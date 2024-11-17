import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'
import Alpine from 'alpinejs'

window.Alpine = Alpine

// API endpoints
const API_URL = 'http://localhost:3000/api'

// Define Alpine.js data and methods
document.addEventListener('alpine:init', () => {
  Alpine.data('clinicData', () => ({
    appointments: [],
    consultations: [],

    async init() {
      await this.fetchAppointments()
      await this.fetchConsultations()
    },

    async fetchAppointments() {
      try {
        const response = await fetch(`${API_URL}/appointments`)
        this.appointments = await response.json()
      } catch (error) {
        console.error('Error fetching appointments:', error)
        this.appointments = []
      }
    },

    async fetchConsultations() {
      try {
        const response = await fetch(`${API_URL}/consultations`)
        this.consultations = await response.json()
      } catch (error) {
        console.error('Error fetching consultations:', error)
        this.consultations = []
      }
    }
  }))
})

Alpine.start()