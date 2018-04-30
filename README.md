# Minimal Hapi React Webpack Boilerplate

### Overview

* React (client) hot module reloading is configured with react-transform-hmr
* ESLint error & warnings are logged to browser console
* Application server (Hapi.js) is separate from webpack dev server (Express.js)
* Hapi.js proxies requests for webpack assets to webpack dev server
* Hapi.js is configured to serve static files and routes
* Server-side React views instead of index.html (see /server-views)
* Automatic application server reloading using nodemon
* Babel transpilation of ES6 and JSX into browser-compatible ES5, both for server and client code. Use all the fancy stuff today!
* Webpack assets are generated with content hashes in filenames for easy cache busting
* Webpack assets are optimized with Uglify.js on production, removing dead code (TODO: add server-only code)
* Webpack asset URLs are recorded in a file, and a helper method is provided to extract them for usage in HTML / JSX.
* Basic testing setup with JEST

## Configuration

`cp .env.example .env`

## Usage

### Dependencies

* Run `npm i` at the root level of this repo.

### Development

* `npm run dev` to start Hapi application server
* `npm run webpack` in another terminal session to start webpack dev server with hot module reloading
* Visit [http://localhost:4000](http://localhost:4000) and open your browser's web development console
* ESLint errors are printed into webpack dev server output and also into the browser's console. To run ESLint separately from that, do `npm run lint`.

## License

No usage allowed without written consent until public release.

## Acknowledgements

Kickstarted from [minimal-hapi-react-webpack](https://github.com/raquo/minimal-hapi-react-webpack/graphs/contributors)
