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
                    <strong>{this.props.col_id}</strong>
                </td>
                <td className="wrap-text">
                  <p className={this.props.mapped_column? "": "aero"}>
                    {
                      this.props.mapped_column ?
                      this.props.mapped_column
                      :
                      "No mapping available"
                    }
                  </p>
                </td>
                <td>
                  {
                    !this.props.disabled &&
                    this.props.sourceId &&
                    <button
                      type="button"
                      className="btn btn-link btn-xs"
                      title="Edit field"
                      onClick={(event)=>{
                        //TODO
                        let selectedColumn = {
                          index: this.props.index,
                          mapped_column: this.props.mapped_column,
                          col_id: this.props.col_id,
                          sourceColumns: this.props.sourceColumns
                        };
                        this.props.handleEditColMapping(selectedColumn);
                      }}
                      >
                      <i className="fa fa-edit green"></i>
                    </button>
                  }
                  {
                    !this.props.disabled &&
                    this.props.mapped_column &&
                    this.props.sourceId &&
                    <button
                      type="button"
                      className="btn btn-link btn-xs"
                      title="Clear field"
                      onClick={(event) => {
                          event.target.value="";
                          this.props.handleChange(event, 'mappedColumn', this.props.index)
                        }}
                      >
                      <i className="fa fa-close amber"></i>
                    </button>
                  }
                </td>
            </tr>
        );
    }

}

export default TransSecColumnRule;
