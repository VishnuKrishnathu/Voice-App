import React, { useContext, useEffect } from 'react';
import Head from 'next/head'
import { NavbarDisplay } from '../components/Navbar';
import { SidebarContext } from '../components/Sidebar';
import { io } from 'socket.io-client';
import { AuthFunction } from "../Context/AuthContext";
import Route from '../Context/Env';

export default function Home() {

  const { accessToken } = AuthFunction();

  // Show navbar and status bar👇
  const updateNavState = NavbarDisplay();
  const updateSideBar = SidebarContext();
  updateNavState(true);
  updateSideBar(true);

  useEffect(()=> {
    const socket = io(`http://localhost:5050`, {
      auth : {
        token : accessToken
      }
    });
    socket.emit('custom-event', "Hello World");
  }, [accessToken]);

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
