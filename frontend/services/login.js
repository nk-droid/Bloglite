export const LoginService = async (LoginData) => {
    const response = await fetch('http://127.0.0.1:5000/login?include_auth_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(LoginData),
    })
    return await response.json()
}
