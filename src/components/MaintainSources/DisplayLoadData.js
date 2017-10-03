import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Panel } from 'react-bootstrap';

class DisplayLoadData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
            businessDate: null,
            applyRules: false,
            fileContents: ''
        }

        this.fileReader = new FileReader();
        this.fileReader.onload = this.loadFileContents.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleBusinessDateChange = this.handleBusinessDateChange.bind(this);
        this.handleApplyRuleCheckBox = this.handleApplyRuleCheckBox.bind(this);
    }

    handleSubmit() {
        console.log("Inside handleSubmit");
        if (this.state.businessDate && this.state.selectedFile) {
            let options = {
                item: this.props.selectedItem,
                selectedFile: this.state.selectedFile,
                businessDate: this.state.businessDate,
                applyRules: this.state.applyRules,
            }
            this.props.handleLoadFile(options);
        }
    }

    handleFileChange(event) {
        console.log('Run handleFileChange');
        let file = event.target.files[0];

        this.fileReader.readAsText(file);
        this.setState({ selectedFile: file });
    }

    loadFileContents() {
        let lines = this.fileReader.result.split(/\r?\n/);
        this.setState({ fileContents: lines });
    }

    handleBusinessDateChange(date) {
        this.setState({ businessDate: date });
    }

    handleApplyRuleCheckBox(e) {
        let applyRules = this.state.applyRules;
        this.setState({ applyRules: !applyRules });
    }
    render() {
        return (
            <div className="x_panel">
                <div className="x_title">
                    <div>
                        <h2>Selected Source <small>Details of the Source Feed </small>
                            <small><i className="fa fa-file-text"></i></small>
                            <small>{this.props.selectedItem.source_file_name}</small>
                        </h2>
                        <div className="clearfix"></div>
                    </div>
                </div>
                <div className="x_content">
                    <form className="form-horizontal form-label-left" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Country </label>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <input
                                    value={this.props.selectedItem.country}
                                    type="text"
                                    className="form-control col-md-7 col-xs-12"
                                    readOnly="readonly"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source Description </label>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <textarea
                                    value={this.props.selectedItem.source_description}
                                    type="text"
                                    className="form-control col-md-7 col-xs-12"
                                    readOnly="readonly"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source File Reference </label>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <input
                                    value={this.props.selectedItem.source_file_name}
                                    type="text"
                                    className="form-control col-md-7 col-xs-12"
                                    readOnly="readonly"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Source Table </label>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <input
                                    value={this.props.selectedItem.source_table_name}
                                    type="text"
                                    className="form-control col-md-7 col-xs-12"
                                    readOnly="readonly"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">File Delimiter</label>
                            <div className="col-md-1 col-sm-1 col-xs-2">
                                <input
                                    value={this.props.selectedItem.source_file_delimiter}
                                    type="text"
                                    className="form-control"
                                    readOnly="readonly"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Load Data From File <span className="required">*</span></label>
                            <input
                                type="file"
                                className="col-md-6 col-sm-6 col-xs-12"
                                required="required"
                                onChange={this.handleFileChange}
                            />
                        </div>

                        {
                            this.state.selectedFile &&
                            this.state.fileContents &&
                            <div className="x_panel">
                                <div className="x_title">
                                    <div>
                                        <h2>File Content Review <small> Data Lines </small>
                                        </h2>
                                        <div className="clearfix"></div>
                                    </div>
                                </div>
                                <div className="x_content">
                                  <div className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                                    <div className="row">
                                      <table className="table table-hover">
                                        <thead>
                                          <tr>
                                            <th>#Line</th>
                                            <th>Data in File</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {
                                              this.state.fileContents.map((line,index)=>{
                                                if(index<5){
                                                  return(
                                                    <tr key={index}>
                                                      <td><b>{index}</b></td>
                                                      <td>{line}</td>
                                                    </tr>
                                                    )
                                                }
                                              })
                                            }
                                          </tbody>
                                          </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                        }

                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name">Business Date <span className="required">*</span></label>
                            <div className="col-md-6 col-sm-6 col-xs-12">
                                <DatePicker
                                    dateFormat="DD-MMM-YYYY"
                                    selected={this.state.businessDate}
                                    onChange={this.handleBusinessDateChange}
                                    placeholderText="Business Date,dd-mon-yyyy"
                                    required="required"
                                    className="view_data_date_picker_input form-control"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name"></label>
                            <input
                                type="checkbox"
                                id="loadData"
                                name="loadData"
                                value="loadData"
                                className="control-label col-md-offset-3"
                                disabled
                                checked="checked" /><b> Load Data</b>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="first-name"></label>
                            <input
                                type="checkbox"
                                id="applyrules"
                                name="applyrules"
                                value="applyrules"
                                className="control-label col-md-offset-3"
                                onChange={this.handleApplyRuleCheckBox}
                            /><b> Apply Rules after Load Data</b>
                        </div>
                        <div className="form-group">
                            <div className="col-md-9 col-sm-9 col-xs-12 col-md-offset-3">
                                <button type="button" className="btn btn-success" onClick={this.handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default DisplayLoadData;
