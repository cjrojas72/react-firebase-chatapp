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

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        {user ? <SignOut /> : console.log("hi")}
        <button onClick={TestConnection}>Test Connection</button>
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn() {
  const googleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={googleSignIn}>Sign in!</button>
  )
};

function SignOut() {

  return auth.currentUser && (
    <button onClick={() => auth.signOut}>Sign Out</button>
  )
};

function ChatRoom() {
  const ref_messages = firestore.collection('messages');
  console.log(ref_messages);
  const query = ref_messages.orderBy('createAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });

  return (
    <>
      <div><h1>You have a chat room</h1></div>
      <div>
        {messages && messages.map(msg => <MessageComp key={msg.id} message={msg} />)}
      </div>
    </>
  )
};

function MessageComp(props) {
  const { text } = props.message;
  console.log(props.message);

  return (
    <p>{text}</p>
  )
}

function TestConnection() {
  firestore.collection("messages").add({
    createAt: 'today',
    text: 'testing',
  })
    .then(function (docRef) {
      console.log("Document written with ID: ", docRef.id);
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

export default App;
