import Ticket from '../src/pages/Ticket';
import React from 'react';
import { mount } from 'enzyme';
import { client } from '../src/utils/client';

beforeAll(() => {
  Object.defineProperty(window.location, 'host', {
    writable: false,
    value: 'localhost'
  })
  Ticket.prototype.websocketConnect = jest.fn();
});

describe('Ticket page', () => {

  test('Ticket not found', () => {
    client.fetchTicketTransactions = jest.fn();

    const wrapper = mount(
      <Ticket id={""}/>
    );
    const h3 = wrapper.find('#ticket-info h3')
    expect(h3.text()).toBe('Ticket not found.')
  });


  test('Ticket not found', () => {
    const ticket = {
      id: 1,
      event: 'Hash Bash',
      price: 0,
      currency: 'USD',
      details: 'Ann Arbor, MI',
      url: 'http://google.com',
      puid: '422',
      platform: {
        name: 'Passage'
      }
    }
    const transactions = [{
      "id":1,
      "hash":"UPDATE",
      "createdAt":"2017-11-01T13:04:57.711Z",
      "updatedAt":"2017-11-01T13:08:04.114Z",
      "ticketId":2,
      "blockchainId":5,
      "actionId":1,
      "blockchain":{"name":"steem"},
      "action":{"name":"record"}
    },{
      "id":2,
      "hash":null,
      "createdAt":"2017-11-01T13:04:57.711Z",
      "updatedAt":"2017-11-01T13:08:04.114Z",
      "ticketId":2,
      "blockchainId":8,
      "actionId":1,
      "blockchain":{"name":"ptl"},
      "action":{"name":"record"}
    }]

    const mounted = jest.spyOn(Ticket.prototype, 'componentDidMount');
    const fetched = jest.spyOn(Ticket.prototype, 'fetchData');
    client.fetchTicketTransactions = jest.fn();

    const wrapper = mount(
      <Ticket id={"1"}/>
    );

    wrapper.setState({
      ticket,
      transactions
    });

    expect(mounted).toHaveBeenCalledTimes(1);
    expect(fetched).toHaveBeenCalledTimes(1);
    expect(client.fetchTicketTransactions).toHaveBeenCalledTimes(1);

    const h3 = wrapper.find('#ticket-info h3')
    expect(h3.text()).toBe('Ticket Information')

    const tables = wrapper.find('.table-cont')
    expect(tables.length).toBe(2)

    const links = wrapper.find('.table-cont a')
    expect(links.length).toBe(1)
    // expect(links.props().href).toBe("")
  });

})
