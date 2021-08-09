import React, {useContext } from 'react';
import Head from 'next/head'
import { navbarDisplay } from '../components/Navbar';
import { SidebarDisplay } from '../components/Sidebar';

export default function Home() {
  // Show navbar and status bar👇
  const updateNavState = navbarDisplay();
  const updateSideBar = useContext(SidebarDisplay);
  updateNavState(true);
  updateSideBar(true);
  return (
    <>
    <Head>
      <meta name="google-site-verification" content="PSsRxeZpHQ1xMKoZKX30NddHsJVd-qfyH6ijJJTz5xo" />
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width" />
    </Head>
      <meta name="google-site-verification" content="PSsRxeZpHQ1xMKoZKX30NddHsJVd-qfyH6ijJJTz5xo" />
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
