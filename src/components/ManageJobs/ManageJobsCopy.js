import React,{Component} from 'react';
import {dispatch} from 'redux';
import {connect} from 'react-redux';
import {hashHistory} from 'react-router';
import _ from 'lodash';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink, ForceGraphArrowLink } from 'react-vis-force';

import ModalAlert from '../ModalAlert/ModalAlert';
require('./ManageJobs.css');

class ManageJobs extends Component{
  constructor(props){
    super(props);
    this.state={
                };
    this.modalOkay = false;
    this.user=this.props.user;
    this.tenant_id=this.props.tenant_id;
    this.handleModalOkayClick = this.handleModalOkayClick.bind(this);

    this.buildGraph = this.buildGraph.bind(this);

    this.viewJobs=_.find(this.props.privileges,{permission:"View Jobs"})?true:false;
    this.RunJobs=_.find(this.props.privileges,{permission:"Run Jobs"})?true:false;
    this.EditJobs=_.find(this.props.privileges,{permission:"Edit Jobs"})?true:false;

  }

  componentWillMount(){
    // TODO
  }

  componentWillReceiveProps(nextProps){
    // TODO
  }

  componentWillUpdate(){
    // TODO
  }

  componentDidUpdate(){
    // TODO
  }

  componentWillUnmount(){
    // TODO
    this.routerWillLeave();
  }

  routerWillLeave(nextLocation) {
    // this.nextLocation = null;
    // const { approve, reject, regress } = this.dataChangePane.actionList;
    // if(approve.length||reject.length||regress.length){
    //   this.handleUnsavedItems(approve.length,reject.length,regress.length);
    //   this.nextLocation = nextLocation;
    //   return false;
    // }
    return true;
  }
  buildGraph(){
        let tasks = [
          {id: 1,job_id: 1,task_id:1,task_name: 'Load Data',task_type: '',task_description: 'This is a sample task one',
            task_dependency: '',task_input:{}},
          {id: 1,job_id: 1,task_id:2,task_name: 'Define Parameters',task_type: '',task_description: 'This is a sample task two',
            task_dependency: '',task_input:{}},
          {id: 1,job_id: 1,task_id:3,task_name: 'Apply Rules',task_type: '',task_description: 'This is a sample task three',
            task_dependency: '1,2',task_input:{}},
          {id: 1,job_id: 1,task_id:4,task_name: 'Validate',task_type: '',task_description: 'This is a sample task four',
            task_dependency: '',task_input:{}},
          {id: 1,job_id: 1,task_id:5,task_name: 'Run Report',task_type: '',task_description: 'This is a sample task five',
            task_dependency: '3,4',task_input:{}},
          {id: 1,job_id: 1,task_id:6,task_name: 'Export Report',task_type: '',task_description: 'This is a sample task six',
            task_dependency: '5',task_input:{}},
        ];
        let grph = [];
        tasks.map((task,index)=>{
          let deps = task.task_dependency && task.task_dependency!='' ? task.task_dependency.split(',') : [];
          let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
          grph.push(
            <ForceGraphNode key={"Task"+task.task_id.toString()}
              node={{ id: task.task_id.toString(), label: task.task_name,
                      }} fill={color} />
          );
          deps.map((dep,idx)=>{
            grph.push(
              <ForceGraphArrowLink key={"Link"+dep} link={{ source: dep.toString(), target: task.task_id.toString(), value: 1}} />
            );
          })
        })
        console.log("graph array", grph);
        return grph;
  }

  buildGraph_data(){
        let nodes = [...Array(20)];
        let grph = [];
        nodes.map((node,index)=>{
          let deps = [...Array(index+1)];
          let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
          grph.push(
            <ForceGraphNode node={{ id: (index+1), label: (index+1) }} fill={color} />
          );
          deps.map((dep,idx)=>{
            grph.push(
              <ForceGraphNode node={{ id: (index+1)+'.'+idx, label: (index+1)+'.'+idx }} fill={color} />
            );
            grph.push(
              <ForceGraphArrowLink link={{ source: (index+1)+'.'+idx, target: (index+1), value: 1}} />
            );
          })

          if(index>0){
            grph.push(
              <ForceGraphArrowLink link={{ source: (index), target: index+1 , value: 1 }} />
            );
          }
        })
        console.log("graph array", grph);
        return grph;
  }

  render(){
    return(
     <div className="row form-container">
        <div className="col-md-12">
          <div className="x_panel">
            <div className="x_title">
              <h2>Manage Jobs <small> Monitor and Manage Jobs for predefined set-up</small></h2>
              <div className="clearfix"></div>
            </div>
            <div className="x_content">
              <div className="row">
                <InteractiveForceGraph
                  draggable={true}
                  simulationOptions={{
                    animate: true,
                    // strength: {
                    //   collide: 8,
                    //   // x: ({ radius }) => 15 / radius,
                    //   // y: ({ radius }) => 50 / radius,
                    // }
                  }}
                  zoom={true}
                  zoomOptions={{maxScale: 5}}
                  labelAttr="label"
                  onSelectNode={(node) => console.log(node)}
                  highlightDependencies={true}
                >
                {
                  this.buildGraph()
                }

                </InteractiveForceGraph>
              </div>
            </div>
          </div>
        </div>
        <ModalAlert
          ref={(modalAlert) => {this.modalAlert = modalAlert}}
          onClickOkay={this.handleModalOkayClick}
        />
      </div>
    );
  }

  handleModalOkayClick(){
    //TODO
    this.modalAlert.isDiscardToBeShown = false;
    if(this.nextLocation){
      this.dataChangePane.actionList = {approve:[],reject:[],regress:[]};
      hashHistory.push(this.nextLocation);
    }
    if (this.selectedListItemitem){
      this.setState(this.selectedListItemitem);
    }

  }

}

function mapStateToProps(state){
  return{
    login_details: state.login_store,
  };
}

const mapDispatchToProps=(dispatch)=>{
  return{
    // TODO
  };
}

const VisibleManageJobs=connect(mapStateToProps,mapDispatchToProps)(ManageJobs);
export default VisibleManageJobs;
