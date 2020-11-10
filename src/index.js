const BASE_URL = 'https://opentdb.com/api.php?amount=10&type=multiple'
const CAT_URL = 'https://opentdb.com/api_category.php'
//'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy'

// in form create game and fetch (dynamic url based on form input)
fetch(BASE_URL)
.then(r => r.json())
.then(console.log)

// might be part of helper for setting up category buttons
fetch(CAT_URL)
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