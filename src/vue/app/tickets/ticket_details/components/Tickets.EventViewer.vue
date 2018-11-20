<template>
  <div class="ticket-event-details">
    <div class="ticket-event-details__attribute">
      <div class="ticket-event-details__attribute-column
        ticket-event-details__attribute-column--icon">
        <md-icon class="ticket-event-details__attribute-icon md-size-2x">
          access_time
        </md-icon>
      </div>
      <div class="ticket-event-details__attribute-column">
        <span class="ticket-event-details__attribute-date">
          {{ 'ticket_details_label_starts_at' | translate }}:
          {{ ticket.eventStartsAt | formatDate('DoMT') }}
        </span>
        <span class="ticket-event-details__attribute-date">
          {{ 'ticket_details_label_ends_at' | translate }}:
          {{ ticket.eventEndsAt | formatDate('DoMT') }}
        </span>
      </div>
    </div>

    <div class="ticket-event-details__attribute">
      <div class="ticket-event-details__attribute-column
        ticket-event-details__attribute-column--icon">
        <md-icon class="ticket-event-details__attribute-icon md-size-2x">
          place
        </md-icon>
      </div>
      <div class="ticket-event-details__attribute-column">
        <span class="ticket-event-details__city">
          {{ ticket.eventAddress.city }}
        </span>
        <span class="ticket-event-details__institution">
          {{ ticket.eventAddress.institution }}
        </span>
        <span class="ticket-event-details__full-address">
          {{ ticket.eventAddress.fullAddress }}
        </span>
      </div>
    </div>

    <div class="ticket-event-details__attribute">
      <div class="ticket-event-details__attribute-column
        ticket-event-details__attribute-column--icon">
        <md-icon class="ticket-event-details__attribute-icon md-size-2x">
          alternate_email
        </md-icon>
      </div>
      <div class="ticket-event-details__attribute-column">
        <span class="ticket-event-details__host-name">
          {{ ticket.host.name }}
        </span>
        <span class="ticket-event-details__host-email">
          {{ ticket.host.email }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { i18n } from '@/js/i18n'

export default {
  data () {
    return {
      i18n
    }
  },
  props: {
    ticket: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang='scss'>
@import "~@scss/variables";

$attribute-margin: 2.4 * $point;
.ticket-event-details,
.ticket-event-details__attribute,
.ticket-event-details__attribute-column {
  display: flex;
  width: 100%;
  flex: 1;
  color: $col-md-primary;
}

.ticket-event-details {
  flex-direction: column;
  flex-wrap: wrap;
  width: calc(100% + #{$attribute-margin});
  margin: 0 -$attribute-margin;
}

.ticket-event-details__attribute {
  min-width: 20 * $point;
  margin: $attribute-margin;
}

.ticket-event-details__attribute-column {
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;

  &--icon {
    flex: 0;
  }
}

.ticket-event-details__attribute-icon {
  margin: 0 1.4 * $point 0 auto;
  color: $col-md-primary-secondary-inactive !important;
}

.ticket-event-details__attribute-date {
  font-size: 1.6 * $point;
}

.ticket-event-details__city,
.ticket-event-details__host-name {
  font-size: 1.6 * $point;
}

.ticket-event-details__institution,
.ticket-event-details__full-address,
.ticket-event-details__host-email {
  font-size: 1.4 * $point;
}
</style>
