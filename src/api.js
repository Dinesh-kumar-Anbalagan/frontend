import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8083/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const AuthAPI = {
  login: (request) => api.post('/CustomerLoginFlow', {request}),
  register: (request) => api.post('/CustomerRegisterFlow', {request}),
};

export const CustomerAPI = {
  updateCustomerField: (request) =>api.post('/CustomerUpdateFlow',{request}),
  getCustomerField: (request) =>api.post('/CustomerRetrieveFlow',{request})
};

export const ShipmentAPI = {
  getOffers: (request) => api.post('/OfferCreationFlow',request),
  confrimOffers: (request) => api.post('/OrderCreationFlow',request),
  pay: (request) => api.post('/PaymentCreationFlow', request),
  track: (request) => api.post('/GetOrderFlow',request),
  trackShipment: (request) => api.post('/GetShipmentFlow',request),
  offerUpdate: (request) => api.post('/OfferUpdationFlow',request),
  printReport: (request) => api.post('/ReportFetchFlow', request),
  reportLabel: (request) => api.post('/ReportGeneratorFlow',request),
};

