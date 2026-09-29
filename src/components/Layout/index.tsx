import { NavLink, Outlet } from 'react-router-dom';
import styles from './index.module.scss';

const Layout = () => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.brand}>💰 记账本</div>

        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            账目
          </NavLink>

          <NavLink
            to="/add"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            记一笔
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;