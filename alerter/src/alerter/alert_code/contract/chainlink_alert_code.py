from ..alert_code import AlertCode


class ChainlinkContractAlertCode(AlertCode):
    PriceFeedNotObservedIncreaseAboveThreshold = 'cl_contract_alert_1'
    PriceFeedObservedAgain = 'cl_contract_alert_2'
    PriceFeedDeviationInreasedAboveThreshold = 'cl_contract_alert_3'
    PriceFeedDeviationDecreasedBelowThreshold = 'cl_contract_alert_4'
    ConsensusNotReached = 'cl_contract_alert_5'
    ErrorRetrievingChainlinkContractData = 'cl_contract_alert_6'
    ChainlinkContractDataNowBeingRetrieved = 'cl_contract_alert_7'
