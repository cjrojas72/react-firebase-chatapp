import React from 'react';
import './App.css';

// firebase dependencies 
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyD_YU0qnrrd8VLctSW9GyxQsagq-zX-6dQ",
  authDomain: "chatz-b7f42.firebaseapp.com",
  databaseURL: "https://chatz-b7f42.firebaseio.com",
  projectId: "chatz-b7f42",
  storageBucket: "chatz-b7f42.appspot.com",
  messagingSenderId: "213497369078",
  appId: "1:213497369078:web:4cfa5e44c858b12a4077d7",
  measurementId: "G-W2FFRYFCZE"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
    </div>
  );
}

export default App;
