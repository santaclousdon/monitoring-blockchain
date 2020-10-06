import { withFormik } from 'formik';
import { connect } from 'react-redux';
import NodesForm from '../../../components/chains/cosmos/forms/nodesForm';
import NodesTable from '../../../components/chains/cosmos/tables/nodesTable';
import { addNodeCosmos, removeNodeCosmos } from '../../../redux/actions/cosmosActions';
import NodeSchema from './schemas/nodeSchema';
import CosmosData from '../../../data/cosmos';

// This performs cosmos node name validation, by checking if the node name
// already exists under the same chain being configured.
const Form = withFormik({
  mapPropsToErrors: () => ({
    cosmosNodeName: '',
  }),
  mapPropsToValues: () => ({
    cosmosNodeName: '',
    tendermintRPCURL: '',
    cosmosRPCURL: '',
    prometheusURL: '',
    exporterUrl: '',
    isValidator: false,
    monitorNode: true,
    isArchiveNode: true,
    useAsDataSource: true,
  }),
  validationSchema: (props) => NodeSchema(props),
  handleSubmit: (values, { resetForm, props }) => {
    const { saveNodeDetails, currentChain } = props;
    const payload = {
      parentId: currentChain,
      cosmosNodeName: values.cosmosNodeName,
      tendermintRPCURL: values.tendermintRPCURL,
      cosmosRPCURL: values.cosmosRPCURL,
      prometheusURL: values.prometheusURL,
      exporterUrl: values.exporterUrl,
      isValidator: values.isValidator,
      monitorNode: values.monitorNode,
      isArchiveNode: values.isArchiveNode,
      useAsDataSource: values.useAsDataSource,
    };
    saveNodeDetails(payload);
    resetForm();
  },
})(NodesForm);

// ------------------------- Cosmos Based Chain Data --------------------

// Cosmos redux data that will be used to control the node form.
const mapStateToProps = (state) => ({
  currentChain: state.CurrentCosmosChain,
  chainConfig: state.CosmosChainsReducer,
  nodesConfig: state.CosmosNodesReducer,
  data: CosmosData,
});

// Functions to be used in the Cosmos Node form to save the form's details
function mapDispatchToProps(dispatch) {
  return {
    saveNodeDetails: (details) => dispatch(addNodeCosmos(details)),
  };
}

// Functions to be used in the Cosmos Nodes table to delete the saved details
// from state
function mapDispatchToPropsRemove(dispatch) {
  return {
    removeNodeDetails: (details) => dispatch(removeNodeCosmos(details)),
  };
}

// Combine cosmos state and dispatch functions to the node form
const NodesFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);

// Combine cosmos state and dispatch functions to the node table
const NodesTableContainer = connect(
  mapStateToProps,
  mapDispatchToPropsRemove,
)(NodesTable);

export {
  NodesFormContainer,
  NodesTableContainer,
};
