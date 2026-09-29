import AddOrEditForm from '@/components/AddOrEditForm'
import { useParams } from "react-router-dom";
import { SpinLoading } from "antd-mobile";
import { useRecord } from '@/hooks/useRecords'

export default function EditRecordFormPage() {
    const params = useParams()
    const { data} = useRecord(params.id!)
    

    if (!data) return <div><SpinLoading color='primary'/></div>  // 数据没到：转圈
    return <AddOrEditForm record={data}/>   // 数据到了：带值挂载表单
    
        
}