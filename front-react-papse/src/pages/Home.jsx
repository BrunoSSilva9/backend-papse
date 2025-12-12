import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();

    const handleNavigateToForm = () => {
        navigate('/formulario');
    };

    return (
        <Layout>
            <div className={styles.conteudoPagina}>
                <div className={styles.conteudoGrid}>
                    <div className={styles.textoConteudo}>
                        <h1>Programa de Acompanhamento<br />Psicológico Estudantil</h1>
                        <h3>Precisa de acompanhamento psicológico?</h3>
                        <button type="button" className={styles.botaoHome} onClick={handleNavigateToForm}>
                            CLIQUE AQUI
                        </button>
                    </div>

                    <img src="/assets/images/img_01.png" alt="PAPSE" className={styles.imgPapse} />
                </div>
            </div>
        </Layout>
    );
};

export default Home;
