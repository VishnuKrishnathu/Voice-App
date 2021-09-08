import '../styles/globals.css'
import type { AppProps } from 'next/app'
import firebase from "firebase/app";
import { CookiesProvider } from "react-cookie";
import Navbar from "../components/Navbar";
import AuthContext, { AuthFunction } from '../Context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }: AppProps) {

  return (<>
  <CookiesProvider>
    <AuthContext>
      <Navbar>
          <Component {...pageProps} />
      </Navbar>
    </AuthContext>
  </CookiesProvider>
 </>)
}
export default MyApp
