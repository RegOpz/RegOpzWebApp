import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';

class ProfileLeftPane extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editUser: false,
            userData: this.props.userData
        };

        this.enableEditing = this.enableEditing.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.saveEditedData = this.saveEditedData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            editUser: false,
            userData: nextProps.userData
        });
    }

    enableEditing() {
        this.setState({
            editUser: true
        });
    }

    saveEditedData() {
        this.setState({ editUser: false });
        this.props.saveEditedData(this.state.userData);
    }

    handleChange(event, index) {
        let value = event.target.value;
        let userData = [...this.state.userData];
        userData[index].value = value;
        this.setState({ userData: userData });
    }

    convertToTitleCase(nameString) {
        nameString = nameString.trim();
        return nameString.toLowerCase().split(' ').map(function (word) {
            return word.replace(word[0], word[0].toUpperCase());
        }).join(' ');
    }

    render() {
        return (
            <div className="col-md-3 col-sm-3 col-xs-12 profile_left">
                <div className="profile_img">
                    <img className="img-responsive" src={this.props.image} alt="Avatar Image" />
                </div>
                <h2>{this.convertToTitleCase(this.props.username)}</h2>
                {
                    !this.state.editUser &&
                    <div>
                        <ul className="list-unstyled user_data">
                            {
                                this.state.userData.map(element => {
                                    return (
                                        <li key={element.title}>
                                            <label className="control-label">
                                              <span className="required">
                                                {element.title + ' '}:
                                              </span>
                                            </label>
                                            {' ' + element.value}
                                        </li>
                                    );
                                })
                            }
                        </ul>
                        <button className="btn btn-success" onClick={this.enableEditing}>
                            <i className="fa fa-edit"></i>
                            {' '} Edit Profile
                        </button>
                    </div>
                }
                {
                    this.state.editUser &&
                    <div>
                        <ul className="list-unstyled user_data">
                            {
                                this.state.userData.map((element, index) => {
                                    return (
                                        <li key={element.title}>
                                            <form>
                                                <label className="control-label">
                                                  <span className="required">
                                                    {element.title + ' '}:
                                                  </span>
                                                </label>
                                                <FormControl
                                                    type="text"
                                                    placeholder="Enter text"
                                                    value={element.value}
                                                    onChange={(event) => {
                                                        this.handleChange(event, index);
                                                    }}
                                                    disabled={element.title === 'User Name'}
                                                />
                                            </form>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                        <button className="btn btn-success" onClick={this.saveEditedData}>
                            <i className="fa fa-save"></i>
                            {' '} Save Profile
                        </button>
                    </div>
                }
            </div>
        );
    }
}

export default ProfileLeftPane;
