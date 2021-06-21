from enum import Enum
from typing import Union, Any

from src.alerter.alerts.node.chainlink import (
    NoChangeInHeightAlert, BlockHeightUpdatedAlert,
    HeadsInQueueIncreasedAboveThresholdAlert,
    HeadsInQueueDecreasedBelowThresholdAlert)
from src.alerter.alerts.system_alerts import (
    OpenFileDescriptorsIncreasedAboveThresholdAlert,
    SystemCPUUsageIncreasedAboveThresholdAlert,
    SystemRAMUsageIncreasedAboveThresholdAlert,
    SystemStorageUsageIncreasedAboveThresholdAlert,
    OpenFileDescriptorsDecreasedBelowThresholdAlert,
    SystemCPUUsageDecreasedBelowThresholdAlert,
    SystemRAMUsageDecreasedBelowThresholdAlert,
    SystemStorageUsageDecreasedBelowThresholdAlert
)
from src.monitorables.nodes.chainlink_node import ChainlinkNode
from src.monitorables.repo import GitHubRepo
from src.monitorables.system import System

RedisType = Union[bytes, str, int, float]
Monitorable = Union[System, GitHubRepo, ChainlinkNode]

# TODO: The below system alerts must be refactored to the types beneath them
#     : when the system alerter is refactored.
IncreasedAboveThresholdSystemAlert = Union[
    OpenFileDescriptorsIncreasedAboveThresholdAlert,
    SystemCPUUsageIncreasedAboveThresholdAlert,
    SystemRAMUsageIncreasedAboveThresholdAlert,
    SystemStorageUsageIncreasedAboveThresholdAlert
]
DecreasedBelowThresholdSystemAlert = Union[
    OpenFileDescriptorsDecreasedBelowThresholdAlert,
    SystemCPUUsageDecreasedBelowThresholdAlert,
    SystemRAMUsageDecreasedBelowThresholdAlert,
    SystemStorageUsageDecreasedBelowThresholdAlert
]

ChainlinkNodeNoChangeInAlert = Union[
    NoChangeInHeightAlert
]
ChainlinkNodeChangeInAlert = Union[
    BlockHeightUpdatedAlert
]
NoChangeInAlert = Union[ChainlinkNodeNoChangeInAlert]
ChangeInAlert = Union[ChainlinkNodeChangeInAlert]

IncreasedAboveThresholdChainlinkNodeAlert = Union[
    HeadsInQueueIncreasedAboveThresholdAlert
]
DecreasedBelowThresholdChainlinkNodeAlert = Union[
    HeadsInQueueDecreasedBelowThresholdAlert
]
IncreasedAboveThresholdAlert = Union[IncreasedAboveThresholdChainlinkNodeAlert]
DecreasedBelowThresholdAlert = Union[DecreasedBelowThresholdChainlinkNodeAlert]


class OpsgenieSeverities(Enum):
    CRITICAL = 'P1'
    ERROR = 'P4'
    WARNING = 'P3'
    INFO = 'P5'


class PagerDutySeverities(Enum):
    CRITICAL = 'critical'
    ERROR = 'error'
    WARNING = 'warning'
    INFO = 'info'


class ChannelTypes(Enum):
    TELEGRAM = 'telegram'
    TWILIO = 'twilio'
    EMAIL = 'email'
    OPSGENIE = 'opsgenie'
    PAGERDUTY = 'pagerduty'
    CONSOLE = 'console'
    LOG = 'log'


class ChannelHandlerTypes(Enum):
    ALERTS = 'alerts'
    COMMANDS = 'commands'


def convert_to_float(value: Union[int, str, float], default_return: Any) -> Any:
    # This function converts a value to float, if the transformation fails it
    # returns a default value
    try:
        return float(value)
    except (TypeError, ValueError):
        return default_return


def convert_to_int(value: Union[int, str, float], default_return: Any) -> Any:
    # This function converts a value to int, if the transformation fails it
    # returns a default value
    try:
        return int(value)
    except (TypeError, ValueError):
        return default_return


def str_to_bool(string: str) -> bool:
    return string.lower() in ['true', 'yes']
