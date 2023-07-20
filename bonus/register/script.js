if (localStorage.getItem('token')) {
    window.location = '/workflow'
}

function register(credentials, callback) {
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => {
        console.error(error)
        callback(undefined)
    })
}

function setError(message)
{
    const desc = document.getElementById('description')
    desc.style.visibility = 'visible'
    desc.innerHTML = message
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('register').addEventListener('click', () => {
        let credentials = new Object()

        for (let input of [ 'name', 'firstname', 'email', 'password' ]) {
            credentials[input] = document.getElementById(input).value
            if (credentials[input] == '') {
                setError('Fill all fields first')
                return
            }
        }
        register(credentials, (data) => {
            console.log(data)
            if (data && 'token' in data) {
                localStorage.setItem('token', data.token)
                window.location = '/workflow'
            } else {
                setError('The username or email already exist')
            }
        })
    })
})
