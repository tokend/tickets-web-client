import { Service } from './service'
import {
  CreateAtomicSwapBidCreationRequestBuilder,
  CancelAtomicSwapBidBuilder,
  CreateAtomicSwapRequestBuilder
} from 'tokend-js-sdk'

export class BidsService extends Service {
  createBid (opts) {
    const operation = CreateAtomicSwapBidCreationRequestBuilder.createASwapBidCreationRequest(opts)

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  cancelBid (opts) {
    const operation = CancelAtomicSwapBidBuilder.cancelASwapBid(opts)

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  createASwapRequest (opts) {
    const operation = CreateAtomicSwapRequestBuilder.createASwapRequest(opts)

    return this._operationBuilder
      .operation()
      .add(operation)
      .submit(this._accountId, this._keypair)
  }

  getBids (opts = {}) {
    return this._horizonRequestBuilder
      .atomic_swap_bids()
      .forOwner(opts.owner)
      .forBaseAsset(opts.baseAsset)
      .call()
  }

  getSwapRequests () {
    return this._horizonRequestBuilder
      .reviewableRequestsHelper()
      .atomic_swaps()
      .forRequestor(this._accountId)
      .callWithSignature(this._keypair)
  }

  getBid (id) {
    console.log(id)
    return this._horizonRequestBuilder
      .atomic_swap_bids()
      .bid(id)
      .call()
  }
}

export const bidsService = new BidsService()
