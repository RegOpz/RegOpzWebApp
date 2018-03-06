import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

class Parameter extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
      // TODO
    }


    componentWillReceiveProps(nextProps) {
      // TODO
    }

    render() {
        return (
            <tr>
                <td>
                    <FormControl
                        type="text"
                        required="required"
                        readOnly={this.props.maintainReportParameter? false : true}
                        maxLength="30"
                        placeholder="Enter parameter name"
                        bsSize="small"
                        value={this.props.parameterTag}
                        onChange={(event) => { this.props.handleChange(event, 'parameterTag', this.props.index); }}
                        disabled={this.props.disabled}
                    />
                </td>
                <td>
                    <FormControl
                        type="text"
                        required={this.props.maintainReportParameter? false : true}
                        maxLength="100"
                        placeholder="Enter parameter value"
                        bsSize="small"
                        value={this.props.keyValue}
                        onChange={(event) => { this.props.handleChange(event, 'keyValue', this.props.index) }}
                    />
                </td>
                <td>
                    <div>
                        <button
                            type="button"
                            className="btn btn-circle btn-warning btn-xs"
                            title="Remove Parameter"
                            onClick={() => { this.props.removeRow(this.props.index) }}
                            disabled={this.props.disabled || this.props.disableRemove}
                        >
                            <small><i className="fa fa-trash"></i></small>
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

}

export default Parameter;
