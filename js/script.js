"use strict";

const elLogoutBtn = document.querySelector(".logout");
const localToken = window.localStorage.getItem("token");
const elSearchInput = document.querySelector(".search__input");
const elResult = document.querySelector(".result");
const elNewestBtn = document.querySelector(".newest__btn");
const elBooksList = document.querySelector(".books__list");
const elBookmarkList = document.querySelector(".bookmark__list");
const elBookmarkItem = document.querySelector(".bookmark__item");
const elResultTemplate = document.querySelector(
  ".search__books-template"
).content;
const elBookmarkedTemplate = document.querySelector(
  ".bookmarked__books-template"
).content;

let search = " harry potter";
let page = 0;
let result;
let maxResult = 6;

// Logout functions
if (!localToken) {
  window.location.replace("login.html");
}

elLogoutBtn.addEventListener("click", function () {
  window.localStorage.removeItem("token");

  window.location.replace("login.html");
});

// Bookmark
let newbookmarkedBooks =
  JSON.parse(window.localStorage.getItem("bookmarkedBooks")) || [];

const bookmarkedBooks = (arr, element) => {
  const bookmarkFragment = document.createDocumentFragment();

  arr.forEach((bookmark) => {
    const clonedBookmarkTemplate = elBookmarkedTemplate.cloneNode(true);
    clonedBookmarkTemplate.querySelector(".bookmark__title").textContent =
      bookmark.volumeInfo.title;
    clonedBookmarkTemplate.querySelector(".bookmark__authors").textContent =
      bookmark.volumeInfo.authors?.join(", ") || "No info";
    clonedBookmarkTemplate.querySelector(
      ".delete__book-btn"
    ).dataset.bookmarkId = bookmark.id;
    bookmarkFragment.appendChild(clonedBookmarkTemplate);
  });

  element.appendChild(bookmarkFragment);
};

elBookmarkList.addEventListener("click", (evt) => {
  const bookmarkedRemoveBtn = evt.target.dataset.bookmarkId;
  if (evt.target.matches(".delete__book-btn")) {
    let foundBookIndex = newbookmarkedBooks.findIndex(
      (book) => book.id === bookmarkedRemoveBtn
    );
    newbookmarkedBooks.splice(foundBookIndex, 1);

    elBookmarkList.innerHTML = null;

    window.localStorage.setItem(
      "bookmarkedBooks",
      JSON.stringify(newbookmarkedBooks)
    );

    if (newbookmarkedBooks.length === 0) {
      window.localStorage.removeItem("bookmarkedBooks");
    }
    bookmarkedBooks(newbookmarkedBooks, elBookmarkList);
  }
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
    clonedBookTemplate.querySelector(".bookmark__add-btn").dataset.bookId =
      book.id;
    booksFragment.appendChild(clonedBookTemplate);
    elResult.textContent = result;
  });

  element.appendChild(booksFragment);

  // Add to bookmark array
  element.addEventListener("click", (evt) => {
    let bookmarkId = evt.target.dataset.bookId;

    if (evt.target.matches(".bookmark__add-btn")) {
      const foundElement = arr.find((book) => book.id === bookmarkId);

      window.localStorage.setItem(
        "bookmarkedBooks",
        JSON.stringify(newbookmarkedBooks)
      );
      if (!newbookmarkedBooks.includes(foundElement)) {
        newbookmarkedBooks.push(foundElement);
        window.localStorage.setItem(
          "bookmarkedBooks",
          JSON.stringify(newbookmarkedBooks)
        );
      }
      elBookmarkList.innerHTML = null;

      bookmarkedBooks(newbookmarkedBooks, elBookmarkList);
    }

    if (evt.target.matches(".read__btn")) {
    }
  });
};
bookmarkedBooks(newbookmarkedBooks, elBookmarkList);
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
