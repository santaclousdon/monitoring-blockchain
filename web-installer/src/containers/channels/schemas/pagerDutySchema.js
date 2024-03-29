import * as Yup from 'yup';
import { checkChannelName, checkIfDoesNotContainsSquareBracket } from 'utils/helpers';

const PagerDutySchema = (props) => Yup.object().shape({
  channel_name: Yup.string()
    .test(
      'unique-config-name',
      'PagerDuty config name is not unique.',
      (value) => {
        const {
          emails, opsGenies, pagerDuties, telegrams, twilios, slacks,
        } = props;
        return checkChannelName(
          value,
          ...[emails, opsGenies, pagerDuties, telegrams, twilios, slacks],
        );
      },
    )
    .test('does-not-contain-square-bracket', 'PagerDuty config name contains a square bracket',
      (value) => checkIfDoesNotContainsSquareBracket(value))
    .required('Config name is required.'),
  api_token: Yup.string().required('API token is required.'),
  integration_key: Yup.string().required('Integration key is required.'),
});

export default PagerDutySchema;
