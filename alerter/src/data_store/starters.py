import logging
import os
import time

import pika.exceptions

from src.data_store.stores.alert import AlertStore
from src.data_store.stores.github import GithubStore
from src.data_store.stores.store import Store
from src.data_store.stores.system import SystemStore
from src.utils.logging import create_logger, log_and_print
from src.utils.starters import get_initialisation_error_message


def _initialize_store_logger(store_name: str) -> logging.Logger:
    # Try initializing the logger until successful. This had to be done
    # separately to avoid instances when the logger creation failed and we
    # attempt to use it.
    while True:
        try:
            store_logger = create_logger(
                os.environ['DATA_STORE_LOG_FILE_TEMPLATE'].format(
                    store_name), store_name,
                os.environ['LOGGING_LEVEL'], rotating=True)
            break
        except Exception as e:
            msg = get_initialisation_error_message(store_name, e)
            # Use a dummy logger in this case because we cannot create the
            # transformer's logger.
            log_and_print(msg, logging.getLogger('DUMMY_LOGGER'))
            time.sleep(10)  # sleep 10 seconds before trying again

    return store_logger


def _initialize_system_store() -> SystemStore:
    store_name = 'System Store'

    store_logger = _initialize_store_logger(store_name)

    # Try initializing the system store until successful
    while True:
        try:
            system_store = SystemStore(store_name, store_logger)
            log_and_print("Successfully initialized {}".format(store_name),
                          store_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(store_name, e)
            log_and_print(msg, store_logger)
            time.sleep(10)  # sleep 10 seconds before trying again

    return system_store


def _initialize_github_store() -> GithubStore:
    store_name = 'GitHub Store'

    store_logger = _initialize_store_logger(store_name)

    # Try initializing the github store until successful
    while True:
        try:
            github_store = GithubStore(store_name, store_logger)
            log_and_print("Successfully initialized {}".format(store_name),
                          store_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(store_name, e)
            log_and_print(msg, store_logger)
            time.sleep(10)  # sleep 10 seconds before trying again

    return github_store


def _initialize_alert_store() -> AlertStore:
    store_name = 'Alert Store'

    store_logger = _initialize_store_logger(store_name)

    # Try initializing the alert store until successful
    while True:
        try:
            alert_store = AlertStore(store_name, store_logger)
            log_and_print("Successfully initialized {}".format(store_name),
                          store_logger)
            break
        except Exception as e:
            msg = get_initialisation_error_message(store_name, e)
            log_and_print(msg, store_logger)
            time.sleep(10)  # sleep 10 seconds before trying again

    return alert_store


def start_system_store() -> None:
    system_store = _initialize_system_store()
    start_store(system_store)


def start_github_store() -> None:
    github_store = _initialize_github_store()
    start_store(github_store)


def start_alert_store() -> None:
    alert_store = _initialize_alert_store()
    start_store(alert_store)


def start_store(store: Store) -> None:
    sleep_period = 10

    while True:
        try:
            log_and_print("{} started.".format(store), store.logger)
            store.begin_store()
        except (pika.exceptions.AMQPConnectionError,
                pika.exceptions.AMQPChannelError):
            # Error would have already been logged by RabbitMQ logger.
            # Since we have to re-initialize just break the loop.
            log_and_print("{} stopped.".format(store), store.logger)
        except Exception as e:
            # Close the connection with RabbitMQ if we have an unexpected
            # exception, and start again
            store.disconnect_from_rabbit()
            log_and_print("{} stopped. {}".format(store, e), store.logger)
            log_and_print("Restarting {} in {} seconds.".format(
                store, sleep_period), store.logger)
            time.sleep(sleep_period)
