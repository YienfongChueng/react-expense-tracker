import { ErrorBlock,Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
export default function NotFoundPage() {
    const navigation = useNavigate()
    
    return (
    <>
    <ErrorBlock status='busy'>
        <Button color='primary' onClick={()=> navigation('/')}>回首页</Button>
    </ErrorBlock>
    </>
    )
    
}