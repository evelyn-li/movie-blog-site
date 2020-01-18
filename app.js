var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	mongoose = require("mongoose"),
	Movie = require("./models/movie"),
	Comment = require("./models/comment"),
	seedDB = require("./seeds")


// APP CONFIG
// seedDB()
mongoose.connect("mongodb+srv://dbEvelyn:DGT7PxG9v0lvlytA@cluster0-9wj0x.mongodb.net/final-project?retryWrites=true&w=majority")
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.use(methodOverride("_method"))


// ROUTES

app.get("/", function(req, res){
	res.redirect("/movies")
})

// INDEX ROUTE
app.get("/movies", function(req, res){
	Movie.find({}, function(err, movies){
		if(err){
			console.log("ERROR")
		} else {
			res.render("movies/index", {movies: movies})
		}
	})
})

// NEW ROUTE
app.get("/movies/new", function(req, res){
	res.render("movies/new")
})

// CREATE ROUTE
app.post("/movies", function(req, res){
	req.body.movie.body = req.sanitize(req.body.movie.body)
	Movie.create(req.body.movie, function(err, newMovie){
		if(err){
			res.render("movies/new")
		} else {
			res.redirect("/movies")
		}
	})
})

// SHOW ROUTE
app.get("/movies/:id", function(req, res){
	Movie.findById(req.params.id).populate("comments").exec(function(err, foundMovie){
		if(err){
			res.redirect("/movies")
		} else {
			console.log(foundMovie)
			res.render("movies/show", {movie: foundMovie})
		}
	})
})

// EDIT ROUTE
app.get("/movies/:id/edit", function(req, res){
	Movie.findById(req.params.id, function(err, foundMovie){
		if(err){
			res.redirect("/movies")
		} else {
			res.render("movies/edit", {movie: foundMovie})
		}
	})
})

// UPDATE ROUTE
app.put("/movies/:id", function(req, res){
	req.body.movie.body = req.sanitize(req.body.movie.body)
	Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie){
		if(err){
			res.redirect("/movies")
		} else {
			res.redirect("/movies/" + req.params.id)
		}
	})
})

// DELETE ROUTE
app.delete("/movies/:id", function(req, res){
	Movie.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/movies")
		} else {
			res.redirect("/movies")
		}
	})
})

// ==========================================================
// COMMENTS
// ==========================================================

// NEW COMMENT ROUTE
app.get("/movies/:id/comments/new", function(req, res){
	Movie.findById(req.params.id, function(err, movie){
		if(err){
			console.log(err)
		} else {
			res.render("comments/new", {movie: movie})
		}
	})
})

// CREATE COMMENT ROUTE
app.post("/movies/:id/comments", function(req, res){
	//find movie using ID
	Movie.findById(req.params.id, function(err, movie){
		if(err){
			console.log(err)
			res.redirect("/movies")
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				} else {
					//connect new comment to movie
					movie.comments.push(comment)
					movie.save()
					//redirect to movie show page
					res.redirect("/movies/" + movie._id)
				}
			})
		}
	})
})


app.listen(3000, function(){
	console.log("Movie App has started")
})