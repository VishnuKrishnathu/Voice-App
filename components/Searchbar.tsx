import styles from "../styles/Navbar.module.css";
export default function Searchbar() {
    return (
        <div className={styles.searchbar}>
            <input type="text" id="searchbar" name="searchbar"/>
        </div>
    )
}
