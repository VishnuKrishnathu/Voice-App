import styles from '../styles/Sidebar.module.css';
import { useState, createContext } from "react";

export const SidebarDisplay = createContext<Function>(()=> {});

export default function Sidebar(props: any) {
    const [sideBarStatus, setSideBarStatus] = useState<boolean>(true);
    function updateSideBar(val: boolean) {
        setSideBarStatus(val);
    }
    return (
        <SidebarDisplay.Provider value={updateSideBar}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "calc(100vh - 3rem - 30px)",
          margin: "10px 0px"
        }}>
            {sideBarStatus ?<div className={styles.sidebar_main}>
                <div></div>
            </div>: <></>}
            {props.children}
        </div>
        </SidebarDisplay.Provider>
    )
}