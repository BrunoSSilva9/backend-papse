import { useState, useRef, useEffect } from 'react';
import styles from './PatientCard.module.css';

const PatientCard = ({ patient, index, onEncaminhar, onEncerrar, showPosition = true }) => {
    const [expanded, setExpanded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [menuOpen]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const handleEncaminhar = (e) => {
        e.preventDefault();
        if (onEncaminhar) {
            onEncaminhar(patient);
        }
        setMenuOpen(false);
    };

    const handleEncerrar = (e) => {
        e.preventDefault();
        if (onEncerrar) {
            onEncerrar(patient);
        }
        setMenuOpen(false);
    };

    return (
        <div className={`${styles.pacienteCard} ${expanded ? styles.expanded : ''}`}>
            <div className={styles.cardHeader}>
                {showPosition && <span>{index + 1}º lugar na lista de espera</span>}
                {!showPosition && <span>Registro #{patient.id}</span>}
                <div className={styles.cardActions} ref={menuRef}>
                    <button className={styles.menuTresPontosBtn} onClick={toggleMenu}>
                        ...
                    </button>
                    <div className={`${styles.cardDropdownMenu} ${menuOpen ? styles.active : ''}`}>
                        {onEncaminhar && onEncaminhar.map((transition, idx) => (
                            <a
                                key={idx}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    transition.action(patient);
                                    setMenuOpen(false);
                                }}
                            >
                                {transition.label}
                            </a>
                        ))}
                        {onEncerrar && (
                            <a href="#" onClick={handleEncerrar}>
                                Encerrar Inscrição
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className={styles.cardBodyResumo}>
                <span className="material-symbols-outlined">person</span>
                <span>{patient.nome}</span>
            </div>

            <div className={styles.cardBodyDetalhes}>

                <p><strong>Número:</strong> <span>{patient.telefone}</span></p>
                <p><strong>Curso:</strong> <span>{patient.curso}</span></p>
                <p><strong>Matrícula:</strong> <span>{patient.matricula}</span></p>
                <p><strong>Motivo:</strong> <span>{patient.motivo || 'Não informado'}</span></p>
                {patient.bolsistaNome && (
                    <p><strong>Bolsista Responsável:</strong> <span>{patient.bolsistaNome}</span></p>
                )}
            </div>

            <div className={styles.cardFooter}>
                <button className={styles.toggleDetailsBtn} onClick={toggleExpanded}>
                    {expanded ? 'Ver menos' : 'Ver mais'}
                </button>
            </div>
        </div>
    );
};

export default PatientCard;
