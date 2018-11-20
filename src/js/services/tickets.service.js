import { TokensService } from './tokens.service'
import { RecordFactory } from '@/js/records/factory'

export class TicketsService extends TokensService {
  async getAll (...args) {
    return this.loadTokens(...args)
  }

  async get (...args) {
    const token = await this.loadTokenByCode(...args)
    return RecordFactory.createTicketRecord(token)
  }
}

export const ticketsService = new TicketsService()
