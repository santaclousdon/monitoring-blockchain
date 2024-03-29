import logging
import time

import pika.exceptions

from src.alerter.alerters.alerter import Alerter
from src.alerter.alerters.contract.chainlink import ChainlinkContractAlerter
from src.alerter.alerters.dockerhub import DockerhubAlerter
from src.alerter.alerters.github import GithubAlerter
from src.alerter.alerters.network.cosmos import CosmosNetworkAlerter
from src.alerter.alerters.network.substrate import SubstrateNetworkAlerter
from src.alerter.alerters.node.chainlink import ChainlinkNodeAlerter
from src.alerter.alerters.node.cosmos import CosmosNodeAlerter
from src.alerter.alerters.node.evm import EVMNodeAlerter
from src.alerter.alerters.node.substrate import SubstrateNodeAlerter
from src.alerter.alerters.system import SystemAlerter
from src.configs.factory.alerts.chainlink_alerts import (
    ChainlinkNodeAlertsConfigsFactory, ChainlinkContractAlertsConfigsFactory)
from src.configs.factory.alerts.cosmos_alerts import (
    CosmosNodeAlertsConfigsFactory, CosmosNetworkAlertsConfigsFactory)
from src.configs.factory.alerts.evm_alerts import EVMNodeAlertsConfigsFactory
from src.configs.factory.alerts.substrate_alerts import (
    SubstrateNodeAlertsConfigsFactory, SubstrateNetworkAlertsConfigsFactory)
from src.configs.factory.alerts.system_alerts import SystemAlertsConfigsFactory
from src.message_broker.rabbitmq import RabbitMQApi
from src.utils.constants.names import (
    SYSTEM_ALERTER_NAME, GITHUB_ALERTER_NAME, DOCKERHUB_ALERTER_NAME,
    CHAINLINK_NODE_ALERTER_NAME, CHAINLINK_CONTRACT_ALERTER_NAME,
    EVM_NODE_ALERTER_NAME, COSMOS_NODE_ALERTER_NAME,
    COSMOS_NETWORK_ALERTER_NAME, SUBSTRATE_NODE_ALERTER_NAME,
    SUBSTRATE_NETWORK_ALERTER_NAME)
from src.utils.constants.starters import (
    RE_INITIALISE_SLEEPING_PERIOD, RESTART_SLEEPING_PERIOD)
from src.utils.env import (
    ALERTERS_LOG_FILE_TEMPLATE, LOGGING_LEVEL, RABBIT_IP,
    ALERTER_PUBLISHING_QUEUE_SIZE)
from src.utils.logging import create_logger, log_and_print
from src.utils.starters import (
    get_initialisation_error_message, get_stopped_message)


def _initialise_alerter_logger(alerter_display_name: str,
                               alerter_module_name: str) -> logging.Logger:
    # Try initialising the logger until successful. This had to be done
    # separately to avoid instances when the logger creation failed and we
    # attempt to use it.
    while True:
        try:
            alerter_logger = create_logger(
                ALERTERS_LOG_FILE_TEMPLATE.format(alerter_display_name),
                alerter_module_name, LOGGING_LEVEL, rotating=True)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            # Use a dummy logger in this case because we cannot create the
            # alerter's logger.
            log_and_print(msg, logging.getLogger('DUMMY_LOGGER'))
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return alerter_logger


def _initialise_system_alerter(
        system_alerts_configs_factory: SystemAlertsConfigsFactory
) -> SystemAlerter:
    # Alerter display name based on system
    alerter_display_name = SYSTEM_ALERTER_NAME

    system_alerter_logger = _initialise_alerter_logger(alerter_display_name,
                                                       SystemAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=system_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            system_alerter = SystemAlerter(
                alerter_display_name, system_alerter_logger,
                system_alerts_configs_factory, rabbitmq,
                ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), system_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, system_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return system_alerter


def _initialise_github_alerter() -> GithubAlerter:
    alerter_display_name = GITHUB_ALERTER_NAME

    github_alerter_logger = _initialise_alerter_logger(alerter_display_name,
                                                       GithubAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=github_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            github_alerter = GithubAlerter(
                alerter_display_name, github_alerter_logger, rabbitmq,
                ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), github_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, github_alerter_logger)
            # sleep 10 seconds before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return github_alerter


def _initialise_dockerhub_alerter() -> DockerhubAlerter:
    alerter_display_name = DOCKERHUB_ALERTER_NAME

    dockerhub_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, DockerhubAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=dockerhub_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            dockerhub_alerter = DockerhubAlerter(
                alerter_display_name, dockerhub_alerter_logger, rabbitmq,
                ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), dockerhub_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, dockerhub_alerter_logger)
            # sleep 10 seconds before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return dockerhub_alerter


def _initialise_chainlink_node_alerter(
        chainlink_alerts_configs_factory: ChainlinkNodeAlertsConfigsFactory
) -> ChainlinkNodeAlerter:
    alerter_display_name = CHAINLINK_NODE_ALERTER_NAME

    chainlink_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, ChainlinkNodeAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=chainlink_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            chainlink_alerter = ChainlinkNodeAlerter(
                alerter_display_name, chainlink_alerter_logger,
                rabbitmq, chainlink_alerts_configs_factory,
                ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), chainlink_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, chainlink_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return chainlink_alerter


def _initialise_chainlink_contract_alerter(
        chainlink_alerts_configs_factory: ChainlinkContractAlertsConfigsFactory
) -> ChainlinkContractAlerter:
    alerter_display_name = CHAINLINK_CONTRACT_ALERTER_NAME

    chainlink_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, ChainlinkContractAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=chainlink_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            chainlink_alerter = ChainlinkContractAlerter(
                alerter_display_name, chainlink_alerter_logger, rabbitmq,
                chainlink_alerts_configs_factory, ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), chainlink_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, chainlink_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return chainlink_alerter


def _initialise_evm_node_alerter(
        evm_alerts_configs_factory: EVMNodeAlertsConfigsFactory
) -> EVMNodeAlerter:
    alerter_display_name = EVM_NODE_ALERTER_NAME

    evm_node_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, EVMNodeAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=evm_node_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            evm_node_alerter = EVMNodeAlerter(
                alerter_display_name, evm_node_alerter_logger,
                evm_alerts_configs_factory, rabbitmq,
                ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), evm_node_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, evm_node_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return evm_node_alerter


def _initialise_cosmos_node_alerter(
        cosmos_alerts_configs_factory: CosmosNodeAlertsConfigsFactory
) -> CosmosNodeAlerter:
    alerter_display_name = COSMOS_NODE_ALERTER_NAME

    cosmos_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, CosmosNodeAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=cosmos_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            cosmos_alerter = CosmosNodeAlerter(
                alerter_display_name, cosmos_alerter_logger, rabbitmq,
                cosmos_alerts_configs_factory, ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), cosmos_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, cosmos_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return cosmos_alerter


def _initialise_cosmos_network_alerter(
        cosmos_alerts_configs_factory: CosmosNetworkAlertsConfigsFactory
) -> CosmosNetworkAlerter:
    alerter_display_name = COSMOS_NETWORK_ALERTER_NAME

    cosmos_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, CosmosNetworkAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=cosmos_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            cosmos_alerter = CosmosNetworkAlerter(
                alerter_display_name, cosmos_alerter_logger, rabbitmq,
                cosmos_alerts_configs_factory, ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), cosmos_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, cosmos_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return cosmos_alerter


def _initialise_substrate_node_alerter(
        substrate_alerts_configs_factory: SubstrateNodeAlertsConfigsFactory
) -> SubstrateNodeAlerter:
    alerter_display_name = SUBSTRATE_NODE_ALERTER_NAME

    substrate_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, SubstrateNodeAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=substrate_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            substrate_alerter = SubstrateNodeAlerter(
                alerter_display_name, substrate_alerter_logger, rabbitmq,
                substrate_alerts_configs_factory, ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), substrate_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, substrate_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return substrate_alerter


def _initialise_substrate_network_alerter(
        substrate_alerts_configs_factory: SubstrateNetworkAlertsConfigsFactory
) -> SubstrateNetworkAlerter:
    alerter_display_name = SUBSTRATE_NETWORK_ALERTER_NAME

    substrate_alerter_logger = _initialise_alerter_logger(
        alerter_display_name, SubstrateNetworkAlerter.__name__)

    # Try initialising an alerter until successful
    while True:
        try:
            rabbitmq = RabbitMQApi(
                logger=substrate_alerter_logger.getChild(RabbitMQApi.__name__),
                host=RABBIT_IP)
            substrate_alerter = SubstrateNetworkAlerter(
                alerter_display_name, substrate_alerter_logger, rabbitmq,
                substrate_alerts_configs_factory, ALERTER_PUBLISHING_QUEUE_SIZE
            )
            log_and_print("Successfully initialised {}".format(
                alerter_display_name), substrate_alerter_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(alerter_display_name, e)
            log_and_print(msg, substrate_alerter_logger)
            # sleep before trying again
            time.sleep(RE_INITIALISE_SLEEPING_PERIOD)

    return substrate_alerter


def start_system_alerter(
        system_alerts_configs_factory: SystemAlertsConfigsFactory) -> None:
    system_alerter = _initialise_system_alerter(system_alerts_configs_factory)
    start_alerter(system_alerter)


def start_github_alerter() -> None:
    github_alerter = _initialise_github_alerter()
    start_alerter(github_alerter)


def start_dockerhub_alerter() -> None:
    dockerhub_alerter = _initialise_dockerhub_alerter()
    start_alerter(dockerhub_alerter)


def start_chainlink_node_alerter(
        chainlink_alerts_configs_factory: ChainlinkNodeAlertsConfigsFactory
) -> None:
    chainlink_alerter = _initialise_chainlink_node_alerter(
        chainlink_alerts_configs_factory)
    start_alerter(chainlink_alerter)


def start_chainlink_contract_alerter(
        chainlink_alerts_configs_factory: ChainlinkContractAlertsConfigsFactory
) -> None:
    chainlink_contract_alerter = _initialise_chainlink_contract_alerter(
        chainlink_alerts_configs_factory)
    start_alerter(chainlink_contract_alerter)


def start_evm_node_alerter(
        evm_alerts_configs_factory: EVMNodeAlertsConfigsFactory) -> None:
    evm_alerter = _initialise_evm_node_alerter(evm_alerts_configs_factory)
    start_alerter(evm_alerter)


def start_cosmos_node_alerter(
        cosmos_alerts_configs_factory: CosmosNodeAlertsConfigsFactory) -> None:
    cosmos_alerter = _initialise_cosmos_node_alerter(
        cosmos_alerts_configs_factory)
    start_alerter(cosmos_alerter)


def start_cosmos_network_alerter(
        cosmos_alerts_configs_factory: CosmosNetworkAlertsConfigsFactory
) -> None:
    cosmos_alerter = _initialise_cosmos_network_alerter(
        cosmos_alerts_configs_factory)
    start_alerter(cosmos_alerter)


def start_substrate_node_alerter(
        substrate_alerts_configs_factory: SubstrateNodeAlertsConfigsFactory
) -> None:
    substrate_alerter = _initialise_substrate_node_alerter(
        substrate_alerts_configs_factory)
    start_alerter(substrate_alerter)


def start_substrate_network_alerter(
        substrate_alerts_configs_factory: SubstrateNetworkAlertsConfigsFactory
) -> None:
    substrate_alerter = _initialise_substrate_network_alerter(
        substrate_alerts_configs_factory)
    start_alerter(substrate_alerter)


def start_alerter(alerter: Alerter) -> None:
    while True:
        try:
            log_and_print("{} started.".format(alerter), alerter.logger)
            alerter.start()
        except (pika.exceptions.AMQPConnectionError,
                pika.exceptions.AMQPChannelError):
            # Error would have already been logged by RabbitMQ logger.
            # Since we have to re-connect just break the loop.
            log_and_print(get_stopped_message(alerter), alerter.logger)
        except Exception:
            # Close the connection with RabbitMQ if we have an unexpected
            # exception, and start again
            alerter.disconnect_from_rabbit()
            log_and_print(get_stopped_message(alerter), alerter.logger)
            log_and_print("Restarting {} in {} seconds.".format(
                alerter, RESTART_SLEEPING_PERIOD), alerter.logger)
            time.sleep(RESTART_SLEEPING_PERIOD)
