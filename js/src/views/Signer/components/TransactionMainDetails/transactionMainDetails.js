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

import MapsLocalGasStation from 'material-ui/svg-icons/maps/local-gas-station';
import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';

import { Button, MethodDecoding } from '~/ui';

import * as tUtil from '../util/transaction';
import Account from '../Account';
import styles from './transactionMainDetails.css';

export default class TransactionMainDetails extends Component {
  static propTypes = {
    children: PropTypes.node,
    from: PropTypes.string.isRequired,
    fromBalance: PropTypes.object,
    gasStore: PropTypes.object,
    id: PropTypes.object.isRequired,
    isTest: PropTypes.bool.isRequired,
    totalValue: PropTypes.object.isRequired,
    transaction: PropTypes.object.isRequired,
    value: PropTypes.object.isRequired
  };

  componentWillMount () {
    const { totalValue, value } = this.props;

    this.updateDisplayValues(value, totalValue);
  }

  componentWillReceiveProps (nextProps) {
    const { totalValue, value } = nextProps;

    this.updateDisplayValues(value, totalValue);
  }

  render () {
    const { children, from, fromBalance, gasStore, isTest, transaction } = this.props;

    return (
      <div className={ styles.transaction }>
        <div className={ styles.from }>
          <div className={ styles.account }>
            <Account
              address={ from }
              balance={ fromBalance }
              isTest={ isTest }
            />
          </div>
        </div>
        <div className={ styles.method }>
          <MethodDecoding
            address={ from }
            historic={ false }
            transaction={
              gasStore
                ? gasStore.overrideTransaction(transaction)
                : transaction
            }
          />
          { this.renderEditGas() }
        </div>
        { children }
      </div>
    );
  }

  renderEditGas () {
    const { gasStore } = this.props;

    if (!gasStore) {
      return null;
    }

    return (
      <div className={ styles.editButtonRow }>
        <Button
          icon={ <MapsLocalGasStation /> }
          label='Edit gas/gasPrice'
          onClick={ this.toggleGasEditor }
        />
      </div>
    );
  }

  renderTotalValue () {
    const { id } = this.props;
    const { feeEth, totalValueDisplay, totalValueDisplayWei } = this.state;
    const labelId = `totalValue${id}`;

    return (
      <div>
        <div
          className={ styles.total }
          data-effect='solid'
          data-for={ labelId }
          data-place='bottom'
          data-tip
        >
          { totalValueDisplay } <small>ETH</small>
        </div>
        <ReactTooltip id={ labelId }>
          The value of the transaction including the mining fee is <strong>{ totalValueDisplayWei }</strong> <small>WEI</small>. <br />
          (This includes a mining fee of <strong>{ feeEth }</strong> <small>ETH</small>)
        </ReactTooltip>
      </div>
    );
  }

  renderValue () {
    const { id } = this.props;
    const { valueDisplay, valueDisplayWei } = this.state;
    const labelId = `value${id}`;

    return (
      <div>
        <div
          data-effect='solid'
          data-for={ labelId }
          data-tip
        >
          <strong>{ valueDisplay } </strong>
          <small>ETH</small>
        </div>
        <ReactTooltip id={ labelId }>
          The value of the transaction.<br />
          <strong>{ valueDisplayWei }</strong> <small>WEI</small>
        </ReactTooltip>
      </div>
    );
  }

  updateDisplayValues (value, totalValue) {
    this.setState({
      feeEth: tUtil.calcFeeInEth(totalValue, value),
      totalValueDisplay: tUtil.getTotalValueDisplay(totalValue),
      totalValueDisplayWei: tUtil.getTotalValueDisplayWei(totalValue),
      valueDisplay: tUtil.getValueDisplay(value),
      valueDisplayWei: tUtil.getValueDisplayWei(value)
    });
  }

  toggleGasEditor = () => {
    this.props.gasStore.setEditing(true);
  }
}
