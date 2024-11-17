import { store, getNextAppointmentId } from '../data/store.js';

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = store.appointments.sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { date, time, patientName } = req.body;
    const newAppointment = {
      id: getNextAppointmentId(),
      date: new Date(date),
      time,
      patientName,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.appointments.push(newAppointment);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};