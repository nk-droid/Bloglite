export const SearchService = async (data) => {
    const res = await fetch("http://127.0.0.1:5000/api/search", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await res.json()
}