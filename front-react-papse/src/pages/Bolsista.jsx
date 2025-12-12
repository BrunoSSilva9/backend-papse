import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getProtocolos, getRegulares, getListaRegular } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PatientCard from '../components/shared/PatientCard';
import styles from './Bolsista.module.css';

const Bolsista = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('protocolos');
    const [protocolos, setProtocolos] = useState([]);
    const [regulares, setRegulares] = useState([]);
    const [esperaRegulares, setEsperaRegulares] = useState([]);
    const [loading, setLoading] = useState(true);

    const dropdownRef = useRef(null);
    const { user } = useAuth();

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

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Use Promise.allSettled to allow independent loading
            const [protocolosResult, regularesResult, esperaRegularesResult] = await Promise.allSettled([
                getProtocolos(),
                getRegulares(),
                getListaRegular()
            ]);

            // Filter by current bolsista ID
            const myId = user.idBolsista || user.id;

            const filterByBolsista = (item) => {
                const itemId = String(item.idBolsista);
                const itemColabId = item.colaborador ? String(item.colaborador.idBolsista) : null;
                const userId = String(myId);

                return itemId === userId || itemColabId === userId;
            };

            // Process Protocolos
            if (protocolosResult.status === 'fulfilled') {
                const myProtocolos = protocolosResult.value.data
                    .filter(filterByBolsista)
                    .map(item => ({
                        ...item.paciente,
                        relationId: item.idProtocolo,
                        motivo: item.paciente.relato,
                        dataInicio: item.data_inicio_atendimento
                    }));
                setProtocolos(myProtocolos);
            } else {
                console.error('Erro ao carregar protocolos:', protocolosResult.reason);
            }

            // Process Regulares
            if (regularesResult.status === 'fulfilled') {
                console.log('Regulares Raw Data:', regularesResult.value.data); // DEBUG: Check what the API returns
                const myRegulares = regularesResult.value.data
                    .filter(filterByBolsista)
                    .map(item => ({
                        ...item.paciente,
                        relationId: item.idRegular,
                        motivo: item.paciente.relato,
                        dataInicio: item.data_inicio_atendimento
                    }));
                setRegulares(myRegulares);
            } else {
                console.warn('Erro ao carregar regulares:', regularesResult.reason);
                setRegulares([]);
            }

            // Process Espera Regulares
            if (esperaRegularesResult.status === 'fulfilled') {
                const myEsperaRegulares = esperaRegularesResult.value.data
                    .filter(filterByBolsista)
                    .map(item => ({
                        ...item.paciente,
                        relationId: item.idListaRegular,
                        motivo: item.paciente.relato
                    }));
                setEsperaRegulares(myEsperaRegulares);
            } else {
                console.error('Erro ao carregar espera regulares:', esperaRegularesResult.reason);
                setEsperaRegulares([]);
            }

        } catch (error) {
            console.error('Erro geral ao carregar dados:', error);
        } finally {
            setLoading(false);
        }
    };

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
                <div className={styles.welcomeSection}>
                    <h2>Olá, {user?.nome}</h2>
                    <p>Gerencie seus atendimentos abaixo.</p>
                </div>

                <div className={styles.tabs}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'protocolos' ? styles.active : ''}`}
                        onClick={() => setActiveTab('protocolos')}
                    >
                        Protocolos ({protocolos.length})
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'regulares' ? styles.active : ''}`}
                        onClick={() => setActiveTab('regulares')}
                    >
                        Regulares ({regulares.length})
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'espera_regulares' ? styles.active : ''}`}
                        onClick={() => setActiveTab('espera_regulares')}
                    >
                        Espera Regulares ({esperaRegulares.length})
                    </button>
                </div>

                <div className={styles.listContainer}>
                    {loading ? (
                        <div className={styles.emptyMessage}>Carregando...</div>
                    ) : (
                        <>
                            {activeTab === 'protocolos' && (
                                protocolos.length === 0 ? (
                                    <div className={styles.emptyMessage}>Você não possui atendimentos de protocolo.</div>
                                ) : (
                                    protocolos.map((patient, index) => (
                                        <PatientCard
                                            key={patient.id}
                                            patient={patient}
                                            index={index}
                                            showPosition={false}
                                        />
                                    ))
                                )
                            )}

                            {activeTab === 'regulares' && (
                                regulares.length === 0 ? (
                                    <div className={styles.emptyMessage}>Você não possui atendimentos regulares.</div>
                                ) : (
                                    regulares.map((patient, index) => (
                                        <PatientCard
                                            key={patient.id}
                                            patient={patient}
                                            index={index}
                                            showPosition={false}
                                        />
                                    ))
                                )
                            )}

                            {activeTab === 'espera_regulares' && (
                                esperaRegulares.length === 0 ? (
                                    <div className={styles.emptyMessage}>Você não possui pacientes na lista de espera regular.</div>
                                ) : (
                                    esperaRegulares.map((patient, index) => (
                                        <PatientCard
                                            key={patient.id}
                                            patient={patient}
                                            index={index}
                                            showPosition={false}
                                        />
                                    ))
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Bolsista;
