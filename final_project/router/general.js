const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message:`User ${username} registered`});
        }
        else {
            return res.status(400).json({message:`User ${username} already registered`});
        }
    }
    else {
        return res.status(404).json({message: "Must provide username and password"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn]);
    } else {
        return res.status(404).json({message: `ISBN: ${isbn} not found!`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let matchingBooks = Object.values(books).filter((book) => book.author === author);
    if (matchingBooks.length > 0) {
        return res.send(matchingBooks);
    } else {
        return res.status(404).json({message: `Author: ${author} not found!`});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let matchingBooks = Object.values(books).filter((book) => book.title.includes(title));
    if (matchingBooks.length > 0) {
        return res.send(matchingBooks);
    } else {
        return res.status(404).json({message: `Title: ${title} not found!`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.send(books[isbn].reviews);
    } else {
        return res.status(404).json({message: `ISBN: ${isbn} not found!`});
    }
});

module.exports.general = public_users;
