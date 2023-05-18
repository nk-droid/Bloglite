export const SignUpService = async (SignUpData) => {
    const res = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SignUpData)
    })
    return  await res.json()
}