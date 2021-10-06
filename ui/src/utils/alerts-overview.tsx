import { h } from "@stencil/core";
import { Alert } from "../interfaces/chains";
import { DataTableRecordType } from "../lib/types/types/datatable";
import { criticalIcon, errorIcon, infoIcon, Severity, warningIcon } from "./constants";

/**
 * Gets the JSX for the data table.
 * @param alerts list of alerts to be displayed.
 * @returns populated data table JSX.
 */
export const getDataTableJSX = (): JSX.Element => {
    let alerts: Alert[] = [];

    const hasAlerts = alerts.length > 0;
    const cols: string[] = ['Severity', 'Time Stamp', 'Message'];
    const rows: DataTableRecordType = hasAlerts ? getDataTableRecordTypeFromAlerts(alerts) : [];

    return <svc-data-table
        key={hasAlerts ? 'data-table-no-alerts' : 'data-table-alerts'}
        cols={cols}
        rows={rows}
        no-records-message="There are no alerts to display at this time"
    />
}

/**
 * Filters alerts which do not have an active severity and formats alerts to DataTableRecordType type.
 * @param alerts list of alerts.
 * @param activeSeverities list of active severities.
 * @returns populated list of lists of required object type.
 */
const getDataTableRecordTypeFromAlerts = (alerts: Alert[]): DataTableRecordType => {
    // Format filtered alerts into DataTableRecordType type.
    return alerts.map(alert => [
        { label: getSeverityIcon(alert.severity), value: alert.severity },
        { label: new Date(alert.timestamp * 1000).toLocaleString(), value: new Date(alert.timestamp * 1000) },
        { label: alert.message, value: alert.message }]);
}

/**
 * Returns icon markup as object according to the severity passed.
 * @param severity the alert severity.
 * @returns icon markup as object which corresponds to the severity.
 */
const getSeverityIcon = (severity: Severity): Object => {
    switch (Severity[severity]) {
        case Severity.CRITICAL: {
            return criticalIcon;
        }
        case Severity.WARNING: {
            return warningIcon;
        }
        case Severity.ERROR: {
            return errorIcon;
        }
        case Severity.INFO: {
            return infoIcon;
        }
        default: {
            return {};
        }
    }
}
