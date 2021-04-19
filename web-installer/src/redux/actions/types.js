// Channel related actions
export const ADD_TELEGRAM = 'ADD_TELEGRAM';
export const LOAD_TELEGRAM = 'LOAD_TELEGRAM';
export const REMOVE_TELEGRAM = 'REMOVE_TELEGRAM';
export const ADD_TWILIO = 'ADD_TWILIO';
export const LOAD_TWILIO = 'LOAD_TWILIO';
export const REMOVE_TWILIO = 'REMOVE_TWILIO';
export const ADD_EMAIL = 'ADD_EMAIL';
export const LOAD_EMAIL = 'LOAD_EMAIL';
export const REMOVE_EMAIL = 'REMOVE_EMAIL';
export const ADD_PAGERDUTY = 'ADD_PAGERDUTY';
export const LOAD_PAGERDUTY = 'LOAD_PAGERDUTY';
export const REMOVE_PAGERDUTY = 'REMOVE_PAGERDUTY';
export const ADD_OPSGENIE = 'ADD_OPSGENIE';
export const LOAD_OPSGENIE = 'LOAD_OPSGENIE';
export const REMOVE_OPSGENIE = 'REMOVE_OPSGENIE';
export const ADD_SLACK = 'ADD_SLACK';
export const LOAD_SLACK = 'LOAD_SLACK';
export const REMOVE_SLACK = 'REMOVE_SLACK';

// Page related actions
export const CHANGE_PAGE = 'CHANGE_PAGE';
export const CHANGE_STEP = 'CHANGE_STEP';

// Cosmos chains related actions
export const ADD_CHAIN_COSMOS = 'ADD_CHAIN_COSMOS';
export const REMOVE_CHAIN_COSMOS = 'REMOVE_CHAIN_COSMOS';
export const LOAD_CHAIN_COSMOS = 'LOAD_CHAIN_COSMOS';
export const LOAD_REPOSITORY_COSMOS = 'LOAD_REPOSITORY_COSMOS';
export const LOAD_DOCKER_COSMOS = 'LOAD_DOCKER_COSMOS';
export const LOAD_KMS_COSMOS = 'LOAD_KMS_COSMOS';
export const LOAD_ALERTS_COSMOS = 'LOAD_ALERTS_COSMOS';
export const ADD_NODE_COSMOS = 'ADD_NODE_COSMOS';
export const LOAD_NODE_COSMOS = 'LOAD_NODE_COSMOS';
export const REMOVE_NODE_COSMOS = 'REMOVE_NODE_COSMOS';
export const RESET_CHAIN_COSMOS = 'RESET_CHAIN_COSMOS';
export const LOAD_CONFIG_COSMOS = 'LOAD_CONFIG_COSMOS';
export const LOAD_REPEAT_ALERTS_COSMOS = 'LOAD_REPEAT_ALERTS_COSMOS';
export const LOAD_TIMEWINDOW_ALERTS_COSMOS = 'LOAD_TIMEWINDOW_ALERTS_COSMOS';
export const LOAD_THRESHOLD_ALERTS_COSMOS = 'LOAD_THRESHOLD_ALERTS_COSMOS';
export const LOAD_SEVERITY_ALERTS_COSMOS = 'LOAD_SEVERITY_ALERTS_COSMOS';

// Substrate chains related actions
export const ADD_CHAIN_SUBSTRATE = 'ADD_CHAIN_SUBSTRATE';
export const REMOVE_CHAIN_SUBSTRATE = 'REMOVE_CHAIN_SUBSTRATE';
export const LOAD_REPOSITORY_SUBSTRATE = 'LOAD_REPOSITORY_SUBSTRATE';
export const LOAD_DOCKER_SUBSTRATE = 'LOAD_DOCKER_SUBSTRATE';
export const ADD_NODE_SUBSTRATE = 'ADD_NODE_SUBSTRATE';
export const REMOVE_NODE_SUBSTRATE = 'REMOVE_NODE_SUBSTRATE';
export const RESET_CHAIN_SUBSTRATE = 'RESET_CHAIN_SUBSTRATE';
export const LOAD_CONFIG_SUBSTRATE = 'LOAD_CONFIG_SUBSTRATE';
export const LOAD_NODE_SUBSTRATE = 'LOAD_NODE_SUBSTRATE';
export const LOAD_REPEAT_ALERTS_SUBSTRATE = 'LOAD_REPEAT_ALERTS_SUBSTRATE';
export const LOAD_TIMEWINDOW_ALERTS_SUBSTRATE = 'LOAD_TIMEWINDOW_ALERTS_SUBSTRATE';
export const LOAD_THRESHOLD_ALERTS_SUBSTRATE = 'LOAD_THRESHOLD_ALERTS_SUBSTRATE';
export const LOAD_SEVERITY_ALERTS_SUBSTRATE = 'LOAD_SEVERITY_ALERTS_SUBSTRATE';

// General aka not chain specific actions
export const UPDATE_PERIODIC = 'UPDATE_PERIODIC';
export const ADD_REPOSITORY = 'ADD_REPOSITORY';
export const LOAD_REPOSITORY = 'LOAD_REPOSITORY';
export const LOAD_ALERTS_GENERAL = 'LOAD_ALERTS_GENERAL';
export const ADD_SYSTEM = 'ADD_SYSTEM';
export const LOAD_SYSTEM = 'LOAD_SYSTEM';
export const REMOVE_REPOSITORY = 'REMOVE_REPOSITORY';
export const REMOVE_SYSTEM = 'REMOVE_SYSTEM';
export const ADD_KMS = 'ADD_KMS';
export const LOAD_KMS = 'LOAD_KMS';
export const REMOVE_KMS = 'REMOVE_KMS';
export const ADD_DOCKER = 'ADD_DOCKER';
export const LOAD_DOCKER = 'LOAD_DOCKER';
export const REMOVE_DOCKER = 'REMOVE_DOCKER';
export const ADD_TELEGRAM_CHANNEL = 'ADD_TELEGRAM_CHANNEL';
export const REMOVE_TELEGRAM_CHANNEL = 'REMOVE_TELEGRAM_CHANNEL';
export const ADD_TWILIO_CHANNEL = 'ADD_TWILIO_CHANNEL';
export const REMOVE_TWILIO_CHANNEL = 'REMOVE_TWILIO_CHANNEL';
export const ADD_EMAIL_CHANNEL = 'ADD_EMAIL_CHANNEL';
export const REMOVE_EMAIL_CHANNEL = 'REMOVE_EMAIL_CHANNEL';
export const ADD_OPSGENIE_CHANNEL = 'ADD_OPSGENIE_CHANNEL';
export const REMOVE_OPSGENIE_CHANNEL = 'REMOVE_OPSGENIE_CHANNEL';
export const ADD_PAGERDUTY_CHANNEL = 'ADD_PAGERDUTY_CHANNEL';
export const REMOVE_PAGERDUTY_CHANNEL = 'REMOVE_PAGERDUTY_CHANNEL';

// General alert configuration action types
export const UPDATE_CHAIN_NAME_COSMOS = 'UPDATE_CHAIN_NAME_COSMOS';
export const UPDATE_CHAIN_NAME_SUBSTRATE = 'UPDATE_CHAIN_NAME_SUBSTRATE';
export const UPDATE_REPEAT_ALERT = 'UPDATE_REPEAT_ALERT';
export const UPDATE_TIMEWINDOW_ALERT = 'UPDATE_TIMEWINDOW_ALERT';
export const UPDATE_THRESHOLD_ALERT = 'UPDATE_THRESHOLD_ALERT';
export const UPDATE_SEVERITY_ALERT = 'UPDATE_SEVERITY_ALERT';
export const LOAD_THRESHOLD_ALERTS_GENERAL = 'LOAD_THRESHOLD_ALERTS_GENERAL';
export const LOAD_SYSTEM_GENERAL = 'LOAD_SYSTEM_GENERAL';
export const LOAD_REPOSITORY_GENERAL = 'LOAD_REPOSITORY_GENERAL';
export const LOAD_DOCKER_GENERAL = 'LOAD_DOCKER_GENERAL';

// Users Page, containing only actions to set and remove users
export const ADD_USER = 'ADD_USER';
export const REMOVE_USER = 'REMOVE_USER';

// Login actions
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SET_AUTHENTICATED = 'SET_AUTHENTICATED';
