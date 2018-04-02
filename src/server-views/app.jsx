const getWebpackAssets = require('../tools/get-webpack-assets');
const React = require('react');

const gaAsync = () => {
  if (process.env.NODE_ENV === 'production') {
    return (
      <script async src="https://www.googletagmanager.com/gtag/js?id=" />
    );
  }
  return null;
};

const gaScript = () => null;

const App = data => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Minimal Hapi React Webpack Project</title>
      <script src={getWebpackAssets().app.js} />
      <script src="https://use.fontawesome.com/c9842f35f0.js" />
      {gaAsync()}
      {gaScript()}
    </head>
    <body>
      <div id="backLoading" />
      <div id="nav" />
      <div id="app" data-view={data.view} data-props={JSON.stringify(data.props)} />
      <div id="mobile-nav" />
    </body>
  </html>
);

module.exports = App;
