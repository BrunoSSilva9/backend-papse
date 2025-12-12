import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    fetchInscricoes,
    createProtocolo,
    createListaRegular,
    createRegular,
    createListaEspera,
    deleteListaEspera,
    deleteListaRegular,
    deleteProtocolo,
    deleteRegular,
    getBolsistas
} from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PatientCard from '../components/shared/PatientCard';
import styles from './PatientList.module.css';

const PatientList = ({ status, title, transitions = [], canEncerrar = true }) => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [bolsistas, setBolsistas] = useState([]);
    const [showBolsistaModal, setShowBolsistaModal] = useState(false);
    const [selectedBolsista, setSelectedBolsista] = useState('');
    const [pendingTransition, setPendingTransition] = useState(null);

    const dropdownRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        loadPatients();
        // Case-insensitive check for ADMIN role
        if (user?.role?.toUpperCase() === 'ADMIN') {
            loadBolsistas();
        }
    }, [status, user]);

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

    const loadBolsistas = async () => {
        try {
            const response = await getBolsistas();
            // Filter only BOLSISTA role (case insensitive)
            const filtered = response.data.filter(b => b.role?.toUpperCase() === 'BOLSISTA');
            setBolsistas(filtered);
        } catch (error) {
            console.error('Erro ao carregar bolsistas:', error);
        }
    };

    const loadPatients = async () => {
        try {
            setLoading(true);
            const response = await fetchInscricoes(status);

            // Map based on status to extract patient and relation ID
            const mappedPatients = response.data.map(item => {
                // If generic endpoint (no relation), item is patient
                if (!item.paciente) return { ...item, motivo: item.relato };

                // Extract relation ID
                let relationId;
                if (status === 'lista_de_espera') relationId = item.idListaEspera;
                else if (status === 'espera_regulares') relationId = item.idListaRegular;
                else if (status === 'atendimento_protocolo') relationId = item.idProtocolo;
                else if (status === 'atendimento_regular') relationId = item.idRegular;

                return {
                    ...item.paciente,
                    relationId,
                    motivo: item.paciente.relato,
                    bolsistaNome: item.colaborador?.nome
                };
            });
            setPatients(mappedPatients);
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteCurrent = async (patient) => {
        if (status === 'lista_de_espera') await deleteListaEspera(patient.relationId);
        else if (status === 'espera_regulares') await deleteListaRegular(patient.relationId);
        else if (status === 'atendimento_protocolo') await deleteProtocolo(patient.relationId);
        else if (status === 'atendimento_regular') await deleteRegular(patient.relationId);
    };

    const initiateTransition = async (patient, targetStatus) => {
        // If target requires bolsista and user is ADMIN, show modal
        const requiresBolsista = ['atendimento_protocolo', 'espera_regulares', 'atendimento_regular'].includes(targetStatus);
        const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

        if (isAdmin && requiresBolsista) {
            // Ensure bolsistas are loaded
            if (bolsistas.length === 0) {
                await loadBolsistas();
            }
            setPendingTransition({ patient, targetStatus });
            setShowBolsistaModal(true);
        } else {
            handleTransition(patient, targetStatus);
        }
    };

    const confirmBolsistaSelection = () => {
        if (!selectedBolsista) {
            alert('Por favor, selecione um bolsista.');
            return;
        }

        if (pendingTransition) {
            handleTransition(pendingTransition.patient, pendingTransition.targetStatus, selectedBolsista);
            setShowBolsistaModal(false);
            setPendingTransition(null);
            setSelectedBolsista('');
        }
    };

    const handleTransition = async (patient, targetStatus, assignedBolsistaId = null) => {
        // Use assigned ID if provided (Admin selection), otherwise use current user ID (Bolsista self-assign)
        const bolsistaId = assignedBolsistaId ? parseInt(assignedBolsistaId) : (user?.idBolsista || user?.id);
        const patientId = patient.idPaciente || patient.id;

        if (!bolsistaId) {
            alert('Erro: Bolsista não identificado.');
            return;
        }

        try {
            // Logic matrix for transitions
            if (targetStatus === 'lista_de_espera') {
                await createListaEspera({ idPaciente: patientId });
                await deleteCurrent(patient);

            } else if (targetStatus === 'atendimento_protocolo') {
                await createProtocolo({
                    idPaciente: patientId,
                    idBolsista: bolsistaId,
                    data_inicio_atendimento: new Date().toISOString(),
                    qtde_sessoes: 0
                });
                await deleteCurrent(patient);

            } else if (targetStatus === 'espera_regulares') {
                if (status === 'lista_de_espera') {
                    await createListaRegular({ idPaciente: patientId, idBolsista: bolsistaId });
                } else {
                    await createListaEspera({ idPaciente: patientId });
                    await createListaRegular({ idPaciente: patientId, idBolsista: bolsistaId });
                    await deleteCurrent(patient);
                }

            } else if (targetStatus === 'atendimento_regular') {
                if (status === 'lista_de_espera' || status === 'espera_regulares') {
                    await createRegular({
                        idPaciente: patientId,
                        idBolsista: bolsistaId,
                        data_inicio_atendimento: new Date().toISOString(),
                        qtde_sessoes: 0
                    });
                } else {
                    await createListaEspera({ idPaciente: patientId });
                    await createRegular({
                        idPaciente: patientId,
                        idBolsista: bolsistaId,
                        data_inicio_atendimento: new Date().toISOString(),
                        qtde_sessoes: 0
                    });
                    await deleteCurrent(patient);
                }
            }

            setPatients(patients.filter(p => (p.idPaciente || p.id) !== patientId));
            alert('Paciente transferido com sucesso!');
        } catch (error) {
            console.error('Erro ao transferir paciente:', error);
            alert('Não foi possível transferir o paciente. Verifique se ele já não está na lista de destino.');
        }
    };

    const handleEncerrar = async (patient) => {
        if (!confirm('Tem certeza que deseja encerrar esta inscrição? O registro será movido para os relatórios.')) {
            return;
        }

        try {
            await deleteCurrent(patient);
            setPatients(patients.filter(p => p.id !== patient.id));
            alert('Inscrição encerrada.');
        } catch (error) {
            console.error('Erro ao encerrar inscrição:', error);
            alert('Não foi possível encerrar a inscrição.');
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    // Prepare transitions for the card
    const cardTransitions = transitions.map(t => ({
        label: t.label,
        action: (p) => initiateTransition(p, t.target)
    }));

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
                            onEncaminhar={cardTransitions.length > 0 ? cardTransitions : null}
                            onEncerrar={canEncerrar ? handleEncerrar : null}
                            showPosition={status === 'lista_de_espera'}
                        />
                    ))
                )}
            </div>

            {showBolsistaModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Selecione o Bolsista Responsável</h3>
                        <select
                            value={selectedBolsista}
                            onChange={(e) => setSelectedBolsista(e.target.value)}
                            className={styles.bolsistaSelect}
                        >
                            <option value="">Selecione...</option>
                            {bolsistas.map(b => (
                                <option key={b.idBolsista} value={b.idBolsista}>
                                    {b.nome}
                                </option>
                            ))}
                        </select>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowBolsistaModal(false)}>Cancelar</button>
                            <button onClick={confirmBolsistaSelection} className={styles.confirmBtn}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientList;
