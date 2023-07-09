const apiKey = '41bc9424a329ed42abeeb7ba25dbb357';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');
const loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', handleLogin);
searchButton.addEventListener('click', searchMovies);

function handleLogin() {
    window.location.href = 'login.html';
  }

function searchMovies() {
  const query = searchInput.value.trim();
  if (query === '') return;

  const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayMovies(data.results);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayMovies(movies) {
  resultsContainer.innerHTML = '';
  if (movies.length === 0) {
        alert("Sorry Movie not found !!! Try Different query");
  }

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'movieCard';

    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    movieCard.appendChild(image);

    const title = document.createElement('h2');
    title.textContent = movie.title;
    movieCard.appendChild(title);

    const rating = document.createElement('p');
    rating.textContent = `Rating: ${movie.vote_average}`;
    movieCard.appendChild(rating);

    const overview = document.createElement('p');
    overview.textContent = movie.overview;
    movieCard.appendChild(overview);

   

    resultsContainer.appendChild(movieCard);
  });
}
