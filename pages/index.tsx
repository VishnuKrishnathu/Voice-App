import React, { useContext, useEffect } from 'react';
import Head from 'next/head'
import { NavbarDisplay } from '../components/Navbar';
import { SidebarDisplay } from '../components/Sidebar';
import { AuthFunction } from "../Context/AuthContext";
import { auth } from "../firebase";

export default function Home() {

  // Show navbar and status bar👇
  const updateNavState = NavbarDisplay();
  const updateSideBar = useContext(SidebarDisplay);
  updateNavState(true);
  updateSideBar(true);


  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
      </Head>
      <div style={{
        background: "var(--secondary-color)",
        height: "calc(100vh - 3rem - 30px)",
        width: "100%",
        margin: "0px 20px",
        borderRadius: "10px"
      }}></div>
    </>
  )
}
