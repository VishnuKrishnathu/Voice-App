import '../styles/globals.css'
import type { AppProps } from 'next/app'
import firebase from "firebase/app";
// import "firebase/auth";
import Navbar from "../components/Navbar";
import Sidebar from '../components/Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {

  const firebaseConfig = {
    apiKey: "AIzaSyDxO5w5JmSd7CvLWY1vloIYw8_Lp5WKlIY",
    authDomain: "voice-app-63c85.firebaseapp.com",
    projectId: "voice-app-63c85",
    storageBucket: "voice-app-63c85.appspot.com",
    messagingSenderId: "694845370977",
    appId: "1:694845370977:web:38e8a8e9f907443dec3020",
    measurementId: "G-HL7C60YP3M"
  };

  // To avoid multiple initialization of firebase 👇
  if (!firebase.apps.length) {
   firebase.initializeApp(firebaseConfig);
  }else {
   firebase.app(); // if already initialized, use that one
  }

  return (<>
    <Navbar>
      <Sidebar>
          <Component {...pageProps} />
      </Sidebar>
    </Navbar>
 </>)
}
export default MyApp
