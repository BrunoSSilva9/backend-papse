import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchInscricoes } from '../services/api';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [counts, setCounts] = useState({
        listaEspera: 0,
        esperaRegulares: 0,
        atendimentoProtocolo: 0,
        atendimentoRegular: 0
    });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const [listaEspera, esperaRegulares, atendimentoProtocolo, atendimentoRegular] = await Promise.all([
                    fetchInscricoes('lista_de_espera'),
                    fetchInscricoes('espera_regulares'),
                    fetchInscricoes('atendimento_protocolo'),
                    fetchInscricoes('atendimento_regular')
                ]);

                setCounts({
                    listaEspera: listaEspera.data.length,
                    esperaRegulares: esperaRegulares.data.length,
                    atendimentoProtocolo: atendimentoProtocolo.data.length,
                    atendimentoRegular: atendimentoRegular.data.length
                });
            } catch (error) {
                console.error('Erro ao carregar contagens:', error);
            }
        };

        loadCounts();
    }, []);

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
        <div className={styles.adminContainer}>
            <header className={styles.mainHeader}>
                <h1 className={styles.headerTitle}>PAPSE | Painel Administrativo</h1>
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

            <nav className={styles.subNav}>
                <Link to="/admin" className={styles.active}>Gerenciar Atendimentos</Link>
                <Link to="/relatorio">Relatório</Link>
            </nav>

            <main className={styles.cardsGrid}>
                <Link to="/lista-espera" className={`${styles.card} ${styles.cardBlue}`}>
                    <div className={styles.cardIconWrapper}>
                        <span className={`material-symbols-outlined ${styles.cardIcon}`}>groups</span>
                        <span className={styles.count}>{counts.listaEspera}</span>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>Lista de espera</h2>
                        <p>Pacientes aguardando atendimento inicial.</p>
                    </div>
                </Link>

                <Link to="/lista-espera-regulares" className={`${styles.card} ${styles.cardYellow}`}>
                    <div className={styles.cardIconWrapper}>
                        <span className={`material-symbols-outlined ${styles.cardIcon}`}>drafts</span>
                        <span className={styles.count}>{counts.esperaRegulares}</span>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>Lista de espera para atendimentos regulares</h2>
                        <p>Pacientes aguardando atendimento regular.</p>
                    </div>
                </Link>

                <Link to="/atendimentos-protocolo" className={`${styles.card} ${styles.cardDarkBlue}`}>
                    <div className={styles.cardIconWrapper}>
                        <span className={`material-symbols-outlined ${styles.cardIcon}`}>clinical_notes</span>
                        <span className={styles.count}>{counts.atendimentoProtocolo}</span>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>Lista de atendimentos de protocolo</h2>
                        <p>Pacientes em atendimento protocolar.</p>
                    </div>
                </Link>

                <Link to="/atendimento-regulares" className={`${styles.card} ${styles.cardRedOrange}`}>
                    <div className={styles.cardIconWrapper}>
                        <span className={`material-symbols-outlined ${styles.cardIcon}`}>psychology</span>
                        <span className={styles.count}>{counts.atendimentoRegular}</span>
                    </div>
                    <div className={styles.cardContent}>
                        <h2>Lista de atendimentos regulares</h2>
                        <p>Pacientes em atendimento psicológico regular.</p>
                    </div>
                </Link>
            </main>
        </div>
    );
};

export default AdminDashboard;
