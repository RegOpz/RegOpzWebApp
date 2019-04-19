import React,{ Component } from 'react';
import { connect } from 'react-redux';

class LoadingForm extends Component{
   constructor(props){
     super(props);
   }

    render(){
      return (
        <div className="col-md-12 form-container">
          <div className="col-middle">
            <div className="text-center text-center">
              <div className="mid_center">
                <div>
                  {this.props.loadingMsg}
                </div>
                <br/>
                <img type="image/gif" src="./images/regopz_30pcnt.gif"></img>
              </div>
            </div>
          </div>
        </div>
      );
    }
}


const VisibleLoadingForm = LoadingForm;
export default VisibleLoadingForm;
