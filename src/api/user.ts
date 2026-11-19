import { client } from './client'

export async function loginApi(user: {username:string,password:string}) {
    await client.get(`/users?username=${user.username}&password=${user.password}`)
    return 'mock-' + Date.now()
}