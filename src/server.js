import http from "http";
import SocketIO from "socket.io"
import express from "express";

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

const handleListen = function(){
    console.log("Listening on http://localhost:3000");
};

const server = http.createServer(app);
const IoServer = SocketIO(server);

IoServer.on("connection", function(Backsocket){
    Backsocket.on("nickname", function(nickname){
       Backsocket["nickname"] = nickname; 
    });
    Backsocket.onAny(function(event){
        console.log(`Backsocket event : ${event}`);
    });
    Backsocket.on("Enter", function(Roomname, func){
        Backsocket.join(Roomname);
        func();
        Backsocket.to(Roomname).emit("welcome", Backsocket.nickname);
    });
    Backsocket.on("disconnecting", function(){
        Backsocket.rooms.forEach(function(room){
            Backsocket.to(room).emit("bye", Backsocket.nickname);
        });
    });
    Backsocket.on("message", function(message,room,func){
        Backsocket.to(room).emit("message", `${Backsocket.nickname} : ${message}`);
        func();
    });
});

server.listen(3000, handleListen);

/*
const Backsockets=[];

wss.on("connection", function(Backsocket){
    Backsockets.push(Backsocket);
    Backsocket["nickname"] = "Anon";
    console.log("Connected to browser");
    Backsocket.on("close", function(){
        console.log("Disconnected from browser");
    });
    Backsocket.on("message", function(message){
        const ParsedMessage = JSON.parse(message);
        switch(ParsedMessage.type){
            case "new_message":
                Backsockets.forEach(function(Asocket){
                    Asocket.send(`${Backsocket.nickname}: ${ParsedMessage.payload}`);
                });
            case "nickname":
                Backsocket["nickname"] = ParsedMessage.payload;
        }
    });
});
*/