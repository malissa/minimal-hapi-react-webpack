import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

class Index extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <IntlProvider locale="en">
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <div>
            <h1>
                Home Page
              </h1>
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}

Index.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string
  })
};

Index.defaultProps = {
  user: null
};

module.exports = Index;
