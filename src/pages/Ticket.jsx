import React, { Component } from 'react';
import { IntlProvider, FormattedDate, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import { client } from '../utils/client';
import { blockchainLink, accountLink } from '../utils/links';
import blockchainName from '../utils/names';
import Purchase from '../components/purchase';

const d3 = require('d3');
const Nes = require('nes');

const options = {
  fixedHeader: false,
  fixedFooter: false,
  selectable: false,
  enableSelectAll: false,
  deselectOnClickaway: true,
  showCheckboxes: false
};

class Ticket extends Component {
  static createHashColumn(txn, blockchain) {
    if (txn.hash) {
      const link = blockchainLink(txn, blockchain);
      return (
        <a target="_blank" rel="noopener noreferrer" href={link}>{txn.hash}</a>
      );
    }
    return <i>Pending</i>;
  }

  static createTransactionRows(txns, blockchain) {
    return txns.map((txn) => {
      const hashCol = Ticket.createHashColumn(txn, blockchain);
      return (
        <TableRow
          key={txn.id}
        >
          <TableRowColumn style={{ border: '1px solid #ccc' }}>
            <FormattedDate
              value={txn.updatedAt}
              day="numeric"
              month="short"
              year="numeric"
            /> <FormattedTime value={txn.updatedAt} />
          </TableRowColumn>
          <TableRowColumn style={{ border: '1px solid #ccc' }}>{txn.action.name}</TableRowColumn>
          <TableRowColumn style={{ border: '1px solid #ccc' }}>
            {hashCol}
          </TableRowColumn>
        </TableRow>
      );
    });
  }

  constructor(props) {
    super(props);

    if (process.env.NODE_ENV === 'development') {
      this.client = new Nes.Client('ws://localhost:3000');
    } else if (process.env.NODE_ENV === 'staging') {
      this.client = new Nes.Client('wss://passagex-staging.herokuapp.com');
    } else {
      this.client = new Nes.Client('wss://passagex.network');
    }

    this.state = {
      showPopUp: false,
      ticket: {},
      parent: {},
      transactions: []
    };

    this.fetchData = this.fetchData.bind(this);
    this.createBlockchainTables = this.createBlockchainTables.bind(this);
    this.getTicketInfo = this.getTicketInfo.bind(this);
    this.getListingInfo = this.getListingInfo.bind(this);
    this.getParentLink = this.getParentLink.bind(this);
    this.websocketConnect = this.websocketConnect.bind(this);
    this.closePopUp = this.closePopUp.bind(this);
  }

  componentDidMount() {
    this.fetchData().then(this.websocketConnect());
  }

  getTicketInfo() {
    const ticket = this.state.ticket;
    if (!ticket.id) {
      return (<h3>Ticket not found.</h3>);
    }
    const listing = this.getListingInfo();
    const parentLink = this.getParentLink();
    const actlink = accountLink(ticket.bearerAddress);
    return (
      <div className="top-cont">
        <h3>Ticket Information</h3>
        {listing}
        <p>Valid: {ticket.valid ? 'true' : 'false'}</p>
        <p>Platform: {ticket.platform.name}</p>
        <p>Event: {ticket.event}</p>
        <p>Price: {ticket.price} ({ticket.currency})</p>
        <p>Details: {ticket.details}</p>
        <p>URL: {ticket.url}</p>
        <p>PUID: {ticket.puid}</p>
        <p>GUID: {ticket.guid}</p>
        <p>Bearer Address: <a target="_blank" rel="noopener noreferrer" href={actlink}>{ticket.bearerAddress}</a></p>
        <p>Bearer Info: {ticket.bearerInfo}</p>
        {parentLink}
      </div>
    );
  }

  getParentLink() {
    if (!this.state.parent.id) {
      return (<p />);
    }
    return (
      <p>
        <a href={`/ticket/${this.state.parent.id}`}>
          Parent ticket
        </a>
      </p>
    );
  }

  getListingInfo() {
    const listing = this.state.ticket.listing;
    if (!listing) {
      return (<div />);
    }
    return (
      <h4 className="buy-text">
        <button
          onClick={() => this.setState({
            showPopUp: true
          })}
        >
          Buy now for {listing.price} ({listing.currency})!
        </button>
      </h4>
    );
  }

  closePopUp(change) {
    this.setState({
      showPopUp: false
    }, () => {
      if (change) {
        window.location.reload();
      }
    });
  }

  websocketConnect() {
    return new Promise(() => {
      this.client.connect((err) => {
        if (err) {
          console.error('socket connect', err);
        }
        const handler = (txn) => {
          const txns = this.state.transactions;

          const found = txns.findIndex(el => el.id === txn.id);
          if (found > -1) {
            txns[found] = txn;
            this.setState({
              transactions: txns
            });
          }
        };
        this.client.subscribe('/nes/transactions', handler, (error) => {
          if (error) {
            console.error('socket subscribe', error);
          }
        });
      });
    });
  }

  fetchData() {
    return new Promise(() => {
      client.fetchTicketTransactions(this.props.id, (result) => {
        this.setState({
          ticket: result.ticket,
          transactions: result.transactions,
          parent: result.parent || {}
        });
      });
    });
  }

  createBlockchainTables() {
    if (!this.state.transactions || !this.state.transactions.length) {
      return (<h2>No blockchains</h2>);
    }
    const data = d3.nest()
      .key(d => d.blockchain.name)
      .sortKeys(d3.ascending)
      .sortValues((a, b) => {
        const ad = new Date(a.updatedAt);
        const bd = new Date(b.updatedAt);
        if (ad > bd) {
          return -1;
        }
        if (ad < bd) {
          return 1;
        }
        // a must be equal to b
        return 0;
      })
      .entries(this.state.transactions);

    return data.map((entry) => {
      const rows = Ticket.createTransactionRows(entry.values, entry.key);
      const label = blockchainName(entry.key);
      return (
        <div key={entry.key} className="table-cont">
          <h4>{label}</h4>
          <Table
            fixedHeader={options.fixedHeader}
            fixedFooter={options.fixedFooter}
            selectable={options.selectable}
          >
            <TableHeader
              style={{ borderBottom: '0px' }}
              displaySelectAll={options.showCheckboxes}
              adjustForCheckbox={options.showCheckboxes}
              enableSelectAll={options.enableSelectAll}
            >
              <TableRow className="tableHeadRow" style={{ borderBottom: '0px' }}>
                <TableHeaderColumn style={{ fontWeight: 'bold', color: '#666' }}>Date</TableHeaderColumn>
                <TableHeaderColumn style={{ fontWeight: 'bold', color: '#666' }}>Action</TableHeaderColumn>
                <TableHeaderColumn style={{ fontWeight: 'bold', color: '#666' }}>Hash</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={options.showCheckboxes}
              deselectOnClickaway={options.deselectOnClickaway}
            >
              {rows}
            </TableBody>
          </Table>
        </div>

      );
    });
  }

  render() {
    const ticket = this.getTicketInfo();
    const tables = this.createBlockchainTables();

    return (
      <IntlProvider locale="en">
        <MuiThemeProvider>
          <div>
            <div className="container">
              <div className="box-container">
                <div className="outside-content" />
              </div>

              <section className="top-header">
                <h1>
                  Transactions
                </h1>
              </section>

              <div className="content">
                <div id="ticket-info">
                  {ticket}
                </div>
                <div>
                  <h3>Blockchain Transactions</h3>
                  {tables}
                </div>
                {this.state.showPopUp ?
                  <Purchase
                    ticket={this.state.ticket} listing={this.state.ticket.listing}
                    user={this.props.user}
                    card={this.props.card} closePopUp={this.closePopUp}
                  />
                  : null }
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      </IntlProvider>
    );
  }
}

Ticket.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({}),
  card: PropTypes.shape({
    address: PropTypes.shape({
      ethereum: PropTypes.string
    })
  })
};

Ticket.defaultProps = {
  user: null,
  card: {
    address: {
      ethereum: null
    }
  }
};

module.exports = Ticket;
