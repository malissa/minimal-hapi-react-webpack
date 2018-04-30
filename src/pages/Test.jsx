import React from 'react';
import PropTypes from 'prop-types';

const Test = props =>
(
  <div>
    <section className="top-header">
      <h1>
        {props.title}
      </h1>
    </section>
  </div>
);

Test.propTypes = {
  title: PropTypes.string.isRequired
};

export default Test;
