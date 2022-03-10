const express = require('express');

const app = express();

app.set("view engine", "pug");

app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", function(request, response){
    response.render("home");
});

app.get("/*", function(request, response){
    response.redirect("/");
});

app.listen(3000);