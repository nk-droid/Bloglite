export const RemoveFollowersService = async (username, follower) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/remove/${follower}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem("authentication_token")
        }
    })
    return await res.json()
}

export const GetFollowersService = async (username) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/followers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await res.json()
}