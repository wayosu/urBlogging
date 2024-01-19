// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtCEbIQa_Q9ZeR1FoubfWT1J1J3ZNsgw0",
  authDomain: "urblogging-web-app.firebaseapp.com",
  projectId: "urblogging-web-app",
  storageBucket: "urblogging-web-app.appspot.com",
  messagingSenderId: "423107289757",
  appId: "1:423107289757:web:364f0060d887074133aa74",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Google Auth
const provider = new GoogleAuthProvider();
const auth = getAuth();
export const authWithGoogle = async () => {
  let user = null;

  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};
