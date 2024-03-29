import json
import logging
import sys
from datetime import datetime
from types import FrameType

import pika.exceptions
from pika.adapters.blocking_connection import BlockingChannel

from src.alerter.alert_code import AlertCode
from src.alerter.alerts.alert import Alert
from src.alerter.grouped_alerts_metric_code import GroupedAlertsMetricCode
from src.channels_manager.channels.log import LogChannel
from src.channels_manager.handlers.handler import ChannelHandler
from src.message_broker.rabbitmq import RabbitMQApi
from src.utils.constants.rabbitmq import (
    ALERT_EXCHANGE, HEALTH_CHECK_EXCHANGE, HEARTBEAT_OUTPUT_WORKER_ROUTING_KEY,
    LOG_HANDLER_INPUT_ROUTING_KEY, CHAN_ALERTS_HAN_INPUT_QUEUE_NAME_TEMPLATE,
    TOPIC)
from src.utils.data import RequestStatus
from src.utils.exceptions import MessageWasNotDeliveredException
from src.utils.logging import log_and_print


class LogAlertsHandler(ChannelHandler):
    def __init__(self, handler_name: str, logger: logging.Logger,
                 rabbitmq: RabbitMQApi, log_channel: LogChannel) -> None:
        super().__init__(handler_name, logger, rabbitmq)

        self._log_channel = log_channel
        self._log_alerts_handler_queue = \
            CHAN_ALERTS_HAN_INPUT_QUEUE_NAME_TEMPLATE.format(
                self.log_channel.channel_id)

    @property
    def log_channel(self) -> LogChannel:
        return self._log_channel

    def _initialise_rabbitmq(self) -> None:
        self.rabbitmq.connect_till_successful()

        # Set consuming configuration
        self.logger.info("Creating '%s' exchange", ALERT_EXCHANGE)
        self.rabbitmq.exchange_declare(ALERT_EXCHANGE, TOPIC, False, True,
                                       False, False)
        self.logger.info("Creating queue '%s'", self._log_alerts_handler_queue)
        self.rabbitmq.queue_declare(self._log_alerts_handler_queue, False, True,
                                    False, False)
        self.logger.info("Binding queue '%s' to exchange '%s' with routing key "
                         "'%s'", self._log_alerts_handler_queue, ALERT_EXCHANGE,
                         LOG_HANDLER_INPUT_ROUTING_KEY)
        self.rabbitmq.queue_bind(self._log_alerts_handler_queue, ALERT_EXCHANGE,
                                 LOG_HANDLER_INPUT_ROUTING_KEY)

        self.rabbitmq.basic_qos(prefetch_count=200)
        self.logger.debug("Declaring consuming intentions")
        self.rabbitmq.basic_consume(self._log_alerts_handler_queue,
                                    self._process_alert, False, False, None)

        # Set producing configuration for heartbeat publishing
        self.logger.info("Setting delivery confirmation on RabbitMQ channel")
        self.rabbitmq.confirm_delivery()
        self.logger.info("Creating '%s' exchange", HEALTH_CHECK_EXCHANGE)
        self.rabbitmq.exchange_declare(HEALTH_CHECK_EXCHANGE, TOPIC, False,
                                       True, False, False)

    def _send_heartbeat(self, data_to_send: dict) -> None:
        self.rabbitmq.basic_publish_confirm(
            exchange=HEALTH_CHECK_EXCHANGE,
            routing_key=HEARTBEAT_OUTPUT_WORKER_ROUTING_KEY, body=data_to_send,
            is_body_dict=True, properties=pika.BasicProperties(delivery_mode=2),
            mandatory=True)
        self.logger.debug("Sent heartbeat to '%s' exchange",
                          HEALTH_CHECK_EXCHANGE)

    def _process_alert(
            self, ch: BlockingChannel, method: pika.spec.Basic.Deliver,
            properties: pika.spec.BasicProperties, body: bytes) -> None:
        alert_json = json.loads(body)
        self.logger.debug("Received %s. Now processing this alert.", alert_json)

        processing_error = False
        alert = None
        try:
            alert_code = alert_json['alert_code']
            alert_code_enum = AlertCode.get_enum_by_value(alert_code['code'])
            metric_code_enum = GroupedAlertsMetricCode.get_enum_by_value(
                alert_json['metric'])
            alert = Alert(alert_code_enum, alert_json['message'],
                          alert_json['severity'], alert_json['timestamp'],
                          alert_json['parent_id'], alert_json['origin_id'],
                          metric_code_enum, alert_json['metric_state_args'])

            self.logger.debug("Successfully processed %s", alert_json)
        except Exception as e:
            self.logger.error("Error when processing %s", alert_json)
            self.logger.exception(e)
            processing_error = True

        # If the alert is processed, it can be acknowledged.
        self.rabbitmq.basic_ack(method.delivery_tag, False)

        alert_result = RequestStatus.FAILED
        try:
            if not processing_error:
                alert_result = self.log_channel.alert(alert)
        except Exception as e:
            raise e

        if alert_result == RequestStatus.SUCCESS and not processing_error:
            try:
                heartbeat = {
                    'component_name': self.handler_name,
                    'is_alive': True,
                    'timestamp': datetime.now().timestamp()
                }
                self._send_heartbeat(heartbeat)
            except MessageWasNotDeliveredException as e:
                # Log the message and do not raise it as heartbeats must be
                # real-time.
                self.logger.exception(e)
            except Exception as e:
                raise e

    def start(self) -> None:
        self._initialise_rabbitmq()
        while True:
            try:
                self._listen_for_data()
            except (pika.exceptions.AMQPConnectionError,
                    pika.exceptions.AMQPChannelError) as e:
                # If we have either a channel error or connection error, the
                # channel is reset, therefore we need to re-initialise the
                # connection or channel settings
                raise e
            except Exception as e:
                self.logger.exception(e)
                raise e

    def _on_terminate(self, signum: int, stack: FrameType) -> None:
        log_and_print("{} is terminating. Connections with RabbitMQ will be "
                      "closed, and afterwards the process will "
                      "exit.".format(self), self.logger)
        self.disconnect_from_rabbit()
        log_and_print("{} terminated.".format(self), self.logger)
        sys.exit()

    def _send_data(self, alert: Alert) -> None:
        """
        We are not implementing the _send_data function because with respect to
        rabbit, the log alerts handler only sends heartbeats. Alerts are sent
        through the third party channel.
        """
        pass
