import { LoginService } from "../services/login.js"
import { LogoutService } from "../services/logout.js"

const login = (context, LoginData) => {
    LoginService(LoginData).then(resJson=>context.commit('LoginState',{'user':resJson.response.user}))
}

const logout = (context) => {
    LogoutService().then(resJson=>context.commit('LogoutState'))
}

export default {
    login,
    logout
}