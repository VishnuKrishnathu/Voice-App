import '../styles/globals.css'
import type { AppProps } from 'next/app'
import firebase from "firebase/app";
import Navbar from "../components/Navbar";
import AuthContext, { AuthFunction } from '../Context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import SocketConnect from "../Context/SocketConnect"

function MyApp({ Component, pageProps }: AppProps) {

  return (<>
    <AuthContext>
      <Navbar>
        <SocketConnect>
          <Component {...pageProps} />
        </SocketConnect>
      </Navbar>
    </AuthContext>
 </>)
}
export default MyApp
