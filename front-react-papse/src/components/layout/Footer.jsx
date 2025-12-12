import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <p>
                Projeto desenvolvido pelo FAPSI em conjunto com<br />
                a FACSI da Universidade Federal do Sul e Sudeste do Pará
            </p>
        </footer>
    );
};

export default Footer;
