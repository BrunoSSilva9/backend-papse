import Layout from '../components/layout/Layout';
import styles from './About.module.css';

const About = () => {
    return (
        <Layout showFooter={false}>
            <div className={styles.conteudoPagina}>
                <main className={styles.contentSobre}>
                    <h1 className={styles.tituloSobre}>
                        Programa de Acompanhamento<br />Psicológico Estudantil
                    </h1>

                    <div className={styles.fieldsAbout}>
                        <a href="#" className={styles.field1}>SOBRE O PAPSE</a>
                        <a href="#" className={styles.field2}>PAPSE NA UNIFESSPA</a>
                    </div>

                    <p className={styles.paragraphSobre}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget faucibus lectus, nec gravida eros. Sed vel fermentum leo, nec interdum eros.
                        Nullam vel suscipit ligula, at interdum leo. Etiam non tempus neque. Quisque molestie hendrerit massa ornare tristique.
                        Pellentesque molestie nisl felis. Morbi at molestie massa, non malesuada orci. Vestibulum iaculis condimentum nunc, eget pretium orci volutpat sed.
                        Fusce consequat orci eu pulvinar rhoncus.
                        Cras sit amet euismod elit. Mauris vestibulum sapien lobortis, posuere ante et, ultricies est. Phasellus ex metus, suscipit a enim id, commodo commodo arcu.
                        Pellentesque vitae nunc mi. Vivamus id tortor fermentum turpis faucibus porta eget vitae nunc. Maecenas ultricies tellus risus, sed luctus nunc luctus vitae.
                    </p>
                </main>
            </div>
        </Layout>
    );
};

export default About;
