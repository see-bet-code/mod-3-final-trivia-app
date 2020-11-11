function initialize(categorySelection, difficultySelection) {
    fetch(`https://opentdb.com/api.php?amount=10&category=${parseInt(categorySelection)}&difficulty=${difficultySelection}&type=multiple`)
  .then(response => response.json())
  .then(questionData => questionDataToObj(questionData));
}

// find parent for main
const catAndDif = document.querySelector(".cat-and-dif")
// create function that renders form to main 
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
    console.log(index)
    const question = questionData.results[index]
    console.log(question)
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
    console.log(answersArray)

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
    console.log(shuffledAnswerArray)
    console.log(question.question)
    questionParent.append(questionCard)
    const answersDiv = document.querySelector(".answers-div")
    const answersForm = document.createElement("form")
    answersForm.className = "answers"
    answersForm.innerHTML = `
        <input type="radio" name="answer" value=${shuffledAnswerArray[0]}>
        <label>${shuffledAnswerArray[0]}</label>
        <input type="radio" name="answer" value=${shuffledAnswerArray[1]}>
        <label>${shuffledAnswerArray[1]}</label>
        <input type="radio" name="answer" value=${shuffledAnswerArray[2]}>
        <label>${shuffledAnswerArray[2]}</label>
        <input type="radio"  name="answer" value=${shuffledAnswerArray[3]}>
        <label>${shuffledAnswerArray[3]}</label>
    `
    answersDiv.append(answersForm)

}



renderCatAndDif()
// initialize()

