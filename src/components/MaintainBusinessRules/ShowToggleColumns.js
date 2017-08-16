import React, { Component } from 'react';
import { FormControl, Checkbox, Button } from 'react-bootstrap';

class ShowToggleColumns extends Component {
    constructor(props) {
        super(props);

        var columns = [];
        let isChecked = false;
        for (let i = 0; i < this.props.columns.length; i++) {
            isChecked = this.props.selectedViewColumns.includes(this.props.columns[i]);
            let columnObject = {
                name: this.props.columns[i],
                index: i,
                checked: isChecked
            }
            columns.push(columnObject);
        }
        //console.log('filteredColumns',this.props.selectedViewColumns);

        this.state = {
            value: '',
            columns: columns,
            filteredColumns: columns
        };

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.selectAllColumns = this.selectAllColumns.bind(this);
        this.deselectAllColumns = this.deselectAllColumns.bind(this);
        this.saveCheckSelection = this.saveCheckSelection.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        var columns = [];
        let isChecked = false;
        for (let i = 0; i < nextProps.columns.length; i++) {
            isChecked = nextProps.selectedViewColumns.includes(nextProps.columns[i]);
            let columnObject = {
                name: nextProps.columns[i],
                index: i,
                checked: isChecked
            }
            columns.push(columnObject);
        }
        //console.log('nextProps filteredColumns',nextProps.selectedViewColumns);
        this.setState({
            value: '',
            columns: columns,
            filteredColumns: columns
        });
    }

    handleSearchChange(event) {
        let value = event.target.value;
        let length = value.length;
        let filteredColumns = this.state.columns.filter(element => {
            return (
                element.name.toLowerCase().includes(value.toLowerCase())
            );
        });

        this.setState({
            value: value,
            filteredColumns: filteredColumns
        });
    }

    handleCheckBoxChange(event, index) {
        var checked = event.target.checked;
        var mainIndex = this.state.filteredColumns[index].index;

        var filteredColumns = this.state.filteredColumns;
        var columns = this.state.columns;

        filteredColumns[index].checked = checked;
        columns[mainIndex].checked = checked;

        this.setState({
            filteredColumns: filteredColumns,
            columns: columns
        });
    }

    selectAllColumns() {
        let columns = this.state.columns;
        let filteredColumns = this.state.filteredColumns;

        for (let i = 0; i < columns.length; i++)
            columns[i].checked = true;
        for (let i = 0; i < filteredColumns.length; i++)
            filteredColumns[i].checked = true;

        this.setState({
            columns: columns,
            filteredColumns: filteredColumns
        });
    }

    deselectAllColumns() {
        let columns = this.state.columns;
        let filteredColumns = this.state.filteredColumns;

        for (let i = 0; i < columns.length; i++)
            columns[i].checked = false;
        for (let i = 0; i < filteredColumns.length; i++)
            filteredColumns[i].checked = false;

        this.setState({
            columns: columns,
            filteredColumns: filteredColumns
        });
    }

    saveCheckSelection() {
        // console.log(this.state.columns);
        this.props.saveSelection(this.state.columns);
    }

    render() {
        return (
          <div className="x_panel">
            <div className="x_title">
              <h2>Data Grid Attributes <small> select to View Items in Data Grid</small></h2>
                <ul className="nav navbar-right panel_toolbox">
                  <li>
                    <a className="close-link" onClick={this.props.handleClose}><i className="fa fa-close"></i></a>
                  </li>
                </ul>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
                <FormControl
                    type="text"
                    placeholder="Enter a search string..."
                    value={this.state.value}
                    onChange={this.handleSearchChange}
                />
                <br />
                <div>
                    <Button
                        style={{ margin: '14px' }}
                        onClick={this.selectAllColumns}
                    >
                        Select All
                    </Button>
                    <Button
                        style={{ margin: '14px' }}
                        onClick={this.deselectAllColumns}
                    >
                        DeSelect All
                    </Button>
                </div>
                <div style={{ padding: '14px', overflow: 'auto' }}>
                    {
                        this.state.filteredColumns.map((element, index) => {
                            return (
                                <span
                                    key={element.index}
                                    style={{
                                        float: 'left',
                                        padding: '3px',
                                        margin: '7px',
                                        display: 'block',
                                        border: '1px solid black'
                                    }}>
                                    <input
                                        style={{ margin: '7px' }}
                                        type="checkbox"
                                        onChange={(event) => {
                                            this.handleCheckBoxChange(event, index)
                                        }}
                                        checked={element.checked}
                                        id={element.name}
                                    />
                                    <label
                                        htmlFor={element.name}
                                        style={{ paddingRight: '3px' }}
                                    >
                                        {element.name}
                                    </label>
                                </span>
                            );
                        })
                    }
                </div>
                <div style={{ padding: '14px' }}>
                    <Button
                        onClick={this.saveCheckSelection}
                    >
                        Save Selection
                    </Button>
                </div>
            </div >
          </div>
        )
    }

}

export default ShowToggleColumns;
