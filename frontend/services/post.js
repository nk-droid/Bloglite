export const PostService = async (formdata) => {
    const res = await fetch("http://127.0.0.1:5000/api/post", {
        method: 'POST',
        headers: {
            'Authentication-Token': localStorage.getItem("authentication_token")
        },
        body: formdata
    })
    return await res.json()
}