import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchInscricoes, updateInscricao } from '../services/api';
import PatientCard from '../components/shared/PatientCard';
import styles from './PatientList.module.css';

const PatientList = ({ status, title, nextStatus, canEncerrar = true }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        loadPatients();
    }, [status]);

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

    const loadPatients = async () => {
        try {
            setLoading(true);
            const response = await fetchInscricoes(status);
            setPatients(response.data);
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEncaminhar = async (pacienteId) => {
        if (!nextStatus) return;

        try {
            await updateInscricao(pacienteId, { status: nextStatus });
            setPatients(patients.filter(p => p.id !== pacienteId));
        } catch (error) {
            console.error('Erro ao encaminhar paciente:', error);
            alert('Não foi possível encaminhar o paciente.');
        }
    };

    const handleEncerrar = async (pacienteId) => {
        if (!confirm('Tem certeza que deseja encerrar esta inscrição? O registro será movido para os relatórios.')) {
            return;
        }

        try {
            await updateInscricao(pacienteId, {
                status: 'encerrado',
                dataEncerramento: new Date().toISOString()
            });
            alert('Inscrição encerrada e movida para o relatório.');
            setPatients(patients.filter(p => p.id !== pacienteId));
        } catch (error) {
            console.error('Erro ao encerrar inscrição:', error);
            alert('Não foi possível encerrar a inscrição.');
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className={styles.patientListContainer}>
            <header className={styles.mainHeader}>
                <div className={styles.headerContent}>
                    <h1 className={styles.headerTitle}>{title}</h1>
                    <p className={styles.totalCounter}>
                        Total de pacientes: <strong>{patients.length}</strong>
                    </p>
                </div>
                <div className={styles.menuContainer} ref={dropdownRef}>
                    <button className={styles.menuButton} onClick={toggleDropdown}>
                        <span className={`material-symbols-outlined ${styles.materialIcon}`}>menu</span>
                    </button>
                    <div className={`${styles.dropdownMenu} ${dropdownOpen ? styles.active : ''}`}>
                        <Link to="/admin">ADMIN</Link>
                        <Link to="/">HOME</Link>
                    </div>
                </div>
            </header>

            <div className={styles.patientList}>
                {loading ? (
                    <div className={styles.emptyMessage}>Carregando...</div>
                ) : patients.length === 0 ? (
                    <div className={styles.emptyMessage}>Não há pacientes nesta lista no momento.</div>
                ) : (
                    patients.map((patient, index) => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            index={index}
                            onEncaminhar={nextStatus ? handleEncaminhar : null}
                            onEncerrar={canEncerrar ? handleEncerrar : null}
                            showPosition={status === 'lista_de_espera'}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default PatientList;
