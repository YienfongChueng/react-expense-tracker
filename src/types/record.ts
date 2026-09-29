export type RecordType = 'expense' | 'income'

export interface RecordItem {
  id: string
  type: RecordType
  amount: number
  category: string
  note: string
  date: string
}

// 新增：提交的输入【没有 id】，id 由服务器生成后返回
export type NewRecord = Omit<RecordItem,'id'>

// 查询条件
export type RecordsParams = {
    type?: RecordType,
    date?: string | null
}

// export interface PageResult<T> {
//   list: T[]

//   total: number

//   page: number

//   pageSize: number
// }