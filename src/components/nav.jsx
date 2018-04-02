import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.getMenuClass = this.getMenuClass.bind(this);
    this.getAuthContent = this.getAuthContent.bind(this);
  }

  getMenuClass(name) {
    let cls = '';
    if (this.props.selected === name) {
      cls = 'selected';
    }
    return cls;
  }

  getAuthContent() {
    if (!this.props.user) {
      return (
        <a href="/account/signin">Sign In</a>
      );
    }
    return (
      <a href="/account/signout">Sign Out</a>
    );
  }

  render() {
    const authContent = this.getAuthContent();
    return (
      <div>
        <div className="menu">
          <a href="/" className={this.getMenuClass('index')}>Home</a>
          {authContent}
        </div>
      </div>
    );
  }
}

Nav.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string
  }),
  selected: PropTypes.string.isRequired
};

Nav.defaultProps = {
  user: null
};

export default Nav;
