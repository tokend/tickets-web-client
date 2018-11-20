export class BidRecord {
  constructor (record) {
    this.id = record.id
    this.ownerId = record.owner_id
    this.baseAsset = record.base_asset
    this.baseBalanceId = record.base_balance_id
    this.availableAmount = record.available_amount
    this.lockedAmount = record.locked_amount
    this.createdAt = record.created_at
    this.isCanceled = record.is_canceled
    this.details = record.details
    this.quoteAssets = record.quote_assets
  }
}
