const URL = 'https://api.lyrics.ovh/suggest/'

const errorModalEL = document.querySelector('[data-js="error-modal"]')
const mainFormEL = document.querySelector('[data-js="main-form"]')
const searchInputEL = document.querySelector('[data-js="search-input"]')
const resultsListWrapperEL = document.querySelector('[data-js="results-list-wrapper"]')
const resultsListEL = document.querySelector('[data-js="results-list"]')
const loadingSpinnerEL = document.querySelector('[data-js="loading-spinner"]')
let nextSearchURL = null


function getSearchTerm() {
  return searchInputEL.value.trim()
}

function getFormatedDuration(duration) {
  const durationIsLesserThanOneMinute = duration < 60

  if (durationIsLesserThanOneMinute) {
    return `00:${duration}`
  }
  
  const amountOfMinutesInTheDuration = Math.floor(duration / 60)
  const leftoverSeconds = duration - (amountOfMinutesInTheDuration * 60)
  const formatedDuration = `${String(amountOfMinutesInTheDuration).padStart(2, '0')}:${String(leftoverSeconds).padStart(2, '0')}`

  return formatedDuration
}

function outputData(musics) {
  musics = musics.map(music => {
    const albumURL = music.album["cover_big"]
    const musicTitle = music.title
    const artistName = music.artist.name
    const artistSVG = '<svg class="music-card--svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M12 12Q10.35 12 9.175 10.825Q8 9.65 8 8Q8 6.35 9.175 5.175Q10.35 4 12 4Q13.65 4 14.825 5.175Q16 6.35 16 8Q16 9.65 14.825 10.825Q13.65 12 12 12ZM4 20V17.2Q4 16.35 4.438 15.637Q4.875 14.925 5.6 14.55Q7.15 13.775 8.75 13.387Q10.35 13 12 13Q13.65 13 15.25 13.387Q16.85 13.775 18.4 14.55Q19.125 14.925 19.562 15.637Q20 16.35 20 17.2V20ZM6 18H18V17.2Q18 16.925 17.863 16.7Q17.725 16.475 17.5 16.35Q16.15 15.675 14.775 15.337Q13.4 15 12 15Q10.6 15 9.225 15.337Q7.85 15.675 6.5 16.35Q6.275 16.475 6.138 16.7Q6 16.925 6 17.2ZM12 10Q12.825 10 13.413 9.412Q14 8.825 14 8Q14 7.175 13.413 6.588Q12.825 6 12 6Q11.175 6 10.588 6.588Q10 7.175 10 8Q10 8.825 10.588 9.412Q11.175 10 12 10ZM12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8Q12 8 12 8ZM12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Q12 18 12 18Z"/></svg>'
    const albumTitle = music.album.title
    const albumSVG = '<svg class="music-card--svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M5.3 20.5Q4.55 20.5 4.025 19.975Q3.5 19.45 3.5 18.7V5.3Q3.5 4.55 4.025 4.025Q4.55 3.5 5.3 3.5H18.7Q19.45 3.5 19.975 4.025Q20.5 4.55 20.5 5.3V18.7Q20.5 19.45 19.975 19.975Q19.45 20.5 18.7 20.5ZM5.3 19H18.7Q18.8 19 18.9 18.9Q19 18.8 19 18.7V5.3Q19 5.2 18.9 5.1Q18.8 5 18.7 5H5.3Q5.2 5 5.1 5.1Q5 5.2 5 5.3V18.7Q5 18.8 5.1 18.9Q5.2 19 5.3 19ZM5 5Q5 5 5 5.088Q5 5.175 5 5.3V18.7Q5 18.825 5 18.913Q5 19 5 19Q5 19 5 18.913Q5 18.825 5 18.7V5.3Q5 5.175 5 5.088Q5 5 5 5ZM7.25 10.75H10.75V7.25H7.25ZM13.25 10.75H16.75V7.25H13.25ZM7.25 16.75H10.75V13.25H7.25ZM13.25 16.75H16.75V13.25H13.25Z"/></svg>'
    const duration = getFormatedDuration(music.duration)
    const durationSVG = '<svg class="music-card--svg" xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="M15.3 16.7 16.7 15.3 13 11.6V7H11V12.4ZM12 22Q9.925 22 8.1 21.212Q6.275 20.425 4.925 19.075Q3.575 17.725 2.788 15.9Q2 14.075 2 12Q2 9.925 2.788 8.1Q3.575 6.275 4.925 4.925Q6.275 3.575 8.1 2.787Q9.925 2 12 2Q14.075 2 15.9 2.787Q17.725 3.575 19.075 4.925Q20.425 6.275 21.212 8.1Q22 9.925 22 12Q22 14.075 21.212 15.9Q20.425 17.725 19.075 19.075Q17.725 20.425 15.9 21.212Q14.075 22 12 22ZM12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12Q12 12 12 12ZM12 20Q15.325 20 17.663 17.663Q20 15.325 20 12Q20 8.675 17.663 6.337Q15.325 4 12 4Q8.675 4 6.338 6.337Q4 8.675 4 12Q4 15.325 6.338 17.663Q8.675 20 12 20Z"/></svg>'

    return `
    <li class="music-card">
      <article>
        <figure class="music-card--figure">
          <img class="music-card--image" src="${albumURL}">

          <figcaption class="music-card--main-flex-wrapper">
            <div>
              <h2 class="music-card--music-name">${musicTitle}</h2>
              <div class="music-card--flex-wrapper">
                ${artistSVG} <p>autor: ${artistName}</p>
              </div>
              <div class="music-card--flex-wrapper">
                ${albumSVG} <p>??lbum: ${albumTitle}</p>
              </div>
              <div class="music-card--flex-wrapper music-card--flex-wrapper-duration">
                ${durationSVG} <p>${duration}</p>
              </div>
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

  resultsListEL.innerHTML += musics.join('')
}

function toggleLoadingSpinner() {
  loadingSpinnerEL.classList.toggle('loading-spinner__enabled')
}

function toggleErrorModal() {
  errorModalEL.classList.toggle('error-modal__enabled')
}

function scheduleShowAndHideModal() {   
  setTimeout(toggleErrorModal, 50)

  setTimeout(toggleErrorModal, 3000)
}

function cleanResults() {
  resultsListEL.innerHTML  = ''
}

function parseResponse(response) {
  toggleLoadingSpinner()

  if (response.ok) {
    return response.json()
  }
  
  switch (response.status) {
    case 404:
      throw new Error('conte??do n??o encontrado')
    case 500:
      throw new Error('erro interno no servidor')
    case 503:
      throw new Error('servi??o indispon??vel no momento')
  }
}

function parseData(data) {
  const musics = data.data
  nextSearchURL = data.next
  
  outputData(musics)
}

function handleError(error) {
  const ifMessageIsFailedToFetch = error.message === 'Failed to fetch'

  errorModalEL.textContent = ifMessageIsFailedToFetch ? 'houve um erro: atualize a p??gina e tente denovo' : error.message

  toggleLoadingSpinner()

  scheduleShowAndHideModal()
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

  toggleLoadingSpinner()

  cleanResults()

  fetchSongs(searchTerm)
}


mainFormEL.addEventListener('submit', handleFormSubmit)
