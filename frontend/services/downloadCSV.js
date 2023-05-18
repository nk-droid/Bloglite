export const DownloadSampleCSV = async (username) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/import/posts`, {
        method: 'GET',
        headers: {
            'Authentication-Token': localStorage.getItem("authentication_token")
        },
    })
    return await res.arrayBuffer()
}