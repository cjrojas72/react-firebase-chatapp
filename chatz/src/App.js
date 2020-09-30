import React, { useRef, useState } from 'react';
import './App.css';

// firebase dependencies 
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// moment dependencies 
import moment from 'moment';

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
  // console.log(user);

  return (
    <div className="App">
      <header className="App-header">
        <SignOut />
        {user ? <UsersOnline /> : <p>Hi</p>}
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
    <div className='center-div'>
      <h1 style={{ fontSize: '50px', color: 'white' }}>Welcome to Chatz</h1>
      <p>Sign in with a google account to begin chatting with the world!</p>
      <button onClick={googleSignIn}>Sign in!</button>
    </div>
  )
};

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => { auth.signOut(); logOutStatus(auth.currentUser.uid); }}>Sign Out</button>)
};

// shows when users are online and updates whenever someone is not online
function UsersOnline() {
  const users_dbRef = firestore.collection('userOnline');
  const query = users_dbRef.where("online", "==", true);

  const [users] = useCollectionData(query, { idField: 'id' });

  let online = 0;

  console.log(users);


  try {
    online = Object.keys(users).length;
    console.log(online);
  }
  catch {
    console.log("not there yet");
  }

  return (
    <h1 style={{ color: "white" }}>Online: {online} </h1>
  )
}


//logs when user is connected to app. 
function logStatus(user) {
  const users_dbRef = firestore.collection('userOnline');
  users_dbRef.doc(user).set({
    online: true,
    lastOnline: firebase.firestore.FieldValue.serverTimestamp()
  });
}

//logs when user's window is closed to show offline status
function logOutStatus(user) {
  const users_dbRef = firestore.collection('userOnline');
  users_dbRef.doc(user).set({
    online: false,
    lastOnline: firebase.firestore.FieldValue.serverTimestamp()
  });
}

function ChatRoom() {

  React.useEffect(() => {
    window.addEventListener("beforeunload", function (e) {
      logOutStatus(auth.currentUser.uid);
    }, false);
  });

  logStatus(auth.currentUser.uid);

  const msgs_dbRef = firestore.collection('messages');
  const query = msgs_dbRef.orderBy('createAt').limit(50);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');

  const dummy = useRef()

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await msgs_dbRef.add({
      text: formValue,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');

    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <div className='chatBox'>
        {messages && messages.map(msg => <MessageComp key={msg.id} message={msg} />)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">send</button>
      </form>
    </>
  )
};

function MessageComp(props) {
  const { text, uid, photoURL } = props.message;
  // console.log(props.message);
  let time = props.message.createAt;
  const convertTime = moment.unix(time).format("dddd, MMMM, h:mm a");

  // console.log(convertTime);


  const messageSOR = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className="stackMsg">
      <div className="time"><p>{convertTime}</p></div>
      <div className={`message ${messageSOR}`}>
        <img src={photoURL} alt='some img' />
        <p>{text}</p>
      </div>
    </div>
  )
}


export default App;
