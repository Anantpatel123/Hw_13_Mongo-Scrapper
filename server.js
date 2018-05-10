var express = require("express");//installed
var bodyParser = require("body-parser");//installed
var logger = require("morgan");
var mongoose = require("mongoose");//installed
// var mongojs = require("mongojs");

var request = require("request");//installed

var axios = require("axios");
var cheerio = require("cheerio");//installed

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var exphbs = require("express-handlebars");//installed

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/NYTimes");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/NYTimes";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// --------------------------Routes---------------------------------------
// --------------------------Routes---------------------------------------

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/section/world?action=click&pgtype=Homepage&region=TopBar&module=HPMiniNav&contentCollection=World&WT.nav=page/"
).then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every article tag, and do the following:
    $("article").each(function(i, element) {

      var result = {};
      result.title = $(this).find("h2.headline").text();
      result.link = $(this).find("a").attr("href");
      result.summary = $(this).find("p.summary").text();
              
      //Create a new Article using the `result` object built from scraping
      if (result.title !== "" && result.link !== "" && result.summary !== "") {
        
      db.Article.create(result)
      .then(function(allArticles) {
        // View the added result in the console
        // console.log("added articles to db ", allArticles); //works
        
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        return res.json(err);
      });
    }//if ends here

  });  
    res.send("Scrape Complete");          
  });
  
});

// Route for getting all Articles from the db
app.get("/all", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
    db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
      // console.log("get all articles ", dbArticle);//works
    })
  });

//GET requests to render Handlebars home page
app.get("/", function(req, res) {
  db.Article.find({"saved": false}, function(error, data) {
    var hbsObject = {
      article: data
    };
    // console.log("Get ALL articles ", hbsObject);//works
    res.render("home", hbsObject);
  });
});

// Save articles then populate
app.put("/saved/:id", function(req, res) {
  db.Article.update({_id: req.params.id}, {$set: {saved: req.body.saved} 
  }).then(function (dbArticle) {
    // console.log(dbArticle)
    res.json(dbArticle);    
  })
    .catch(function(err) {    
    res.json(err);
  });
});

//this way save page shows up with no data.
app.get("/articles/", function(req, res) {
  db.Article.find({saved: true})
    .then(function(dbArticle) {
      console.log(dbArticle)
      res.render("saved", {dbArticle});
    })
    .catch(function(error) {
      res.json(error);    
  });
});


// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
   db.Article.findOne({ _id: req.params.id })
   // ..and populate all of the notes associated with it
   .populate("note")
   .then(function(dbArticle) {
     // If we were able to successfully find an Article with the given id, send it back to the client
     res.json(dbArticle);
     console.log("grab the article ", dbArticle);
   })
   .catch(function(err) {
     // If an error occurred, send it to the client
     res.json(err);
   });    
});



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
