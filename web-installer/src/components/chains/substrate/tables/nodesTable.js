import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  Grid,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import CancelIcon from '@material-ui/icons/Cancel';
import StyledTableRow from 'assets/jss/custom-jss/StyledTableRow';
import StyledTableCell from 'assets/jss/custom-jss/StyledTableCell';
import { NEXT, BACK } from 'constants/constants';
import StepButtonContainer from 'containers/chains/common/stepButtonContainer';

/*
 * Contains the data of all the nodes of the current chain process. Has the
 * functionality to delete node data from redux.
 */
const NodesTable = ({
  chainConfig,
  substrateNodesConfig,
  currentChain,
  removeNodeDetails,
  data,
}) => {
  if (chainConfig.byId[currentChain].nodes.length === 0) {
    return (
      <div>
        <Box py={4}>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={4} />
            <Grid item xs={2}>
              <StepButtonContainer
                disabled={false}
                text={BACK}
                navigation={data.nodeForm.backStep}
              />
            </Grid>
            <Grid item xs={2}>
              <StepButtonContainer
                disabled={false}
                text={NEXT}
                navigation={data.nodeForm.nextStep}
              />
            </Grid>
            <Grid item xs={4} />
          </Grid>
        </Box>
      </div>
    );
  }

  let highestLen = 0;
  const nodesInThisChain = chainConfig.byId[currentChain].nodes;
  nodesInThisChain.forEach((node) => {
    const len = substrateNodesConfig.byId[node].governance_addresses.length;
    if (len > highestLen) {
      highestLen = len;
    }
  });

  const gvnAddressTableHeaders = () => {
    const tableHeaders = [];

    for (let i = 0; i < highestLen; i += 1) {
      tableHeaders.push(
        <StyledTableCell align="center">
          {`Governance Address ${i + 1}`}
        </StyledTableCell>,
      );
    }

    if (tableHeaders.length <= 1) {
      return (
        <StyledTableCell align="center">Governance Address</StyledTableCell>
      );
    }

    return tableHeaders;
  };

  const gvnAddressRows = (governanceAddresses) => {
    const tableRows = [];

    if (highestLen === 0) {
      tableRows.push(
        <StyledTableCell align="center" />,
      );
      return tableRows;
    }

    for (let i = 0; i < highestLen; i += 1) {
      tableRows.push(
        <StyledTableCell align="center">
          {governanceAddresses[i]}
        </StyledTableCell>,
      );
    }

    return tableRows;
  };

  return (
    <Box pt={5}>
      <TableContainer component={Paper}>
        <Table className="table" aria-label="substrate-nodes-table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Name</StyledTableCell>
              <StyledTableCell align="center">Websocket</StyledTableCell>
              <StyledTableCell align="center">Node Exporter</StyledTableCell>
              <StyledTableCell align="center">Stash Address</StyledTableCell>
              {gvnAddressTableHeaders()}
              <StyledTableCell align="center">Validator</StyledTableCell>
              <StyledTableCell align="center">Monitor</StyledTableCell>
              <StyledTableCell align="center">Archive</StyledTableCell>
              <StyledTableCell align="center">Data Source</StyledTableCell>
              <StyledTableCell align="center">Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chainConfig.byId[currentChain].nodes.map((id) => (
              <StyledTableRow key={id}>
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].node_ws_url}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].exporter_url}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].stash_address}
                </StyledTableCell>
                {gvnAddressRows(
                  substrateNodesConfig.byId[id].governance_addresses,
                )}
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].is_validator ? (
                    <CheckIcon />
                  ) : (
                    <ClearIcon />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].monitor_node ? (
                    <CheckIcon />
                  ) : (
                    <ClearIcon />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].is_archive_node ? (
                    <CheckIcon />
                  ) : (
                    <ClearIcon />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {substrateNodesConfig.byId[id].use_as_data_source ? (
                    <CheckIcon />
                  ) : (
                    <ClearIcon />
                  )}
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Button
                    onClick={() => {
                      removeNodeDetails(substrateNodesConfig.byId[id]);
                    }}
                  >
                    <CancelIcon />
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box py={4}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={4} />
          <Grid item xs={2}>
            <StepButtonContainer disabled={false} text={BACK} navigation={data.nodeForm.backStep} />
          </Grid>
          <Grid item xs={2}>
            <StepButtonContainer disabled={false} text={NEXT} navigation={data.nodeForm.nextStep} />
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </Box>
    </Box>
  );
};

NodesTable.propTypes = {
  chainConfig: PropTypes.shape({
    byId: PropTypes.shape({
      id: PropTypes.string,
      nodes: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  substrateNodesConfig: PropTypes.shape({
    byId: PropTypes.shape({
      id: PropTypes.string,
      parent_id: PropTypes.string,
      name: PropTypes.string,
      node_ws_url: PropTypes.string,
      telemetry_url: PropTypes.string,
      prometheus_url: PropTypes.string,
      exporter_url: PropTypes.string,
      stash_address: PropTypes.string,
      is_validator: PropTypes.bool,
      monitor_node: PropTypes.bool,
      is_archive_node: PropTypes.bool,
      use_as_data_source: PropTypes.bool,
    }).isRequired,
    allIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  removeNodeDetails: PropTypes.func.isRequired,
  currentChain: PropTypes.string.isRequired,
  data: PropTypes.shape({
    nodeForm: PropTypes.shape({
      backStep: PropTypes.string.isRequired,
      nextStep: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default NodesTable;
