import { withFormik } from 'formik';
import { connect } from 'react-redux';
import OpsGenieForm from 'components/channels/forms/opsGenieForm';
import OpsGenieTable from 'components/channels/tables/opsGenieTable';
import { addOpsGenie, removeOpsGenie } from 'redux/actions/channelActions';
import { toggleDirty } from 'redux/actions/pageActions';
import OpsGenieSchema from './schemas/opsGenieSchema';

const Form = withFormik({
  mapPropsToErrors: () => ({
    channel_name: '',
    api_token: '',
  }),
  mapPropsToValues: () => ({
    channel_name: '',
    api_token: '',
    eu: false,
    info: false,
    warning: false,
    critical: false,
    error: false,
  }),
  toggleDirtyForm: (tog, { props }) => {
    const { toggleDirtyForm } = props;
    toggleDirtyForm(tog);
  },
  validationSchema: (props) => OpsGenieSchema(props),
  handleSubmit: (values, { resetForm, props }) => {
    const { saveOpsGenieDetails } = props;
    const payload = {
      channel_name: values.channel_name,
      api_token: values.api_token,
      eu: values.eu,
      info: values.info,
      warning: values.warning,
      critical: values.critical,
      error: values.error,
      parent_ids: [],
      parent_names: [],
    };
    saveOpsGenieDetails(payload);
    resetForm();
  },
})(OpsGenieForm);

const mapStateToProps = (state) => ({
  emails: state.EmailsReducer,
  opsGenies: state.OpsGenieReducer,
  pagerDuties: state.PagerDutyReducer,
  telegrams: state.TelegramsReducer,
  twilios: state.TwiliosReducer,
  slacks: state.SlacksReducer,
});

function mapDispatchToProps(dispatch) {
  return {
    saveOpsGenieDetails: (details) => dispatch(addOpsGenie(details)),
    toggleDirtyForm: (tog) => dispatch(toggleDirty(tog)),
  };
}

function mapDispatchToPropsRemove(dispatch) {
  return {
    removeOpsGenieDetails: (details) => dispatch(removeOpsGenie(details)),
  };
}

const OpsGenieFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form);

const OpsGenieTableContainer = connect(
  mapStateToProps,
  mapDispatchToPropsRemove,
)(OpsGenieTable);

export { OpsGenieFormContainer, OpsGenieTableContainer };
