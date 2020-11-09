const BASE_URL = 'https://opentdb.com/api.php?amount=10'
console.log('Hello World')
// const h1 = document.createElement('h1')
// h1.innerHTML = 'Hello World Title'
// document.append(h1)

// in form create game and fetch (dynamic url based on form input)
fetch(BASE_URL)
.then(r => r.json())
.then(console.log)

//