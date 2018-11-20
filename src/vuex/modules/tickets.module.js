import { vuexTypes } from '../types'

import { ticketsService } from '../../js/services/tickets.service'
import { RecordFactory } from '../../js/records/factory'
import { StateHelper } from '../helpers/state.helper'

export const state = {
  tickets: [],
  userOwnedTickets: [],
  acquiredTickets: []
}

export const mutations = {
  SET_ALL_TICKETS: (state, tickets) => {
    state.tickets = tickets
  },
  SET_USER_OWNED_TICKETS: (state, tickets) => {
    state.userOwnedTickets = tickets
  },
  SET_USER_ACQUIRED_TICKETS: (state, tickets) => {
    state.acquiredTickets = tickets
  }
}

export const actions = {
  async GET_ALL_TICKETS ({ commit }) {
    const records = await ticketsService.getAll()

    commit(
      vuexTypes.SET_ALL_TICKETS,
      records
        .map(record => RecordFactory.createTicketRecord(record))
        .filter(ticket => ticket.isTicket)
    )

    // FIXME don't repeat pls
    commit(
      vuexTypes.SET_ALL_TOKENS,
      records
        .map(record => RecordFactory.createTokenRecord(record))
    )
  }
}

export const getters = {
  tickets: state => [].concat(state.tickets).reverse(),
  acquirableTickets: state => state.tickets.filter(item => +item.available > 0).reverse(),
  userOwnedTickets: state => state.userOwnedTickets,
  userAcquiredTickets: _ => StateHelper.deriveTokensFromBalancesDetails(),
  userWalletTickets: _ => StateHelper.deriveTokensFromBalancesDetails(ticket => ticket.isWalletTicket),
  userTransferableTickets: _ => StateHelper.deriveTicketsFromBalancesDetails(ticket => ticket.isTransferable),
  userWithdrawableTickets: _ => StateHelper.deriveTokensFromBalancesDetails(ticket => ticket.isWithdrawable)
}

export default {
  actions,
  getters,
  mutations,
  state
}
