const Frontsocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const nickname = document.getElementById("nickname");
const nameform = nickname.querySelector("#name");
const chat = document.getElementById("chat");

chat.hidden = true;

let Roomname;

function AddMessage(message){
    const ul = chat.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function Showroom(){
    welcome.hidden = true;
    nickname.hidden = true;
    chat.hidden = false;
    const h3 = chat.querySelector("h3");
    h3.innerText = `This room is ${Roomname}`;
    const messageform = chat.querySelector("#message");
    messageform.addEventListener("submit", function(event){
        event.preventDefault();
        const input = chat.querySelector("#message input");
        const value = input.value;
        Frontsocket.emit("message", input.value, Roomname, function(){
            AddMessage(`You : ${value}`);
        });
        input.value = "";
    });
}

form.addEventListener("submit", function(event){
    event.preventDefault();
    const input = form.querySelector("input");
    Frontsocket.emit("Enter", input.value, Showroom);
    Roomname = input.value;
    input.value = "";
});

nameform.addEventListener("submit", function(event){
    event.preventDefault();
    const input = nameform.querySelector("#name input");
    Frontsocket.emit("nickname", input.value);
});

Frontsocket.on("welcome", function(user){
    AddMessage(`${user} joined`);
});

Frontsocket.on("bye", function(user){
    AddMessage(`${user} lefted`);
});

Frontsocket.on("message", AddMessage);

/*
const Nickform = document.querySelector("#nick");
const Messageform = document.querySelector("#message");
const Messagelist = document.querySelector("ul");
const Frontsocket = new WebSocket(`ws://${window.location.host}`);

function Makemessage(type, payload){
    const msg = {type, payload};
    return JSON.stringify(msg);
}

Frontsocket.addEventListener("open", function(){
    console.log("Connected to server");
});

Frontsocket.addEventListener("message", function(message){
    const li = document.createElement("li");
    li.innerText = message.data;
    Messagelist.append(li);
});

Frontsocket.addEventListener("close", function(){
    console.log("Disconnected from server");
});

Messageform.addEventListener("submit", function(event){
    event.preventDefault();
    const input = Messageform.querySelector("input");
    Frontsocket.send(Makemessage("new_message", input.value));
    input.value = "";
});

Nickform.addEventListener("submit", function(event){
    event.preventDefault();
    const input = Nickform.querySelector("input");
    Frontsocket.send(Makemessage("nickname", input.value));
    input.value="";
});
*/