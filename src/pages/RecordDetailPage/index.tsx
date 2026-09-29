import { useQuery,useQueryClient,useMutation } from "@tanstack/react-query";
import type { RecordItem } from '@/types/record'
import { Card,Button,ErrorBlock,SpinLoading, Space,Toast,Dialog } from "antd-mobile";
import { useNavigate, useParams } from "react-router-dom";
import { getRecordById,deleteRecord } from '@/api/records'
import styles from './index.module.scss'
import {useRecord,useDeleteRecord,invalidateRecordLists} from '@/hooks/useRecords'

function RecordDetailPage() {
    // const queryClient = useQueryClient()
    const params = useParams()
    const {data, isLoading,error} = useRecord(params.id!)

    const navigate = useNavigate()
    const handleBack = () => {
        navigate('/')
    }
   
    const toEditPage = () => {
        navigate(`/edit/${params.id}`)
    }

    // DELETE请求删除资源
    const mutation = useDeleteRecord()

    const handleDel = () => {
        Dialog.confirm({
            content: '确定要删除该账单？',
            cancelText:'取消',
            confirmText: '确定',
        }).then(res => {
            if(res) {
                mutation.mutate(params.id!,{
                    onSuccess: () => {
                        Toast.show({ icon: 'success', content: '删除成功' })
                        navigate('/', { replace: true })  // 详情已删，用 replace 不留垃圾历史记录
                    },
                    onError:()=> {
                        Toast.show({content:'删除失败，请重试'})
                    }
                })
            }
        })
    }

   

    if(!params.id) return <div className={styles.loading}><Button block color='primary' size='large' onClick={handleBack}>返回</Button></div>
    if (isLoading) return <div className={styles.loading}><SpinLoading  color='primary' /></div>
    if (error) return (
        <ErrorBlock
            image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
            style={{'--image-height': '150px',}}
            description={
            <span>{error.message}</span>
            }
        >
            <Button color='primary' onClick={() => invalidateRecordLists()}>重试</Button>
        </ErrorBlock>
    )

    return (
        <Card title='账单详情' className={styles.card}>
          <div>
            <div className={styles.item}>
                <span className={styles.label}>金额：</span>
                <span className={styles.value}>{data?.type === 'expense' ? '-¥' : '+¥'}{data?.amount}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>分类：</span>
                <span className={styles.value}>{data?.category}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>备注：</span>
                <span className={styles.value}>{data?.note}</span>
            </div>
            <div className={styles.item}>
                <span className={styles.label}>日期：</span>
                <span className={styles.value}>{data?.date}</span>
            </div>
          </div>
          <Space direction='vertical' block>
            <Button block color='primary' size='large' onClick={handleBack}>返回</Button>
            <Button block color='danger' size='large' 
                onClick={handleDel}
                loading={mutation.isPending} 
                disabled={mutation.isPending}>{mutation.isPending?'删除中...': '删除'}</Button>
            <Button block color='success' size='large' onClick={toEditPage}>编辑</Button>
          </Space>
        </Card>
    )
}

export default RecordDetailPage