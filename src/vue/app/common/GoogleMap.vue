<template>
  <div class="google-map" :id="mapName"></div>
</template>

<script>
  export default {
    name: 'google-map',
    props: {
      name: { type: String, required: true },
      allowToChangeMarkPosition: { type: Boolean, default: true },
      initialCoordinates: {
        type: Object,
        default: _ => ({
          latitude: 50.450075,
          longitude: 30.524160
        })
      }
    },
    data () {
      return {
        mapName: `${this.name}-map`
      }
    },
    mounted () {
      this.initMap()
    },
    methods: {
      initMap () {
        /* eslint-disable no-undef */
        const bounds = new google.maps.LatLngBounds()
        const element = document.getElementById(this.mapName)
        const coord = this.initialCoordinates
        const map = new google.maps.Map(element, {})
        const position = new google.maps.LatLng(coord.latitude, coord.longitude)
        let markers = []
        const marker = new google.maps.Marker({ position, map })
        markers.push(marker)
        map.fitBounds(bounds.extend(position))
        setTimeout(() => map.setZoom(10), 100)

        if (this.allowToChangeMarkPosition) {
          google.maps.event.addListener(map, 'click', (event) => {
            const latitude = event.latLng.lat()
            const longitude = event.latLng.lng()
            const position = new google.maps.LatLng(latitude, longitude)
            this.$emit('update-mark-position', { latitude: latitude, longitude: longitude })
            markers.forEach((el, index) => {
              markers[index].setMap(null)
            })
            markers = []
            const newMarker = new google.maps.Marker({ position, map })
            markers.push(newMarker)
          })
        }
        /* eslint-enable no-undef */
      }
    },
    watch: {
      initialCoordinates () {
        this.initMap()
      }
    }
  }
</script>

<style scoped>
  .google-map {
    margin: 0 auto;
    background: gray;
  }
</style>
