import type { NewRecord, RecordItem } from '@/types/record';
import { type RefObject } from 'react'
import {
    Form,
    Input,
    Button,
    Radio,
    DatePicker,
    Toast,
    Space
  } from 'antd-mobile'
  import dayjs from 'dayjs'
  import type { DatePickerRef } from 'antd-mobile/es/components/date-picker'
  import { useNavigate } from "react-router-dom";
  import { useSaveUpdateRecord } from '@/hooks/useRecords';
  

   // 表单草稿的精确类型：type/date 默认填好，其余空串起步
  // 注意 amount 在表单阶段是字符串（input type=number 给的是 string），
  // 提交时才 Number() 转 number —— 所以草稿类型 ≠ RecordItem
  interface FormState {
    type: 'expense' | 'income',
    amount: string,
    category: string,
    note: string,
    date: Date
  }
  const EMPTY_FORM: FormState = {
    type: 'expense',
    amount: '',
    category: '',
    note: '',
    date: new Date(),
  }
 
  interface AddOrEditFormProps {
    record?: RecordItem | null
  }


function recordToFormState(record: RecordItem): FormState {
    return {
        type: record.type,
        amount: String(record.amount),
        category: record.category,
        note: record.note,
        date: dayjs(record.date).toDate(),
    }
}

export default function AddOrEditForm(_props: AddOrEditFormProps = {}) {
    const [form] = Form.useForm<FormState>()
    const record = _props.record
    const isEdit = record != null
    const INIT_FORM: FormState = isEdit ? recordToFormState(record) : EMPTY_FORM
    const submitBtnText = isEdit ? '保存' : '添加'

    const navigate = useNavigate()

    const saveUpdateMutation = useSaveUpdateRecord()
    
    const onSubmit = (values: FormState) => {
        const payload: NewRecord = {
            type: values.type,
            amount: Number(values.amount),   // string -> number 在这里一次性转
            category: values.category,
            note: values.note,
            date: dayjs(values.date).format('YYYY-MM-DD'),
        }
        saveUpdateMutation.mutate(
            isEdit ? { ...payload, id: record!.id } : payload,
            {
                onSuccess: () => {
                    Toast.show({ icon: 'success', content: isEdit ? '保存成功' : '新增成功' })
                    navigate('/', { replace: true })
                },
                onError: () => {
                    Toast.show({ content: isEdit ? '保存失败，请重试' : '新增失败，请重试' })
                },
            }
        )
    }
    
    return (
        <>
        <Form 
            onFinish={onSubmit} 
            form={form}
            initialValues={INIT_FORM}
            layout='horizontal'
            footer={
                <Button block type='submit' color='primary' size='large' loading={saveUpdateMutation.isPending} disabled={saveUpdateMutation.isPending}>
                    {saveUpdateMutation.isPending ? `${submitBtnText}中...` : submitBtnText}
                </Button>
                }
        >
            <Form.Header>{isEdit ? '编辑账单' : '记一笔'}</Form.Header>
            <Form.Item  name='amount' label='金额'>
                <Input type='number'  placeholder='请输入金额' />
            </Form.Item>
            <Form.Item  name='type' label='类型'>
                <Radio.Group >
                    <Space>
                        <Radio value='expense'>支出</Radio>
                        <Radio value='income'>收入</Radio>
                    </Space>
                </Radio.Group>
            </Form.Item>
            <Form.Item  name='category' label='分类'>
                <Input type='text'  placeholder='请输入分类' />
            </Form.Item>
            <Form.Item  name='note' label='备注'>
                <Input type='text' placeholder='请输入备注' />
            </Form.Item>
            <Form.Item name='date' label='日期'
                trigger='onConfirm'
                onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
                  datePickerRef.current?.open()
                }}>
                <DatePicker precision="day">
                    {value => value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期'}
                </DatePicker>
            </Form.Item>
        </Form>
        </>
    );
}