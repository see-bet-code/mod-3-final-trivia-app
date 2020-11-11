const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple'
const API_CAT_URL = 'https://opentdb.com/api_category.php'

const BASE_URL = 'http://localhost:3000/api/v1'
const SESSIONS_URL = `${BASE_URL}/sessions`
const USERS_URL = `${BASE_URL}/users`

let current_user = null
let current_session = null
// in form create game and fetch (dynamic url based on form input)
fetch(API_URL)
.then(r => r.json())
.then(console.log)

// might be part of helper for setting up category buttons
fetch(API_CAT_URL)
.then(r => r.json())
.then(console.log)

//start game helper function
//  another container pops up with first question
//  on click display next question and update user points
//  after last question, display right answers(????) and 
//      user points for game (might be a fetch here to user database to update points)

// create button container for all categories/difficulty or random (same form)
// function
    // default buttons are random or optional selection to start game
    // url = BASE_URL
    // if catID
    //      url += `&category=${catId}`
    // if difficultyId
    //      url += `&difficulty=${difficultyID}`
    //  fetch(url)
    //  .then(r.json)
    //  .then(helper func to start)

//signup
function signUp(){
    const modal = document.getElementById('id01')
    modal.style.display='initial'
    const signupForm = modal.querySelector('form')
    console.log(signupForm)
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault()
        fetch (USERS_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify( {
                user: {
                    username: e.target.username.value,
                    password: e.target.password.value,
                    password_confirmation: e.target.passwordConfirmation.value
                } 
            })
        })
        .then(r => r.json())
        .then(console.log)
    })
}

function switchToLogout() {
    const loginBtn = loginForm.querySelector('button')
    loginBtn.style.display = "none"
    const logoutBtn = loginForm.querySelector('button.logout')
    logoutBtn.style.display = "initial"
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault()
        fetch(`${BASE_URL}/sessions/${current_user.id}`, {
            method: 'delete'
        })
        .then(r => r.json())
        .then(j => {
            console.log(j)
            loginBtn.style.display = "initial"
            logoutBtn.style.display = "none"
            loginForm.reset()
        })
    })

}
function login(e){
    e.preventDefault()
    fetch (SESSIONS_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify( {
            user: {
                username: e.target.username.value,
                password: e.target.password.value
            } 
        })
    })
    .then(r => r.json())
    .then(function(o) {
        if (o.status === 401) {
            throw Error(o.message)
        } else {
            current_user = o.user
            current_session = o
            switchToLogout()
        } 
    })
    .catch(e => {
        if (confirm("We don't recognize your credentials. Sign up?")) {
            signUp()
        }
    })
}

const loginForm = document.querySelector('form.login')
loginForm.addEventListener('submit', login)
