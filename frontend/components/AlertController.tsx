import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

export interface IETKAlert {
  title: string;
  message: string;
  actions: { label: string; value: any }[];
  onDismiss?: (v:any) => void;
};
export class ETKAlert extends React.Component<IETKAlert, { open: boolean }> {
  constructor(props) {
    super(props);
    this.state = { open: true };
  }
  dismiss(v) {
    this.setState({ open: false });

    if (this.props.onDismiss) {
      this.props.onDismiss(v);
    }
  }
  present() {
    this.setState({ open: true });
  }

  render() {
    const actions = this.props.actions.map(action => (
      <Button onClick={(e) => { this.dismiss(action.value); }}>{action.label}</Button>
    ));
    return (
      <Dialog open={this.state.open}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>{this.props.message}</DialogContent>
        <DialogActions>
          {actions}
        </DialogActions>
      </Dialog>
    );
  }
}

/**
 * @todo needs a better implementation to prevent stacking alers on the dom
 */
export default class ETKAlertController extends React.Component<{ props }, { alerts: IETKAlert[] }> {
  constructor(props) {
    super(props);
    this.state = { alerts: [] };
  }

  create(props: IETKAlert) {
    const _a = [...this.state.alerts, props];
    this.setState({ alerts: _a });
  }

  render() {
    return this.state.alerts.map(alert =>
      <ETKAlert
        title={alert.title}
        message={alert.message}
        actions={alert.actions}
        onDismiss={alert.onDismiss}
      >
      </ETKAlert>
    );
  }
}