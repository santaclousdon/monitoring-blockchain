import _ from 'lodash';
import { combineReducers } from 'redux';
import {
  ADD_TELEGRAM, REMOVE_TELEGRAM, ADD_TWILIO, REMOVE_TWILIO, ADD_EMAIL,
  REMOVE_EMAIL, ADD_PAGERDUTY, REMOVE_PAGERDUTY, ADD_OPSGENIE, REMOVE_OPSGENIE,
} from '../actions/types';

// Reducers to add and remove telegram configurations from global state
function telegramsById(state = {}, action) {
  switch (action.type) {
    case ADD_TELEGRAM:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case REMOVE_TELEGRAM:
      return _.omit(state, action.payload.id);
    default:
      return state;
  }
}

// Reducers to remove from list of all telegrams
function allTelegrams(state = [], action) {
  switch (action.type) {
    case ADD_TELEGRAM:
      return state.concat(action.payload.id);
    case REMOVE_TELEGRAM:
      return state.filter((config) => config !== action.payload.id);
    default:
      return state;
  }
}

const TelegramsReducer = combineReducers({
  byId: telegramsById,
  allIds: allTelegrams,
});

// Reducers to add and remove twilio configurations from global state
function twiliosById(state = {}, action) {
  switch (action.type) {
    case ADD_TWILIO:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case REMOVE_TWILIO:
      return _.omit(state, action.payload.id);
    default:
      return state;
  }
}

// Reducers to remove from list of all twilios
function allTwilios(state = [], action) {
  switch (action.type) {
    case ADD_TWILIO:
      return state.concat(action.payload.id);
    case REMOVE_TWILIO:
      return state.filter((config) => config !== action.payload.id);
    default:
      return state;
  }
}

const TwiliosReducer = combineReducers({
  byId: twiliosById,
  allIds: allTwilios,
});

// Reducers to add and remove email configurations from global state
function emailsById(state = {}, action) {
  switch (action.type) {
    case ADD_EMAIL:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case REMOVE_EMAIL:
      return _.omit(state, action.payload.id);
    default:
      return state;
  }
}

// Reducers to remove from list of all emails
function allEmails(state = [], action) {
  switch (action.type) {
    case ADD_EMAIL:
      return state.concat(action.payload.id);
    case REMOVE_EMAIL:
      return state.filter((config) => config !== action.payload.id);
    default:
      return state;
  }
}

const EmailsReducer = combineReducers({
  byId: emailsById,
  allIds: allEmails,
});

// Reducers to add and remove pagerduty configurations from global state
function pagerdutyById(state = {}, action) {
  switch (action.type) {
    case ADD_PAGERDUTY:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case REMOVE_PAGERDUTY:
      return _.omit(state, action.payload.id);
    default:
      return state;
  }
}

// Reducers to remove from list of all pagerduties
function allPagerDuties(state = [], action) {
  switch (action.type) {
    case ADD_PAGERDUTY:
      return state.concat(action.payload.id);
    case REMOVE_PAGERDUTY:
      return state.filter((config) => config !== action.payload.id);
    default:
      return state;
  }
}

const PagerDutyReducer = combineReducers({
  byId: pagerdutyById,
  allIds: allPagerDuties,
});

// Reducers to add and remove pagerduty configurations from global state
function opsgenieById(state = {}, action) {
  switch (action.type) {
    case ADD_OPSGENIE:
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    case REMOVE_OPSGENIE:
      return _.omit(state, action.payload.id);
    default:
      return state;
  }
}

// Reducers to remove from list of all pagerduties
function allOpsGenies(state = [], action) {
  switch (action.type) {
    case ADD_OPSGENIE:
      return state.concat(action.payload.id);
    case REMOVE_OPSGENIE:
      return state.filter((config) => config !== action.payload.id);
    default:
      return state;
  }
}

const OpsGenieReducer = combineReducers({
  byId: opsgenieById,
  allIds: allOpsGenies,
});

export {
  OpsGenieReducer, PagerDutyReducer, EmailsReducer, TwiliosReducer,
  TelegramsReducer,
};
