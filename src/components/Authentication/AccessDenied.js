import React,{ Component } from 'react';
import { connect } from 'react-redux';

class AccessDenied extends Component{
   constructor(props){
     super(props);
   }

    render(){
      return (
        <div className="col-md-12 form-container">
          <div className="col-middle">
            <div className="text-center text-center">
              <h1 className="error-number">403</h1>
              <h2>Access denied</h2>
              <p>Permission is required to access this resource <u><strong>{this.props.component}</strong></u>. Please Contact your system administrator.
              </p>
              <div className="mid_center">
                <h5>Back to RegOpz Dash!</h5>
                <h1><a href="#/dashboard"><i className="fa fa-home"></i></a></h1>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

const VisibleAccessDenied = AccessDenied;
export default VisibleAccessDenied;
