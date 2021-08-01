import styles from '../styles/Sidebar.module.css';

export default function Sidebar(props: any) {
    return (
        <>
        <div className={styles.sidebar_main}>
            <div></div>
        </div>
        {props.children}
        </>
    )
}
