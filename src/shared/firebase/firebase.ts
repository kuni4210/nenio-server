import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDgsZ1HxalB5TFEgA6ldh9z8_m1RLg3750',
  authDomain: 'nenio-f37da.firebaseapp.com',
  projectId: 'nenio-f37da',
  storageBucket: 'nenio-f37da.appspot.com',
  messagingSenderId: '679885893354',
  appId: '1:679885893354:web:8a2b0a21bf94b13bbab193',
  measurementId: 'G-6NWZ14RQN4',
};

// Initialize Firebase
export const init = initializeApp(firebaseConfig);
export const auth = getAuth(init);
// export const analytics = getAnalytics(app); // 문제 있다.
