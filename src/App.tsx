import Layout from '@/components/Layout';
import { Routes,Route } from 'react-router-dom';
import RecordsPage from '@/pages/RecordsPage'
import AddRecordPage from '@/pages/AddRecordFormPage'
import EditRecordPage from '@/pages/EditRecordFormPage'
import RecordDetailPage from './pages/RecordDetailPage';
import NotFoundPage from './pages/NotFoundPage'

function createRoutes() {
  return (
    <>
      <Route path="/" element={<Layout />}>
        <Route index element={<RecordsPage />} />
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