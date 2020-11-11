const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple'
const API_CAT_URL = 'https://opentdb.com/api_category.php'

const BASE_URL = 'http://localhost:3000/api/v1'
const SESSIONS_URL = `${BASE_URL}/sessions`
const USERS_URL = `${BASE_URL}/users`

let current_user = null
let current_session = null

function initialize(categorySelection, difficultySelection) {
    fetch(`https://opentdb.com/api.php?amount=10&category=${parseInt(categorySelection)}&difficulty=${difficultySelection}&type=multiple`)
    .then(response => response.json())
    .then(questionData => questionDataToObj(questionData));
}

// function randomInitialize(randomCategory) {
//     fetch(`https://opentdb.com/api.php?amount=10&category=${parseInt(randomCategory)}&type=multiple`)
//     .then(response => response.json())
//     .then(questionData => questionDataToObj(questionData));
// }

// find parent for main
const catAndDif = document.querySelector(".cat-and-dif")
// create function that renders form to main
// remove form after selection 
function renderCatAndDif() {
    
    catAndDif.innerHTML = `
        <h2>Select Category</h2>
        <form id="select-category" name="categoryFrom" >
            <input type="radio" id="books" name="category" value=10 required>
            <label for="books">Books</label>
            <input type="radio" id="film" name="category" value=11>
            <label for="film">Film</label>
            <input type="radio" id="music" name="category" value=13>
            <label for="music">Music</label>
            <input type="radio" id="television" name="category" value=14>
            <label for="television">Television</label>
            <input type="radio" id="video-games" name="category" value=15>
            <label for="video-games">Video Games</label><br>

            <input type="radio" id="science-and-nature" name="category" value=17>
            <label for="science-and-nature">Science and Nature</label>
            <input type="radio" id="mythology" name="category" value=20>
            <label for="mythology">Mythology</label>
            <input type="radio" id="sports" name="category" value=21>
            <label for="sports">Sports</label>
            <input type="radio" id="history" name="category" value=23>
            <label for="history">History</label>
            <input type="radio" id="animals" name="category" value=27>
            <label for="animals">Animals</label>
           

            <h2>Select Difficulty</h2>
            <input type="radio" id="easy" name="difficulty" value="easy" required>
            <label for="easy">Easy</label>
            <input type="radio" id="medium" name="difficulty" value="medium">
            <label for="medium">Medium</label>
            <input type="radio" id="hard" name="difficulty" value="hard">
            <label for="hard">Hard</label><br><br>
            <button class="cat-dif-button" >Start Round</button> 
        </form><br>
        <button class="random-button" >Random Category and Difficulty</button> 
    `
    const randomButton = document.querySelector(".random-button")

    const categoryNumbers = [10, 11, 13, 14, 15, 17, 20, 21, 23, 27]
    const difficultyOptions = ["easy", "medium", "hard"]

    randomButton.addEventListener("click", function() {
        const randomCategory = categoryNumbers[Math.floor(Math.random()*categoryNumbers.length)];
        const randomDifficulty = difficultyOptions[Math.floor(Math.random()*difficultyOptions.length)];
        initialize(randomCategory, randomDifficulty)
        catAndDif.innerHTML = ""
    })

    catAndDif.addEventListener("submit", submitForm)

    function submitForm(event) {
        event.preventDefault()
        let myForm = document.getElementById('select-category');
        let formData = new FormData(myForm);
        const categorySelection = formData.get("category")
        const difficultySelection = formData.get("difficulty")
            
        initialize(categorySelection, difficultySelection)
        catAndDif.innerHTML = ""
    }

}

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


questionParent = document.querySelector(".questions")

let index = 0
let questionNumber = 1

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function questionDataToObj(questionData) {
    questionParent.innerHTML = ''
    const question = questionData.results[index]
    const questionCard = document.createElement("span")
    questionCard.className = "question-card"
    questionCard.innerHTML = `
    <h3>Question ${questionNumber} for ${question.category} on ${capitalizeFirstLetter(question.difficulty)} Difficulty</h3>
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
    console.log(answersArray)
    shuffledAnswerArray = shuffle(answersArray)
    
    console.log(shuffledAnswerArray)
    questionParent.append(questionCard)
    const answersDiv = document.querySelector(".answers-div")
    const answersForm = document.createElement("form")
    answersForm.className = "answers"
    answersForm.innerHTML = `
        <input type="radio" name="answer" value="${shuffledAnswerArray[0]}" required>
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
        gameCycle(e, question.correct_answer, questionData, submitBtn)
    })

}

function gameCycle(e, answer, data) {
    e.preventDefault()
    console.log(answer)
    if (e.target.answer.value === answer) {
        console.log('Correct!')
        correctAnswerTally++
    } else {
        console.log('Wrong!')
    }
    if (index < data.results.length - 1) {  
        index++
        questionNumber++
        questionDataToObj(data)
        // update user points
        // update graphics to show right answer???
    } else {
        console.log("finished!")
        questionParent.innerHTML = ''
        renderFinalScore()
    }
}

let correctAnswerTally = 0

const finalScoreParent = document.querySelector(".final")
function renderFinalScore() {
    finalScoreCard = document.createElement("span")
    finalScoreCard.className = "final-score-card"
    finalScoreCard.innerHTML = `
    <h1>Game Complete!</h1>
    <h2>Let's See How You Did.</h2>
    <h3>Looks like you got ${correctAnswerTally}/10 of the questions correct</h3>
    <h3>You've received data points for the Game</h3>
    <button class="paly-another-button" >Play Another Game of Trivia</button><button class="log-out-button" >Log Out</button>
    `
    finalScoreParent.append(finalScoreCard)
    const playAnother = document.querySelector(".paly-another-button")
    playAnother.addEventListener('click', function() {
        finalScoreParent.innerHTML = ''
        renderCatAndDif()
    })
    
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
