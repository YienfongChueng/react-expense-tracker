import styles from './index.module.scss'
import type { RecordItem, RecordType } from '@/types/record'
import { Button, ErrorBlock,List,SpinLoading,Segmented,DatePicker,Empty, type SegmentedValue } from 'antd-mobile'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import type { PickerDate } from 'antd-mobile/es/components/date-picker/util'
import dayjs from 'dayjs'
import { CloseOutline} from 'antd-mobile-icons'
import { useRecords,invalidateRecordLists } from '@/hooks/useRecords'

function RecordsPage() {
    const [visible,setVisible] = useState(false)
    const [searchParams,setSearchParams] = useSearchParams()

    const typeParam = searchParams.get('type')
    const type: RecordType | undefined = typeParam === 'expense' || typeParam === 'income' ? typeParam : undefined
    const date = searchParams.get('date')

    const { data: records, isLoading,error,isSuccess } = useRecords({type,date})

    const navigate = useNavigate()
    const handleRowClick = (row: RecordItem) => {
        navigate(`/record/${row.id}`)
    }

    const handleChange = (v:SegmentedValue) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            if(v === '') {
                next.delete('type')
            } else {
                next.set('type',v as string)
            }
            return next
        })
    }

    const handleOnConfirm = (v: PickerDate) => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            next.set('date',dayjs(v).format('YYYY-MM'))
            return next
        })
    }
    const resetDate = () => {
        setSearchParams(prev => {
            const next = new URLSearchParams(prev)
            next.delete('date')
            return next
        })
    }
    if (isLoading) return <div className={styles.loading}><SpinLoading  color='primary' /></div>
    if (error) return (
        <ErrorBlock
            image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
            style={{'--image-height': '150px',}}
            description={
            <span>{error.message}</span>
            }
        >
            <Button color='primary' onClick={() => invalidateRecordLists() }>重试</Button>
        </ErrorBlock>
    )
   
    const FilterRender =  (
            <div className={styles.filter_wrap}>
                <Segmented
                    block
                    className={styles.my_segmented}
                    value={type ?? ''}
                    options={[
                        { label: '全部', value: '',},
                        { label: '支出', value: 'expense',},
                        { label: '收入', value: 'income',},
                    ]}
                    onChange={(v) => handleChange(v)}
                />
                <Button size='small' className={styles.date_btn} onClick={()=> setVisible(true)}>{date ? date : '按月查询'}</Button>
                {date && <CloseOutline onClick={resetDate} />}
                <DatePicker
                    visible={visible}
                    precision='month'
                    onClose={() => {  setVisible(false)}}
                    onConfirm={val => handleOnConfirm(val)}
                />
            </div>
        )
    if(isSuccess && records.length === 0) {
        return (
            <>
                {FilterRender}
                <Empty
                    style={{ padding: '64px 0' }}
                    imageStyle={{ width: 128 }}
                    description='暂无数据'
                />
            </>
        
        )
    }
    return (
        <div className={styles.list}>
            {FilterRender}
            <List header='账单列表'>
                {records?.map((record) => (
                    <List.Item 
                        key={record.id} 
                        arrowIcon={false}>
                        <div 
                            onClick={()=> handleRowClick(record)}
                            className={[styles.recordItem, record.type === 'expense' ? styles.expense : styles.income].join(' ')}>
                            <span>{record.type === 'expense' ? '-¥' : '+¥'}{record.amount}</span>
                            <span>{record.category}</span>
                            <span>{record.note}</span>
                            <span>{record.date}</span>
                        </div>
                    </List.Item>
                ))}
            </List>
        </div>
    )
}

export default RecordsPage  