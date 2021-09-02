import logging
from src.message_broker.rabbitmq import RabbitMQApi
from src.alerter.alerters.alerter import Alerter


class ChainlinkContractAlerter(Alerter):
    def __init__(
            self, alerter_name: str, logger: logging.Logger,
            rabbitmq: RabbitMQApi, max_queue_size: int = 0) -> None:
        super().__init__(alerter_name, logger, rabbitmq, max_queue_size)