// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component, PropTypes } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';

import InputQuery from './inputQuery';
import { Container, TypedInput } from '~/ui';

import styles from './queries.css';

export default class Queries extends Component {
  static contextTypes = {
    api: PropTypes.object
  }

  static propTypes = {
    accountsInfo: PropTypes.object.isRequired,
    contract: PropTypes.object,
    values: PropTypes.object
  }

  render () {
    const { contract } = this.props;

    if (!contract) {
      return null;
    }

    const queries = contract.functions
      .filter((fn) => fn.constant)
      .sort(this._sortEntries);

    const noInputQueries = queries
      .slice()
      .filter((fn) => fn.inputs.length === 0)
      .map((fn) => this.renderQuery(fn));

    const withInputQueries = queries
      .slice()
      .filter((fn) => fn.inputs.length > 0)
      .map((fn) => this.renderInputQuery(fn));

    if (queries.length + noInputQueries.length + withInputQueries.length === 0) {
      return null;
    }

    return (
      <Container title='queries'>
        <div className={ styles.methods }>
          <div className={ styles.vMethods }>
            { noInputQueries }
          </div>
          <div className={ styles.hMethods }>
            { withInputQueries }
          </div>
        </div>
      </Container>
    );
  }

  renderInputQuery (fn) {
    const { abi, name, signature } = fn;
    const { accountsInfo, contract } = this.props;

    return (
      <div className={ styles.container } key={ fn.signature }>
        <InputQuery
          accountsInfo={ accountsInfo }
          className={ styles.method }
          inputs={ abi.inputs }
          outputs={ abi.outputs }
          name={ name }
          signature={ signature }
          contract={ contract }
        />
      </div>
    );
  }

  renderQuery (fn) {
    const { values } = this.props;

    return (
      <div className={ styles.container } key={ fn.signature }>
        <Card className={ styles.method }>
          <CardTitle
            className={ styles.methodTitle }
            title={ fn.name }
          />
          <CardText
            className={ styles.methodContent }
          >
            { this.renderValue(values[fn.name], fn.outputs[0].kind.type) }
          </CardText>
        </Card>
      </div>
    );
  }

  renderValue (value, type) {
    if (typeof value === 'undefined') {
      return null;
    }

    const { api } = this.context;
    const { accountsInfo } = this.props;

    let valueToDisplay = value;

    if (api.util.isArray(value)) {
      valueToDisplay = api.util.bytesToHex(value);
    } else if (typeof value === 'boolean') {
      valueToDisplay = value ? 'true' : 'false';
    }
    return (
      <TypedInput
        accounts={ accountsInfo }
        allowCopy
        isEth={ false }
        param={ type }
        readOnly
        value={ valueToDisplay }
      />
    );
  }

  _sortEntries (a, b) {
    return a.name.localeCompare(b.name);
  }
}
