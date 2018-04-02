// import $ from 'jquery';
// global.$ = global.jQuery = $;
import * as d3 from 'd3';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global.d3 = d3;

configure({ adapter: new Adapter() });
