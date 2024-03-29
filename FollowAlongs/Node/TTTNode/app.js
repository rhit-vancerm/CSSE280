const express = require("express");

var app = express();
app.use(express.static("public"));



app.get("/api/getmove/:board", (req, res) => {
    const boardString = req.params.board;
    const openings = getOpenLocations(boardString);

    const moveSelected = openings[Math.floor(Math.random() * openings.length)];


    res.send({"move": moveSelected});
})



function getOpenLocations(boardString) {
 const openLocations = [];
 for (var i = 0; i < boardString.length; i++) {
   if (boardString.charAt(i) == '-') {
     openLocations.push(i)
   }
 }
 return openLocations;
}

console.log(getOpenLocations("-OO-OOOOO"));



app.listen(3000);

