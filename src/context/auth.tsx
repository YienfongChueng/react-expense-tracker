import { createContext, useContext,useState,type ReactNode } from "react";
import {loginApi} from '@/api/user'

interface AuthContextType {
    token: string | null
    login: (username:string,password:string) => Promise<boolean>
    logout: ()=> void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({children}: {children:ReactNode}) {
     // TODO-1: 为什么套一层箭头？想不出来我下面讲
    const [token,setToken] = useState<string|null>(()=> localStorage.getItem('token'))

    const login = async(username:string,password:string):Promise<boolean> => {
      // TODO-2: 非空校验（空就 return false）
      if(username === '' || password === '') return false
      // TODO-3: 模拟 500ms 延迟——await new Promise(r => setTimeout(r, 500))
      const token = await loginApi({username,password})
      // TODO-4: 造假 token 'mock-' + Date.now()
      // TODO-5: 两处落盘——setToken(t) + localStorage.setItem('token', t)
      setToken(token)
      localStorage.setItem('token',token)
      // 最后 return true
      return true
    }
    const logout = ()=> {
        setToken(null)
        localStorage.removeItem('token')
    }

    return (
        <AuthContext.Provider value={{token,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const ctx = useContext(AuthContext)
    // TODO-7: ctx 可能是 null（组件不在 Provider 里时）——
    //         if (!ctx) throw new Error('必须在 AuthProvider 内使用')
    if(!ctx) throw new Error('必须在 AuthProvider 内使用')

    return ctx
}