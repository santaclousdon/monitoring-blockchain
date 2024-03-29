import { withFormik } from 'formik';
import { connect } from 'react-redux';
import SystemForm from 'components/chains/common/forms/systemForm';
import SystemTable from 'components/chains/common/tables/systemTable';
import { addSystem, removeSystem } from 'redux/actions/generalActions';
import { changeStep, changePage, toggleDirty } from 'redux/actions/pageActions';
import { GENERAL } from 'constants/constants';
import GeneralData from 'data/general';
import ChainlinkData from 'data/chainlink';
import SystemSchema from './schemas/systemSchema';

// Form validation, check if the system name is unique and if the exporter
// URL was provided.
const Form = withFormik({
  mapPropsToErrors: () => ({
    name: '',
    exporter_url: '',
  }),
  mapPropsToValues: () => ({
    name: '',
    exporter_url: '',
    monitor_system: true,
  }),
  toggleDirtyForm: (tog, { props }) => {
    const { toggleDirtyForm } = props;
    toggleDirtyForm(tog);
  },
  validationSchema: (props) => SystemSchema(props),
  handleSubmit: (values, { resetForm, props }) => {
    const { saveSystemDetails, currentChain } = props;
    const payload = {
      parent_id: currentChain,
      name: values.name,
      exporter_url: values.exporter_url,
      monitor_system: values.monitor_system,
    };
    saveSystemDetails(payload);
    resetForm();
  },
})(SystemForm);

// ------------------------- Common Actions --------------------------

function mapDispatchToPropsSave(dispatch) {
  return {
    saveSystemDetails: (details) => dispatch(addSystem(details)),
    toggleDirtyForm: (tog) => dispatch(toggleDirty(tog)),
  };
}

function mapDispatchToPropsRemove(dispatch) {
  return {
    stepChanger: (step) => dispatch(changeStep(step)),
    pageChanger: (page) => dispatch(changePage(page)),
    removeSystemDetails: (details) => dispatch(removeSystem(details)),
  };
}

// ----------------------------- General State

const mapGeneralStateToProps = (state) => ({
  currentChain: GENERAL,
  config: state.GeneralReducer,
  chainlinkNodesConfig: state.ChainlinkNodesReducer,
  substrateNodesConfig: state.SubstrateNodesReducer,
  cosmosNodesConfig: state.CosmosNodesReducer,
  reposConfig: state.GitHubRepositoryReducer,
  dockerHubConfig: state.DockerHubReducer,
  evmNodesConfig: state.EvmNodesReducer,
  systemConfig: state.SystemsReducer,
  data: GeneralData,
});

const SystemGeneralFormContainer = connect(
  mapGeneralStateToProps,
  mapDispatchToPropsSave,
)(Form);

const SystemGeneralTableContainer = connect(
  mapGeneralStateToProps,
  mapDispatchToPropsRemove,
)(SystemTable);

// ----------------------------- Chainlink State

const mapChainlinkStateToProps = (state) => ({
  currentChain: state.CurrentChainlinkChain,
  config: state.ChainlinkChainsReducer,
  substrateNodesConfig: state.SubstrateNodesReducer,
  chainlinkNodesConfig: state.ChainlinkNodesReducer,
  cosmosNodesConfig: state.CosmosNodesReducer,
  reposConfig: state.GitHubRepositoryReducer,
  dockerHubConfig: state.DockerHubReducer,
  systemConfig: state.SystemsReducer,
  evmNodesConfig: state.EvmNodesReducer,
  data: ChainlinkData,
});

const SystemChainlinkFormContainer = connect(
  mapChainlinkStateToProps,
  mapDispatchToPropsSave,
)(Form);

const SystemChainlinkTableContainer = connect(
  mapChainlinkStateToProps,
  mapDispatchToPropsRemove,
)(SystemTable);

export {
  SystemGeneralFormContainer, SystemGeneralTableContainer,
  SystemChainlinkFormContainer, SystemChainlinkTableContainer,
};
