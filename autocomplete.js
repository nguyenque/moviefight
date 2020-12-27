const createAutoComplete = ({ root, renderOption, onOptionSelect, inputValue, fetchData }) => {
  root.innerHTML = `
  <label><b>Search</b></label>
  <input type="text" class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
  
`

  const input = root.querySelector('input')
  const dropdown = root.querySelector('.dropdown')
  const resultsWrapper = root.querySelector('.results')

  const onInput = async (event) => {
    /*
    METHOD 1 (BY ME)
    const movies = await fetchData(event.target.value)
    movies.map(movie => {
      const { Poster, Title } = movie
      const div = document.createElement('div')
      div.innerHTML = `
      <img src="${Poster}">
      <h1>${Title}</h1>
    `
      const element = document.querySelector('#target')
      element.appendChild(div)
    })
  */
    // METHOD 2 (BY STEVEN)
    const items = await fetchData(event.target.value)
    console.log(items);
    if (!items.length) {
      dropdown.classList.remove('is-active')
      return;
    }
    resultsWrapper.innerHTML = ""
    dropdown.classList.add('is-active')
    for (let item of items) {
      const option = document.createElement('a')
      option.classList.add('dropdown-item')
      option.innerHTML = renderOption(item)
      option.addEventListener('click', async () => {
        input.value = inputValue(item)
        dropdown.classList.remove('is-active')
        onOptionSelect(item)
      })
      resultsWrapper.appendChild(option)
    }
    input.focus()
    input.value = ""
  }
  input.addEventListener('input', debounce(onInput, 500))
  document.addEventListener('click', event => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove('is-active')
    }
  })
}