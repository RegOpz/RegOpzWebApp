import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';

class TransSecColumnRule extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
      // TODO
      // console.log("TransSecColumnRule componentWillMount",this.props)
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
                        readOnly={true}
                        maxLength="30"
                        placeholder="Column"
                        bsSize="small"
                        value={this.props.col_id}
                        disabled={true}
                    />
                </td>
                <td>
                  <FormControl
                      componentClass="select"
                      className={this.props.mapped_column=="" ? "blue":""}
                      placeholder="Select Source Column"
                      value={this.props.mapped_column}
                      onChange={(event) => { this.props.handleChange(event, 'mappedColumn', this.props.index) }}
                      disabled={this.props.disabled}
                  >
                  <option value="">Choose option</option>
                  {
                    this.props.sourceColumns.map(function(item,index){
                      return(
                        <option key={index} target={item.Field} value={item.Field}>{item.Field}</option>
                      )
                    })
                  }
                  </FormControl>
                </td>
            </tr>
        );
    }

}

export default TransSecColumnRule;
