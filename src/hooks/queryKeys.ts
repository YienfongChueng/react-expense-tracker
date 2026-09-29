import type { RecordsParams } from '@/types/record'

export const recordKeys = {
    all: ['record'] as const,
    lists: ()=> [...recordKeys.all,'list'] as const,
    list: (params: RecordsParams)=> [...recordKeys.lists(),params] as const,
    details: ()=> [...recordKeys.all,'detail'] as const,
    detail: (id:string) => [...recordKeys.details(),id] as const
}