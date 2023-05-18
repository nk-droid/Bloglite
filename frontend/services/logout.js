export const LogoutService = async () => {
    const response = await fetch("http://127.0.0.1:5000/api/logout", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem("authentication_token")
        }
    })
    return await response.json()
}