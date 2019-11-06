import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { WithOutContext as ReactTags } from 'react-tag-input';

class AddReportRulesStep3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // TODO
    };

  }

  componentWillMount() {
    // TODO
  }

  componentWillReceiveProps(nextProps) {
      // TODO
  }

  render(){
      const { handleSubmit, handlePrevStep, viewOnly } = this.props;
      return(
        <form onSubmit={handleSubmit}>
        <div className="form-label-left" >
          <div className="form-group">
            <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="Comment">Comment <span className="required">*</span></label>
            <div className="col-md-9 col-sm-9 col-xs-12">
              <textarea
                type="text"
                placeholder="Enter a Comment"
                required="required"
                className="form-control col-md-9 col-xs-12"
                value={this.props.audit_form.comment}
                readOnly={viewOnly}
                maxLength="1000"
                minLength="20"
                onChange={
                  (event) => {
                    let newaudit_form=this.props.audit_form;
                    newaudit_form.comment = event.target.value;
                    // this.setState({audit_form});
                    this.props.handleSetAuditFormValues(newaudit_form);
                  }
                }
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="actionBar">
            <button type="button" className="btn btn-default btn-sm"
              onClick={handlePrevStep}>
              Back
            </button>
            {
              !viewOnly &&
              <button type="submit" className="btn btn-success btn-sm">
                Submit
              </button>
            }
          </div>
        </div>
      </form>
      )
    }
  }


export default AddReportRulesStep3;
