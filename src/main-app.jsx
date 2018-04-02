import Nav from './components/nav';

// React must be in scope when using JSX because JSX is translated into React.createElement(...)
const React = require('react');
const ReactDOM = require('react-dom');
const Index = require('./pages/Index');
const Profile = require('./pages/Profile');

const components = {
  index: Index,
  profile: Profile
};

require('./main-app.css');

function mainApp() {
  const el = document.getElementById('app');
  const view = el.dataset.view;
  const data = JSON.parse(el.dataset.props);
  data.selected = view;

  ReactDOM.render(
    React.createElement(Nav, data),
    document.getElementById('nav'),
   );

  ReactDOM.render(
    React.createElement(components[view], data),
    el,
  );
}


document.addEventListener('DOMContentLoaded', mainApp);
