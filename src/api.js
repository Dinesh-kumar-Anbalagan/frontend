import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8083/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach token if present
// api.interceptors.request.use((config) => {
//   const saved = localStorage.getItem('auth');
//   if (saved) {
//     const { token } = JSON.parse(saved);
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export const AuthAPI = {
  login: (request) => api.post('/CustomerLoginFlow', {request}),
  register: (request) => api.post('/CustomerRegisterFlow', {request}),
};

export const CustomerAPI = {
  updateCustomerField: (request) =>api.post('/CustomerUpdateFlow',{request})
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

// export default api;

const mockCustomers = [
  {
    customerID: "CUST1001",
    accountNumber: "W000392496",
    allowedLOB: "Air, Ocean",
    addressList: [
      {
        street: "9 Orchard Street",
        city: "New York",
        state: "NY",
        zip: "10002",
      },
      {
        street: "123 Market St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
      },
    ],
    preferredPaymentMethod: "Credit Card",
    status: "Active",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "555-123-4567",
    email: "john.doe@example.com",
  },
  {
    customerID: "CUST1002",
    accountNumber: "W000392497",
    allowedLOB: "Ground",
    addressList: [
      {
        street: "456 Elm Street",
        city: "Chicago",
        state: "IL",
        zip: "60607",
      },
    ],
    preferredPaymentMethod: "Invoice",
    status: "Inactive",
    firstName: "Jane",
    lastName: "Smith",
    phoneNumber: "555-987-6543",
    email: "jane.smith@example.com",
  },
];

export async function loginUser({ userId, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === "admin" && password === "admin") {
        console.log("hello");
        resolve({ id: "CUST1002", name: "Admin User", token: "fake-jwt-token" });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
}

export async function registerUser(user) {

  console.log("Registered user:", user);
  return { success: true };
}

export async function getCustomers() {
  return [
    { id: 1, name: "Dinesh Kumar", email: "dinesh@example.com" },
    { id: 2, name: "John Doe", email: "john@example.com" },
  ];
}

export async function getAddresses(customerId) {
  return [
    { id: 1, address: "123 Main St", city: "Chennai", zip: "600001" },
    { id: 2, address: "456 Market Rd", city: "Bangalore", zip: "560001" },
  ];
}

export async function getShipmentOffers() {
  return [
    { id: 1, from: "Chennai", to: "Bangalore", price: "₹1200" },
    { id: 2, from: "Chennai", to: "Hyderabad", price: "₹1500" },
  ];
}

export async function getCustomerById(id) {
  console.log(id);
}

export async function getOffers(shipments) {
  console.log(shipments);
  return [
    { id: 1, carrier:"ALS",description: "Express Delivery", price: "₹2000" , },
    { id: 2, description: "Standard Delivery", price: "₹1200" },
  ];
}

export async function makePayment(details) {
  console.log("Payment:", details);
  return { success: true };
}

export async function updateCustomerField(details) {
  console.log( details);
  return   {
    customerID: "CUST1001",
    accountNumber: "W000392496",
    allowedLOB: "Air, Ocean",
    addressList: [
      {
        street: "9 Orchard Street",
        city: "New York",
        state: "NY",
        zip: "10002",
      },
      {
        street: "123 Market St",
        city: "San Francisco",
        state: "CA",
        zip: "94105",
      },
    ],
    preferredPaymentMethod: "Credit Card",
    status: "Active",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "555-123-4567",
    email: "john.doe@example.com",
  };
}
