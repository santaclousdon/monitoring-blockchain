import { combineReducers } from 'redux';
import ChangePageReducer from './pageChange';
import ChangeStepReducer from './stepChange';
import ChannelsReducer from './channelsReducer';
import CosmosChainsReducer from './cosmosChainsReducer';
import SubstrateChainsReducer from './substrateChainsReducer';
import OtherReducer from './otherReducer';

export default combineReducers({
  ChangePageReducer,
  ChangeStepReducer,
  ChannelsReducer,
  CosmosChainsReducer,
  SubstrateChainsReducer,
  OtherReducer,
});
