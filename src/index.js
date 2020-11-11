const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple'
const API_CAT_URL = 'https://opentdb.com/api_category.php'

const BASE_URL = 'http://localhost:3000/api/v1'
const SESSIONS_URL = `${BASE_URL}/sessions`
const USERS_URL = `${BASE_URL}/users`

let currentUser = null
let currentSession = null
let gamePoints = 0

function initialize(categorySelection, difficultySelection) {
    fetch(`${API_URL}&category=${parseInt(categorySelection)}&difficulty=${difficultySelection}&type=multiple`)
    .then(response => response.json())
    .then(questionDataToObj);
}

// find parent for main
const catAndDif = document.querySelector(".cat-and-dif")
// create function that renders form to main
// remove form after selection 
function renderCatAndDif() {
    
    catAndDif.innerHTML = `
        <h2>Select Category</h2>
        <form id="select-category">
            <input type="radio" id="books" name="category" value=10>
            <label for="books">Books</label>
            <input type="radio" id="film" name="category" value=11>
            <label for="film">Film</label>
            <input type="radio" id="music" name="category" value=13>
            <label for="music">Music</label><br>
            <input type="radio" id="television" name="category" value=14>
            <label for="television">Television</label>
            <input type="radio" id="video-games" name="category" value=15>
            <label for="video-games">Video Games</label>
            <h2>Select Difficulty</h2>
            <input type="radio" id="easy" name="difficulty" value="easy">
            <label for="easy">Easy</label>
            <input type="radio" id="medium" name="difficulty" value="medium">
            <label for="medium">Medium</label>
            <input type="radio" id="hard" name="difficulty" value="hard">
            <label for="hard">Hard</label><br><br>
            <button class="cat-dif-button" >Start Round</button>
        </form>
`
    catAndDif.addEventListener("submit", submitForm)

    function submitForm(event) {
        event.preventDefault()
        let myForm = document.getElementById('select-category');
        let formData = new FormData(myForm);
        const categorySelection = formData.get("category")
        const difficultySelection = formData.get("difficulty")
            
        initialize(categorySelection, difficultySelection)
        
    }
}
questionParent = document.querySelector(".questions")

let index = 0
let questionNumber = 1

function questionDataToObj(questionData) {
    questionParent.innerHTML = ''
    const question = questionData.results[index]
    const questionCard = document.createElement("span")
    questionCard.className = "question-card"
    questionCard.innerHTML = `
    <h3>Question Number ${questionNumber}.</h3>
    <h3>${question.question}</h3>
    <div class="answers-div">
    </div>
    `
    // Pushing all the answers into a new array in order to randomize them.
    answersArray = []
    question.incorrect_answers.forEach(incorrect_answer => {
        answersArray.push(incorrect_answer)
    });
    answersArray.push(question.correct_answer)

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;
            while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
            }
        return array;
        }

    shuffledAnswerArray = shuffle(answersArray)
    questionParent.append(questionCard)
    const answersDiv = document.querySelector(".answers-div")
    const answersForm = document.createElement("form")
    answersForm.className = "answers"
    answersForm.innerHTML = `
        <input type="radio" name="answer" value="${shuffledAnswerArray[0]}">
        <label>${shuffledAnswerArray[0]}</label>
        <input type="radio" name="answer" value="${shuffledAnswerArray[1]}">
        <label>${shuffledAnswerArray[1]}</label>
        <input type="radio" name="answer" value="${shuffledAnswerArray[2]}">
        <label>${shuffledAnswerArray[2]}</label>
        <input type="radio"  name="answer" value="${shuffledAnswerArray[3]}">
        <label>${shuffledAnswerArray[3]}</label>
    `
    const submitBtn = document.createElement('button')
    submitBtn.type = 'submit'
    if (index === 9) {
        submitBtn.textContent = 'Last question!'
    } else {
        submitBtn.textContent = 'Next'
    }
    
    answersForm.append(submitBtn)
    answersDiv.append(answersForm)
    answersForm.addEventListener('submit', function(e) {
        gameCycle(e, question, questionData)
    })

}

function gameCycle(e, question, data) {
    e.preventDefault()
    if (e.target.answer.value === question.correct_answer) {
        console.log('Correct!')
        updateGamePoints(question.difficulty)
    } else {
        console.log('Wrong!')
    }
    if (index < data.results.length - 1) {  
        index++
        questionNumber++
        questionDataToObj(data)
        // update graphics to show right answer???
    } else {
        console.log("finished!")
        console.log(`You finished with ${gamePoints}`)
        updateUserLifetimePoints()
    }
    
}

function updateGamePoints(difficulty) {
    console.log(difficulty)
    switch(difficulty) {
        case "easy":
            gamePoints += 5
            break;
        case "medium":
            gamePoints += 10
            break;
        case "hard":
            gamePoints += 15
    }
}

function updateUserLifetimePoints() {
    let lifetimePoints = 0
    if (currentUser.points) {
        lifetimePoints = currentUser.points
    }
    console.log(lifetimePoints)
    fetch (`USERS_URL/${currentUser}/points`, {
        method: 'patch',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify( {
            user: {
                points: lifetimePoints += gamePoints,
            } 
        })
    })
    .then(r => r.json())
    .then(console.log)
}


renderCatAndDif()
// initialize()

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
        fetch(`${BASE_URL}/sessions/${currentUser.id}`, {
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

// login
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
            currentUser = o.user
            currentSession = o
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
