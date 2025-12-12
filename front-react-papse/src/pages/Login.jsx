import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeaderMenu from '../components/shared/HeaderMenu';
import styles from './Login.module.css';

const Login = () => {
    const { register, handleSubmit } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const success = await login(data.matricula, data.senha);
        if (success) {
            // Redirect based on local storage role or just default to admin/bolsista
            // Since we don't have role immediately from `success` boolean, we can modify login to return role or assume logic
            // But context sets user, so we can check user role in useEffect or simply rely on navigation
            const userStr = localStorage.getItem('papse_user');
            if (userStr) {
                const user = JSON.parse(userStr);
                if (user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/bolsista');
                }
            }
        } else {
            alert('Falha no login. Verifique sua matrícula e senha.');
        }
    };

    return (
        <div className={styles.loginWrapper}>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 100 }}>
                <HeaderMenu />
            </div>
            <section className={styles.loginSection}>
                <div className={styles.loginCard}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="matricula">Matrícula</label>
                            <div className={styles.inputWrapper}>
                                <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                                <input
                                    type="text"
                                    id="matricula"
                                    placeholder="Digite sua matrícula"
                                    {...register('matricula', { required: true })}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="senha">Senha</label>
                            <div className={styles.inputWrapper}>
                                <svg className={styles.inputIcon} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    type="password"
                                    id="senha"
                                    placeholder="Digite sua senha"
                                    {...register('senha', { required: true })}
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.submitBtn}>ENTRAR</button>
                    </form>
                </div>
            </section>

            <section className={styles.infoSection}>
                <div className={styles.infoContent}>
                    <p>Usuários não vinculados como bolsistas ou administradores do projeto <strong>não</strong> devem utilizar este login!</p>
                    <img src="/assets/images/illustration-login.svg" alt="Ilustração de uma pessoa estressada" />
                </div>
            </section>
        </div>
    );
};

export default Login;
