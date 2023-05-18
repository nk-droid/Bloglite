export const PostGetService = async (username, post_id) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/post/${post_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return await res.json()
}

export const PostDeleteService = async (username, post_id) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/post/${post_id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem("authentication_token")
        }
    })
    return await res.json()
}

export const PostArchiveSwitchService = async (username, post_id) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/post/${post_id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem("authentication_token")
        }
    })
    return await res.json()
}

export const PostUpdateService = async (username, post_id, data) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/post/${post_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem("authentication_token")
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}

export const AddPosts = async (username,formdata) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/import/posts`, {
        method: 'POST',
        headers: {
            'Authentication-Token': localStorage.getItem("authentication_token")
        },
        body: formdata
    })
    return await res.json()
}