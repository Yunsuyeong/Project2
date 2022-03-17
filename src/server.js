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

const server = http.createServer(app);
const IoServer = SocketIO(server);

IoServer.on("connection", function(Backsocket){
    Backsocket.on("Enter", function(roomName){
        Backsocket.join(roomName);
        Backsocket.to(roomName).emit("Welcome");
    });
    Backsocket.on("Offer", function(offer, roomName){
        Backsocket.to(roomName).emit("offer", offer);
    });
    Backsocket.on("Answer", function(answer, roomName){
        Backsocket.to(roomName).emit("answer", answer);
    });
    Backsocket.on("Ice", function(ice, roomName){
        Backsocket.to(roomName).emit("ice", ice);
    });
});

const handleListen = function(){
    console.log("Listening on http://localhost:3000");
};

server.listen(3000, handleListen);

/*
function PublicRooms(){
    const {
        sockets:{
            adapter: { sids, rooms },
        },
    } = IoServer;
    const PublicRooms = [];
    rooms.forEach(function(_, key){
        if(sids.get(key)===undefined){
            PublicRooms.push(key);
        }
    });
    return PublicRooms;
}

function CountRoom(roomName){
    return IoServer.sockets.adapter.rooms.get(roomName)?.size;
}

IoServer.on("connection", function(Backsocket){
    Backsocket.on("nickname", function(nickname){
       Backsocket["nickname"] = nickname; 
    });
    Backsocket.onAny(function(event){
        console.log(`Backsocket event : ${event}`);
    });
    Backsocket.on("Enter", function(roomName, func){
        Backsocket.join(roomName);
        func();
        Backsocket.to(roomName).emit("welcome", Backsocket.nickname, CountRoom(roomName));
        IoServer.sockets.emit("change", PublicRooms());
    });
   
    Backsocket.on("disconnecting", function(){
        Backsocket.rooms.forEach(function(room){
            Backsocket.to(room).emit("bye", Backsocket.nickname, CountRoom(room)-1);
        });
    });
    Backsocket.on("disconnect", function(){
        IoServer.sockets.emit("change", PublicRooms());
    });
    Backsocket.on("message", function(message,room,func){
        Backsocket.to(room).emit("message", `${Backsocket.nickname} : ${message}`);
        func();
    });
});
*/


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