import { client } from './client'
import type {RecordItem,NewRecord,RecordsParams} from '@/types/record'

export const getRecords = async (params: RecordsParams): Promise<RecordItem[]> => {
    const response = await client.get('/records',{
        params: {
            type: params.type,
            // json-server@1.0.0-beta.15 支持 contains 操作符：date_contains=2026-09
            // 可匹配所有 2026-09-xx 的记录；axios 会自动忽略值为 null/undefined 的参数
            date_contains: params.date
           }
    })
    return response.data
}

export const createRecord = async (record: NewRecord): Promise<RecordItem> => {
    const response = await client.post('/records', record)
    return response.data
}

export const updateRecord = async (record: RecordItem): Promise<RecordItem> => {
    const response = await client.put(`/records/${record.id}`, record)
    return response.data
}

export const deleteRecord = async (id: string): Promise<void> => {
    await client.delete(`/records/${id}`)
}

export const getRecordById = async (id: string): Promise<RecordItem> => {
    const response = await client.get(`/records/${id}`)
    return response.data
}