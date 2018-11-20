import { RequestRecord } from './request.record'
import _get from 'lodash/get'

const TASKS = Object.freeze({
  txProcessing: 1,
  txSucceeded: 2
})

export class ASwapRequest extends RequestRecord {
  constructor (record) {
    super(record)
    this.bidId = _get(record, 'details.atomic_swap.bid_id')
    this.baseAmount = _get(record, 'details.atomic_swap.base_amount')
    this.quoteAsset = _get(record, 'details.atomic_swap.quote_asset')
    this.address = this._getAddress(record)
    this.pendingTasks = record.pending_tasks
  }

  _getAddress (record) {
    const details = _get(record, 'external_details.data')
    if (!details) return null
    return details
      .filter(d => d)
      .map(d => d.address || d.Address)[0]
  }

  get isProcessing () {
    return !(this.pendingTasks & TASKS.txProcessing)
  }

  get isSucceded () {
    return !(this.pendingTasks & TASKS.txSucceeded)
  }
}
