const LoginState = (state, payload) => {
    state.username=payload.user.username
    state.profilepic=payload.user.profile_pic
    state.token=payload.user.authentication_token
    localStorage.setItem("authentication_token",payload.user.authentication_token)
    localStorage.setItem("ActiveUser", payload.user.username)
    localStorage.setItem("ProfilePic", payload.user.profile_pic)
}

const LogoutState = (state) => {
    state.username=null
    state.token=null
    state.profilepic=null
    localStorage.removeItem("authentication_token")
    localStorage.removeItem("ActiveUser")
    localStorage.removeItem("ProfilePic")
}

export default {
    LoginState,
    LogoutState
}