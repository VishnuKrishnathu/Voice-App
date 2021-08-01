import Head from 'next/head'
import Navbar from "../components/Navbar";
import Sidebar from '../components/Sidebar';

export default function Home() {
  return (
    <>
      <Head>
        <title>My app</title>
      </Head>
      <Navbar>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "calc(100vh - 3rem - 30px)",
          margin: "10px 0px"
        }}>
          <Sidebar></Sidebar>
          <div></div>
        </div>
      </Navbar>
    </>
  )
}
