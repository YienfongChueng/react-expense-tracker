import { Form, Input, Button, Image } from 'antd-mobile'
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons'
import { useState } from 'react'
import styles from './index.module.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/auth'

interface FormState {
   username:'string',
   password:'string'
  }
function LoginPage() {
    const [visible, setVisible] = useState(false)
    const [loading,setLoading] = useState(false)
    const [form] = Form.useForm<FormState>()
    const location = useLocation()
    const navigation = useNavigate()
    const { login } = useAuth()

    const onSubmit = (values: FormState) => {
        setLoading(true)
        login(values.username,values.password).then(res => {
            if(res) {
                // 未登录访问 /stats 被踢过来，登录后要回 /stats）
                console.log("--",location.state)
                navigation(location.state?.from ?? '/')
            }
        }).finally(()=> {
            setLoading(false)
        })

    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.logo}>
                <Image 
                    width={100}
                    height={100}
                    fit='cover'
                    style={{ borderRadius: 50 }}
                    src='https://images.unsplash.com/photo-1567945716310-4745a6b7844b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=60' />
            </div>
            <div className={styles.formWrap}>
                <Form 
                    requiredMarkStyle='asterisk' 
                    layout='horizontal'
                    onFinish={onSubmit} 
                    form={form}
                    footer={
                        <Button block type='submit' color='primary' size='large' loading={loading}>
                            登  录
                        </Button>}
                >
                    <Form.Item name='username' label='用户名' rules={[{ required: true }]}>
                        <Input placeholder='请输入用户名' />
                    </Form.Item>
                    <Form.Item name='password'  label='密码' 
                        rules={[{ required: true }]}
                        extra={
                            <div className={styles.eye}>
                            {!visible ? (
                                <EyeInvisibleOutline onClick={() => setVisible(true)} />
                            ) : (
                                <EyeOutline onClick={() => setVisible(false)} />
                            )}
                            </div>
                        }>
                        <Input placeholder='请输入密码' type={visible ? 'text' : 'password'} />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default LoginPage