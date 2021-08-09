import firebase from "firebase/app";
import "firebase/auth";

const app = () => {
    if (!firebase.apps.length) {
    return firebase.initializeApp({
        apiKey: "AIzaSyDxO5w5JmSd7CvLWY1vloIYw8_Lp5WKlIY",
        authDomain: "voice-app-63c85.firebaseapp.com",
        projectId: "voice-app-63c85",
        storageBucket: "voice-app-63c85.appspot.com",
        messagingSenderId: "694845370977",
        appId: "1:694845370977:web:38e8a8e9f907443dec3020",
        measurementId: "G-HL7C60YP3M"
    });
    }else {
        return firebase.app(); // if already initialized, use that one
    }
}

export const auth = app().auth();
export default app;