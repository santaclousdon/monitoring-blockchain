import * as Yup from 'yup';

const SystemSchema = (props) => Yup.object().shape({
  name: Yup.string()
    .test('unique-system-name', 'System name is not unique.', (value) => {
      const {
        systemConfig, substrateNodesConfig, cosmosNodesConfig, reposConfig,
        chainlinkNodesConfig, dockerHubConfig, evmNodesConfig,
      } = props;

      for (let i = 0; i < evmNodesConfig.allIds.length; i += 1) {
        if (evmNodesConfig.byId[evmNodesConfig.allIds[i]].name === value) {
          return false;
        }
      }
      for (let i = 0; i < chainlinkNodesConfig.allIds.length; i += 1) {
        if (chainlinkNodesConfig.byId[chainlinkNodesConfig.allIds[i]].name === value) {
          return false;
        }
      }
      for (let i = 0; i < substrateNodesConfig.allIds.length; i += 1) {
        if (substrateNodesConfig.byId[substrateNodesConfig.allIds[i]].name === value) {
          return false;
        }
      }
      for (let i = 0; i < cosmosNodesConfig.allIds.length; i += 1) {
        if (cosmosNodesConfig.byId[cosmosNodesConfig.allIds[i]].name === value) {
          return false;
        }
      }
      for (let i = 0; i < systemConfig.allIds.length; i += 1) {
        if (systemConfig.byId[systemConfig.allIds[i]].name === value) {
          return false;
        }
      }
      for (let i = 0; i < reposConfig.allIds.length; i += 1) {
        if (reposConfig.byId[reposConfig.allIds[i]].repo_name === value) {
          return false;
        }
      }
      for (let i = 0; i < dockerHubConfig.allIds.length; i += 1) {
        if (dockerHubConfig.byId[dockerHubConfig.allIds[i]].repo_name === value) {
          return false;
        }
      }
      return true;
    })
    .required('System name is required.'),
  exporter_url: Yup.string()
    .required('Node Exporter URL is required.'),
});

export default SystemSchema;
