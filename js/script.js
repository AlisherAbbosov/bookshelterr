"use strict";

const elLogoutBtn = document.querySelector(".logout");
const localToken = window.localStorage.getItem("token");
const elSearchInput = document.querySelector(".search__input");
const elResult = document.querySelector(".result");
const elNewestBtn = document.querySelector(".newest__btn");
const elBooksList = document.querySelector(".books__list");
const elResultTemplate = document.querySelector(
  ".search__books-template"
).content;

let search = " harry potter";
let page = 0;
let result;
let maxResult = 6;

// Bookmark
let localBookmarkedBooks = JSON.parse(
  window.localStorage.getItem("bookmarkedBooks")
);
let newbookmarkedMovies = localBookmarkedBooks || [];

if (!localToken) {
  window.location.replace("login.html");
}

elLogoutBtn.addEventListener("click", function () {
  window.localStorage.removeItem("token");

  window.location.replace("login.html");
});

const renderBooks = (arr, element) => {
  result = arr.totalItems;
  arr = arr.items;
  const booksFragment = document.createDocumentFragment();

  arr.forEach((book) => {
    const clonedBookTemplate = elResultTemplate.cloneNode(true);

    clonedBookTemplate.querySelector(".book__img").src =
      book.volumeInfo.imageLinks?.smallThumbnail;
    clonedBookTemplate.querySelector(".card__title").textContent =
      book.volumeInfo.title;
    clonedBookTemplate.querySelector(".book-author").textContent =
      book.volumeInfo.authors?.join(", ") || "No info";
    clonedBookTemplate.querySelector(".book-year").textContent =
      book.volumeInfo?.publishedDate || 2009;
    clonedBookTemplate.querySelector(".bookmark__add-btn").dataset.movieId =
      book.id;
    booksFragment.appendChild(clonedBookTemplate);
    elResult.textContent = result;
  });

  element.appendChild(booksFragment);
};

const getBooks = async () => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&maxResults=${maxResult}`
  );

  const data = await response.json();
  renderBooks(data, elBooksList);
};
getBooks();

elNewestBtn.addEventListener("click", () => {
  page = 0;
  elBooksList.innerHTML = null;
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&maxResults=${maxResult}&orderBy=newest`
  )
    .then((response) => response.json())
    .then((data) => renderBooks(data, elBooksList));
});

elSearchInput.addEventListener("change", (evt) => {
  search = evt.target.value;
  elBooksList.innerHTML = null;
  page = 0;
  getBooks();
});
