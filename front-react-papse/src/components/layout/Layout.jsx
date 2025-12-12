import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';

const Layout = ({ children, showFooter = true, headerVariant = 'default' }) => {
    return (
        <div className={styles.layoutContainer}>
            <Header variant={headerVariant} />
            <main className={styles.mainContent}>{children}</main>
            {showFooter && <Footer />}
        </div>
    );
};

export default Layout;
