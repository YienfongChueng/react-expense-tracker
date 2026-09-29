import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query'
import {getRecords,getRecordById,createRecord,updateRecord,deleteRecord} from '@/api/records'
import type { RecordItem,NewRecord,RecordsParams} from '@/types/record'
import {recordKeys} from '@/hooks/queryKeys'

export function invalidateRecordLists() {
    const queryClient = useQueryClient()
    queryClient.invalidateQueries({
        queryKey:recordKeys.lists()
    })
}

export function useRecords(params:RecordsParams) {
    return useQuery({
        queryKey: recordKeys.list(params),
        queryFn: ()=> getRecords(params)
    })
}

export function useRecord(id: string) {
    return useQuery({
        queryKey: recordKeys.detail(id),
        queryFn: ()=> getRecordById(id),
        enabled: !!id
    })
}

export function useSaveUpdateRecord() {
    const queryClient = useQueryClient()
    return useMutation({
        // 带花括号 = 需要显式 return，不带 = 隐式返回表达式值
        mutationFn: (payload: NewRecord & {id?:string}) => {
            return payload.id != null 
                ? updateRecord(payload as RecordItem) // 返回 Promise<RecordItem>
                : createRecord(payload) // 返回 Promise<NewRecord>
        },
        onSuccess: (_,{id}) => {
            queryClient.invalidateQueries({queryKey: recordKeys.lists()})
            if(id != null) {
                queryClient.invalidateQueries({queryKey: recordKeys.detail(id)})
            }
        }
    })
}

export function useDeleteRecord() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id:string) => deleteRecord(id),
        onSuccess: (_,id) => {
            queryClient.removeQueries({
                queryKey:recordKeys.detail(id),
              })
        
              queryClient.invalidateQueries({
                queryKey: recordKeys.lists(),
              })
        }
    })
}