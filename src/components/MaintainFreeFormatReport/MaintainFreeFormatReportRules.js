import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
// Leftmenu click to refresh the rightside details pane
import {
  actionLeftMenuClick,
} from '../../actions/LeftMenuAction';
// Free format report actions
import {
  actionFetchFreeFormatReportData,
  actionUpdateFreeFormatReportData
} from '../../actions/FreeFormatReportAction';
// DragObjects related modules
import {
	DropTarget,
	ConnectDropTarget,
	DropTargetMonitor,
} from 'react-dnd';
import ItemTypes from '../DragObjects/ItemTypes';
import Box from '../DragObjects/Box';
// Other components for free format report maintenance
import ReportCatalogList from '../MaintainReportRules/ReportRuleCatalog';
import RegOpzReportGrid from '../RegOpzReportGrid/RegOpzReportGrid';
import ReportChangeHistory from './ReportChangeHistory';
import ReportCellDetails from './ReportCellDetails';
import LoadingForm from '../Authentication/LoadingForm';
import AccessDenied from '../Authentication/AccessDenied';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';


// DnD related methods
const boxTarget = {
	drop(props, monitor, component) {
		// console.log("inside boxTarget",component)
		if (!component) {
			return
		}
		const item = monitor.getItem();
		const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x) < 0 ? 0 : Math.round(item.left + delta.x);
		const top = Math.round(item.top + delta.y) < -50 ? -50 : Math.round(item.top + delta.y);

		component.moveBox(item.id, left, top);
	},
}

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const Boxes = {
  editTools:  { isMoveBoxExternal: true, moveBoxComponent: 'reportGrid',
                  id: 'editTools', key: 'editTools', left: 0, top: 0,
                  hideSourceOnDrag:false, isResizeAllowed:false,
                  className: '', isMaximized: false,isAlwaysOnTop:true ,
                  isBringToFront: false },
  editSection:  { isMoveBoxExternal: true, moveBoxComponent: 'reportGrid',
                  id: 'editSection', key: 'editSection', left: 10, top:60,
                  hideSourceOnDrag: false, isResizeAllowed:true,
                  className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                  isBringToFront: false, isOpen: false },
  history : { isMoveBoxExternal: false, moveBoxComponent: this ,
                 id: 'history', key: 'history', left: 10, top:60,
                 hideSourceOnDrag: false, isResizeAllowed:true,
                 className: 'col-md-9 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                 isBringToFront: false, isOpen: false },
 details : { isMoveBoxExternal: false, moveBoxComponent: this ,
                id: 'details', key: 'details', left: 10, top:60,
                hideSourceOnDrag: false, isResizeAllowed:true,
                className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                isBringToFront: false, isOpen: false },
  parameters : { isMoveBoxExternal: false, moveBoxComponent: this ,
                 id: 'parameters', key: 'parameters', left: 10, top:60,
                 hideSourceOnDrag: false, isResizeAllowed:true,
                 className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                 isBringToFront: false, isOpen: false },
  allRules : { isMoveBoxExternal: false, moveBoxComponent: this ,
                 id: 'allRules', key: 'allRules', left: 10, top:60,
                 hideSourceOnDrag: false, isResizeAllowed:true,
                 className: 'col-md-9 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                 isBringToFront: false, isOpen: false },
};

class MaintainFreeFormatReportRules extends Component {
  constructor(props){
    super(props)
    this.state = {
      displayOption: false,
      selectedReport: {},
      // details related variables
      detailsCell: {},
      // DnD boxes
      boxes: Boxes,
    }

    // Variables for local scope
    this.openBoxObj = { isOpen: true, left: 0, top: 30 };
    this.gridDataViewReport = undefined;

    // Functions to be used inthe component
    this.alphaSequence = this.alphaSequence.bind(this);
    this.loadingPage = this.loadingPage.bind(this);
    this.renderDynamic = this.renderDynamic.bind(this);
    this.handleReportClick = this.handleReportClick.bind(this);
    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleToolsButtonClick = this.handleToolsButtonClick.bind(this);
    this.handleHistoryClick = this.handleHistoryClick.bind(this);
    this.handleDetailsClick = this.handleDetailsClick.bind(this);

    // DnD related methods
    this.handleBoxSize = this.handleBoxSize.bind(this);
    this.handleBringToFront = this.handleBringToFront.bind(this);
    this.handleClickToOpenBox = this.handleClickToOpenBox.bind(this);
    this.handleSetBoxObjects = this.handleSetBoxObjects.bind(this);
    this.renderBoxes = this.renderBoxes.bind(this);
    this.isSectionDefined = this.isSectionDefined.bind(this);
    this.handleUpdateReportData = this.handleUpdateReportData.bind(this);
    this.handleCloseAllClick = this.handleCloseAllClick.bind(this);

    // Grid buttons
    this.buttons=[
      // {id: 'details', title: 'Cell Rule Details', onClick: this.handleRefreshGrid.bind(this), toolObj: <i className="fa fa-refresh green"></i>},
      { id: 'refresh', title: 'Refresh Report', onClick: this.handleReportClick, toolObj: <i className="fa fa-refresh"></i> },
      { id: 'details', title: 'Cell Rule Details', onClick: this.handleDetailsClick, toolObj: <i className="fa fa-cog green"></i> },
      { id: 'history', title: 'Report Change History', onClick: this.handleHistoryClick, toolObj: <i className="fa fa-history dark"></i> },
      { id: 'allRules', title: 'All Report Rules', onClick: this.handleReportBusinessRulesClick, toolObj: <i className="fa fa-link aero"></i> },
      { id: 'parameters', title: 'Edit Report Parameters', onClick: this.handleEditParameterClick, toolObj: <i className="fa fa-cogs dark"></i> },
      { id: 'closeAll', title: 'Close All Open Boxes', onClick: this.handleCloseAllClick, toolObj: <i className="fa fa-power-off red"></i> },
      // { title: 'Save Report Rules', iconClass: 'fa-puzzle-piece', checkDisabled: 'No', className: "btn-info", onClick: this.handleExportRules.bind(this) },
      // { title: 'Export', iconClass: 'fa-table', checkDisabled: 'No', className: "btn-success", onClick: this.handleExportReport.bind(this) },
      // { title: 'Edit Report Parameters', iconClass: 'fa-cogs', checkDisabled: 'No', className: "btn-warning", onClick: this.handleEditParameterClick.bind(this) },
    ];


    // Check subscription and permissions as required to determine the role of the user and domain
    this.isSubscribed=JSON.parse(this.props.login_details.domainInfo.subscription_details)["Maintain Report Rules"];
    this.component=this.isSubscribed ? _.find(this.props.login_details.permission,{component:"Maintain Report Rules"}) : null;

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report Rules" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report Rules" }) ? true : false;
  }

  componentWillMount() {
      // TODO
  }

  componentDidUpdate() {
    // When leftmenu clicked refresh right pane
    this.props.leftMenuClick(false);
  }
  componentWillReceiveProps(nextProps){
    // Get the data from nextProps
    // Report grid data for viewing
    this.gridDataViewReport = nextProps.gridDataViewReport;
    // Reset all state variables to refresh the right pane
    if(this.props.leftmenu){
      let boxes = this.state.boxes;
      Object.keys(boxes).map((id,index)=>{
        boxes[id].isOpen = false;
      })
      this.setState({
        // TODO
          boxes: boxes,
          selectedReport: {},
          displayOption: false
        },
        ()=>{
          // TODO:  if any post refresh right pane
        }
      );
    }
  }

// Set the box position after drag end
  moveBox(id, left, top){
    let boxes = this.state.boxes;
    Object.assign(boxes[id],{left: left, top: top});
    this.setState({boxes: boxes})
  }

// Box resizing - maximise, restore
  handleBoxSize(id, boxSizes){
    let boxes = this.state.boxes;
    Object.assign(boxes[id],boxSizes);
    this.setState(boxes);
  }

// Bring DnD box to front by setting z-index
  handleBringToFront(id){
    let boxes = this.state.boxes;
    Object.keys(boxes).map(box=> boxes[box].isBringToFront= (box == id ? true: false));
    this.setState({boxes: boxes });
  }

// Open any DnD box and bring it to front and send all other boxes to the background
  handleClickToOpenBox(id){
    let boxes = this.state.boxes;
    Object.assign(boxes[id],this.openBoxObj);
    Object.keys(boxes)
          .map(box=> {
              boxes[box].isBringToFront= (box == id ? true : false);
            }
          );
    return boxes;
  }

  // Close all open windows by setting the isOpen flag as false
  handleCloseAllClick(){
    let boxes = this.state.boxes;
    Object.keys(boxes)
          .map(box=> {
              boxes[box].isOpen= false;
            }
          );
    this.setState({boxes});
  }

// Method to manage DnD boxes inside any child component
  handleSetBoxObjects(boxes){
    this.setState({boxes});
  }

  handleReportClick(selectedReport) {
    selectedReport = selectedReport ? selectedReport : this.state.selectedReport;
    if(selectedReport.access_type=="No access"){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open(
        <div className=" mid_center">
          <h3><i className="fa fa-warning red"></i>&nbsp;</h3>
          {"Please note that you do not have access to view report " + selectedReport.report_id + ". Contact administrator for required permission."}
        </div>);
      this.setState({displayOption: "accessDenied",selectedReport: selectedReport,});
    } else {
      // Close open DnD boxes
      let boxes = this.state.boxes;
      Object.keys(boxes).map((id,index)=>{
        boxes[id].isOpen = false;
      })
      // Reset gridDataViewReport data, so that last instance of the data is not rendered,
      // and assign the value subsequently through nextProps
      // selectedReport = selectedReport ? selectedReport : this.state.selectedReport;
      this.gridDataViewReport=undefined;
      this.setState({
          boxes: boxes,
          selectedReport: selectedReport,
          displayOption: "showReportGrid"
       },
        ()=>{
          const { report_id } = this.state.selectedReport;
          this.props.fetchReportData(report_id)
        }
      );
    }
  }

  handleSelectCell(sheetName, cell_selected, sheetIndexKey){
    let reportId = this.state.selectedReport.report_id;
    this.selectedCell = {reportId, sheetName};
    this.selectedCellRange = cell_selected ? cell_selected : [undefined,undefined,undefined,undefined];
    if(cell_selected){
      let [startrow,startcol,endrow,endcol]=cell_selected;
      this.selectedCell.cell = this.alphaSequence(startcol)+(startrow+1);
      this.selectedCell.cellRef = this.gridDataViewReport[sheetIndexKey].cell_refs ?
                                  this.gridDataViewReport[sheetIndexKey].cell_refs[startrow][startcol]
                                  :
                                  null;
    } else {
      this.selectedCell.cell = null;
    }
    // this.setState({selectedCell: this.selectedCell});
  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
  }

  // Generic tools button click method
  handleToolsButtonClick(id) {
    let boxes  = {...this.state.boxes};
    if(boxes[id].isOpen) {
      boxes[id].isOpen = false;
    } else {
      boxes = this.handleClickToOpenBox(id);
    }
    this.setState({boxes});
  }

  handleHistoryClick(){
    this.handleToolsButtonClick('history');
  }

  handleDetailsClick(id){
    // We facilitate multiple open windows for cell details
    // thus keep on amending the list of boxes for related cells
    // Note that this need sto be tested for performance, as we are not unmounting the DOM components
    if(id){
      if(this.state.boxes[id] && this.state.boxes[id].isOpen){
        this.handleToolsButtonClick(id);
      }
    } else {
      // create the unique id of the cell for which details to be displayed
      id = 'details'+ this.reportGrid.key +this.selectedCell.cell;

      if(!this.selectedCell.cell){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open("Please select a cell for rule details");
      } else {
        let { boxes,detailsCell } = {...this.state};
        // if this cell has not been accessed earlier, create its box element
        if(!boxes[id]){
          let newDetailsCell = {};
          let newDetailsBox = {};
          newDetailsCell[id] = {...this.selectedCell, section: this.isSectionDefined()};
          newDetailsBox[id] = {...boxes.details, id: id, key: id };
          // Add the box element and cell details only if it has valid section def
          if(newDetailsCell[id].section){
            Object.assign(detailsCell,newDetailsCell);
            Object.assign(boxes,newDetailsBox);
            this.setState({boxes,detailsCell},
              ()=>{
                this.handleToolsButtonClick(id);
              }
            );
          }
        } else {
          this.handleToolsButtonClick(id);
        }
      }
    }
  }

  isSectionDefined(){
    let sectionDef = null;
    let [rowStart,colStart,rowEnd,colEnd] = this.selectedCellRange;
    // let r1 ={x:[rowStart,rowEnd], y: [colStart,colEnd]}
    // We only need to check first cell selected if it's a range of cells selected
    const { key, gridData } = this.reportGrid;
    gridData[key].sections.map((sec,index)=>{

      let [secRowStart,secColStart,secRowEnd,secColEnd] = sec.ht_range;
      // If one rectangle is on left side of other
      if (colStart > secColEnd || secColStart > colStart){
        // sectionDef = false;
      }
      // If one rectangle is above other, please check the > sign here as our report grid
      // Y axis is inverted (starts at 0 row and increaes as we go down the rows....)
      else if (rowStart > secRowEnd || secRowStart > rowStart){
        // sectionDef = false;
      } else {
        sectionDef = sec;
      }

    })

    if(!sectionDef){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open(
        <div className="mid_center">
          <span>
            <i className="fa fa-warning amber"></i>
            { " No section definition found for "}<b className="red">{this.selectedCell.cell}</b>{"."}
            <br/>
            {" Please check and Add section definition, then try to add rules ..."}
          </span>
        </div>);
      }

    return sectionDef;
  }

  handleUpdateReportData(report_data){
    this.props.updateReportData(this.state.selectedReport.report_id, report_data);
  }

  // render a DnD box
  renderBoxes(id){
    let box = this.state.boxes[id]
    return(
          <div
            onClick={
              ()=>{
                this.handleBringToFront(box.id);
              }
            }
            onDoubleClick={
              ()=>{
                let boxSize = {
                  isMaximized: !box.isMaximized
                }
                this.handleBoxSize(box.id,boxSize)
              }
            }>
            <Box
                {...box}
              >
              { this.renderDynamic(box.id)}
            </Box>
          </div>
        );
  }

  renderDynamic(displayOption){
    let detailsId = displayOption;
    if(displayOption && displayOption.includes("details")){
      displayOption = "details";
    }
    switch(displayOption){
      case "showReportGrid":
          const { report_id } = this.state.selectedReport;
          if (this.gridDataViewReport) {
              return(

                    <RegOpzReportGrid
                      { ...this.state.selectedReport }
                      additionalTools = { this.buttons }
                      gridData={this.gridDataViewReport}
                      boxes = { this.state.boxes }
                      moveBox = { this.moveBox }
                      handleBoxSize = { this.handleBoxSize }
                      handleBringToFront = { this.handleBringToFront }
                      handleClickToOpenBox = { this.handleClickToOpenBox }
                      handleSetBoxObjects = { this.handleSetBoxObjects }
                      handleSelectCell={ this.handleSelectCell }
                      handleUpdateReportData={ this.handleUpdateReportData }
                      ref={
                         (reportGrid) => {
                           this.reportGrid = reportGrid;
                         }
                       }
                    />

              );
          }
          return(
              <div>
                {
                  this.loadingPage("fa-send", "blue","Opening Report " + report_id)
                }
              </div>
          );
          break;
      case "history":
          return(
            <ReportChangeHistory
              history={ this.state.boxes.history }
              selectedReport={ this.state.selectedReport }
              gridDataViewReport={ this.gridDataViewReport }
              handleClose={ this.handleHistoryClick }
              handleBoxSize = { this.handleBoxSize }
              handleBringToFront = { this.handleBringToFront }
              />
          );
          break;
      case "details":
          if(this.state.detailsCell[detailsId] && this.state.detailsCell[detailsId].section){
            switch(this.state.detailsCell[detailsId].section.section_type){
              case "FIXEDFORMAT":
                return(
                  <ReportCellDetails
                    groupId={ this.props.groupId }
                    viewOnly={ this.viewOnly }
                    writeOnly={ this.writeOnly }
                    reportGrid={ this.reportGrid }
                    details={ this.state.boxes[detailsId] }
                    selectedCell={ this.state.detailsCell[detailsId] }
                    handleClose={ this.handleDetailsClick }
                    handleBoxSize = { this.handleBoxSize }
                    handleBringToFront = { this.handleBringToFront }
                    />
                );
                break;
              case "TRANSACTION":
                return(
                  <div className="mid_center">
                    Yet to create component for transaction section! Work in progress ....
                  </div>
                );
                break;
            }
          }

          return(
            <div className="mid_center">
              That's embarrassing !!!zzzzz No section information available ????
              <span>{JSON.stringify(this.state.detailsCell[detailsId])}</span>
            </div>
          );
          break;
      case "accessDenied":
          if (this.state.selectedReport){
              return <AccessDenied
                      component={"View Report Rules for Report [" + this.state.selectedReport.report_id +"] "}/>
          }
          break;
      default:
          return(
              <ReportCatalogList
                dataCatalog={this.props.dataCatalog}
                navMenu={false}
                handleReportClick={this.handleReportClick}
                constantFilter={"COMPOSIT"}
                reportPermissions={ this.props.login_details.report}
                />
          );
    }
  }

  loadingPage(icon, color,msg){
    return(
      <LoadingForm
        loadingMsg={
            <div>
              <div>
                <a className="btn btn-app" style={{"border": "none"}}>
                  <i className={ "fa " + icon + " " + color }></i>
                  <span className={color}>..........</span>
                </a>
              </div>
              <span className={color}>{msg}</span>
              <br/>
              <span className={color}>Please wait</span>
            </div>
          }
        />
    );
  }

  render(){
    const { connectDropTarget, dataCatalog } = this.props;
    const { report_description, report_id } = this.state.selectedReport;
    const { gridDataViewReport } = this;
    let content =[];
    console.log("On mapState MaintainFreeFormatReportRules this state", this.state);
    if (typeof dataCatalog !== 'undefined') {
        return connectDropTarget(
          <div>
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                  {
                    !this.state.displayOption &&
                    <h2>View Report Rules <small>Available Report Rules for </small>
                      <small>{moment(this.state.startDate).format("DD-MMM-YYYY") + ' to ' + moment(this.state.endDate).format("DD-MMM-YYYY")}</small>
                    </h2>
                  }
                  {
                    this.state.displayOption &&
                    <div>
                      <h2>Maintain Report Rules <small>{' Report '}</small>
                        <small><i className="fa fa-file-text"></i></small>
                        <small title={report_description}>{report_id }</small>
                      </h2>
                      <ul className="nav navbar-right panel_toolbox">
                        <li>
                          <a className="close-link"
                            onClick={()=>{this.props.leftMenuClick(true)}}
                            title={"Back to Report List"}>
                            <i className="fa fa-th-list"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  }
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {
                    (()=>{
                      let content =[];
                      Object.keys(this.state.boxes).map(key=>{
                        // Add this way to avoid unmounting the entire component
                        if(!this.state.boxes[key].isMoveBoxExternal){
                          content.push(
                            <div>
                              {
                                this.state.boxes[key].isOpen &&
                                this.renderBoxes(key)
                              }
                            </div>
                          )
                        }
                      })
                      return content;
                    })()
                  }
                  {this.renderDynamic(this.state.displayOption)}
                </div>
            </div>
          </div>
          <ModalAlert
            ref={(modalAlert) => {this.modalAlert = modalAlert}}
            onClickOkay={this.handleModalOkayClick}
          />

          < AuditModal showModal={this.state.showAuditModal}
            onClickOkay={this.handleAuditOkayClick}
          />
        </div>
      );
    } else {
      return(
              <div>
                {
                  this.loadingPage("fa-rocket", "blue","Loading Report List")
                }
              </div>
            );
    }
  }
}

function mapStateToProps(state){
  console.log("On mapState MaintainFreeFormatReportRules ", state);
  return {
    gridDataViewReport: state.freeFormatReport.report_grid,
    login_details: state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReportData:(report_id, reporting_date)=>{
      dispatch(actionFetchFreeFormatReportData(report_id, reporting_date))
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
    updateReportData:(report_id, report_data)=>{
      dispatch(actionUpdateFreeFormatReportData(report_id, report_data))
    },
  }
}

const VisibleMaintainFreeFormatReportRules = connect(
  mapStateToProps,
  mapDispatchToProps
)(DropTarget(ItemTypes.BOX, boxTarget, collect)(MaintainFreeFormatReportRules));

export default VisibleMaintainFreeFormatReportRules;
