import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { WithContext as ReactTags } from 'react-tag-input';
import {
    Link,
    hashHistory
} from 'react-router';
import {
    actionFetchSourceFeedColumnList,
    actionInsertSourceData,
    actionUpdateSourceData
} from '../../../actions/MaintainSourcesAction';

import SourceTable from './SourceTable';
import { Button } from 'react-bootstrap';


import './AddSources.css';

class AddSources extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rulesTags: [],
            aggRefTags: [],
            rulesSuggestions: [],
            fieldsSuggestions: [],
            form: {
                source_table_name: null,
                source_id: null,
                country: null,
                id: null,
                source_description: null,
                source_file_name: null,
                source_file_delimiter: null,
                last_updated_by: null
            },
            requestType: this.props.requestType,
            readOnly: this.props.readOnly,
            additionalSourceFields: [],
            fileDelimiter: ',',
            mandatoryFields: {
                id: "bigint",
                business_date: "int",
                last_updated_by: "varchar(20)",
                dml_allowed: "varchar(1)",
                in_use: "varchar(1)"
            }
        };

        console.log('Props: ', this.props);

        this.handleAdditionalSourceTableChange = this.handleAdditionalSourceTableChange.bind(this);
        this.addRowToSourceTable = this.addRowToSourceTable.bind(this);
        this.removeRowFromSourceTable = this.removeRowFromSourceTable.bind(this);
        this.moveRowInSourceTable = this.moveRowInSourceTable.bind(this);
        this.readFile = this.readFile.bind(this);
        this.setFileDelimiter = this.setFileDelimiter.bind(this);
        this.addDefaultRows = this.addDefaultRows.bind(this);
    }

    componentWillMount() {
      let form = this.props.formData;
      form.country = this.props.login_details.domainInfo.country;
      this.setState({
            form: form,
            additionalSourceFields: []
          },
            ()=>{this.props.fetchSourceFeedColumnList(this.state.form.source_table_name)}
        );
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.form.source_id != nextProps.formData.source_id){
            this.setState({
              form: nextProps.formData,
              additionalSourceFields: [],
              requestType: nextProps.requestType,
              readOnly: nextProps.readOnly,
            },
              ()=>{this.props.fetchSourceFeedColumnList(this.state.form.source_table_name)}
          );
        }
    }

    addDefaultRows() {
        let additionalSourceFields = this.state.additionalSourceFields;
        let currentColumns = this.props.source_table_columns;
        let combinedColumns = [...additionalSourceFields, ...currentColumns];
        let mandatoryFields = new Set(Object.keys(this.state.mandatoryFields));

        combinedColumns.forEach(element => {
            if(mandatoryFields.has(element.Field))
                mandatoryFields.delete(element.Field);
        });

        var notEnteredColumns = [...mandatoryFields];
        notEnteredColumns.forEach(element => {
            additionalSourceFields.push({
                Field: element,
                Type: this.state.mandatoryFields[element],
                Null: 'YES',
                Key: '',
                Default: '',
                Extra: '',
                disabled: true
            });
        });

    }

    handleAdditionalSourceTableChange(event, eventType, index) {
        var additionalSourceFields = [...this.state.additionalSourceFields];
        var value;
        var checked;
        switch (eventType) {
            case 'field':
                value = event.target.value;
                value = value.replace(/[^a-z0-9_]/g, "");
                additionalSourceFields[index].Field = value;
                this.setState({ additionalSourceFields: additionalSourceFields });
                break;
            case 'type':
                value = event.target.value;
                console.log(value);
                additionalSourceFields[index].Type = value;
                this.setState({ additionalSourceFields: additionalSourceFields });
                break;
            case 'nullable':
                if (this.state.requestType == "update") {
                    value = "YES"
                } else {
                    value = event.target.value;
                }
                additionalSourceFields[index].Null = value;
                this.setState({ additionalSourceFields: additionalSourceFields });
                break;
            case 'key':
                value = event.target.value;
                additionalSourceFields[index].Key = value;
                this.setState({ additionalSourceFields: additionalSourceFields });
                break;
            case 'default':
                value = event.target.value;
                additionalSourceFields[index].Default = value;
                this.setState({ additionalSourceFields: additionalSourceFields });
                break;
            case 'extra':
                value = event.target.value;
                additionalSourceFields[index].Extra = value;
                this.setState({ additionalSourceFields: additionalSourceFields });
                break;
        }
    }

    addRowToSourceTable(fieldName, dataType, disabled) {

        let additionalSourceFields = this.state.additionalSourceFields;

        if(this.props.source_table_columns.length < 5)
            this.addDefaultRows();

        additionalSourceFields.push({
            Field: fieldName ? fieldName : '',
            Type: dataType ? dataType : 'varchar(1000)',
            Null: disabled ? 'NO' : 'YES',
            Key: '',
            Default: '',
            Extra: '',
            disabled: disabled ? true : false
        });
        this.setState({ additionalSourceFields: additionalSourceFields });
    }

    removeRowFromSourceTable(index) {
        var additionalSourceFields = [...this.state.additionalSourceFields];
        additionalSourceFields.splice(index, 1);
        this.setState({ additionalSourceFields: additionalSourceFields });
    }

    moveRowInSourceTable(currentIndex, direction) {
        if (currentIndex === 0 && direction === 'UP')
            return;
        if (currentIndex === this.state.additionalSourceFields.length - 1 && direction === 'DOWN')
            return;

        if (direction === 'UP') {
            let currentValue = this.state.additionalSourceFields[currentIndex];
            let intendedValue = this.state.additionalSourceFields[currentIndex - 1];
            let additionalSourceFields = [...this.state.additionalSourceFields];
            additionalSourceFields[currentIndex] = intendedValue;
            additionalSourceFields[currentIndex - 1] = currentValue;
            this.setState({ additionalSourceFields: additionalSourceFields });
        }
        else {
            let currentValue = this.state.additionalSourceFields[currentIndex];
            let intendedValue = this.state.additionalSourceFields[currentIndex + 1];
            let additionalSourceFields = [...this.state.additionalSourceFields];
            additionalSourceFields[currentIndex] = intendedValue;
            additionalSourceFields[currentIndex + 1] = currentValue;
            this.setState({ additionalSourceFields: additionalSourceFields });
        }
    }

    readFile(event) {
        var fieldsFromFile = [];
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = () => {
            var line = reader.result.split('\n')[0];
            line = line.split(this.state.fileDelimiter);

            for (let i = 0; i < line.length; i++) {
                line[i] = line[i].toLowerCase();
                line[i] = line[i].replace(/[^a-z0-9_]/g, "");

                if (!(line[i] in this.state.mandatoryFields))
                    this.addRowToSourceTable(line[i]);
            }
        };
        reader.readAsText(file);
    }

    setFileDelimiter(event) {
        var value = event.target.value;
        this.setState({ fileDelimiter: value });
    }

    render() {
        console.log('field list', this.props.source_table_columns);
        if (typeof (this.props.source_table_columns) == 'undefined') {
            return (
                <h1>Loading...</h1>
            )
        } else {
            console.log('in else', this.props.source_table_columns);
            console.log('Before render ', this.state.requestType, this.state.form.country, this.state.form);
            return (
                <div className="row">
                    <div className="x_panel">
                        <div className="x_title">
                            <h2>Maintain Source <small>Add a new source</small></h2>
                            <div className="clearfix"></div>
                        </div>
                        <div className="x_content">
                            <br />
                            <form className="form-horizontal form-label-left" onSubmit={this.handleSubmit.bind(this)}>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source Table Name <span className="required">*</span></label>
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <input
                                            placeholder="Enter source table name"
                                            value={this.state.form.source_table_name}
                                            type="text"
                                            readOnly={this.state.readOnly || this.state.requestType == "edit" }
                                            required="required"
                                            maxLength="60"
                                            className="form-control col-md-7 col-xs-12"
                                            onChange={
                                                (event) => {
                                                  let form = this.state.form;
                                                  form.source_table_name = event.target.value.replace(' ','');
                                                  this.setState({form: form});
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source ID <span className="required">*</span></label>
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <input
                                            value={this.state.form.source_id}
                                            type="text"
                                            placeholder="System Reference ID"
                                            required="required"
                                            className="form-control col-md-7 col-xs-12"
                                            readOnly="readonly"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source Description <span className="required">*</span></label>
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <textarea
                                            placeholder="Enter source Description"
                                            value={this.state.form.source_description}
                                            type="text"
                                            maxLength="1000"
                                            required="required"
                                            className="form-control col-md-7 col-xs-12"
                                            onChange={
                                                (event) => {
                                                    let form = this.state.form;
                                                    form.source_description = event.target.value;
                                                    this.setState({form: form});
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source File Name <span className="required">*</span></label>
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <input
                                            placeholder="Enter source File Name"
                                            value={this.state.form.source_file_name}
                                            type="text"
                                            required="required"
                                            className="form-control col-md-7 col-xs-12"
                                            onChange={
                                                (event) => {
                                                  let form = this.state.form;
                                                  form.source_file_name = event.target.value;
                                                  this.setState({form: form});
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source File Data Delimiter <span className="required">*</span></label>
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <input
                                            placeholder="Enter source File Data Delimiter"
                                            value={this.state.form.source_file_delimiter}
                                            type="text"
                                            required="required"
                                            maxLength="1"
                                            className="form-control col-md-7 col-xs-12"
                                            onChange={
                                                (event) => {
                                                  let form = this.state.form;
                                                  form.source_file_delimiter = event.target.value;
                                                  this.setState({form: form});
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Last Updated By <span className="required">*</span></label>
                                    <div className="col-md-6 col-sm-6 col-xs-12">
                                        <input value={this.state.form.last_updated_by} readOnly="readonly" type="text" className="form-control col-md-7 col-xs-12" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Country <span className="required">*</span></label>
                                    <div className="col-md-1 col-sm-12 col-xs-12">
                                        <input
                                            value={this.props.login_details.domainInfo.country}
                                            className="form-control col-md-7 col-xs-6"
                                            type="text"
                                            readOnly={ true }
                                            placeholder="Country"
                                            maxLength="2"
                                            onChange={
                                                (event) => {
                                                    let form = this.state.form;
                                                    form.country = this.props.login_details.domainInfo.country;
                                                    this.setState({
                                                        form: form
                                                    });
                                                    //this.state.form.country = event.target.value.toLocaleUpperCase();
                                                }
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="import-file" className="control-label col-md-3 col-sm-3 col-xs-12">Select File for Header Line</label>
                                    <div className="col-md-1 col-sm-12 col-xs-12">
                                        <input
                                            type="file"
                                            onChange={this.readFile}
                                        />
                                        <input
                                            type="text"
                                            className="form-control col-md-7 col-xs-6"
                                            onChange={this.setFileDelimiter}
                                            value={this.state.fileDelimiter}
                                            placeholder="Enter a delimiter..."
                                            style={{ margin: '7px 0', width: '100px', height: '25px' }}
                                        />
                                    </div>
                                </div>

                                <div className="x_title">
                                    <h2 style={{ width: '100%' }}>
                                        Source Table Definition
                                        <small>Column list</small>
                                          <button type="button" className="btn btn-primary" style={{ float: 'right' }} onClick={() => { this.handleCancel() }}>
                                              Cancel
                                          </button>
                                          <button type="submit" className="btn btn-success" style={{ float: 'right' }}>Submit</button>
                                        <Button
                                            bsStyle="success"
                                            onClick={() => { this.addRowToSourceTable(); }}
                                            style={{ float: 'right' }}
                                        >
                                            + New Field
                                        </Button>
                                    </h2>
                                    <div className="clearfix"></div>
                                </div>
                                {
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Field</th>
                                                <th>Type</th>
                                                <th>Nullable</th>
                                                <th>Key</th>
                                                <th>Default</th>
                                                <th>Extra</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.requestType != "add" && this.props.source_table_columns.map(function (col, colindex) {
                                                    return (
                                                        <tr>
                                                            <td>{col.Field}</td>
                                                            <td>{col.Type}</td>
                                                            <td>{col.Null}</td>
                                                            <td>{col.Key}</td>
                                                            <td>{col.Default}</td>
                                                            <td>{col.Extra}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-circle btn-success btn-xs"
                                                                    disabled
                                                                >
                                                                    <i className="fa fa-check"></i>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                }.bind(this))
                                            }
                                            {
                                                this.state.additionalSourceFields.map((element, index) => {
                                                    return (
                                                        <SourceTable
                                                            {...element}
                                                            index={index}
                                                            maxIndex={this.state.additionalSourceFields.length - 1}
                                                            handleChange={this.handleAdditionalSourceTableChange}
                                                            moveRow={this.moveRowInSourceTable}
                                                            removeRow={this.removeRowFromSourceTable}
                                                            key={index}
                                                        />
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                }

                                <div className="form-group">
                                    <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                                        <div className="clearfix"></div>
                                        <button type="button" className="btn btn-primary" onClick={() => { this.handleCancel() }}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn btn-success">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        }
    }
    showTableFieldsList() {
        console.log(this.props.source_table_columns.length);
        if (this.props.source_table_columns.length > 0) {
            this.props.source_table_columns.map(function (col, colindex) {
                return (
                    <tr>
                        <td>{col.Field}</td>
                        <td>{col.Type}</td>
                        <td>{col.Null}</td>
                        <td>{col.Key}</td>
                        <td>{col.Default}</td>
                        <td>{col.Extra}</td>
                    </tr>
                )
            }.bind(this))
        }
    }
    handleSubmit(event) {
        console.log('inside submit', this.state.form);
        event.preventDefault();

        let data = {
            table_name: "data_source_information",
            update_info: this.state.form,
            added_fields: this.state.additionalSourceFields,
            modified_fields: []
        };
        console.log('inside submit final', data);
        if (this.state.requestType == "add") {
            data.update_info.source_id = 32767;
            this.props.insertSourceData(data);
        }
        else {
            this.props.updateSourceData(this.state.form.id, data);
        }

        this.props.handleClose();
    }
    handleCancel(event) {
        console.log('inside cancel');
        this.props.handleClose();
    }
}
function mapStateToProps(state) {
    console.log("On map state of Add report rule", state);
    return {
        source_table_columns: state.source_feeds.source_table_columns,
        login_details:state.login_store,
        leftmenu: state.leftmenu_store.leftmenuclick,
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetchSourceFeedColumnList: (table_name) => {
            dispatch(actionFetchSourceFeedColumnList(table_name));
        },
        insertSourceData: (data) => {
            dispatch(actionInsertSourceData(data));
        },
        updateSourceData: (id, data) => {
            dispatch(actionUpdateSourceData(id, data));
        }
    }
}
const VisibleAddSources = connect(
    mapStateToProps,
    mapDispatchToProps
)(AddSources);
export default VisibleAddSources;
