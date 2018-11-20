import config from '../../config'
import _get from 'lodash/get'
import { RequestRecord } from './request.record'

export class TicketCreationRecord extends RequestRecord {
  constructor (record) {
    super(record)
    this.preissuedAssetSigner = _get(this._record, 'details.asset_create.pre_issued_asset_signer')
    this.initialPreissuedAmount = _get(this._record, 'details.asset_create.initial_preissued_amount')
    this._record = record
    this.tokenCode = _get(this._record, 'details.asset_create.code')
    this.details = this._getDetails()
    this.icon = _get(this._record, 'details.asset_create.details.icon')
    this.iconUrl = this._getImgUrl(_get(this.icon, 'key'))
    this.splash = _get(this._record, 'details.asset_create.details.splash')
    this.splashUrl = this._getImgUrl(_get(this.splash, 'key'))
    this.policies = this._getPolicies()
    this.maxIssuanceAmount = +_get(this._record, 'details.asset_create.max_issuance_amount') + ''
    this.policy = this._getPolicy()
    this.requestType = _get(this._record, 'details.request_type')
    this.requestTypeI = _get(this._record, 'details.request_type_i')
  }

  get logoURL () {
    const key = _get(this._record, 'details.asset_create.details.logo.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getDetails () {
    let details = {
      name: _get(this._record, 'details.asset_create.details.name'),
      stylePreset: _get(this._record, 'details.asset_create.details.stylePreset'),
      host: _get(this._record, 'details.asset_create.details.host'),
      eventStartsAt: _get(this._record, 'details.asset_create.details.eventStartsAt'),
      eventEndsAt: _get(this._record, 'details.asset_create.details.eventEndsAt'),
      shortDescription: _get(this._record, 'details.asset_create.details.shortDescription'),
      longDescription: _get(this._record, 'details.asset_create.details.longDescription'),
      eventAddress: _get(this._record, 'details.asset_create.details.eventAddress'),
      eventCoordinates: _get(this._record, 'details.asset_create.details.eventCoordinates')
    }
    return details
  }

  _getImgUrl (key) {
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  _getPolicies () {
    const policies = _get(this._record, 'details.asset_create.policies')
    return (policies || []).map(policy => policy.value)
  }
  _getPolicy () {
    return (this.policies || []).reduce((sum, policy) => {
      return sum | policy
    })
  }
}
