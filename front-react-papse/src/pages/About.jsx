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
                        O Programa de Acompanhamento Psicológico Estudantil (PAPSE) teve início em 2019 e foi criado com intuito de promover atendimento psicológico aos estudantes da Unifesspa. Estes atendimentos são feitos por discentes regularmente matriculados no Curso de Psicologia, com supervisão clínica, tendo como base a Teoria Psicanalítica. As sessões normalmente acontecem uma vez por semana, de forma
                        presencial ou remota. As inscrições são realizadas pelo e-mail agendapsico@unifesspa.edu.br. Os principais objetivos do programa são: atender à demanda de atendimentos psicológicos de discentes da Unifesspa; oferecer supervisão clínica, colaborando na formação dos discentes de Psicologia selecionados no Programa;
                        e contribuir para redução da taxa de evasão/retenção entre os discentes da Unifesspa, ocasionadas por problemas psicológicos. O grupo está atualmente composto por seis discentes bolsistas, quatro discentes voluntárias, uma técnica colaboradora e uma supervisora, docente na mesma faculdade (FAPSI). No ano de 2024, já foram atendidos 96 discentes. Contudo, desde o início do programa, mais de 300 estudantes de diversos cursos da Unifesspa já se beneficiaram.  O PAPSE também oferece um atendimento de protocolo, em que são realizadas até cinco sessões, das quais, após serem concluídas, quem desejar segue aguardando disponibilidade de vaga para atendimento regular na fila de espera.
                    </p>
                </main>
            </div>
        </Layout>
    );
};

export default About;
