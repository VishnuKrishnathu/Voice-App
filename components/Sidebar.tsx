import styles from '../styles/Sidebar.module.css';
import { useState, createContext, useContext } from "react";

type Props = {
    title? : string,
    children : JSX.Element
}

interface ISidebarDisplay {
    hideSidebar : Function,
    showSidebar : Function
}

const SidebarDisplay = createContext<ISidebarDisplay>({
    hideSidebar : ()=> {},
    showSidebar: ()=> {}
});

export const SidebarContext = () => {
    return useContext(SidebarDisplay);
}

export default function Sidebar(props: Props) {
    const [sideBarStatus, setSideBarStatus] = useState<boolean>(true);
    const updateSideBar = {
        hideSidebar : function(){
            setSideBarStatus(false)
        },
        showSidebar : function(){
            setSideBarStatus(true);
        }
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
