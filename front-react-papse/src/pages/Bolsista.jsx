import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Bolsista.module.css';

const Bolsista = () => {
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
        <div className={styles.bolsistaContainer}>
            <header className={styles.mainHeader}>
                <h1 className={styles.headerTitle}>PAPSE | Painel do Bolsista</h1>
                <div className={styles.menuContainer} ref={dropdownRef}>
                    <button className={styles.menuButton} onClick={toggleDropdown}>
                        <span className={`material-symbols-outlined ${styles.materialIcon}`}>menu</span>
                    </button>
                    <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.active : ''}`}>
                        <Link to="/">SAIR</Link>
                        <Link to="/">HOME</Link>
                    </div>
                </div>
            </header>

            <div className={styles.content}>
                <h2>Bem-vindo, Bolsista!</h2>
                <p>Este é o painel de controle para bolsistas do PAPSE.</p>
                <p>Aqui você pode gerenciar atendimentos e acompanhar pacientes.</p>
            </div>
        </div>
    );
};

export default Bolsista;
