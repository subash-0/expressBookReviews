const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];



const isValid = (username)=>{ 
if ( users.filter((user)=>user.username === username).length > 0 ){
  return false;
}else{
  return true;    
}
}

const authenticatedUser = (username,password)=>{ 
  if ( users.filter((user)=>user.username === username && user.password === password).length > 0 ){
    return true;
  }else{
    return false;    
  }
  } 


//only registered users can login
regd_users.post("/login", (req,res) => {
  let {username,password} = req.body;
  
  if (authenticatedUser(username,password) === true) {
    let accessToken = jwt.sign({username,password  }, 'access',{expiresIn: 24*3600});
    req.session.authorization = {accessToken,username,password};
    res.status(200).json({message: `User with name :${username} logged in`}); 
  }else{
    res.status(403).json({message: "User not authenticated"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 let isbn = req.params.isbn;
  let {review} = req.body;
  let username1;
  
  token = req.session.authorization['accessToken'];
  jwt.verify(token, "access",(err,user)=>{
    username1 = user.username;
  });
  console.log(username1);
  if (books[isbn]) {
    for(let i in books[isbn].reviews){
      if(books[isbn].reviews[i].username1===username1){
           books[isbn].reviews.review = review;
    }else{
      const reviewId = Object.keys(books[isbn].reviews).length + 1;
      books[isbn].reviews[reviewId] = { username1, review};
    }
   
    return res.status(200).json({message: "Review added"});
  } } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
