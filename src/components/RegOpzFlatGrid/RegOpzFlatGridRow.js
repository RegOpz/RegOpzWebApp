import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import RegOpzFlatGridCell from './RegOpzFlatGridCell';
import _ from 'lodash';
export default class RegOpzFlatGridRow extends Component {
    constructor(props){
        super(props);
        this.textField = null;
        this.data = props.data;
        this.cols = props.columns;
        this.selectedRows = [];
        this.rowContainerClassName = "flat_grid_row_container";
        this.checkBoxStaus=null;
        this.nonEditableFields=['in_use','dml_allowed','last_updated_by','id','business_date'];
    }
    componentWillReceiveProps(nextProps){
        this.cols = nextProps.columns;
        this.data = nextProps.data;
    }
    isBusinessRulePresent(item){
      let row = _.where(this.selectedRows, item);
      if(row.length != 0){
        return true
      }  else {
        return false
      }
    }
    deSelectAll(){
      console.log('selected rows before deselect',this.selectedRows)
      this.selectedRows = [];
      this.forceUpdate();
    }
    render(){
        return(
            <div className="flat_grid_rows_container">{
                this.data.map(function(item,index){
                    if(this.isBusinessRulePresent(item)){
                      this.rowContainerClassName = "flat_grid_row_container flat_grid_row_container_active";
                      this.checkBoxStaus="checked";
                    } else {
                      this.rowContainerClassName = "flat_grid_row_container";
                      this.checkBoxStaus=null;
                    }
                    return(
                        <div
                            onClick={
                                (event) => {
                                    let itemIndex = index;
                                    let itemData = item;
                                    if ( this.selectedRows.length==1) {
                                      itemIndex = this.data.indexOf(this.selectedRows[0]);
                                      itemData = this.selectedRows[0];
                                    }
                                    this.props.onSelect(itemIndex,itemData);
                                    console.log('View data on click ...index, item ',itemIndex,itemData)
                                }
                            }
                            key={index}
                            className={this.rowContainerClassName}>
                                <div
                                    onClick={
                                        (event) => {
                                            if(this.isBusinessRulePresent(item)){
                                              var index = this.selectedRows.indexOf(item);
                                              this.selectedRows.splice(index, 1);
                                            } else {
                                              if(!this.props.isMultiSelectAllowed){
                                                console.log('To uncheck the previously selected checkbox in data view mode')
                                                this.selectedRows = [];
                                              }
                                              console.log('View data on select row...',item)
                                              this.selectedRows.push(item);
                                            }
                                            this.props.onFullSelect(this.selectedRows);
                                            this.forceUpdate();
                                        }
                                    }
                                    key={index}
                                    className="flat_grid_header_cell"
                                >
                                  <input type="checkbox"
                                    id={item.id}
                                    className="flat"
                                    checked={this.checkBoxStaus}
                                  >
                                  </input>
                                </div>
                                {
                                    this.cols.map(function(citem,cindex){
                                        return(
                                          <RegOpzFlatGridCell
                                            key={cindex}
                                            data={item}
                                            identifier={citem}
                                            onUpdateRow={this.props.onUpdateRow}
                                            readOnly={this.props.readOnly || this.nonEditableFields.includes(citem)}
                                         />
                                        )
                                    }.bind(this))
                                }

                        </div>
                    )
                }.bind(this))
            }</div>
        )
    }
}
