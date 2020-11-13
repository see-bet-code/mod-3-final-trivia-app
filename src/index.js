// import moment from 'moment';

const API_URL = 'https://opentdb.com/api.php?amount=10&type=multiple'
const API_CAT_URL = 'https://opentdb.com/api_category.php'

const BASE_URL = 'http://localhost:3000/api/v1'
const GAMES_URL = `${BASE_URL}/games`
const SESSIONS_URL = `${BASE_URL}/sessions`
const USERS_URL = `${BASE_URL}/users`

let currentUser = null
let currentSession = null
let gamePoints = 0
let index = 0
let questionNumber = 1
let correctAnswerTally = 0

const loginBtn = document.querySelector('button.login-nav')
const finalScoreParent = document.querySelector(".final")
// find parent for main
const catAndDif = document.querySelector(".cat-and-dif")
const questionParent = document.querySelector(".questions")

fetch(API_CAT_URL)
    .then(response => response.json())
    .then(console.log)

function initialize(categorySelection, difficultySelection) {
    fetch(`https://opentdb.com/api.php?amount=10&category=${categorySelection}&difficulty=${difficultySelection}&type=multiple`)
    .then(response => response.json())
    .then(questionDataToObj)
    .catch(console.log)
}




// create function that renders form to main
function renderCatAndDif() {
    
    catAndDif.innerHTML = `
        <h2>Select Category</h2>
        <form id="select-category" name="categoryFrom" class="select-form">
            <input type="radio" id="books" name="category" value=10 required checked>
            <label for="books">Books</label>
            <input type="radio" id="film" name="category" value=11>
            <label for="film">Film</label>
            <input type="radio" id="music" name="category" value=12>
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
            <input type="radio" id="easy" name="difficulty" value="easy" required checked>
            <label for="easy">Easy</label>
            <input type="radio" id="medium" name="difficulty" value="medium">
            <label for="medium">Medium</label>
            <input type="radio" id="hard" name="difficulty" value="hard">
            <label for="hard">Hard</label><br><br>
            <button class="cat-dif-button btn btn-outline-primary" >Start Round</button> 
        </form><br>
        <button class="random-button btn btn-outline-secondary" >Random Category and Difficulty</button> 
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


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function questionDataToObj(questionData) {
    questionParent.innerHTML = ''
    // questionParent.style.display = "initial"
    const question = questionData.results[index]
    questionParent.innerHTML =  `
        <div class="modal-header">
            <h3><span class="label label-warning" id="qid">${questionNumber}</span>${question.question}</h3>
            <h4>
                Category: <span class="label label-warning" id="qid-c">${question.category}</span><br>
                Difficulty: <span class="label label-warning" id="qid-d">${capitalizeFirstLetter(question.difficulty)}</span>
            </h4>
        </div>
    `
    
    // Pushing all the answers into a new array in order to randomize them.
    answersArray = []
    question.incorrect_answers.forEach(incorrect_answer => {
        answersArray.push(incorrect_answer)
    });
    answersArray.push(question.correct_answer)
    shuffledAnswerArray = shuffle(answersArray)
    
    const answersForm = document.createElement("form")
    answersForm.className= 'answers-form'
    questionParent.append(answersForm)
    answersForm.innerHTML = `
        <div class="countdown"></div>
        <label class="btn btn-outline-primary element-animation0">
            <input type="radio" name="answer" value="${shuffledAnswerArray[0]}" required>${shuffledAnswerArray[0]}
        </label>
        <label class="btn btn-outline-primary element-animation1">
            <input type="radio" name="answer" value="${shuffledAnswerArray[1]}">${shuffledAnswerArray[1]}
        </label>
        <label class="btn btn-outline-primary element-animation2">
            <input type="radio" name="answer" value="${shuffledAnswerArray[2]}">${shuffledAnswerArray[2]}
        </label>
        <label class="btn btn-outline-primary element-animation3">
            <input type="radio" name="answer" value="${shuffledAnswerArray[3]}">${shuffledAnswerArray[3]}
        </label>
        <br>
    `
    const submitBtn = document.createElement('button')
    submitBtn.classList.add("btn", "btn-secondary", "submit-btn")
    submitBtn.type = 'submit'
    submitBtn.textContent = 'Next'
    if (index === 9) {
        submitBtn.textContent = 'Last question!'
    }
    
    answersForm.append(submitBtn)
    answersForm.addEventListener('submit', function(e) {
        console.log('click')
        console.log(e.target.answer.value)
        clearInterval(timer)
        gameCycle(e, question, questionData)
    })

    let countdown = document.querySelector(".countdown")
    
        let duration = moment.duration({
            'minutes': 0,
            'seconds': 15
        });

        let min = duration.minutes();
        let sec = duration.seconds();

        console.log(duration.seconds())
        
        let timestamp = new Date(0, 0, 0, 2, 10, 30);
        let interval = 1;
        let timer = setInterval(function() {
            timestamp = new Date(timestamp.getTime() + interval * 1000);
        
            duration = moment.duration(duration.asSeconds() - interval, 'seconds');
            
            sec -= 1;
            if (min < 0) return clearInterval(timer);
            if (min < 10 && min.length != 2) min = '0' + min;
            if (sec < 0 && min != 0) {
                min -= 1;
                sec = 59;
            } else if (sec < 10 && length.sec != 2) sec = '0' + sec;
            
            countdown.innerHTML = `${min}:${sec}`
           
            if (min == 0 && sec == 0)
                clearInterval(timer);
            if (questionNumber == 10 && sec == 0) {
                questionParent.innerHTML = ''
                renderFinalScore()
            } else if (sec == 0) {
                index++
                questionNumber++
                questionDataToObj(questionData)
            }
        
        }, 1000);

}



function gameCycle(e, question, data) {
    e.preventDefault()
    if (e.target.answer.value === question.correct_answer) {
        console.log('Correct!')
        updateGamePoints(question.difficulty)
    } else {
        console.log('Wrong!')
    }
    questionParent.innerHTML = ''
    if (index < data.results.length - 1) {  
        index++
        questionNumber++
        questionDataToObj(data)
        // update graphics to show right answer???
    } else {
        addToGameHistory(question)
        renderFinalScore()
        renderProfile()
    }
}

function updateGamePoints(difficulty) {
    correctAnswerTally++
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

function renderFinalScore() {
    finalScoreCard = document.createElement("span")
    finalScoreCard.className = "final-score-card"
    finalScoreCard.innerHTML = `
    <h1>Game Complete!</h1>
    <h2>Let's See How You Did.</h2>
    <h3>Looks like you got ${correctAnswerTally}/10 of the questions correct</h3>
    <h3>You've received ${gamePoints} for the Game</h3>
    <button class="play-another-button btn btn-outline-secondary" >Play Another Game of Trivia</button>
    `
    finalScoreParent.append(finalScoreCard)
    const playAnother = document.querySelector(".play-another-button")
    playAnother.addEventListener('click', function() {
        finalScoreParent.innerHTML = ''
        renderProfile()
        renderCatAndDif()
    })
    resetGame()

}

function addToGameHistory(question) {
    fetch (GAMES_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify( {
                category: question.category,
                difficulty: question.difficulty,
                points: gamePoints,
                user_id: currentUser.id
        })
    })
    .then(r => r.json())
    .then(console.log)
}

function resetGame() {
    gamePoints = 0
    index = 0
    questionNumber = 1
    correctAnswerTally = 0
}

// initialize()

function renderProfile() {
        const b = document.querySelector('button.profile')
        b.addEventListener('click', e => {
            if (currentUser) {
                document.getElementById('profile').style.display = "initial"
            }
        })
        fetch (`${USERS_URL}/${currentUser.id}`)
        .then(r => r.json())
        .then(user => {
        var reducer = function add(acc, g) { return acc + g.points }
        points = user.games.reduce(reducer, 0)
        document.querySelector('h4#name').innerHTML = user.name
        document.querySelector('span#username').innerHTML = '@' + user.username
        document.querySelector('span.total').innerHTML = user.games.length
        document.querySelector('span.points').innerHTML = points
        if (!user.avatUrl)
            document.querySelector('img.rounded').src = user.avatarUrl
    })
    
}

//signup
function signUp(){
    const modal = document.getElementById('id01')
    modal.style.display='initial'
    const signupForm = modal.querySelector('form')
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault()
        console.log(e.target.avatar.value)
        fetch (USERS_URL, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify( {
                user: {
                    name: e.target.name.value,
                    username: e.target.username.value,
                    password: e.target.password.value,
                    password_confirmation: e.target.passwordConfirmation.value,
                    avatar_url: e.target.avatar.value
                } 
            })
        })
        .then(r => r.json())
        .then(console.log)
        .catch(console.log)
    })
}

function switchToLogout() {
    const logoutBtn = document.querySelector('button.logout')
    logoutBtn.style.display = "initial"
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault()
        fetch(`${SESSIONS_URL}/${currentUser.id}`, {
            method: 'delete'
        })
        .then(r => r.json())
        .then(j => {
            document.querySelector('form.login-2').reset()
            loginBtn.style.display = "initial"
            document.querySelector('button.logout').remove()
            currentUser = null
            currentSession = null
            console.log(currentUser)
            catAndDif.remove()
        })
    })

}

function login(){
    const modal = document.getElementById('id01-login')
    modal.style.display='initial'
    const loginForm = modal.querySelector('form')
    loginForm.addEventListener('submit', function(e) {
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
                renderProfile()
                switchToLogout()
                renderCatAndDif()
                document.getElementById('id01-login').style.display = "none"
                loginBtn.style.display="none"
            } 
        })
        .catch(e => {
            console.log(e)
            if (confirm("We don't recognize your credentials. Sign up?")) {
                signUp()
            }
        })
    })
}


loginBtn.addEventListener('click', e => login())

function initializeGames() {
    fetch(GAMES_URL)
  .then(response => response.json())
  .then(gamesData => leaderBoardDisplay(gamesData));
}


const initializeGame = document.querySelector(".scores")
initializeGame.addEventListener("click", initializeGames)



function leaderBoardDisplay(playerObjectArray){
    const playerData = playerObjectArray
    console.log(playerObjectArray)
    const modalOne = document.getElementById('id02')
    modalOne.style.display='initial'
    
    
    function compare(a, b) {
        const playerA = a.points;
        const playerB = b.points;
      
        let comparison = 0;
        if (playerA > playerB) {
          comparison = -1;
        } else if (playerA < playerB) {
          comparison = +1;
        }
        return comparison;
      }
    
      const sortedPlayerArray = playerData.sort(compare);
      allTimeHighScores(sortedPlayerArray)
    //   easyScores(sortedPlayerArray)
      
}

leaderBoardTb = document.querySelector("#table-body")

function allTimeHighScores(sortedPlayerArray) {
    sortedPlayerArray.forEach(playerObj => {
        console.log(playerObj)
        
        const playerCard = document.createElement("tr")
        playerCard.className = "playerCard"
        playerCard.dataset.id = playerObj.id

        playerCard.innerHTML = `
            <td class="user-name">${playerObj.user.username}</td> 
            <td class="category">${playerObj.category}</td> 
            <td class="difficulty">${playerObj.difficulty}</td> 
            <td class="points">${playerObj.points}</td>
        `
        leaderBoardTb.append(playerCard) 
    });

   

    const easyBtn = document.querySelector("#easy")
    const mediumBtn = document.querySelector("#medium")
    const hardBtn = document.querySelector("#hard")

    easyBtn.addEventListener("click", easyScores)
    mediumBtn.addEventListener("click", mediumScores)
    hardBtn.addEventListener("click", hardScores)

    function easyScores() {
        console.log("hello")
        leaderBoardTb.innerHTML = ""
        sortedPlayerArray.forEach(playerObj => {
            if (playerObj.difficulty == "easy") {
                const playerCard = document.createElement("tr")
                playerCard.className = "playerCard"
                playerCard.dataset.id = playerObj.id
    
                playerCard.innerHTML = `
                <td class="user-name">${playerObj.user.username}</td> 
                <td class="category">${playerObj.category}</td> 
                <td class="difficulty">${playerObj.difficulty}</td> 
                <td class="points">${playerObj.points}</td>
            `
                leaderBoardTb.append(playerCard) 
            }
        });
    }

    function mediumScores() {
        leaderBoardTb.innerHTML = ""
        sortedPlayerArray.forEach(playerObj => {
            if (playerObj.difficulty == "medium") {
                const playerCard = document.createElement("tr")
                playerCard.className = "playerCard"
                playerCard.dataset.id = playerObj.id
                 playerCard.innerHTML = `
                <td class="user-name">${playerObj.user.username}</td> 
                <td class="category">${playerObj.category}</td> 
                <td class="difficulty">${playerObj.difficulty}</td> 
                <td class="points">${playerObj.points}</td>
            `
                leaderBoardTb.append(playerCard) 
            }
        });
    }

    function hardScores() {
        leaderBoardTb.innerHTML = ""
        sortedPlayerArray.forEach(playerObj => {
            if (playerObj.difficulty == "hard") {
                const playerCard = document.createElement("tr")
                playerCard.className = "playerCard"
                playerCard.dataset.id = playerObj.id
                playerCard.innerHTML = `
                <td class="user-name">${playerObj.user.username}</td> 
                <td class="category">${playerObj.category}</td> 
                <td class="difficulty">${playerObj.difficulty}</td> 
                <td class="points">${playerObj.points}</td>
            `
                leaderBoardTb.append(playerCard) 
            }
        });
    }
}
