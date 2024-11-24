/* script.js */
const API_KEY = "3b90ca76"; // Replace with your API key
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

const searchInput = document.getElementById("searchInput");
const loader = document.getElementById("loader");
const moviesContainer = document.getElementById("moviesContainer");
const pagination = document.getElementById("pagination");
const modal = document.getElementById("movieModal");
const modalDetails = document.getElementById("modalDetails");
const closeButton = document.querySelector(".close-button");

let currentPage = 1;
let currentQuery = "";

// Render movies in a grid
function renderMovies(movies) {
  moviesContainer.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
    movieCard.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
      <div class="movie-info">
        <div class="movie-title">${movie.Title}</div>
        <div>${movie.Year}</div>
        <button class="details-btn" data-id="${movie.imdbID}">Details</button>
      </div>
    `;
    moviesContainer.appendChild(movieCard);
  });

  // Add event listeners for "Details" buttons
  document.querySelectorAll(".details-btn").forEach((button) => {
    button.addEventListener("click", (e) => showMovieDetails(e.target.dataset.id));
  });
}

// Render pagination buttons
function renderPagination(totalResults) {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalResults / 10);
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.disabled = i === currentPage;
    button.addEventListener("click", () => {
      currentPage = i;
      searchMovies(currentQuery, currentPage);
    });
    pagination.appendChild(button);
  }
}

// Fetch and display movies based on a search query
async function searchMovies(query, page = 1) {
  if (!query) return;
  loader.classList.remove("hidden");
  try {
    const res = await fetch(`${API_URL}&s=${query}&page=${page}`);
    const data = await res.json();
    if (data.Response === "True") {
      renderMovies(data.Search);
      renderPagination(parseInt(data.totalResults, 10));
    } else {
      moviesContainer.innerHTML = `<p>${data.Error}</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    loader.classList.add("hidden");
  }
}

// Fetch and display movie details
async function showMovieDetails(imdbID) {
    try {
      loader.classList.remove("hidden");
      const res = await fetch(`${API_URL}&i=${imdbID}&plot=full`);
      const movie = await res.json();
      if (movie.Response === "True") {
        modalDetails.innerHTML = `
          <h2>${movie.Title}</h2>
          <img src="${movie.Poster !== "N/A" ? movie.Poster : "placeholder.jpg"}" alt="${movie.Title}">
          <p><strong>Year:</strong> ${movie.Year}</p>
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Director:</strong> ${movie.Director}</p>
          <p><strong>Actors:</strong> ${movie.Actors}</p>
          <p><strong>Plot:</strong> ${movie.Plot}</p>
          <p><strong>Ratings:</strong> ${
            movie.Ratings.length
              ? movie.Ratings.map((r) => `<span>${r.Source}: ${r.Value}</span>`).join(", ")
              : "N/A"
          }</p>
        `;
        modal.classList.remove("hidden");
      } else {
        alert("Error fetching movie details!");
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      loader.classList.add("hidden");
    }
  }
  
  // Close modal
  closeButton.addEventListener("click", () => {
    modal.classList.add("hidden");
  });
  
  // Close modal when clicking outside the modal content
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.add("hidden");
    }
  });

// Debouncing implementation for search
let debounceTimer;
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  if (query === currentQuery) return;

  currentQuery = query;
  currentPage = 1;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    searchMovies(query);
  }, 500); // 500ms debounce
});

// Fetch movies on initial load (default query)
window.addEventListener("load", () => {
  currentQuery = "Avengers"; // Default query for initial load
  searchMovies(currentQuery);
});


