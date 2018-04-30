import Test from '../src/pages/Test';
import React from 'react';
import { mount } from 'enzyme';

describe('Test page', () => {

  test('Title', () => {
    const wrapper = mount(
      <Test title={"My Title"}/>
    );

    const h1 = wrapper.find('h1')
    expect(h1.text()).toBe('My Title')
  });

})
