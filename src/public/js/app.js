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