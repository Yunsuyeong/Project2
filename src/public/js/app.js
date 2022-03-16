const Frontsocket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const nickname = document.getElementById("nickname");
const nameform = nickname.querySelector("#name");
const chat = document.getElementById("chat");
const list = document.getElementById("list");

chat.hidden = true;

let roomName;

function AddMessage(message){
    const ul = chat.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function AddList(name){
    const ul = list.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = name;
    ul.appendChild(li);
}

function DeleteList(){
    const ul = list.querySelector("ul");
    const lis = ul.getElementsByTagName("li");
    lis[0].remove();
}

function OnMessageSubmit(event){
    event.preventDefault();
    const input = chat.querySelector("#message input");
    const value = input.value;
    Frontsocket.emit("message", input.value, roomName, function(){
        AddMessage(`You : ${value}`);
    });
    input.value = "";
}

function OnNicknameSubmit(event){
    event.preventDefault();
    const input = nameform.querySelector("#name input");
    Frontsocket.emit("nickname", input.value);
}

function Showroom(){
    welcome.hidden = true;
    nickname.hidden = true;
    chat.hidden = false;
    const h3 = chat.querySelector("h3");
    h3.innerText = `${roomName}`;
    const messageform = chat.querySelector("#message");
    messageform.addEventListener("submit", OnMessageSubmit);
}

function OnChatSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    Frontsocket.emit("Enter", input.value, Showroom);
    roomName = input.value;
    input.value = "";
}


form.addEventListener("submit", OnChatSubmit);

nameform.addEventListener("submit", OnNicknameSubmit);

Frontsocket.on("welcome", function(user, count){
    const h3 = chat.querySelector("h3");
    h3.innerText = `${roomName} (${count})`;
    AddMessage(`${user} joined`);
    AddList(`${user}`);
});

Frontsocket.on("bye", function(user, count){
    const h3 = chat.querySelector("h3");
    h3.innerText = `${roomName} (${count})`;
    AddMessage(`${user} lefted`);
    DeleteList();
});

Frontsocket.on("message", AddMessage);

Frontsocket.on("change", function(rooms){
    const roomlist = welcome.querySelector("ul");
    roomlist.innerHTML="";
    if(rooms.length===0){
        return;
    }
    rooms.forEach(function(room){
        const li = document.createElement("li");
        li.innerText = room;
        roomlist.append(li);
    });
});

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