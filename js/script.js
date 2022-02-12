"use strict";

let search = "disney";
let page = 0;
let pagesCount;
let maxResult = 6;

const elLogoutBtn = document.querySelector(".logout");
const localToken = window.localStorage.getItem("token");
const elSearchInput = document.querySelector(".search__input");
const elResult = document.querySelector(".result");
const elNewestBtn = document.querySelector(".newest__btn");
const elBooksList = document.querySelector(".books__list");
const elModal = document.querySelector(".info__modal");
const elCloseModal = document.querySelector(".close__modal");
const elOverlay = document.querySelector(".overlay");
const elCardButtons = document.querySelector(".buttons");
const elBookmarkList = document.querySelector(".bookmark__list");
const elBookmarkItem = document.querySelector(".bookmark__item");
const elPagination = document.querySelector(".pagination__list");
const elResultTemplate = document.querySelector(
  ".search__books-template"
).content;
const elBookmarkedTemplate = document.querySelector(
  ".bookmarked__books-template"
).content;
const elPaginationTemplate = document.querySelector(
  ".pagination__template"
).content;
const elModalTemplate = document.querySelector(".modal__template").content;

/////////////////////////////////////////
/////////////////////////////////////////

const closeModal = function () {
  elModal.classList.add("hidden");
  elOverlay.classList.add("hidden");
};

// Logout functions
if (!localToken) {
  window.location.replace("login.html");
}

elLogoutBtn.addEventListener("click", function () {
  window.localStorage.removeItem("token");

  window.location.replace("login.html");
});

/////////////////////////////////////////////

let newbookmarkedBooks =
  JSON.parse(window.localStorage.getItem("bookmarkedBooks")) || [];

//////////////////////////////////////////

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

    clonedBookmarkTemplate.querySelector(".read__book-btn").href =
      bookmark?.volumeInfo.previewLink;

    bookmarkFragment.appendChild(clonedBookmarkTemplate);
    element.appendChild(bookmarkFragment);
  });
};
bookmarkedBooks(newbookmarkedBooks, elBookmarkList);

// BOOKMARK EVENTS
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

/////////////////////////////////////////////
/////////////////////////////////////////////

// PAGINATION;
const paginate = (page) => {
  let pages = Math.ceil(page / maxResult);

  // elPagination.innerHTML = null;
  var elPaginationItemsFragment = document.createDocumentFragment();

  for (let i = 1; i < pages; i++) {
    const elNewPaginationItem = elPaginationTemplate.cloneNode(true);

    elNewPaginationItem.querySelector(".pagination__page-num").textContent = i;

    elPaginationItemsFragment.appendChild(elNewPaginationItem);
  }
  elPagination.appendChild(elPaginationItemsFragment);
};

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

const renderBooks = (arr, element) => {
  pagesCount = arr.totalItems;

  paginate(pagesCount);

  arr = arr.items;

  const booksFragment = document.createDocumentFragment();
  arr.forEach((book) => {
    const clonedBookTemplate = elResultTemplate.cloneNode(true);
    clonedBookTemplate.querySelector(".book__img").src =
      book.volumeInfo?.imageLinks.smallThumbnail;
    clonedBookTemplate.querySelector(".card__title").textContent =
      book.volumeInfo.title;
    clonedBookTemplate.querySelector(".book-author").textContent =
      book.volumeInfo.authors?.join(", ");
    clonedBookTemplate.querySelector(".book-year").textContent =
      book.volumeInfo?.publishedDate || "No info";
    clonedBookTemplate.querySelector(".bookmark__add-btn").dataset.bookId =
      book.id;
    clonedBookTemplate.querySelector(".more__btn").dataset.bookId = book.id;
    clonedBookTemplate.querySelector(".read__btn").href =
      book.volumeInfo?.previewLink;
    booksFragment.appendChild(clonedBookTemplate);
    elResult.textContent = pagesCount;
  });

  // CARDS EVENTS
  elBooksList.addEventListener("click", (evt) => {
    if (evt.target.matches(".bookmark__add-btn")) {
      let bookmarkId = evt.target.dataset.bookId;
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

        elBookmarkList.innerHTML = null;

        bookmarkedBooks(newbookmarkedBooks, elBookmarkList);
      }
    }
    if (evt.target.matches(".more__btn")) {
      elModal.innerHTML = null;
      let infoId = evt.target.dataset.bookId;

      const modalFragment = document.createDocumentFragment();
      const foundElement = arr.find((book) => book.id === infoId);
      const clonedBookTemplate = elModalTemplate.cloneNode(true);

      clonedBookTemplate.querySelector(".modal__title").textContent =
        foundElement.volumeInfo.title;
      clonedBookTemplate.querySelector(".modal__img").src =
        foundElement.volumeInfo?.imageLinks.smallThumbnail;

      clonedBookTemplate.querySelector(".modal__book-info").textContent =
        foundElement.volumeInfo?.description;

      clonedBookTemplate.querySelector(".authors__values").textContent =
        foundElement.volumeInfo?.authors[0];

      clonedBookTemplate.querySelector(".published__values").textContent =
        foundElement.volumeInfo?.publishedDate;

      clonedBookTemplate.querySelector(".publishers__values").textContent =
        foundElement.volumeInfo?.publisher;

      clonedBookTemplate.querySelector(".count__values").textContent =
        foundElement.volumeInfo?.pageCount;

      clonedBookTemplate.querySelector(".modal__read-btn").href =
        foundElement.volumeInfo?.previewLink;

      modalFragment.appendChild(clonedBookTemplate);
      elModal.appendChild(modalFragment);

      elModal.classList.remove("hidden");
      elOverlay.classList.remove("hidden");
    }
    // elCloseModal.addEventListener("click", () => closeModal);
    elOverlay.addEventListener("click", () => closeModal());
  });

  element.appendChild(booksFragment);
};

/////////////////////////////////////////////////////
/////////////////////////////////////////////////////

// GET NEWEST BOOKS

elNewestBtn.addEventListener("click", () => {
  page = 0;
  elBooksList.innerHTML = null;
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&maxResults=${maxResult}&orderBy=newest`
  )
    .then((response) => response.json())
    .then((data) => renderBooks(data, elBooksList));
});

/////////////////////////////////////////////
/////////////////////////////////////////////

// SEARCH BOOKS
elSearchInput.addEventListener("change", (evt) => {
  search = evt.target.value;

  elBooksList.innerHTML = null;
  page = 0;
  getBooks();
});

///////////////////////////////////////////////
//////////////////////////////////////////////

// GET AIP

const getBooks = async () => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${search}&startIndex=${page}&maxResults=${maxResult}`
    );
    const data = await response.json();
    renderBooks(data, elBooksList);
    console.log(data);
  } catch (err) {
    // console.log(err);
    pagesCount = 0;
    elResult.textContent = 0;
  }
};
getBooks();
