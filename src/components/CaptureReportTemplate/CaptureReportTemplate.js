import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, dispatch } from 'redux';
import SubscriberReportTemplate from './SubscriberReportTemplate';
import RepositoryReportTemplate from './RepositoryReportTemplate';


class CaptureTemplate extends Component {
    constructor(props) {
        super(props);
        this.domainInfo = this.props.login_details.domainInfo;
    }

    componentWillMount() {
        // TODO
    }

    componentWillReceiveProps(nextProps){

      // TODO
    }

    componentDidMount() {
        // document.body.classList.add('subscribe');
        document.title = "RegOpz Dashbord | Capture Report Template";
    }

    render() {
        const { tenant_id, country } = this.domainInfo;

        return(
          <div>
          {
            tenant_id=='regopz' &&
            <RepositoryReportTemplate/>
          }
          {
            tenant_id!='regopz' &&
            <SubscriberReportTemplate/>
          }
          </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        login_details: state.login_store,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        // TODO
    };
}

const VisibleCaptureTemplate = connect(
    mapStateToProps,
    mapDispatchToProps
)(CaptureTemplate);

export default VisibleCaptureTemplate;
