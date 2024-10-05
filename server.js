const express = require("express");
const body_parser = require("body-parser");
const app = express();


app.set('view engine', 'ejs');
app.use(body_parser.urlencoded({extended:true}));
app.use(express.static("p"))
app.use(body_parser.json());


const mysql = require('mysql');

// Create a connection
const connection = mysql.createConnection({
  host: 'localhost',  // Your MySQL host
  user: 'root',       // Your MySQL username
  password: '',  // Your MySQL password
  database: 'wiki'   // Your database name
});

// Connect to the database
connection.connect((err) => {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
    }
    console.log('Connected as id ' + connection.threadId);
  });

//route for all article///
app.route("/article").get(function(req, res){
  const query = "SELECT * FROM article";

  connection.query(query, (error, results, fields) => {
      if (error) throw error;
      res.send(results);
  });

}).post(function(req, res){
  let x = req.body.title;
  let y = req.body.content;
  const query = "INSERT INTO article (title, content) VALUES (?, ?)";

  connection.query(query,[x,y], (error,  results, fields) => {
      if (error) throw error;
      res.send("all good")
      //console.log('Inserted Row ID:', results.insertId);
  });

}).delete(function(req, res){
  const query = "DELETE FROM article";

  connection.query(query, (error,  results, fields) => {
      if (error) throw error;
      res.send("all good")
      //console.log('Inserted Row ID:', results.insertId);
  });
});




//route for a single article//

app.route("/article/:articleTitle")

.get(function(req, res){
  
  let article_title = req.params.articleTitle;
  console.log(article_title);
  const query = "SELECT * FROM article WHERE title = ?";
  connection.query(query,[article_title], (error,  results, fields) => {
    if (error) throw error;
    
    if(results.length == 0){
      res.send("No match found");
    }
    else{
      res.send(results);
    }
    //console.log('Inserted Row ID:', results.insertId);
});

})

.put(function(req, res){

  let article_title = req.params.articleTitle;
  let updated_title = req.body.title;
  let updated_content = req.body.content;
  console.log(updated_content);
  console.log(updated_title);

  console.log(article_title);
  const query = `
                UPDATE article 
                SET title = ? , content = ?
                WHERE title = ?`;

  connection.query(query,[updated_title, updated_content, article_title], (error,  results, fields) => {
    if (error) throw error;
    else{
      res.send("all good");
    }
    //console.log('Inserted Row ID:', results.insertId);
});
})

.patch(function(req, res){
  let articleTitle = req.params.articleTitle;
    let updatedFields = req.body; // This contains the fields to update

    // Array to store parts of the SET clause
    let setClause = [];
    // Array to store the values to be passed to the query
    let values = [];

    // Check if the title field is provided in the request body
    if (updatedFields.title) {
        setClause.push('title = ?');
        values.push(updatedFields.title);
    }

    // Check if the content field is provided in the request body
    if (updatedFields.content) {
        setClause.push('content = ?');
        values.push(updatedFields.content);
    }

    // If there are no fields to update, return an error response
    if (setClause.length === 0) {
        return res.status(400).send('No fields provided for update.');
    }

    // Add the article ID to the values array for the WHERE clause
    values.push(articleTitle);

    // Construct the final query with dynamic SET clause
    const query = `UPDATE article SET ${setClause.join(', ')} WHERE title = ?`;

    // Execute the query
    connection.query(query, values, (error, results, fields) => {
        if (error) throw error;

        if (results.affectedRows > 0) {
            res.send("Article updated successfully.");
        } else {
            res.status(404).send("Article not found.");
        }
    });
})

.delete(function(req, res){
  let article_title = req.params.articleTitle;

  const query = `DELETE FROM article WHERE title = ?`;

    // Execute the query
    connection.query(query, [article_title], (error, results, fields) => {
        if (error) throw error;
        res.send("Deleted successfully");
    });

});

  app.listen(3000 , function(){
    console.log("App started at 3000");
})
  
