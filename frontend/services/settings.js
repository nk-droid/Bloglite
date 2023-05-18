export const GetSettingsService = async (username) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/settings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem("authentication_token")
        }
    })
    return await res.json()
}

export const UpdateSettingsService = async (username, formdata) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/settings`, {
        method: 'PATCH',
        headers: {
            'Authentication-Token': localStorage.getItem("authentication_token")
        },
        body: formdata
    })
    return await res.json()
}