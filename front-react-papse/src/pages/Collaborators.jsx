import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getBolsistas, createColaborador, deleteColaborador } from '../services/api';
import styles from './Collaborators.module.css';

const Collaborators = () => {
    const [collaborators, setCollaborators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        matricula: '',
        data_admissao: new Date().toISOString().split('T')[0],
        senha: '',
        confirmarSenha: '',
        role: 'BOLSISTA'
    });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [collaboratorToDelete, setCollaboratorToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        loadCollaborators();
    }, []);

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

    const loadCollaborators = async () => {
        try {
            setLoading(true);
            const response = await getBolsistas();
            setCollaborators(response.data);
        } catch (error) {
            console.error('Erro ao carregar colaboradores:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    const openCreateModal = () => {
        setShowCreateModal(true);
        setFormData({
            nome: '',
            matricula: '',
            data_admissao: new Date().toISOString().split('T')[0],
            senha: '',
            confirmarSenha: '',
            role: 'BOLSISTA'
        });
        setFormErrors({});
        setSuccessMessage('');
        setErrorMessage('');
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setFormData({
            nome: '',
            matricula: '',
            data_admissao: new Date().toISOString().split('T')[0],
            senha: '',
            confirmarSenha: '',
            role: 'BOLSISTA'
        });
        setFormErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.nome.trim()) {
            errors.nome = 'Nome é obrigatório';
        }

        if (!formData.matricula.trim()) {
            errors.matricula = 'Matrícula é obrigatória';
        }

        if (!formData.data_admissao) {
            errors.data_admissao = 'Data de admissão é obrigatória';
        }

        if (!formData.senha) {
            errors.senha = 'Senha é obrigatória';
        } else if (formData.senha.length < 6) {
            errors.senha = 'Senha deve ter no mínimo 6 caracteres';
        }

        if (!formData.confirmarSenha) {
            errors.confirmarSenha = 'Confirme a senha';
        } else if (formData.senha !== formData.confirmarSenha) {
            errors.confirmarSenha = 'As senhas não coincidem';
        }

        if (!formData.role) {
            errors.role = 'Selecione um tipo de conta';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const dataToSend = {
                nome: formData.nome.trim(),
                matricula: formData.matricula.trim(),
                data_admissao: formData.data_admissao,
                senha: formData.senha,
                role: formData.role
            };

            await createColaborador(dataToSend);
            setSuccessMessage('Colaborador criado com sucesso!');

            // Reload collaborators list
            await loadCollaborators();

            // Close modal after a short delay
            setTimeout(() => {
                closeCreateModal();
            }, 1500);
        } catch (error) {
            console.error('Erro ao criar colaborador:', error);
            const errorMsg = error.response?.data?.message || 'Erro ao criar colaborador. Verifique se a matrícula já não está cadastrada.';
            setErrorMessage(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const openDeleteModal = (collaborator) => {
        setCollaboratorToDelete(collaborator);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setCollaboratorToDelete(null);
    };

    const handleDelete = async () => {
        if (!collaboratorToDelete) return;

        setDeleting(true);
        try {
            await deleteColaborador(collaboratorToDelete.idBolsista);
            setSuccessMessage('Colaborador excluído com sucesso!');
            await loadCollaborators();
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            closeDeleteModal();
        } catch (error) {
            console.error('Erro ao excluir colaborador:', error);
            const errorMsg = error.response?.data?.message || 'Erro ao excluir colaborador.';
            setErrorMessage(errorMsg);
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
        } finally {
            setDeleting(false);
        }
    };

    // Separate collaborators by role
    const admins = collaborators.filter(c => c.role?.toUpperCase() === 'ADMIN');
    const bolsistas = collaborators.filter(c => c.role?.toUpperCase() === 'BOLSISTA');

    return (
        <div className={styles.collaboratorsContainer}>
            <header className={styles.mainHeader}>
                <h1 className={styles.headerTitle}>Colaboradores Cadastrados</h1>
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

            <nav className={styles.subNav}>
                <Link to="/admin">Gerenciar Atendimentos</Link>
                <Link to="/relatorio">Relatório</Link>
                <Link to="/colaboradores" className={styles.active}>Colaboradores</Link>
            </nav>

            <main className={styles.content}>
                {(successMessage || errorMessage) && (
                    <div className={styles.messageContainer}>
                        {successMessage && (
                            <div className={styles.successMessage}>
                                <span className="material-symbols-outlined">check_circle</span>
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className={styles.errorMessage}>
                                <span className="material-symbols-outlined">error</span>
                                {errorMessage}
                            </div>
                        )}
                    </div>
                )}

                <div className={styles.actionBar}>
                    <button className={styles.createButton} onClick={openCreateModal}>
                        <span className="material-symbols-outlined">add_circle</span>
                        Novo Colaborador
                    </button>
                </div>

                {loading ? (
                    <div className={styles.loading}>Carregando...</div>
                ) : (
                    <>
                        {/* ADMIN Section */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span className="material-symbols-outlined">admin_panel_settings</span>
                                Administradores ({admins.length})
                            </h2>
                            {admins.length === 0 ? (
                                <p className={styles.emptyMessage}>Nenhum administrador cadastrado.</p>
                            ) : (
                                <div className={styles.cardsGrid}>
                                    {admins.map((admin) => (
                                        <div key={admin.idBolsista} className={`${styles.card} ${styles.cardAdmin}`}>
                                            <div className={styles.cardHeader}>
                                                <span className="material-symbols-outlined">person</span>
                                                <span className={styles.role}>ADMIN</span>
                                            </div>
                                            <div className={styles.cardBody}>
                                                <h3>{admin.nome}</h3>
                                                <p><strong>Matrícula:</strong> {admin.matricula}</p>
                                                <p><strong>Data de Admissão:</strong> {formatDate(admin.data_admissao)}</p>
                                                {admin.data_saida && (
                                                    <p className={styles.exitDate}>
                                                        <strong>Data de Saída:</strong> {formatDate(admin.data_saida)}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={styles.cardActions}>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => openDeleteModal(admin)}
                                                    title="Excluir colaborador"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* BOLSISTA Section */}
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <span className="material-symbols-outlined">school</span>
                                Bolsistas ({bolsistas.length})
                            </h2>
                            {bolsistas.length === 0 ? (
                                <p className={styles.emptyMessage}>Nenhum bolsista cadastrado.</p>
                            ) : (
                                <div className={styles.cardsGrid}>
                                    {bolsistas.map((bolsista) => (
                                        <div key={bolsista.idBolsista} className={`${styles.card} ${styles.cardBolsista}`}>
                                            <div className={styles.cardHeader}>
                                                <span className="material-symbols-outlined">person</span>
                                                <span className={styles.role}>BOLSISTA</span>
                                            </div>
                                            <div className={styles.cardBody}>
                                                <h3>{bolsista.nome}</h3>
                                                <p><strong>Matrícula:</strong> {bolsista.matricula}</p>
                                                <p><strong>Data de Admissão:</strong> {formatDate(bolsista.data_admissao)}</p>
                                                {bolsista.data_saida && (
                                                    <p className={styles.exitDate}>
                                                        <strong>Data de Saída:</strong> {formatDate(bolsista.data_saida)}
                                                    </p>
                                                )}
                                            </div>
                                            <div className={styles.cardActions}>
                                                <button
                                                    className={styles.deleteButton}
                                                    onClick={() => openDeleteModal(bolsista)}
                                                    title="Excluir colaborador"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>

            {/* Create Collaborator Modal */}
            {showCreateModal && (
                <div className={styles.modalOverlay} onClick={closeCreateModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Criar Novo Colaborador</h2>
                            <button className={styles.closeButton} onClick={closeCreateModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="nome">Nome Completo *</label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleInputChange}
                                    className={formErrors.nome ? styles.inputError : ''}
                                />
                                {formErrors.nome && <span className={styles.errorText}>{formErrors.nome}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="matricula">Matrícula *</label>
                                <input
                                    type="text"
                                    id="matricula"
                                    name="matricula"
                                    value={formData.matricula}
                                    onChange={handleInputChange}
                                    className={formErrors.matricula ? styles.inputError : ''}
                                />
                                {formErrors.matricula && <span className={styles.errorText}>{formErrors.matricula}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="data_admissao">Data de Admissão *</label>
                                <input
                                    type="date"
                                    id="data_admissao"
                                    name="data_admissao"
                                    value={formData.data_admissao}
                                    onChange={handleInputChange}
                                    className={formErrors.data_admissao ? styles.inputError : ''}
                                />
                                {formErrors.data_admissao && <span className={styles.errorText}>{formErrors.data_admissao}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="role">Tipo de Conta *</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className={formErrors.role ? styles.inputError : ''}
                                >
                                    <option value="BOLSISTA">Bolsista</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                                {formErrors.role && <span className={styles.errorText}>{formErrors.role}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="senha">Senha *</label>
                                <input
                                    type="password"
                                    id="senha"
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    className={formErrors.senha ? styles.inputError : ''}
                                    placeholder="Mínimo 6 caracteres"
                                />
                                {formErrors.senha && <span className={styles.errorText}>{formErrors.senha}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="confirmarSenha">Confirmar Senha *</label>
                                <input
                                    type="password"
                                    id="confirmarSenha"
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleInputChange}
                                    className={formErrors.confirmarSenha ? styles.inputError : ''}
                                />
                                {formErrors.confirmarSenha && <span className={styles.errorText}>{formErrors.confirmarSenha}</span>}
                            </div>

                            {errorMessage && (
                                <div className={styles.errorMessage}>
                                    <span className="material-symbols-outlined">error</span>
                                    {errorMessage}
                                </div>
                            )}

                            {successMessage && (
                                <div className={styles.successMessage}>
                                    <span className="material-symbols-outlined">check_circle</span>
                                    {successMessage}
                                </div>
                            )}

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={closeCreateModal}
                                    className={styles.cancelButton}
                                    disabled={submitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Criando...' : 'Criar Colaborador'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && collaboratorToDelete && (
                <div className={styles.modalOverlay} onClick={closeDeleteModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Confirmar Exclusão</h2>
                            <button className={styles.closeButton} onClick={closeDeleteModal}>
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className={styles.deleteModalBody}>
                            <div className={styles.warningIcon}>
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <p className={styles.deleteMessage}>
                                Tem certeza que deseja excluir a conta do colaborador <strong>{collaboratorToDelete.nome}</strong>?
                            </p>
                            <p className={styles.deleteSubMessage}>
                                <strong>Matrícula:</strong> {collaboratorToDelete.matricula}
                            </p>
                            <p className={styles.deleteWarning}>
                                Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                onClick={closeDeleteModal}
                                className={styles.cancelButton}
                                disabled={deleting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className={styles.deleteConfirmButton}
                                disabled={deleting}
                            >
                                {deleting ? 'Excluindo...' : 'Excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Collaborators;
