import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import { Tab, Tabs } from 'react-bootstrap';
import DefAuditHistory from '../AuditModal/DefAuditHistory';
import LoadingForm from '../Authentication/LoadingForm';
import {
  actionFetchReportChangeHistory,
} from '../../actions/MaintainReportRuleAction';

class ReportChangeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
        // TODO
        selectedAuditSheet: 0,
    };

    // Local data
    this.changeHistory = undefined;

    // Methods
    this.loadingPage = this.loadingPage.bind(this);
    this.handleClose = this.props.handleClose;
    this.handleBoxSize = this.props.handleBoxSize;
    this.handleBringToFront = this.props.handleBringToFront;
  }

  componentWillMount() {
    // Get the audit history linked to the selected sheet
    const { selectedReport, gridDataViewReport } = this.props;
    if(gridDataViewReport.length > 0){
      let sheetName = gridDataViewReport[0].sheet;
      this.setState({selectedAuditSheet:0},
        ()=>{
          this.props.fetchReportChangeHistory(selectedReport.report_id,sheetName)
        })
    }

  }

  componentWillReceiveProps(nextProps) {
      // Collect nextPros of change history
      if(!this.changeHistory && this.props.change_history !== nextProps.change_history){
        this.changeHistory = nextProps.change_history;
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
    const { selectedReport, history, gridDataViewReport } = this.props;
    const { handleClose, handleBoxSize, handleBringToFront, handlePinDndBox } = this.props;
    return(
      <div className="box-content-wrapper">
          <div className="box-tools">
            <ul className="nav navbar-right panel_toolbox">
              <li>
                <a className="close-link"
                  title="Close"
                  onClick={()=>{this.handleClose()}}>
                  <i className="fa fa-close"></i>
                </a>
              </li>
              {
                history.position == "DnD" &&
                <li>
                  <a onClick={()=>{
                      let boxSize = {
                        isMaximized: !history.isMaximized
                      }
                      this.handleBoxSize('history',boxSize)
                    }} title={ history.isMaximized ? "Restore" : "Maximize"}>
                    <small><i className="fa fa-square-o"></i></small>
                  </a>
                </li>
              }
              <li>
                <a onClick={()=>{
                    let id = history.id;
                    let position = history.position == "DnD" ? "pinnedTop": "DnD";
                    handlePinDndBox(id,position);
                  }} title={ history.position == "DnD" ? "Pin Window" : "Float Window"}>
                  <small>
                    <i className={"fa " + (history.position == "DnD" ? "fa-thumb-tack" : "fa-external-link" )}></i>
                  </small>
                </a>
              </li>
              <li>
                <a title="Move Box" style={{'cursor':'grabbing'}}>
                  <small>
                    <i className="fa fa-arrows"></i>&nbsp;Change History
                  </small>
                </a>
              </li>
            </ul>
        </div>
        <div className="x_panel">
          <div className="x_title">
            <h2>Change History<small> Time Line </small></h2>

            <div className="clearfix"></div>
          </div>
          <div className="x_content dontDragMe">
          <Tabs
            defaultActiveKey={0}
            activeKey={this.state.selectedAuditSheet}
            onSelect={(key) => {
                let sheetName = gridDataViewReport[key].sheet;
                this.changeHistory = undefined;
                this.setState({selectedAuditSheet:key},
                ()=>{this.props.fetchReportChangeHistory(selectedReport.report_id,sheetName)}
              );
            }}
            >
            {
              gridDataViewReport.map((item,index) => {
                return(
                    <Tab
                      key={index}
                      eventKey={index}
                      title={item['sheet']}

                    >
                      {
                        (()=>{
                          if(this.state.selectedAuditSheet == index){
                            if(!this.changeHistory){
                              return(
                                  <div>
                                    {
                                      this.loadingPage("fa-history", "purple","Fetching Change History for " + item['sheet'])
                                    }
                                  </div>
                              );
                            }
                            return (
                                <DefAuditHistory
                                  data={ this.changeHistory }
                                  historyReference={ "" }
                                 />
                              );
                          }
                        })()
                      }
                    </Tab>
                )
              })
            }
          </Tabs>
        </div>
      </div>
    </div>
    );
  }
}


function mapStateToProps(state){
  console.log("On map state of Maintain Report Rule ReportChangeHistory",state);
  return{
    change_history:state.maintain_report_rules_store.change_history,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    fetchReportChangeHistory:(report_id,sheet_id,cell_id) => {
      dispatch(actionFetchReportChangeHistory(report_id,sheet_id,cell_id));
    },
  }
}

const VisibleReportChangeHistory = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportChangeHistory);

export default VisibleReportChangeHistory;
