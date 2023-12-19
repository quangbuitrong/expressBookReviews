const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const isbnNum = parseInt(isbn);
        getBooks()
        .then((bks) => {
            if (bks[isbnNum]) {
                resolve(bks[isbnNum]);
            } else {
                reject({status:404, message:`ISBN ${isbnNum} not found!`});
            }
        });
    })
}

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
    return getBooks().then((bks) => res.send(JSON.stringify(bks)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bks) => Object.values(bks))
    .then((bks) => bks.filter((bk) => bk.author === author))
    .then((matchingBooks) => res.send(matchingBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bks) => Object.values(bks))
    .then((bks) => bks.filter((bk) => bk.title.includes(title)))
    .then((matchingBooks) => res.send(matchingBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBookByISBN(isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
    );
});

module.exports.general = public_users;
