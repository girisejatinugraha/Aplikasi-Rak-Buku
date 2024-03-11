(() => {
  let books = [];

  function addBookToShelf(event) {
    event.preventDefault();

    const titleInput = document.querySelector("#inputBookTitle");
    const authorInput = document.querySelector("#inputBookAuthor");
    const yearInput = document.querySelector("#inputBookYear");
    const isCompleteInput = document.querySelector("#inputBookIsComplete");
    const descriptionInput = document.querySelector("#inputBookDescription");
    const imageInput = document.querySelector("#inputBookImage"); 

    let imageUrl = "";
    if (imageInput.files.length > 0) {
      const selectedImage = imageInput.files[0];
      imageUrl = URL.createObjectURL(selectedImage);
    }

    const newBook = {
      id: +new Date(),
      title: titleInput.value,
      author: authorInput.value,
      year: parseInt(yearInput.value),
      isComplete: isCompleteInput.checked,
      description: descriptionInput.value,
      imageUrl: imageUrl, 
    };

    books.push(newBook);
    document.dispatchEvent(new Event("bookChanged"));

    titleInput.value = "";
    authorInput.value = "";
    yearInput.value = "";
    isCompleteInput.checked = false;
    descriptionInput.value = "";
    imageInput.value = ""; 
  }

  function searchBooks(event) {
    event.preventDefault();

    const searchInput = document.querySelector("#searchBookTitle");
    const query = searchInput.value;

    if (query) {
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(query.toLowerCase())
      );
      displayBooks(filteredBooks);
    } else {
      displayBooks(books);
    }
  }

  function markAsComplete(event) {
    const bookId = Number(event.target.dataset.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      const isConfirmed = window.confirm(
        "Are you sure you have finished reading this book?"
      );
      if (isConfirmed) {
        books[bookIndex] = { ...books[bookIndex], isComplete: true };
        document.dispatchEvent(new Event("bookChanged"));
      }
    }
  }

  function markAsIncomplete(event) {
    const bookId = Number(event.target.dataset.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      const isConfirmed = window.confirm(
        "Are you sure you haven't finished reading this book?"
      );
      if (isConfirmed) {
        books[bookIndex] = { ...books[bookIndex], isComplete: false };
        document.dispatchEvent(new Event("bookChanged"));
      }
    }
  }

  function deleteBook(event) {
    const bookId = Number(event.target.dataset.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);

    if (bookIndex !== -1) {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this book?"
      );
      if (isConfirmed) {
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event("bookChanged"));
      }
    }
  }

  function editBook(event) {
    const bookId = Number(event.target.dataset.id);
    const bookIndex = books.findIndex((book) => book.id === bookId);
  
    if (bookIndex !== -1) {
      const editedBook = books[bookIndex];
  
      const titleInput = document.querySelector("#inputBookTitle");
      const authorInput = document.querySelector("#inputBookAuthor");
      const yearInput = document.querySelector("#inputBookYear");
      const isCompleteInput = document.querySelector("#inputBookIsComplete");
      const descriptionInput = document.querySelector("#inputBookDescription");
  
      const confirmation = window.confirm("Do you want to edit this book?");
      
      if (confirmation) {
        titleInput.value = editedBook.title;
        authorInput.value = editedBook.author;
        yearInput.value = editedBook.year;
        isCompleteInput.checked = editedBook.isComplete;
        descriptionInput.value = editedBook.description;
  
        books.splice(bookIndex, 1);
        document.dispatchEvent(new Event("bookChanged"));
      }
    }
  }
  

  function displayBooks(bookList) {
    const incompleteBookshelfList = document.querySelector(
      "#incompleteBookshelfList"
    );
    const completeBookshelfList = document.querySelector(
      "#completeBookshelfList"
    );

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for (const book of bookList) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");

      const bookTitle = document.createElement("h3");
      bookTitle.innerText = book.title;

      const authorInfo = document.createElement("p");
      authorInfo.innerText = "Author: " + book.author;

      const yearInfo = document.createElement("p");
      yearInfo.innerText = "Year: " + book.year;

      const descriptionInfo = document.createElement("p");
      descriptionInfo.innerText = "Description: " + book.description;

      if (book.imageUrl) {
        const imageInfo = document.createElement("img");
        imageInfo.src = book.imageUrl;
        imageInfo.alt = "Book Image";
        bookItem.appendChild(imageInfo);
      }

      bookItem.appendChild(bookTitle);
      bookItem.appendChild(authorInfo);
      bookItem.appendChild(yearInfo);
      bookItem.appendChild(descriptionInfo);

      const actionContainer = document.createElement("div");
      actionContainer.classList.add("action");

      const completeButton = document.createElement("button");
      completeButton.dataset.id = book.id;
      completeButton.innerText = book.isComplete
        ? "Not Finished Reading"
        : "Finished Reading";
      completeButton.classList.add(book.isComplete ? "red" : "green");
      completeButton.addEventListener(
        "click",
        book.isComplete ? markAsIncomplete : markAsComplete
      );

      const editButton = document.createElement("button");
      editButton.dataset.id = book.id;
      editButton.innerText = "Edit Book";
      editButton.classList.add("blue", "yellow"); 
      editButton.addEventListener("click", editBook);

      const deleteButton = document.createElement("button");
      deleteButton.dataset.id = book.id;
      deleteButton.innerText = "Delete Book";
      deleteButton.classList.add("red");
      deleteButton.addEventListener("click", deleteBook);

      actionContainer.appendChild(completeButton);
      actionContainer.appendChild(editButton);
      actionContainer.appendChild(deleteButton);

      bookItem.appendChild(actionContainer);

      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    }
  }

  function saveBooksToLocalStorage(books) {
    localStorage.setItem("books", JSON.stringify(books));
  }

  window.addEventListener("load", () => {
    books = JSON.parse(localStorage.getItem("books")) || [];
    displayBooks(books);

    const inputBookForm = document.querySelector("#inputBook");
    const searchBookForm = document.querySelector("#searchBook");

    inputBookForm.addEventListener("submit", addBookToShelf);
    searchBookForm.addEventListener("submit", searchBooks);
    document.addEventListener("bookChanged", () => {
      saveBooksToLocalStorage(books);
      displayBooks(books);
    });
  });
})();