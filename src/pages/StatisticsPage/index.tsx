import { useRecords } from '@/hooks/useRecords'
import { useMemo } from 'react'
import { Grid,List } from 'antd-mobile'
import styles from './index.module.scss'

export default function StatisticsPage() {
    const { data: records } = useRecords({})
    const totalObj = useMemo(()=> {
        const acc = (records ?? []).reduce((sum,item) => {
            if(item.type === 'income') {
                sum.income += item.amount
            }else {
                sum.expense += item.amount
            }
            return sum
        },{income:0,expense:0})
        // 按支出分类统计
        const map = new Map<string,number>();
        for(const item of records??[]) {
            if(item.type !== 'expense') continue
            const old = map.get(item.category) ?? 0
            map.set(item.category, old + item.amount)
        }
        
        const byCategory = [...map.entries()]
        .map(([category,amount]) => ({category,amount}))
        .sort((a,b) => b.amount -a.amount)
        return {
            income: acc.income,
            expense: acc.expense,
            balance: acc.income - acc.expense,
            byCategory
        }
    },[records])

    

    return (
        <div>
            <h1>统计分析</h1>
            <Grid columns={3} gap={8}>
                <Grid.Item>
                    <div className={styles.card}>
                        <span className={styles.text}>收入</span>
                        <span className={[styles.value,styles.income].join(' ')}>{totalObj.income}</span>
                    </div>
                </Grid.Item>
                <Grid.Item>
                    <div className={styles.card}>
                        <span className={styles.text}>支出</span>
                        <span className={[styles.value,styles.expense].join(' ')}>{totalObj.expense}</span>
                    </div>
                </Grid.Item>
                <Grid.Item>
                    <div className={styles.card}>
                        <span className={styles.text}>结余</span>
                        <span className={styles.value}>{totalObj.balance}</span>
                    </div>
                </Grid.Item>
            </Grid>
            <List header='支出💰分类汇总'>
                {totalObj.byCategory.map((item) => (
                    <List.Item key={item.category} >
                        <div className={styles.list}>
                            <div className={styles.text}>{item.category}</div>
                            <div className={styles.value}>-{item.amount}</div>
                        </div>
                    </List.Item>
                ))}
            </List>

        </div>
    )
}