const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let {username,password} = req.body;
  if (isValid(username) === true) {
    users.push({username, password});
    res.status(201).json({message: `User with name :${username} created`});
  } else {
    res.status(400).json({message: "User not created"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let bookList = JSON.stringify(books);
  return res.status(200).json(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }       
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let bookList = [];
  for (let book in books) {
    if (books[book].author === author) {
      bookList.push(books[book]);
    }
  }
  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  } else {
    return res.status(404).json({message: "Author not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
 let title = req.params.title;
  let bookList = [];
  for (let book in books) {
    if (books[book].title === title) {
      bookList.push(books[book]);
    }
  }
  if (bookList.length > 0) {
    return res.status(200).json(bookList);
  } else {
    return res.status(404).json({message: `Book with title:${title} not found`});
  }
  
});

//  Get book review
public_users.get('/review/:isbn',  function  (req, res) {
  let isbn = req.params.isbn;
  let bookReviews = [];
  if (books[isbn]) {
    for (let i in books[isbn].reviews) {
      bookReviews.push(books[isbn].reviews[i]);
    }
    return  res.status(200).json(bookReviews);
  } else {
    return res.status(404).json({message: "Book's review  not found"});
  }
  
});

module.exports.general = public_users;
