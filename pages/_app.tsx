import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from "../components/Navbar";
import Sidebar from '../components/Sidebar';

function MyApp({ Component, pageProps }: AppProps) {
  return (<>
    <Navbar>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "calc(100vh - 3rem - 30px)",
        margin: "10px 0px"
      }}>
        <Sidebar/>
        <Component {...pageProps} />
      </div>
    </Navbar>
 </>)
}
export default MyApp
