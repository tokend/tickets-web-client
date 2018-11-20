import { TokenRecord } from './token.record'
import get from 'lodash/get'
import config from '@/config'
export class TicketRecord extends TokenRecord {
  constructor (record, attachedDetails = {}) {
    super(record, attachedDetails)
  }

  get splashUrl () {
    const key = get(this._record, 'details.splash.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  get iconUrl () {
    const key = get(this._record, 'details.icon.key')
    if (!key) return ''
    return `${config.FILE_STORAGE}/${key}`
  }

  get shortDescription () {
    return get(this._record, 'details.shortDescription')
  }

  get longDescription () {
    return get(this._record, 'details.longDescription')
  }

  get eventStartsAt () {
    return get(this._record, 'details.eventStartsAt')
  }

  get eventEndsAt () {
    return get(this._record, 'details.eventEndsAt')
  }

  get eventCoordinates () {
    const coords = get(this._record, 'details.eventCoordinates', {})
    return Object.freeze({
      latitude: coords.latitude || coords.lat,
      longitude: coords.longitude || coords.lng
    })
  }

  get stylePreset () {
    return get(this._record, 'details.stylePreset')
  }

  get eventAddress () {
    return Object.freeze({
      city: get(this._record, 'details.eventAddress.city'),
      institution: get(this._record, 'details.eventAddress.institution'),
      fullAddress: get(this._record, 'details.eventAddress.fullAddress')
    })
  }

  get host () {
    return Object.freeze({
      name: get(this._record, 'details.host.name'),
      email: get(this._record, 'details.host.email')
    })
  }

  get prices () {
    return [].concat(...get(this._record, 'details.prices', []))
  }

  get sortedPrices () {
    const priorities = ['UAH', 'BTC', 'ETH']
    return this.prices.sort((a, b) => {
      return priorities.indexOf(a.asset) > priorities.indexOf(b.asset)
    })
  }

  get isTicket () {
    return Boolean(
      !this.isWalletToken &&
      this.eventStartsAt
    )
  }
}
