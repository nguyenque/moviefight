// ``
const autoCompleteConfig = {
  renderOption(movie) {
    const { Poster, Title, Year } = movie
    const imgSrc = Poster === "N/A" ? "" : Poster
    return `
    <img src="${imgSrc}">
    ${Title} (${Year})
  `
  },
  inputValue(movie) {
    return movie.Title
  },
  async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey: 'dec74fc5',
        s: searchTerm
      }
    })

    if (response.data.Error) {
      return []
    }
    return response.data.Search
  }
}
createAutoComplete({
  root: document.querySelector('#left-autocomplete'),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
  },
})
createAutoComplete({
  root: document.querySelector('#right-autocomplete'),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    document.querySelector('.tutorial').classList.add('is-hidden')
    onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
  },
})
let leftMovie
let rightMovie
const onMovieSelect = async ({ imdbID: id }, summaryElement, side) => {
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'dec74fc5',
      i: id
    }
  })
  summaryElement.innerHTML = (movieTemplate(response.data))
  if (side === 'left') {
    leftMovie = response.data
  } else {
    rightMovie = response.data
  }
  if (leftMovie && rightMovie) {
    runComparison()
  }
}
const runComparison = () => {
  const leftSideStats = document.querySelectorAll('#left-summary .notification')
  const rightSideStats = document.querySelectorAll('#right-summary .notification')

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index]
    const leftSideValue = parseInt(leftStat.dataset.value)
    const rightSideValue = parseInt(rightStat.dataset.value)
    if (leftSideValue < rightSideValue) {
      leftStat.classList.remove('is-primary')
      leftStat.classList.add('is-warning')
    } else {
      rightStat.classList.remove('is-primary')
      rightStat.classList.add('is-warning')
    }
  })
}
const movieTemplate = (movieDetail) => {
  const { Title, Poster, imdbRating: Rating, imdbVotes: Votes, BoxOffice, Genre, Plot, Awards, Metascore } = movieDetail
  const dollars = parseInt(BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
  const metascore = parseInt(Metascore)
  const imdbRating = parseFloat(Rating)
  const imdbVotes = parseInt(Votes.replace(/,/g, ''))


  // method 1 to calculate total awards
  /*
    let count = 0
    const awards = Awards.split(' ')
    awards.forEach((word) => {
      const value = parseInt(word)
      if(isNaN(value)) {
        return
      } else {
        count += value
      }
    })
    console.log(count);
    */
  //  method 2:
  const awards = Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word)
    if (isNaN(value)) {
      return prev
    } else {
      return prev + value
    }
  }, 0)

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${Title}</h1>
          <h4>${Genre}</h4>
          <p>${Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${Awards}</p>
      <p class="sub-title">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
      <p class="title">${BoxOffice}</p>
      <p class="sub-title">BoxOffice</p>
    </article>
    <article data-value=${metascore} class="notification is-primary">
      <p class="title">${Metascore}</p>
      <p class="sub-title">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${Rating}</p>
      <p class="sub-title">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${Votes}</p>
      <p class="sub-title">IMDB Votes</p>
    </article>
  `
}