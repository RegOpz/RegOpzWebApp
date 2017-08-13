import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import RegOpzFlatGridHeader from './RegOpzFlatGridHeader';
import RegOpzFlatGridRow from './RegOpzFlatGridRow';
import _ from 'lodash';
require('./RegOpzFlatGridStyle.css');

export default class RegOpzFlatGrid extends Component {
    constructor(props) {
        super(props);
        this.cols = props.columns;
        this.data = props.dataSource;
        this.filterConditions = null;
        this.flatGridRows = null;
    }

    componentWillReceiveProps(nextProps) {
        this.cols = nextProps.columns;
        this.data = nextProps.dataSource;
        if(this.filterConditions){
            this.data = _.where( nextProps.dataSource,this.filterConditions);
        } else {
            this.data = nextProps.dataSource;
        }
    }

    setDataSource(data) {
        this.data = data;
        this.forceUpdate();
    }

    filterData(conditions) {
        this.filterConditions = conditions;
        this.data = _.where( this.props.dataSource,this.filterConditions);
        this.forceUpdate();
    }

    render() {
      console.log("Inside Render RegOpzFlatGrid....",this.props);
        return(
            <div className="flat_grid_container">
                <RegOpzFlatGridHeader columns={this.cols} onSort={this.props.onSort} onFilter={this.props.onFilter} />
                <div className="clearfix"></div>
                <RegOpzFlatGridRow
                    onSelect={this.props.onSelectRow}
                    onFullSelect = {this.props.onFullSelect}
                    onUpdateRow = {this.props.onUpdateRow}
                    columns={this.cols}
                    data={this.data}
                    ref={(flatGridRows) => {
                      this.flatGridRows = flatGridRows;
                    }}
                    readOnly={this.props.readOnly}
                    isMultiSelectAllowed={this.props.isMultiSelectAllowed ? this.props.isMultiSelectAllowed : false}
               />
            </div>
        )
    }

    deSelectAll() {
      this.flatGridRows.deSelectAll();
      return [];
    }
}
