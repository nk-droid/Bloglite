export const FeedService = async () => {
    const res = await fetch(`http://127.0.0.1:5000/api/feed`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': localStorage.getItem("authentication_token")
        }
    })
    return await res.json()
}