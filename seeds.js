var mongoose = require("mongoose");
var Movie = require("./models/movie");
var Comment   = require("./models/comment");

var data = [
    {
        title: "Test 1", 
        image: "https://cdn.pixabay.com/photo/2020/01/12/07/49/tv-tower-4759430__340.jpg",
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        title: "Test 2", 
        image: "https://cdn.pixabay.com/photo/2020/01/11/07/39/north-4756774__340.jpg",
        body: "Blah Blah Blah "
    },
    {
        title: "Test 3", 
        image: "https://cdn.pixabay.com/photo/2020/01/05/05/39/city-4742329__340.jpg",
        body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
   //Remove all movies
   Movie.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed movies!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few movies
            data.forEach(function(seed){
                Movie.create(seed, function(err, movie){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a movie");
                        //create a comment
                        Comment.create(
                            {
                                text: "That's a good movie",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    movie.comments.push(comment);
                                    movie.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
module.exports = seedDB;
