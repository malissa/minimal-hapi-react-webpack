import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ''
    };
  }

  render() {
    const { email } = this.state;

    return (
      <IntlProvider locale="en">
        <MuiThemeProvider>
          <div>

            <h1>
                  My Profile
                </h1>

            <h3>Name: {this.props.user.name}</h3>
            <h4>Email: {email}</h4>
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string
  }).isRequired
};

module.exports = Profile;
