import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = ({ variant = 'default' }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
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

    const isActive = (path) => location.pathname === path;

    return (
        <header className={styles.headerContainer}>
            <nav className={styles.navegacao}>
                <ul>
                    <li>
                        <Link to="/" className={isActive('/') ? styles.active : ''}>
                            PRINCIPAL
                        </Link>
                    </li>
                    <li>
                        <Link to="/sobre" className={isActive('/sobre') ? styles.active : ''}>
                            SOBRE
                        </Link>
                    </li>
                    <li>
                        <Link to="/formulario" className={isActive('/formulario') ? styles.active : ''}>
                            FORMULÁRIO
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className={styles.menuContainer} ref={dropdownRef}>
                <button className={styles.menuButton} onClick={toggleDropdown}>
                    <span className={`material-symbols-outlined ${styles.materialIcon}`}>menu</span>
                </button>

                <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.active : ''}`}>
                    <Link to="/">SAIR</Link>
                    <a href="https://www.unifesspa.edu.br/" target="_blank" rel="noopener noreferrer">
                        UNIFESSPA
                    </a>
                    <Link to="/login">LOGIN</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
