import Layout from '@/components/Layout';
import { Routes,Route, useLocation, Navigate } from 'react-router-dom';
import {type ReactNode,lazy} from 'react'

import LoginPage from '@/pages/LoginPage'

import { useAuth } from '@/context/auth';

const RecordsPage = lazy(() => import('@/pages/RecordsPage'))
const AddRecordPage = lazy(() => import('@/pages/AddRecordFormPage'))
const EditRecordPage = lazy(() => import('@/pages/EditRecordFormPage'))
const RecordDetailPage = lazy(() => import('@/pages/RecordDetailPage'))
const StatisticsPage = lazy(() => import('@/pages/StatisticsPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const RequireAuth = ({children}: {children:ReactNode}) => {
  const {token} = useAuth()
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" replace state={{from:location.pathname}} />;
  }
  return children;
};



function createRoutes() {
  return (
    <>
        <Route path='login' element={<LoginPage/>} />
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={<RecordsPage />} />
            <Route path="stats" element={<StatisticsPage />}></Route>
            <Route path="record/:id" element={<RecordDetailPage/>} />
            <Route path="add" element={<AddRecordPage />} />
            <Route path="edit/:id" element={<EditRecordPage/>} />
            <Route path="*" element={<NotFoundPage/>}></Route>
        </Route>
    </>
    )
}

function App() {
  return (
    <Routes>
      {createRoutes()}
    </Routes>
  )
}

export default App; 