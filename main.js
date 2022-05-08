const URL = 'https://api.lyrics.ovh/suggest/'

const mainFormEL = document.querySelector('[data-js="main-form"]')
const searchInputEL = document.querySelector('[data-js="search-input"]')
const resultsContainerEL = document.querySelector('[data-js="results-container"]')
let nextSearchURL = null


function getSearchTerm() {
  return searchInputEL.value.trim()
}

function parseResponse(response) {
  if (response.ok) {
    return response.json()
  }
  
  throw new Error('problema na requisição')
}

function outputData(lyrics) {
  lyrics = lyrics.map(musicLyrics => {
    const albumURL = musicLyrics.album["cover_big"]
    const musicTitle = musicLyrics.title
    const artistName = musicLyrics.artist.name
    const artistSVG = '<svg class="lyrics-card--svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 12Q10.35 12 9.175 10.825Q8 9.65 8 8Q8 6.35 9.175 5.175Q10.35 4 12 4Q13.65 4 14.825 5.175Q16 6.35 16 8Q16 9.65 14.825 10.825Q13.65 12 12 12ZM4 20V17.2Q4 16.35 4.438 15.637Q4.875 14.925 5.6 14.55Q7.15 13.775 8.75 13.387Q10.35 13 12 13Q13.65 13 15.25 13.387Q16.85 13.775 18.4 14.55Q19.125 14.925 19.562 15.637Q20 16.35 20 17.2V20ZM6 18H18V17.2Q18 16.925 17.863 16.7Q17.725 16.475 17.5 16.35Q16.15 15.675 14.775 15.337Q13.4 15 12 15Q10.6 15 9.225 15.337Q7.85 15.675 6.5 16.35Q6.275 16.475 6.138 16.7Q6 16.925 6 17.2ZM12 10Q12.825 10 13.413 9.412Q14 8.825 14 8Q14 7.175 13.413 6.588Q12.825 6 12 6Q11.175 6 10.588 6.588Q10 7.175 10 8Q10 8.825 10.588 9.412Q11.175 10 12 10ZM12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8ZM12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Z"/></svg>'
    const albumTitle = musicLyrics.album.title
    const albumSVG = '<svg class="lyrics-card--svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.3 20.5Q4.55 20.5 4.025 19.975Q3.5 19.45 3.5 18.7V5.3Q3.5 4.55 4.025 4.025Q4.55 3.5 5.3 3.5H18.7Q19.45 3.5 19.975 4.025Q20.5 4.55 20.5 5.3V18.7Q20.5 19.45 19.975 19.975Q19.45 20.5 18.7 20.5ZM5.3 19H18.7Q18.8 19 18.9 18.9Q19 18.8 19 18.7V5.3Q19 5.2 18.9 5.1Q18.8 5 18.7 5H5.3Q5.2 5 5.1 5.1Q5 5.2 5 5.3V18.7Q5 18.8 5.1 18.9Q5.2 19 5.3 19ZM5 5Q5 5 5 5.088Q5 5.175 5 5.3V18.7Q5 18.825 5 18.913Q5 19 5 19Q5 19 5 18.913Q5 18.825 5 18.7V5.3Q5 5.175 5 5.088Q5 5 5 5ZM7.25 10.75H10.75V7.25H7.25ZM13.25 10.75H16.75V7.25H13.25ZM7.25 16.75H10.75V13.25H7.25ZM13.25 16.75H16.75V13.25H13.25Z"/></svg>'

    return `
    <li class="lyrics-card">
      <article>
        <figure class="lyrics-card--figure">
          <img class="lyrics-card--image" src="${albumURL}">

          <figcaption class="lyrics-card--main-wrapper">
            <h2 class="lyrics-card--music-name">${musicTitle}</h2>
            <div class="lyrics-card--flex-wrapper">
              ${artistSVG} <p>autor: ${artistName}</p>
            </div>
            <div class="lyrics-card--flex-wrapper">
              ${albumSVG} <p>album: ${albumTitle}</p>
            </div>

            <div class="tridimensional-button-wrapper">
              <button class="tridimensional-button-wrapper--button">
                ver letra
              </button>
              <div class="tridimensional-button-wrapper--shadow"></div>
            </div>
          </figcaption>
        </figure>
      </article>
    </li>
  `})

  resultsContainerEL.innerHTML += lyrics.join('')
}

function parseData(data) {
  const lyrics = data.data
  nextSearchURL = data.next
  
  outputData(lyrics)
}

function handleError(error) {
  console.log(error.message)
}

function cleanResults() {
  resultsContainerEL.innerHTML  = ''
}

function fetchSongs(searchTerm) {
  fetch(URL + searchTerm)
  .then(parseResponse)
  .then(parseData)
  .catch(handleError)
}

function handleFormSubmit(event) {
  event.preventDefault()

  const searchTerm = getSearchTerm()
  const searchTermIsEmpty = searchTerm.replaceAll(' ', '').length === 0
  
  if (searchTermIsEmpty) return

  cleanResults()

  fetchSongs(searchTerm)
}


mainFormEL.addEventListener('submit', handleFormSubmit)
