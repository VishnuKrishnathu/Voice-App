import '../styles/globals.css'
import type { AppProps } from 'next/app'
import firebase from "firebase/app";
// import "firebase/auth";
import Navbar from "../components/Navbar";
import Sidebar from '../components/Sidebar';
import AuthContext, { AuthFunction } from '../Context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (<>
  <AuthContext>
    <Navbar>
      <Sidebar>
          <Component {...pageProps} />
      </Sidebar>
    </Navbar>
  </AuthContext>
 </>)
}
export default MyApp
