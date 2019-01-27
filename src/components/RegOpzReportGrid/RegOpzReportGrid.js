import React, { Component, } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Tab, Tabs } from 'react-bootstrap';
import { bindActionCreators, dispatch } from 'redux';
import _ from 'lodash';
import moment from 'moment';
import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';
import HotTableTab from './HotTableTab';
import HotTableSection from './HotTableSection';
import HotTableTabToolsMenu from './HotTableTabToolsMenu';
import ModalAlert from '../ModalAlert/ModalAlert';
import {
  actionInsertBusinessRule,
  actionUpdateBusinessRule
} from '../../actions/BusinessRulesAction';
require('handsontable/dist/handsontable.full.css');
require('./RegOpzDataGrid.css');

class RegOpzReportGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSheet: 0,
      editSheetName: null,
      selectedCellRange: []
    };

    this.selectedTab=0;

    this.newTab =[];
    this.key = 0;
    this.fixedColumnsLeft = 2;
    this.report_id = null; //this.props.report_id;
    this.showToolsMenu = this.props.showToolsMenu != undefined ? this.props.showToolsMenu : true;
    this.reporting_date = this.props.reporting_date;
    this.gridData = this.props.gridData;
    this.cell_format_yn = 'Y';
    this.selectedCell = {};
    this.selectedSheetName = null;
    this.gridHight = 0;
    this.gridWidth = 0;
    this.rulesIdAsSubQuery = "";
    this.linkageData = null;
    this.tabBody = null;
    this.alphaSequence = this.alphaSequence.bind(this);
    this.setTdStyle = this.setTdStyle.bind(this);
    this.createClass = this.createClass.bind(this);
    this.rgb2hex = this.rgb2hex.bind(this);
    this.applyTdStyleAtLoading = this.applyTdStyleAtLoading.bind(this);
    this.saveTdStyle = this.saveTdStyle.bind(this);
    this.getSheetTdStyles = this.getSheetTdStyles.bind(this);
    this.handleSheet = this.handleSheet.bind(this);
    this.handleClickTab = this.handleClickTab.bind(this);
    this.checkSheetName = this.checkSheetName.bind(this);
    this.handleSelectCell = this.handleSelectCell.bind(this);
    this.handleShowEditSection = this.handleShowEditSection.bind(this);

    console.log('Inside Constructor');
    console.log(this.props.gridData);
    console.log(this.props.report_id);
  }

  componentDidMount(){
    console.log("componentDidMount.....");
    if(this.refs.ht0){
      let ref = this.refs.ht0;
      this.ht = ref.ht;
      console.log("componentDidMount This hot table instance",this.ht);
    }
    console.log("Before applyTdStyleAtLoading...",moment().format('h:mm:ss'));
    this.applyTdStyleAtLoading();
    console.log("After applyTdStyleAtLoading...",moment().format('h:mm:ss'));
    this.gridData.map((div,idx) => {
        // $('#'+idx+"-hot-table").hide();
        document.getElementById(idx+"-hot-table").style.visibility="hidden"
        document.getElementById(idx+"-hot-table").style.height="0"
        // $('#'+index+"-hot-table").show();
        // document.getElementById(index+"-hot-table").style.visibility="visible"
    })
    // $('#'+0+"-hot-table").show();
    document.getElementById(this.key + "-hot-table").style.visibility="visible"
    document.getElementById(this.key + "-hot-table").style.height="100%"
    // this.key=0;
    this.handleSelectCell(this.gridData[this.key].sheet,this.ht.hotInstance.getSelectedLast());
  }

  componentWillReceiveProps(nextProps){
      //TODO
      console.log('Inside Receive Props');
      console.log(nextProps.gridData);
      console.log(nextProps.report_id,this.report_id);

      if(this.report_id != nextProps.report_id){
        console.log("Inside componentWillReceiveProps change report id")
        this.setState({ selectedSheet: 0 },
                      ()=>{
                        if(this.refs.ht0){
                          let ref = this.refs.ht0;
                          this.ht = ref.ht;
                          console.log("componentWillReceiveProps This hot table instance",this.ht);
                        }
                        console.log("Before applyTdStyleAtLoading nextprops...",moment().format('h:mm:ss'));
                        this.applyTdStyleAtLoading();
                        console.log("After applyTdStyleAtLoading nextprops...",moment().format('h:mm:ss'));
                      }
                      );
      }
      this.gridData = nextProps.gridData;
      this.report_id = nextProps.report_id;
      this.reporting_date = nextProps.reporting_date;
      console.log("Inside componentWillReceiveProps reggrid",this.gridData)
      this.handleSelectCell(this.gridData[this.key].sheet,this.ht.hotInstance.getSelectedLast());
  }

  rgb2hex(rgb){
     if(!rgb) return rgb;
     rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
     return (rgb && rgb.length === 4) ? "#" +
      ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
      ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
  }



  createClass(name,rules){
    let doesExist = $(name)[0] ||
                    _.find(document.styleSheets,function(o) {
                                                  // console.log("Checking using lodash call....")
                                                  return o.cssRules[0] && o.cssRules[0].selectorText == name;
                                                }
                          );
    let cssStyle = name
                  .replace(".handsontable",'')
                  .replace(".ht",'')
                  .replace(/-[\w]*$/,'')
                  .replace(" ",'');
    // console.log("Checking name...",document.getElementsByClassName("abcdefdeb"),
    //               document.getElementsByClassName(name
    //               .replace(".handsontable",'')
    //               .replace(".",'')
    //               .replace(" ",'')))
    if(doesExist){
      // console.log("Class exists do not add again....",name, cssStyle)
      // let cssStyleValue= cssStyle.match(/(background|color)/) ? this.rgb2hex($(name).css(cssStyle)) : $(name).css(cssStyle);
      // console.log("get the class details....",name,cssStyleValue);
    } else{
      // console.log("Class does not exists create class ....",name)
      let style = document.createElement('style');
      style.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(style);
      if(!(style.sheet||{}).insertRule)
          (style.styleSheet || style.sheet).addRule(name, rules);
      else
          style.sheet.insertRule(name+"{"+rules+"}",0);
    }

  }

  alphaSequence(i) {
      return i < 0
          ? ""
          : this.alphaSequence((i / 26) - 1) + String.fromCharCode((65 + i % 26) + "");
  }

  setTdStyle(style,actionType,actionRule,runUndoHook,reRender){
    // style and actionType carries the follwoing values
    // actionType                 style
    // --------------------------------------------
    // Font related: e.g.         value of the css style
    // font-size                  10px
    // font-weight                bold, normal
    // font-style                 italic
    // color                      colorcode in hex
    // Cell background:
    // background                 colorcode in hex
    // Border Related:
    // border                     default, creates four borders {thin solid #000000}
    // border-top                 default {thin solid #000000}
    // border-bottom              default {thin solid #000000}
    // border-left                default {thin solid #000000}
    // border-right               default {thin solid #000000}
    // border-color               colorcode in hex
    //                            color will only replace the color of the applicable border e.g. top, bottom etc
    // border-style               dotted, dashed, solid
    //                            style will only replace the color of the applicable border e.g. top, bottom etc
    // border-width               thin, medium, thick
    //                            width will only replace the color of the applicable border e.g. top, bottom etc
    // -------------------------------------------
    // actionRule possible values :
    // toggle : If not added then add else remove the className, e.g. bold, italic
    // replace: replace only if the classname added for actiontype (may be with a different value e.g. color, width, size etc)
    // remove: remove className if already added for action type (e.g. border related css classes)
    // add : add the className anyway (if present replace or else addnew classname)
    let ht=this.ht.hotInstance;
    let selection = ht.getSelected()
    let selectedRange = ht.getSelectedRange();
    runUndoHook = runUndoHook ? runUndoHook : true;
    reRender = reRender ? reRender : true;
    // console.log("section in setTdStyle....",selection)
    if(selection){
      let stateBefore ={}
      selection.map((cell,index)=>{
        let [startrow,startcol,endrow,endcol]=cell;
        // console.log("cell meta for selected cell...",selection,startrow,startcol,endrow,endcol);
        for(let r=(startrow <= endrow? startrow:endrow);r<=(startrow <= endrow? endrow:startrow);r++){
          stateBefore[r] =[]
          for(let c=(startcol<=endcol?startcol:endcol);c<=(startcol<=endcol?endcol:startcol);c++){
            let cellMeta = ht.getCellMeta(r,c);
            stateBefore[r][c] = cellMeta.className;
          }
        }
      })

      let tdClassTypes = this.processActionTypeClasses(style,actionType);
      let newClassType = '';
      tdClassTypes.map((action,index)=>{
        newClassType += (index==0 ? 'ht' : ' ht') + action.newClassType + '-' + action.newStyle.replace('#','HEX').replace(/ /g,'_');
      })
      // console.log("tdClassTypes",stateBefore,tdClassTypes,newClassType);

      if(runUndoHook) ht.runHooks('beforeCellAlignment', stateBefore, selectedRange, 'horizontal', newClassType);


      selection.map((cell,index)=>{
        let [startrow,startcol,endrow,endcol]=cell;
        // console.log("cell meta for selected cell...",selection,startrow,startcol,endrow,endcol);
        for(let r=(startrow <= endrow? startrow:endrow);r<=(startrow <= endrow? endrow:startrow);r++){
          for(let c=(startcol<=endcol?startcol:endcol);c<=(startcol<=endcol?endcol:startcol);c++){
            let cellMeta = ht.getCellMeta(r,c);

            // console.log("cellMeta.className",cellMeta.className);
            let className = this.createNewClassName(style,tdClassTypes,actionRule,cellMeta.className);
            // console.log("className",className)


            // console.log("stateBefore ",row,col,stateBefore[row][col])
            ht.setCellMeta(r, c, 'className', className)
          }
        }
      })

      if(reRender) ht.render();
    }
  }

  createNewClassName(style,tdClassTypes,actionRule,className){
    let newCellClassName = className ? className : '';
    tdClassTypes.map((action,index)=>{
      let regex = RegExp(` ht${action.newClassType}-[\\w]*`,'');
      let newClassName = 'ht'+ action.newClassType + '-' + action.newStyle.replace('#','HEX').replace(/ /g,'_');

      // toggle : If not added then add else remove the className, e.g. bold, italic
      // replace: replace only if the classname added for actiontype (may be with a different value e.g. color, width, size etc)
      // nooverwrite: Do not overwrite if exists, add if it does not exist
      // remove: remove className if already added for action type (e.g. border related css classes)
      // add : add the className anyway (if present replace or else addnew classname)
      switch(actionRule){
        case "toggle":
            newCellClassName = newCellClassName.match(regex) ?
                               newCellClassName.replace(regex,'') :  newCellClassName + ' ' + newClassName;
            break;
        case "replace":
            newCellClassName = newCellClassName.match(regex) ?
                               newCellClassName.replace(regex,'')  + ' ' + newClassName :  newCellClassName;
            break;
        case "nooverwrite":
            newCellClassName = newCellClassName.match(regex) ?
                               newCellClassName : newCellClassName  + ' ' + newClassName;
            break;
        case "remove":
            newCellClassName = newCellClassName.replace(regex,'');
            break;
        case "add":
            newCellClassName = newCellClassName.replace(regex,'')  + ' ' + newClassName;
            break;
        default:
            break;
      }

    })

    return newCellClassName;
  }

  processActionTypeClasses(style,actionType){
    const defaultBorderCss = { width: 'thin', style: 'solid', color: '#000000'};
    const borderEdges = ['top','bottom','left','right'];
    let tdClassTypes =[];
    let newClassType = null;
    let newStyle = null;
    if(actionType.match(/border-[\w]*$/)){
      // Process border action classNames
      // Create the class only once for all the selected list of cells.
      let actionBorders =[];
      // If all borders to be set or any border attribute to be set that applies to all applicable edges
      if(actionType.match(/border-(all|color|style|width)/)){
        borderEdges.map((edge,index)=>{
          //replace border-all , all with null, so that it can be replace by edges
          actionBorders.push(
            actionType
            .replace('-','-' + edge+'-')
            .replace('-all','')
          )
        });
      } else {
        actionBorders.push(actionType);
      }
      // Now check tdClassTypes, provided they already don't include the border css attributes
      actionBorders.map((borderAction,ib)=>{
        // Only applicable for the set border to set default values, else use the style supplied
        if(borderAction.match(/border-[\w]*$/)){
          Object.keys(defaultBorderCss).map((key,idx)=>{
            newClassType = borderAction + '-' + key
            newStyle = defaultBorderCss[key];
            tdClassTypes.push({newClassType: newClassType, newStyle: newStyle});
            this.createClass('.handsontable .ht' + newClassType + '-' + newStyle.replace('#','HEX'),
                            newClassType + ": " + newStyle +";"
                          );
          });
        } else {
          newClassType = borderAction
          newStyle = style;
          tdClassTypes.push({newClassType: newClassType, newStyle: newStyle});
          this.createClass('.handsontable .ht' + newClassType + '-' + newStyle.replace('#','HEX'),
                          newClassType + ": " + newStyle +";"
                        );
        }
      });

    } else {
      newClassType = actionType;
      newStyle = style;
      tdClassTypes.push({newClassType: newClassType, newStyle: newStyle});
      // Create the class only once for all the selected list of cells.
      this.createClass('.handsontable .ht' + newClassType + '-' + newStyle.replace('#','HEX').replace(/ /g,'_'),
                      newClassType + ": " + newStyle +";"
                    );
    }
    return tdClassTypes;
  }

  applyTdStyleAtLoading(){
    this.gridData.map((data,gridIdx)=>{
      let ht = this.refs['ht'+gridIdx].ht.hotInstance;
      Object.keys(data.sheet_styles.style_classes).map((classType,index)=>{
        let newClassType = data.sheet_styles.style_classes[classType].new_class_type
        let newStyle = data.sheet_styles.style_classes[classType].new_value
        this.createClass('.handsontable ' + classType.replace('ht','.ht'),
                        newClassType + ": " + newStyle +";"
                      );
        })

      data.sheet_styles.td_styles.map((cell,idx)=>{
        if(cell.class_name && cell.class_name!='') ht.setCellMeta(cell.row, cell.col, 'className', cell.class_name)
        })
      console.log("classname inside component did nount call ",gridIdx,moment().format('h:mm:ss'));
      ht.render();
    })

  }

  saveTdStyle(){

    if(!this.checkSheetName(this.key)){
      return false;
    }

    let reportWorkBook=[];

    this.gridData.map((data,gridIdx)=>{
      let ht = this.refs['ht'+gridIdx].ht.hotInstance;
      let rowCount = ht.countRows();
      let colCount = ht.countCols();
      let rowHeights={};
      let colWidths={};
      let sheetStyles={};
      let mergedCells = [];
      let sections = [];
      // Get the data
      let sheetData = ht.getData();
      // Get col width and row rowHeights
      for (let r=0; r< rowCount; r++){
        rowHeights[(r+1).toString()] = ht.getRowHeight(r) ? ht.getRowHeight(r) : 25;
      }
      for (let c=0; c< colCount; c++){
        colWidths[this.alphaSequence(c)] = ht.getColWidth(c) ? ht.getColWidth(c) : 90;
      }
      // Get cell styles
      sheetStyles = this.getSheetTdStyles(rowCount,colCount,ht);
      // get the merged cell info
      mergedCells = ht.getPlugin('mergeCells').mergedCellsCollection.mergedCells;
      // get sections for the sheet
      sections = data.sections;

      // add these elements to the workbook
      reportWorkBook.push({rowHeights, colWidths, sheetData, sheetStyles, mergedCells, sections, sheet: data.sheet})
    })

    console.log("tdStyleSave output...",reportWorkBook,(JSON.stringify(reportWorkBook)).length*2, (JSON.stringify(this.gridData)).length*2);
    this.props.handleUpdateReportData(reportWorkBook);

  }

  getSheetTdStyles(rowCount,colCount,ht){
    let cellStyles ={};
    for (let r=0; r< rowCount; r++){
      for (let c=0; c< colCount; c++){
        let cellMeta = ht.getCellMeta(r,c);
        let className = cellMeta.className;
        let cellId = this.alphaSequence(c)+(r+1);
        // Td Styles are based on classnames associated with the TD element as 'ht' + CSSstyletext +'-' + styleValue
        // Note that CSSstyletext will have '-'s e.g. border-top-color etc
        // styleValue will have '_' (Times_New_Roman) or 'HEX' inplace of '#' for color
        if(className){
          let classNameArray = className.split(' ');
          let styleObject ={font:{},border:{}}; //Initialise with blank object with font and border element only
          classNameArray.map((styleClass,index)=>{
            // console.log("Processing className style ",styleClass);
            // Hack ClassNames for alignment and fontcolor
            if(styleClass.match(/ht(left|right|center|justify)/i)){
              styleClass = styleClass.toLowerCase().replace('ht','htalignment-horizontal-');
            }
            if(styleClass.match(/ht(top|bottom|middle)/i)){
              styleClass = styleClass.toLowerCase()
                                      .replace('middle','center')
                                      .replace('ht','htalignment-vertical-');
            }
            // if(styleClass.match(/htcolor-[\w]*$/)){
            //   styleClass = styleClass.replace('ht','htfont-');
            // }
            if(styleClass && styleClass.replace(' ','') != '' ) {
              this.extractStyleObject(styleClass.replace(' ',''),styleObject);
            }
          })
          cellStyles[cellId]= styleObject;
        }

      }
    }

    return cellStyles;
  }

  extractStyleObject(classNameStr,styleObject){
    let classNameElements = classNameStr.replace('ht','').split('-');
    // console.log("styleObject...",classNameElements)
    // Walk the hierarchy, creating new objects where needed untill the last element
    // traverse till classNameElements.length-2 since,
    // classNameElements.length - 1 : holds the actual value of the css style
    // classNameElements.length - 2 : holds the css style element which needs to be captured, e.g. color, size, width etc
    for( let i = 0; i < classNameElements.length-2; i++ ) {
        styleObject = styleObject[ classNameElements[i] ] = styleObject[ classNameElements[i] ] || {};
        // console.log("styleObject...",styleObject)
    }

    // Assign the value for the last style element
    let lastElement = classNameElements[classNameElements.length-2];
    let value = classNameElements[classNameElements.length-1].replace("HEX","")
                                                              .replace("#","")
                                                              .replace("_"," ");
    styleObject = styleObject[ lastElement ] = value;

  }

  checkSheetName(index){
    console.log("grid lebgth..",this.gridData[index],this.gridData.length)
    if(this.gridData[index]){

      if(!this.gridData[index].sheet){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open(<div><i className="fa fa-warning amber"></i>
                              &nbsp;Sheet Name can not be blank!! Please enter a valid sheet name.</div>);
        document.getElementById(index+"-input-tab").focus();
        return false;
      }

      let isDuplicateSheetName = false;
      let sheetName = this.gridData[index].sheet;
      this.gridData.map((sheet,sIdx)=>{
        if(sIdx!=index && sheet.sheet == sheetName){
          isDuplicateSheetName = true;
        }
      })

      if(isDuplicateSheetName){
        this.modalAlert.isDiscardToBeShown = false;
        this.modalAlert.open(<div><i className="fa fa-warning amber"></i>
      &nbsp;Duplicate sheet Name!! Please try a different sheet name.</div>);
        document.getElementById(index+"-input-tab").focus();
        return false;
      }
    }

    return true;
  }

  handleClickTab(index,forced){
    if((index != this.key && this.checkSheetName(this.key)) || forced){
        let ref = this.refs["ht"+index];
        this.ht = ref.ht;
        // this.ht.hotInstance.selectCell(0,0,0,0)
        // $('#'+this.key+"-hot-table").hide();
        if(this.gridData[this.key]){
          document.getElementById(this.key+"-hot-table").style.visibility="hidden"
          document.getElementById(this.key+"-hot-table").style.height="0"
        }
        // $('#'+index+"-hot-table").show();
        document.getElementById(index+"-hot-table").style.visibility="visible"
        document.getElementById(index+"-hot-table").style.height="100%"
        this.ht.hotInstance.render();
        this.key=index;
        this.handleSelectCell(this.gridData[index].sheet,this.ht.hotInstance.getSelectedLast());

    } else {
      $("#"+index+"-li-tab").removeClass("active")
      $("#"+index+"-hot-table").removeClass("in")
      $("#"+this.key+"-li-tab").addClass("active")
      $("#"+this.key+"-hot-table").addClass("in")
    }
    console.log("Selected tab is ",'#'+index+'-tab',this.ht)

  }

  handleSheet(action,old_sheet_id,new_sheet_id){
    let index = null;
    let forced = false;
    switch (action){
      case "Add":
        if(this.checkSheetName(this.key)){
          index = this.gridData.length;
          this.gridData.push(
            {
              data: Array(10).fill(null).map(()=>Array(10).fill(null)),
              colWidths: Array(10).fill(90),
              rowHeights: Array(10).fill(25),
              merged_cells: [],
              sections: [],
              sheet_styles:{ style_classes: {}, td_styles: []},
              sheet: null
            }
          );
        } else {
          index = this.key;
          document.getElementById(index+"-input-tab").focus();
        }
        break;
      case "Remove":
        index = this.key;
        delete this.gridData[index];
        this.key = null;
        index = null;
        forced = null;
        this.gridData.map((data,idx)=>{
          console.log("Inside remove....",idx);
          this.key=idx;
          index=idx;
          forced = true;
        })
        break;
      case "Rename":
        index = this.key;
        // this.setState({editSheetName: this.key})
        break;
    }

    // Forec re-render, however if nothing is changed for the child HotTableTab components will not be rerendered
    // as we used PureComponent for the child hot table tabs
    this.setState({selectedSheet:0, editSheetName: index },
                  ()=>{
                    //this.applyTdStyleAtLoading()
                    if(this.key){
                      $("#"+this.key+"-li-tab").removeClass("active")
                      $("#"+this.key+"-hot-table").removeClass("in")
                    }
                    if(index){
                      $("#"+index+"-li-tab").addClass("active")
                      $("#"+index+"-hot-table").addClass("in")
                      this.handleClickTab(index,forced);
                      if(['Add','Rename'].includes(action)){
                        document.getElementById(index+"-input-tab").focus();
                      }
                    }
                  }
                )
    console.log("handleSheet...", this.gridData)
  }

  handleShowEditSection(){
    let isOpen = this.state.display == "editSection";
    if(isOpen){
      this.setState({display: null})
    } else {
      this.setState({display: "editSection"})
    }
  }

  handleSelectCell(sheetName, cell_selected){
    if(this.state.display == "editSection"){
      this.setState({selectedCellRange: cell_selected ? cell_selected : [undefined,undefined,undefined,undefined] });
    }
    this.props.handleSelectCell(sheetName, cell_selected);
  }

  render(){
    console.log("render main call.....")
    if (this.gridData.length > 0) {
      return(
        <div className="row">
          <HotTableTabToolsMenu
            setTdStyle={this.setTdStyle}
            saveTdStyle={this.saveTdStyle}
            showToolsMenu={ this.showToolsMenu }
            handleSheet = { this.handleSheet }
            handleShowEditSection = { this.handleShowEditSection }
            />
          <div className="">
          {
            this.state.display == "editSection" &&
            <HotTableSection
              ht={this.ht}
              selectedCellRange={this.state.selectedCellRange}
              data = {this.gridData[this.key]}
              handleClose = { this.handleShowEditSection }
              />
          }
          <div className="" role="tabpanel" data-example-id="togglable-tabs">
            <ul id="myTab" className="nav nav-tabs" role="tablist">
              {
                this.gridData.map((item,index) => {
                  console.log("Inside dridData map");
                  return(
                    <li key= {index.toString()} id={index+"-li-tab"} role="presentation" className={ index==0 ? "active" : ""}>
                      <a href={'#'+index+"-hot-table"} id={index+"-tab"} role="tab" data-toggle="tab" aria-expanded="true"
                        onDoubleClick={
                          (e)=>{
                            this.handleClickTab(index);
                            this.handleSheet("Rename");
                          }
                        }
                        onClick={
                          (e)=>{
                            this.handleClickTab(index);
                          }
                        }
                        >
                        {
                          this.state.editSheetName == index &&
                          <input type="text"
                            id={index+"-input-tab"}
                            className="htSheetName"
                            required={true}
                            title={"Editting Sheet Name"}
                            defaultValue={this.gridData[index].sheet}
                            onKeyPress={(e)=>{
                                // e.stopPropagation();
                                if(e.key == 'Enter'){
                                  if(this.checkSheetName(this.key)){
                                    this.setState({editSheetName: null})
                                  }
                                }
                              }
                            }
                            onChange={
                              (e)=>{
                                this.gridData[index].sheet = e.target.value;
                              }
                            }
                            />
                        }
                        {
                          this.state.editSheetName != index &&
                          <span>{item.sheet}</span>
                        }

                      </a>
                    </li>
                  )
                })
              }
            </ul>
            <div id="tabContent" style={{"overflow":"hidden"}}>
            {
              this.gridData.map((item,index) => {
                console.log("Inside dridData map",index,this.showToolsMenu);
                return(
                  <div role="tabpanel" className={index==0 ? "fade active in" : "fade"} id={index+"-hot-table"} aria-labelledby="home-tab"
                    >

                    <HotTableTab
                      data={this.gridData[index]}
                      showToolsMenu={this.showToolsMenu}
                      handleSelectCell={this.handleSelectCell}
                      ref={"ht" + index}
                      />

                  </div>
                )
              })
            }
            </div>
          </div>
        </div>
        <ModalAlert
          ref={(modalAlert) => {this.modalAlert = modalAlert}}
          onClickOkay={this.handleModalOkayClick}
        />

      </div>
      )
    } else {
      return(
        <h4>Loading...</h4>
      )
    }
  }

}

export default RegOpzReportGrid;
