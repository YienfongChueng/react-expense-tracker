import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import { useAuth } from '@/context/auth';
import { Suspense } from 'react';
import { DotLoading } from 'antd-mobile'

const Loading = () => {
  return (
    <span style={{ fontSize: 24,color: '#00b578' }}>
      <DotLoading color='currentColor' />
    </span>
  )
}

const Layout = () => {
  const {logout} = useAuth()
  const navigation = useNavigate()
  const handleLogout = ()=> {
    logout()
    navigation('/login')
  }
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
          <NavLink 
            to="/stats" 
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }>分析</NavLink>
          <NavLink to='' className={styles.navLink} onClick={handleLogout} replace>登出</NavLink>
        </nav>
      </header>

      <main>
        <Suspense fallback={<Loading/>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default Layout;