import React from 'react';
import Warning from '@material-ui/icons/Warning';
import SnackbarContent from 'components/material_ui/Snackbar/SnackbarContent';
import Clearfix from 'components/material_ui/Clearfix/Clearfix';
import NewReleasesIcon from '@material-ui/icons/NewReleases';
import useStyles from 'assets/jss/material-kit-react/views/componentsSections/notificationsStyles';
import ErrorIcon from '@material-ui/icons/Error';
import Data from 'data/channels';

export default function AlertsSection() {
  const classes = useStyles();
  return (
    <div className={classes.section} id="notifications">
      <SnackbarContent
        message={(
          <span>
            <b>{Data.alerts.info}</b>
          </span>
        )}
        color="default"
        icon={ErrorIcon}
        iconColor="#339900"
      />
      <SnackbarContent
        message={(
          <span>
            <b>{Data.alerts.warning}</b>
          </span>
        )}
        color="default"
        icon={Warning}
        iconColor="#EED202"
      />
      <SnackbarContent
        message={(
          <span>
            <b>{Data.alerts.critical}</b>
          </span>
        )}
        color="default"
        icon={NewReleasesIcon}
        iconColor="#cc3300"
      />
      <SnackbarContent
        message={(
          <span>
            <b>{Data.alerts.error}</b>
          </span>
        )}
        color="default"
        icon={ErrorIcon}
        iconColor="#000000"
      />
      <Clearfix />
    </div>
  );
}
