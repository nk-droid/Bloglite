export const ExportService = async (username) => {
    const res = await fetch(`http://127.0.0.1:5000/api/${username}/export/post`, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/csv',
            'Authentication-Token': localStorage.getItem("authentication_token")
        }
    })
    return await res.arrayBuffer()
}