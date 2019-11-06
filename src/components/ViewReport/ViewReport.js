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
  // actionFetchFreeFormatReportData,
  actionUpdateFreeFormatReportData
} from '../../actions/FreeFormatReportAction';
import {
  actionFetchReportData,
  actionDrillDown
} from '../../actions/CaptureReportAction';
import {
  //actionFetchDates,
  actionFetchReportCatalog,
  //actionFetchReportLinkage,
  //actionFetchDataChangeHistory,
  actionExportCSV,
  actionGenerateReport,
} from '../../actions/ViewDataAction';
// DragObjects related modules
import {
	DropTarget,
	ConnectDropTarget,
	DropTargetMonitor,
} from 'react-dnd';
import ItemTypes from '../DragObjects/ItemTypes';
import Box from '../DragObjects/Box';
// Other components for free format report maintenance
import ReportCatalogList from './ReportCatalogList';
import ReportVersionsList from './ReportVersionsList';
import ReportBusinessRules from '../MaintainReportRules/ReportBusinessRules';
import MaintainReportRulesRepository from '../MaintainReportRulesRepository/MaintainReportRulesRepository';
import RegOpzReportGrid from '../RegOpzReportGrid/RegOpzReportGrid';
import HotTableSection from '../RegOpzReportGrid/HotTableSection';
import ReportChangeHistory from './ReportChangeHistory';
import ReportCellDetails from './ReportCellDetails';
import LoadingForm from '../Authentication/LoadingForm';
import AccessDenied from '../Authentication/AccessDenied';
import AuditModal from '../AuditModal/AuditModal';
import ModalAlert from '../ModalAlert/ModalAlert';

// import GridLayout from 'react-grid-layout';
// import { Responsive as ResponsiveGridLayout, WidthProvider  } from 'react-grid-layout';
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
require('react-grid-layout/css/styles.css');
require('react-resizable/css/styles.css');
//
// const ResponsiveGridLayout = WidthProvider(Responsive);

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
		const top = Math.round(item.top + delta.y) < 10 ? 10 : Math.round(item.top + delta.y);

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
                  isBringToFront: false, isOpen: false, position: 'DnD' },
  editSection:  { isMoveBoxExternal: true, moveBoxComponent: 'reportGrid',
                  id: 'editSection', key: 'editSection', left: 10, top:60,
                  hideSourceOnDrag: false, isResizeAllowed:true,
                  className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                  isBringToFront: false, isOpen: false, position: 'DnD' },
  history : { isMoveBoxExternal: false, moveBoxComponent: this ,
                 id: 'history', key: 'history', left: 10, top:60,
                 hideSourceOnDrag: false, isResizeAllowed:true,
                 className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                 isBringToFront: false, isOpen: false, position: 'DnD' },
 details : { isMoveBoxExternal: false, moveBoxComponent: this ,
                id: 'details', key: 'details', left: 10, top:60,
                hideSourceOnDrag: false, isResizeAllowed:true,
                className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                isBringToFront: false, isOpen: false, position: 'DnD' },
  parameters : { isMoveBoxExternal: false, moveBoxComponent: this ,
                 id: 'parameters', key: 'parameters', left: 10, top:60,
                 hideSourceOnDrag: false, isResizeAllowed:true,
                 className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                 isBringToFront: false, isOpen: false, position: 'DnD' },
  allRules : { isMoveBoxExternal: false, moveBoxComponent: this ,
                 id: 'allRules', key: 'allRules', left: 10, top:60,
                 hideSourceOnDrag: false, isResizeAllowed:true,
                 className: 'col-md-6 col-xs-12', isMaximized: false,isAlwaysOnTop:false ,
                 isBringToFront: false, isOpen: false, position: 'DnD' },
};

class ViewReport extends Component {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
    draggableCancel: '.dontDragMe',
  };

  constructor(props){

    super(props)
    this.layoutsTemplate = {
                              lg : {i: 'i', x: 0, y: Infinity, w: 6, h: 3, maxW:12,},
                              md : {i: 'i', x: 0, y: Infinity, w: 5, h: 3, maxW:10,},
                              sm : {i: 'i', x: 0, y: Infinity, w: 3, h: 3, maxW:6, },
                              xs : {i: 'i', x: 0, y: Infinity, w: 4, h: 2, maxW:4, },
                              xxs : {i: 'i', x: 0, y: Infinity, w: 2, h: 2, maxW:2, },
                            };
    this.state = {
      displayOption: false,
      selectedReport: {},
      // Report catalog varaibales
      timeNow: moment(),
      startDate:moment().subtract(1,'months').format("YYYYMMDD"),
      endDate:moment().format('YYYYMMDD'),
      // details related variables
      detailsCell: {},
      // DnD boxes
      boxes: {...Boxes},
      // RGL varibales
      breakpoint: "lg",
      cols: 12,
      layouts: {},
    }

    // Variables for local scope
    this.openBoxObj = { isOpen: true, left: 0, top: 30, position: "DnD" };
    this.gridDataViewReport = undefined;
    this.layoutChangeOrigin = null;
    this.reportVersions = undefined;

    // Functions to be used inthe component
    this.alphaSequence = this.alphaSequence.bind(this);
    this.handleDateFilter = this.handleDateFilter.bind(this);
    this.getaccTypeColor = this.getaccTypeColor.bind(this);
    this.submitGenerateReport = this.submitGenerateReport.bind(this);

    // Report version related methods
    this.viewReportVersions = this.viewReportVersions.bind(this);
    this.viewOperationLog = this.viewOperationLog.bind(this);
    this.refreshOperationLog = this.refreshOperationLog.bind(this);

    this.loadingPage = this.loadingPage.bind(this);
    this.renderDynamic = this.renderDynamic.bind(this);
    this.handleReportClick = this.handleReportClick.bind(this);
    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleToolsButtonClick = this.handleToolsButtonClick.bind(this);
    this.handleHistoryClick = this.handleHistoryClick.bind(this);
    this.handleDetailsClick = this.handleDetailsClick.bind(this);
    this.handleReportRepositoryClick = this.handleReportRepositoryClick.bind(this);
    this.handleReportBusinessRulesClick = this.handleReportBusinessRulesClick.bind(this);
    this.handleEditParameterClick = this.handleEditParameterClick.bind(this);
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);
    this.handleModalDiscardClick = this.handleModalDiscardClick.bind(this);

    // DnD related methods
    this.handleBoxSize = this.handleBoxSize.bind(this);
    this.handleBringToFront = this.handleBringToFront.bind(this);
    this.handleClickToOpenBox = this.handleClickToOpenBox.bind(this);
    this.handleSetBoxObjects = this.handleSetBoxObjects.bind(this);
    this.renderBoxes = this.renderBoxes.bind(this);
    this.isSectionDefined = this.isSectionDefined.bind(this);
    this.handleUpdateReportData = this.handleUpdateReportData.bind(this);
    this.handleCloseAllClick = this.handleCloseAllClick.bind(this);
    this.handlePinDndBox = this.handlePinDndBox.bind(this);

    this.handleLayoutsOnClcikTools = this.handleLayoutsOnClcikTools.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);

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
    this.isSubscribed=JSON.parse(this.props.login_details.domainInfo.subscription_details)["Maintain Report"];
    this.component=this.isSubscribed ? _.find(this.props.login_details.permission,{component:"Maintain Report"}) : null;

    this.viewOnly = _.find(this.props.privileges, { permission: "View Report" }) ? true : false;
    this.writeOnly = _.find(this.props.privileges, { permission: "Edit Report" }) ? true : false;
  }

  componentWillMount() {
      // TODO
      // Fetch the report catalog at the begining
      this.props.fetchReportCatalog(moment(this.state.startDate).format('YYYYMMDD') ,moment(this.state.endDate).format('YYYYMMDD') , 'Data');
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
          displayOption: false,
          layouts: {},
        },
        ()=>{
          // TODO:  if any post refresh right pane
        }
      );
    }
  }

  componenwillUnmount(){
    // Lets close all open DnD boxes
    let boxes = this.state.boxes;
    Object.keys(boxes).map((id,index)=>{
      boxes[id].isOpen = false;
    })
    this.setState({
      // TODO
        boxes: boxes,
        selectedReport: {},
        displayOption: false,
        layouts: {},
      },
      ()=>{
        // TODO:  if any post refresh right pane
      }
    );
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

  // Pin or float DnD box as desired
  handlePinDndBox(id,position){
    let {boxes,layouts} = this.state;
    if(position == "DnD") {
      this.handleOpenDnDBoxes(boxes,id);
      // boxes[id].top =  document.getElementById("RegOpzReportGrid").offsetTop;
      let bodyRect = document.body.getBoundingClientRect()
      let childRect = document.getElementById(id+boxes[id].position).getBoundingClientRect();
      boxes[id].top = childRect.top - bodyRect.top - 90;
      // alert(id+boxes[id].position + "   " +rect.top + "  " + bodyRect.top)
    }
    boxes[id].position = position ? position : "DnD";
    if(!boxes[id].isMoveBoxExternal){
      this.handleLayoutsOnClcikTools(position == "DnD" ? 'float' : 'open',id,layouts);
      this.layoutChangeOrigin = id;
    }
    // Object.assign(boxes[id],{isMaximized: !boxes[id].isMaximized});
    this.setState({boxes,layouts});
  }

// Open any DnD box and bring it to front and send all other boxes to the background
  handleClickToOpenBox(id,isPartOfLayouts){
    let boxes = this.state.boxes;
    let layouts = this.state.layouts;
    isPartOfLayouts = isPartOfLayouts ? isPartOfLayouts : 'Yes';
    Object.assign(boxes[id],this.openBoxObj);
    Object.keys(boxes)
          .map(box=> {
              boxes[box].isBringToFront= (box == id ? true : false);
            }
          );
    // Now add to the lay outs
    if(isPartOfLayouts=='Yes'){
      this.handleLayoutsOnClcikTools('open',id,layouts);
    }
    return {boxes:boxes,layouts:layouts};
  }

  // Close all open windows by setting the isOpen flag as false
  handleCloseAllClick(){
    let layouts= {};
    let boxes = this.state.boxes;
    Object.keys(boxes)
          .map(box=> {
              if(boxes[box].isMoveBoxExternal){
                boxes[box].top = 30;
              } else {
                boxes[box].isOpen= false;
              }
            }
          );
    this.setState({boxes,layouts});
  }

  // Relative position  management for DnD open boxes
  handleOpenDnDBoxes(boxes,id){
    if(id=='none' || boxes[id].position != "DnD"){
      let safeTop = document.getElementById('RegOpzReportGrid').offsetTop + 60
      Object.keys(boxes).map((key,index)=>{
        if(id!=key && ((boxes[key].isOpen && boxes[key].position == "DnD") || boxes[key].isAlwaysOnTop)){
          if (document.getElementById("dndBox"+key)) {
            boxes[key].top = safeTop;
            boxes[key].left = boxes[key].isAlwaysOnTop ? 0 : boxes[key].left;
          }
          // alert(key+boxes[key].top)
        }
      });
    }
    // return boxes;
  }

  // Handle to open->add to layouts, close->remove from layouts, float->remove from layouts
  handleLayoutsOnClcikTools(action,id,layouts){
    switch(action){
      case "open":
        // Add to layouts
        Object.keys(this.layoutsTemplate).map((key,idx)=>{
          let layout = {...this.layoutsTemplate[key]}
          layout.i = id;
          console.log("handleLayoutsOnClcikTools template key",key,layout.x,layout.w,layout.h)
          if(Object.keys(layouts).includes(key)){
              // _.remove(layouts[key],{i:id});
              layouts[key].push(layout);
            console.log("handleLayoutsOnClcikTools template layouts",layouts)
          } else {
            layouts[key]=[layout];
            console.log("handleLayoutsOnClcikTools template else layouts",layouts)
          }
        });
        break;
      case "close":
        // Remove from layouts
        // Fallthrough as both close and float have same action
      case "float":
        // Remove from layouts
        Object.keys(layouts).map((key,idx)=>{
            let layout = {...this.layoutsTemplate[key]}
            layout.i = id;
            _.remove(layouts[key],{i:id});
            // layout.w=0;
            // layout.h=0;
            // layouts[key].push(layout);
        });
        console.log("handleLayoutsOnClcikTools template close/float layouts",layouts)
        break;
    }

    return layouts;
  }

// Method to manage DnD boxes inside any child component
  handleSetBoxObjects(boxes){
    this.setState({boxes});
  }

  handleDateFilter(dates) {
    this.setState({
      startDate: dates.startDate,
      endDate: dates.endDate
    },
      //since setState is asynchronus this gurantees that fetch is executed after setState is executed
      ()=>{this.props.fetchReportCatalog(this.state.startDate,this.state.endDate)}
    );
    // console.log("Dates",dates)
    // this.props.fetchSource(dates.startDate,dates.endDate,"Data");
  }

  getaccTypeColor(accType){
    switch(accType){
      case "No access": return "red";
      case "Not restricted": return "green";
      case "Restricted": return "amber";
      case "Search matched": return "purple";
      default: return "red";
    }
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
          displayOption: "showReportGrid",
          layouts: {},
       },
        ()=>{
          const { report_id, reporting_date, version, report_snapshot, report_parameters  } = this.state.selectedReport;
          // this.props.fetchReportData(report_id)
          this.props.fetchReportData(report_id,reporting_date,
            version,report_snapshot,report_parameters
          );
        }
      );
    }
  }

  submitGenerateReport(reportInfo){
    // if (reportInfo.report_type=="TRANSACTION"){
    //   this.props.createTransReport(reportInfo);
    // } else {
      this.props.generateReport(reportInfo);
    // }
  }

  handleSelectCell(sheetName, cell_selected, sheetIndexKey){
    let reportId = this.state.selectedReport.report_id;
    this.selectedCell = {reportId, sheetName};
    this.selectedCellRange = cell_selected ? cell_selected : [undefined,undefined,undefined,undefined];
    if(cell_selected){
      let [startrow,startcol,endrow,endcol]=cell_selected;
      this.selectedCell.cell = this.alphaSequence(startcol)+(startrow+1);
      this.selectedCell.cellRef = this.gridDataViewReport[sheetIndexKey].cell_refs ?
                                  JSON.parse(this.gridDataViewReport[sheetIndexKey].cell_refs[startrow][startcol]).cell_ref
                                  :
                                  null;
      this.selectedCell.section = this.gridDataViewReport[sheetIndexKey].cell_refs ?
                      JSON.parse(this.gridDataViewReport[sheetIndexKey].cell_refs[startrow][startcol]).section
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
  handleToolsButtonClick(id, overrideWarning) {
    let {boxes,layouts}  = {...this.state};
    if(boxes[id].isOpen && !overrideWarning) {
      this.modalAlert.isDiscardToBeShown = true;
      this.modalAlert.customProps = { id: id };
      this.modalAlert.open(
        <div className="mid_center">
          <span>
            <i className="fa fa-warning amber"></i>
            <br/>
            {
              id.match('details') &&
              <p>
                {"Would you like to close cell details for "}
                <br/>
                <b className="red">{this.selectedCell.cell}</b>
                {" of sheet "}
                <b className="red">{this.selectedCell.sheetName}</b>
                { " ?"}
              </p>
            }
            {
              !id.match('details') &&
              <p>{" Would you like to close window displaying "}<b className="red">{id}</b>{ " ?"}<br/></p>
            }
          </span>
        </div>
      );
    } else {
      if (boxes[id].isOpen && overrideWarning) {
        this.handleOpenDnDBoxes(boxes,id);
        layouts = this.handleLayoutsOnClcikTools('close',id,layouts);
        boxes[id].isOpen = false;
        boxes[id].position = "pinnedTop";
      } else {
        let boxesLayouts = this.handleClickToOpenBox(id,boxes[id].isMoveBoxExternal ? 'No':'Yes');
        console.log("boxesLayouts",boxesLayouts)
        boxes = boxesLayouts.boxes;
        layouts = boxesLayouts.layouts;
        boxes[id].position = "pinnedTop";
        // boxes[id].top = document.getElementById('RegOpzReportGrid').offsetTop + 60;
        this.layoutChangeOrigin = id;
      }
      console.log("handleToolsButtonClick onLayoutChange",layouts,moment().format('h:mm:ss a'));
      this.setState({boxes,layouts});
    }
  }

  handleHistoryClick(){
    this.handleToolsButtonClick('history');
  }

  handleEditParameterClick(){
    this.handleToolsButtonClick('parameters');
  }

  handleReportBusinessRulesClick() {
    this.handleToolsButtonClick('allRules');
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
      } else if(this.selectedCell.cell && !this.selectedCell.section){
        this.isSectionDefined()
      } else {
        let { boxes,detailsCell } = {...this.state};
        // if this cell has not been accessed earlier, create its box element
        if(!boxes[id]){
          let newDetailsCell = {};
          let newDetailsBox = {};
          newDetailsCell[id] = {...this.selectedCell } //, section: this.isSectionDefined()};
          newDetailsBox[id] = {...boxes.details, id: id, key: id };
          // Add the box element and cell details
          Object.assign(detailsCell,newDetailsCell);
          Object.assign(boxes,newDetailsBox);
          this.setState({boxes,detailsCell},
            ()=>{
              this.handleToolsButtonClick(id);
            }
          );

        } else {
          // Added to avoid error when session timedout, while some DnD boxes selected and relogged in
          let newDetailsCell = {};
          newDetailsCell[id] = {...this.selectedCell } //, section: this.isSectionDefined()};
          if(!detailsCell[id] && newDetailsCell[id].section){
            Object.assign(detailsCell,newDetailsCell);
            this.setState({detailsCell},
              ()=>{
                this.handleToolsButtonClick(id);
              })
            } else {
              this.handleToolsButtonClick(id);
            }
        }
      }
    }
  }

  handleReportRepositoryClick(){

    let isOpen = this.state.displayOption === "showReportRepository";
    if(isOpen) {
      this.props.leftMenuClick(true);
      // this.setState({
      //   selectedReport: {},
      //   displayOption: false
      //   },
      //   ()=>{
      //     // this.props.fetchReportTemplateList();
      //   }
      // );
    } else {
      //this.props.fetchReportChangeHistory(this.state.reportId);
      //console.log("Repot Linkage",this.props.change_history);
      this.handleCloseAllClick();
      this.setState({
        selectedReport: {},
        displayOption: "showReportRepository",
        layouts: {},
        },
        ()=>{
          //TODO save in the def catalog
        }
      );
    }
  }

  isSectionDefined(){

    // if(!sectionDef){
      this.modalAlert.isDiscardToBeShown = false;
      this.modalAlert.open(
        <div className="mid_center">
          <span>
            <i className="fa fa-warning amber"></i>
            { " The selected cell "}<b className="red">{this.selectedCell.cell}</b>{" does not belong to any section. "}
            <br/>
            {" No cell details are available...."}
          </span>
        </div>);
      // }

    // return sectionDef;
  }

  handleUpdateReportData(report_data){
    this.props.updateReportData(this.state.selectedReport.report_id, report_data);
  }

  handleModalOkayClick(event){
    //console.log("showAuditModal",this.state.showAuditModal);
    this.modalAlert.isDiscardToBeShown = false;
    this.modalAlert.modalTitle = "Attention";
    // this.setState({closeBox:this.modalAlert.modalTitle});
    if(this.modalAlert.customProps && this.modalAlert.customProps.id){
      this.handleToolsButtonClick(this.modalAlert.customProps.id,true);
    }
    this.modalAlert.customProps = null;
  }

  handleModalDiscardClick(event){
    //console.log("showAuditModal",this.state.showAuditModal);
    this.modalAlert.isDiscardToBeShown = false;
    this.modalAlert.modalTitle = "Attention";
    this.modalAlert.customProps = null;
  }

  // Report version related methods
  viewReportVersions(item) {
    console.log("selected view report versions item",item);
    let isOpen = this.state.displayOption === "viewReportVersions";
    if(isOpen){
      this.reportVersions = undefined;
      this.setState({
        displayOption: false,
        selectedReport: null,
    //     reportId: null,
    //     reportingDate: null,
    //     businessDate: null,
    //     selectedRecord: null,
      },
      // Nothing to add at this stage
      );
    }
    else {
      this.reportVersions = {data_sources: item.versions};
      // console.log("Inside data_sources....", this.reportVersions);
      this.setState({
        displayOption: "viewReportVersions",
        selectedReport: item,
        // reportId: item.report_id,
        // reportingDate: item.reporting_date,
        // businessDate: item.as_of_reporting_date,
        // selectedRecord: item,
       },
        // Nothing to add at this stage
      );
    }
  }

  viewOperationLog(item) {
    console.log("selected view operation log for item",item);
    let isOpen = this.state.display === "viewOperationLog";
    if(isOpen){
      this.operationLogs = undefined;
      console.log("this.state.selectedRecord..",this.state.selectedRecord)
      this.viewReportVersions(this.state.selectedRecord);
    }
    else {
      this.setState({
        display: "viewOperationLog",
        reportId: item.report_id,
        reportingDate: item.reporting_date,
        businessDate: item.as_of_reporting_date,
        selectedRecord: item,
       },
        // Nothing to add at this stage
        ()=>{this.props.fetchOperationLog("Report",item.id)}
      );
    }
  }

  refreshOperationLog(entity_id){
    // this.operationLogs = undefined;
    this.props.fetchOperationLog("Report",entity_id);
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
              <div>
              { this.renderDynamic(box.id)}
              </div>
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
                      showToolsMenu = { false }
                      additionalTools = { this.buttons }
                      gridData={this.gridDataViewReport}
                      boxes = { this.state.boxes }
                      moveBox = { this.moveBox }
                      handleBoxSize = { this.handleBoxSize }
                      handleBringToFront = { this.handleBringToFront }
                      handlePinDndBox = { this.handlePinDndBox }
                      handleClickToOpenBox = { this.handleClickToOpenBox }
                      handleToolsButtonClick = { this.handleToolsButtonClick }
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
              handlePinDndBox = { this.handlePinDndBox }
              />
          );
          break;
      case "allRules":
          let reportId  = this.state.selectedReport.report_id;
          return(
            <ReportBusinessRules
              reportId={ reportId }
              allRules={ this.state.boxes.allRules }
              handleClose={this.handleReportBusinessRulesClick}
              handleBoxSize = { this.handleBoxSize }
              handleBringToFront = { this.handleBringToFront }
              handlePinDndBox = { this.handlePinDndBox }
              />
          );
          break;
      case "parameters":
          return(
            <div className="mid_center">
              Yet to create component for parameters! Work in progress ....
            </div>
          );
          break;
      case "details":
          console.log("details for the selected cell...",this.state,detailsId)
          if(this.state.detailsCell[detailsId]){
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
                    selectedReport={ this.state.selectedReport }
                    handleClose={ this.handleDetailsClick }
                    handleBoxSize = { this.handleBoxSize }
                    handleBringToFront = { this.handleBringToFront }
                    handlePinDndBox = { this.handlePinDndBox }
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
      case "showReportRepository":
          this.component= _.find(this.props.login_details.permission,{component:"Maintain Report Rules Repository"});
          return(
                  <MaintainReportRulesRepository
                    privileges={ this.component ? this.component.permissions : null }
                    tenantRenderType={"copyRule"}
                    reportFormat={"COMPOSIT"}
                    country={this.props.login_details.domainInfo.country}
                    handleCancel={this.handleReportRepositoryClick}
                    groupId={this.props.groupId}
                    tenant_report_details={this.state.selectedReport}
                    />
                );
          break;
      case "accessDenied":
          if (this.state.selectedReport){
              return <AccessDenied
                      component={"View Report Rules for Report [" + this.state.selectedReport.report_id +"] "}/>
          }
          break;
      case "viewReportVersions":
        return(
            <ReportVersionsList
              dataCatalog={this.reportVersions}
              handleReportClick={this.handleReportClick}
              editParameter={this.handleEditParameterClick}
              generateReport={this.submitGenerateReport}
              viewOperationLog={this.viewOperationLog}
              selectedReport = {this.state.selectedReport}
              />
        );
        break;
      default:
          console.log(this.props.login_details.report,this.props.dataCatalog)
          return(
              <ReportCatalogList
                  dataCatalog={this.props.dataCatalog}
                  navMenu={false}
                  handleReportClick={this.handleReportClick}
                  dateFilter={this.handleDateFilter}
                  editParameter={this.handleEditParameterClick}
                  generateReport={this.submitGenerateReport}
                  viewReportVersions={this.viewReportVersions}
                  viewOperationLog={this.viewOperationLog}
                  reportPermissions={this.props.login_details.report}
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


  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    },
    ()=>{console.log("onBreakpointChange", this.state, this.props.cols)}
    );

  }

  onLayoutChange(layout, layouts) {
    // let layouts = this.state.layouts;
    console.log("onLayoutChange........",JSON.stringify(layout),JSON.stringify(layouts.md),JSON.stringify(this.state.layouts.md),moment().format('h:mm:ss a'));
    // object.assign(layouts, layout);
    // if(this.state.layouts.lg.length == layout.length) {
    // let {boxes} = this.state;
    // this.handleOpenDnDBoxes(boxes,'none');
    if(this.layoutChangeOrigin){
      let bp = this.state.breakpoint;
      let gridLayout = _.find(layouts[bp],{i:this.layoutChangeOrigin});
      let stateLayout = _.find(this.state.layouts[bp],{i:this.layoutChangeOrigin});
      gridLayout.w = stateLayout.w;
      gridLayout.h = stateLayout.h;
      this.layoutChangeOrigin = null;
      console.log("onLayoutChange........ 2...",JSON.stringify(layouts.md),JSON.stringify(this.state.layouts.md),moment().format('h:mm:ss a'));
    }
      this.setState({layouts});
    // }
  }


  render(){
    if(!this.viewOnly && !this.writeOnly){
      return(
        <div>
          <div className="row form-container">
            <div className="x_panel">
              <div className="x_content">
                <AccessDenied
                        component={"Maintain Report Rules Repository"}/>
              </div>
            </div>
          </div>
        </div>
      );
    }
    const { connectDropTarget, dataCatalog } = this.props;
    const { report_description, report_id, access_type, version, report_create_date } = this.state.selectedReport;
    const { gridDataViewReport } = this;
    let content =[];
    console.log("On mapState ViewReport this state", this.state);
    if (typeof dataCatalog !== 'undefined') {
        return connectDropTarget(
          <div id="ViewReport">
            <div className="row form-container">
              <div className="x_panel">
                <div className="x_title">
                  {
                    !this.state.displayOption &&
                    <div>
                      <h2>View Report <small>Available Reports for </small>
                        <small>{moment(this.state.startDate).format("DD-MMM-YYYY") + ' to ' + moment(this.state.endDate).format("DD-MMM-YYYY")}</small>
                      </h2>
                      <ul className="nav navbar-right panel_toolbox">
                        <li>
                          <a className="close-link"
                            onClick={()=>{
                              this.setState({timeNow: moment()},
                                this.props.fetchReportCatalog(moment(this.state.startDate).format('YYYYMMDD') ,moment(this.state.endDate).format('YYYYMMDD') , 'Data')
                                // this.props.leftMenuClick(true)
                              );
                            }}
                            title={"Refresh List"}>
                            <i className="fa fa-refresh"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  }
                  {
                    this.state.displayOption &&
                    <div>
                      <h2>View Report <small>{' Report '}</small>
                        <small><i className={"fa fa-file-text " + this.getaccTypeColor(access_type)}></i></small>
                        {
                          this.state.displayOption == "viewReportVersions" &&
                          <small>{this.state.selectedReport.report_id + ' Versions'}</small>
                        }
                        {
                          this.state.displayOption != "viewReportVersions" &&
                          <small>{this.state.selectedReport.report_id + ' [Version: ' + version + ' @' + report_create_date + ']'}
                          {' as on Business Date: ' + moment(this.state.businessDate).format("DD-MMM-YYYY")}</small>
                        }
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
                <div id="entireGridLayout" className="x_content">
                  {
                    (()=>{
                      let content = []
                      let relatedLayout = this.state.layouts[this.state.breakpoint] ?
                                          this.state.layouts[this.state.breakpoint] : [];
                      relatedLayout.map((key,index)=>{
                          content.push(
                            <div id={key.i+this.state.boxes[key.i].position} key={key.i}
                              style={{'border':'1px solid #E6E9ED', 'overflow': 'auto',}}>
                              {
                                this.state.boxes[key.i].isOpen &&
                                this.state.boxes[key.i].position == "pinnedTop" &&
                                <div>
                                  {
                                    this.renderDynamic(key.i)
                                  }
                                </div>
                              }
                              </div>
                          );
                        }
                      )
                      if(content.length>0){
                        return(
                          <ResponsiveGridLayout
                            {...this.props}
                            layouts={this.state.layouts}
                            onBreakpointChange={this.onBreakpointChange}
                            onLayoutChange={this.onLayoutChange}
                            >
                            {
                              content
                            }
                            </ResponsiveGridLayout>
                        )
                      }
                    })()
                  }

                  {
                    this.state.displayOption == "showReportGrid" &&
                    <div >
                      {
                        (()=>{
                          let content =[];
                          Object.keys(this.state.boxes).map(key=>{
                            // Add this way to avoid unmounting the entire component
                            if(!this.state.boxes[key].isMoveBoxExternal){
                              let id= key + "DnD";
                              content.push(
                                <div id={id}>
                                  {
                                    this.state.boxes[key].isOpen &&
                                    this.state.boxes[key].position == "DnD" &&
                                    this.renderBoxes(key)
                                  }
                                </div>
                              )
                            }
                          })
                          return content;
                        })()
                      }
                    </div>
                  }
                  {this.renderDynamic(this.state.displayOption)}
                </div>
            </div>
          </div>
          <ModalAlert
            ref={(modalAlert) => {this.modalAlert = modalAlert}}
            onClickOkay={this.handleModalOkayClick}
            onClickDiscard={this.handleModalDiscardClick}
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
  console.log("On mapState ViewReport ", state);
  return {
    dataCatalog: state.report_store.reports,
    gridDataViewReport: state.captured_report,
    login_details: state.login_store,
    leftmenu: state.leftmenu_store.leftmenuclick,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReportCatalog:(startDate,endDate)=>{
      dispatch(actionFetchReportCatalog(startDate,endDate))
    },
    generateReport: (report_info) => {
      dispatch(actionGenerateReport(report_info));
    },
    fetchReportData:(report_id, reporting_date, version, report_snapshot,report_parameters)=>{
      dispatch(actionFetchReportData(report_id, reporting_date, version, report_snapshot,report_parameters))
    },
    leftMenuClick:(isLeftMenu) => {
      dispatch(actionLeftMenuClick(isLeftMenu));
    },
    updateReportData:(report_id, report_data)=>{
      dispatch(actionUpdateFreeFormatReportData(report_id, report_data))
    },
  }
}

const VisibleViewReport = connect(
  mapStateToProps,
  mapDispatchToProps
)(DropTarget(ItemTypes.BOX, boxTarget, collect)(ViewReport));

export default VisibleViewReport;
