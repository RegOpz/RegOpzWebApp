import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { actionClearErrorMessage } from './../../actions/MiddleWareAction';

class DisplayMessage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayAlert: false
        }

        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.message)
            this.setState({ displayAlert: true });
    }

    handleAlertDismiss() {
        this.props.clearMessage();
        this.setState({ displayAlert: false });
    }

    render() {
        return (
            <div>
                {
                    this.state.displayAlert &&
                    <Alert bsStyle="danger" onDismiss={this.handleAlertDismiss}>
                        <strong> {this.props.message} </strong>
                    </Alert>
                }
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        message: state.displayMessage
    };
}

const matchDispatchToProps = (dispatch) => {
    return {
        clearMessage: () => {
            dispatch(actionClearErrorMessage());
        }
    };
}

export default connect(mapStateToProps, matchDispatchToProps)(DisplayMessage);