function getUserProfile(callback) {
    fetch('/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => {
        console.error(error)
        callback(undefined)
    })
}

function getUserTodos(callback) {
    fetch('/user/todos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => {
        console.error(error)
        callback(undefined)
    })
}

function formatDate(dateString) {
    const dateObj = new Date(dateString);

    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hours = ("0" + dateObj.getHours()).slice(-2);
    const minutes = ("0" + dateObj.getMinutes()).slice(-2);

    return `${year}/${month}/${day} at ${hours}:${minutes}`;
}

function currentFormatDate() {
    const dateObj = new Date();

    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hours = ("0" + dateObj.getHours()).slice(-2);
    const minutes = ("0" + dateObj.getMinutes()).slice(-2);

    return `${year}/${month}/${day} at ${hours}:${minutes}`;
}

function createTaskDate(created_at) {

    const taskDate = document.createElement('div')
    taskDate.classList.add('task-date')
    taskDate.textContent = created_at

    return taskDate
}

function setError(message)
{
    const desc = document.getElementById('description')
    desc.style.visibility = 'visible'
    desc.innerHTML = message
}

function removeError() {
    const desc = document.getElementById('description')
    desc.style.visibility = 'hidden'
}

function createTaskBox(title, description, status) {
    const box = document.createElement('div')
    let tag = createTaskStateTag(status)
    box.classList.add('task')
    const taskTitle = document.createElement('b')
    taskTitle.style.textTransform = 'uppercase'
    taskTitle.textContent = title
    const taskDescription = document.createTextNode(description)
    box.appendChild(taskTitle)
    box.appendChild(document.createElement('br'))
    box.appendChild(taskDescription)
    box.appendChild(document.createElement('br'))
    box.appendChild(tag)
    return box
}

function createTaskStateTag(state) {
    const tag = document.createElement('div')

    tag.classList.add('tag')
    tag.classList.add(`tag-${state}`)
    tag.textContent = state
    return tag
}

function createTask(id, date, box) {
    const task = document.createElement('div')

    task.id = `task-${id}`
    task.appendChild(date)
    task.appendChild(box)
    return task
}

function cleanupInputValues() {
    document.getElementById('add-title').value = ''
    document.getElementById('add-description').value = ''
}

function closeAddForm(addForm) {
    addForm.style.display = 'none';
    removeError()
    cleanupInputValues()
}

function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const hours = ("0" + now.getHours()).slice(-2);
    const minutes = ("0" + now.getMinutes()).slice(-2);
    const seconds = ("0" + now.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function addUserTodo(data, callback) {
    fetch('/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => {
        console.error(error)
        callback(undefined)
    })
}

document.addEventListener('DOMContentLoaded', () => {
    let todoId = 0

    const todolist = document.getElementById('todolist')

    function addTask(title, description) {
        addUserTodo({
            title, description,
            due_time: getCurrentDateTime(),
            user_id: localStorage.getItem('id'),
            status: 'todo' }, results => {
            if (results) {
                let date = createTaskDate(currentFormatDate())
                let box = createTaskBox(title, description, results.status)
                let task = createTask(todoId, date, box)
                todolist.appendChild(task)
                todoId++
            }
        })
    }

    const progressBar = document.getElementById('progress-bar')

    if (!localStorage.getItem('token')) {
        window.location = '/login'
    } else {
        getUserProfile((profile) => {
            document.getElementById('profile-name').innerHTML = profile.name
            localStorage.setItem('id', profile.id)
        })

        getUserTodos((data) => {
            if (!data || !('todos' in data) || data.todos.length == 0) {
                return
            }
            for (let todo of data.todos) {
                let date = createTaskDate(formatDate(todo.created_at))
                let box = createTaskBox(todo.title, todo.description, todo.status)
                let task = createTask(todoId, date, box)
                todolist.appendChild(task)
                todoId++
            }
        })
    }

    const panel = document.getElementById('profile-panel')
    const panelStates = { false: 'none', true: 'block' }
    let state = false

    document.getElementById('profile-btn').addEventListener('click', () => {
        state = !state
        panel.style.display = panelStates[state]
    })

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token')
        localStorage.removeItem('id')
        window.location = '/'
    })

    const addForm = document.getElementById('add-form')

    document.getElementById('add').addEventListener('click', () => {
        addForm.style.display = 'block';
    })

    document.getElementById('cancel').addEventListener('click', () => {
        closeAddForm(addForm)
    })

    document.getElementById('continue').addEventListener('click', () => {
        const title = document.getElementById('add-title').value
        const description = document.getElementById('add-description').value

        if (title == '' || description == '') {
            setError('Fill all fields first')
            return
        }
        progressBar.classList.remove('progress-animation')
        progressBar.offsetWidth
        progressBar.classList.add('progress-animation')
        addTask(title, description, currentFormatDate())
        closeAddForm(addForm)
    })
})
