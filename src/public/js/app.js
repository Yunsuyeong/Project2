const Frontsocket = io();

const myface = document.getElementById("myface");
const muteButton = document.getElementById("mute");
const cameraButton = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const mikesSelect = document.getElementById("mikes");


let myStream;

let muted = false;
let cameraOff = false;

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera === camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        });
    } catch(e){
        console.log(e);
    }
}

async function getMikes(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mikes = devices.filter(device => device.kind === "audioinput");
        const currentMike = myStream.getAudioTracks()[0];
        mikes.forEach(mike => {
            const option = document.createElement("option");
            option.value = mike.deviceId;
            option.innerText = mike.label;
            if(currentMike === mike.label){
                option.selected = true;
            }
            mikesSelect.appendChild(option);
        });
    } catch(e){
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstraints= {
        audio:true,
        video: { facingMode : "user" },
    };
    const cameraConstraints= {
        audio:true,
        video: { deviceId : { exact : deviceId } },
    };
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        );
        myface.srcObject = myStream;
        if(!deviceId){
              await getCameras();
              await getMikes();
            }  
    } catch(e){
        console.log(e);
    }
}


function OnMuteClick(){
    myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
    if(!muted){
        muteButton.innerText = "Unmute";
        muted = true;
    } else{
        muteButton.innerText = "Mute";
        muted = false;
    }
}

function OnCameraClick(){
    myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
    if(cameraOff){
        cameraButton.innerText = "Turn Camera Off";
        cameraOff = false;
    } else{
        cameraButton.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

muteButton.addEventListener("click", OnMuteClick);
cameraButton.addEventListener("click", OnCameraClick);

/*
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
*/

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