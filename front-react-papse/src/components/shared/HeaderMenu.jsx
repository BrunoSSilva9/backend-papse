import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeaderMenu.module.css';

const HeaderMenu = ({ customLinks = [] }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownOpen]);

    return (
        <div className={styles.menuContainer} ref={dropdownRef}>
            <button className={styles.menuButton} onClick={toggleDropdown} aria-label="Menu">
                <span className="material-symbols-outlined">menu</span>
            </button>
            <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.active : ''}`}>
                <Link to="/" className={styles.menuItem}>
                    <span className="material-symbols-outlined">home</span>
                    HOME
                </Link>
                {customLinks.map((link, index) => (
                    <Link key={index} to={link.to} className={styles.menuItem}>
                        {link.icon && <span className="material-symbols-outlined">{link.icon}</span>}
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HeaderMenu;
