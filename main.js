const URL = 'https://api.lyrics.ovh/suggest/'

const mainFormEL = document.querySelector('[data-js="main-form"]')
const searchInputEL = document.querySelector('[data-js="search-input"]')


function getSearchTerm() {
  return searchInputEL.value.trim()
}

function fetchSongs(event) {
  event.preventDefault()

  const searchTerm = getSearchTerm()
  const searchTermIsEmpty = searchTerm.replaceAll(' ', '').length === 0
  
  if (searchTermIsEmpty) return

  fetch(URL + searchTerm)
  .then(response => response.json())
  .then(data => console.log(data))
}


mainFormEL.addEventListener('submit', fetchSongs)
