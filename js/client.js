const socket = io('http://localhost:3000');

const form = document.getElementById('send-container');
const inpMessage = document.getElementById('inpMessage');
const messageContainer = document.querySelector('.message-container');
const username = document.getElementById('user');
const mutebtn = document.getElementById('mute');
const image = document.getElementsByTagName('img');
var audio = new Audio('../notify.mp3');
var muteflag = false;

mutebtn.addEventListener('click', () => {
  if (!muteflag) {
    image[0].src = './icons/mute.png';
    muteflag = true;
  } else {
    image[0].src = './icons/unmute.png';
    muteflag = false;
  }
});

const append = (message, position) => {
  let d = new Date();
  let hr = d.getHours();
  let min = d.getMinutes();
  let time = hr + ':' + min;
  const messageElement = document.createElement('div');
  const paraElement = document.createElement('p');
  const spanElement = document.createElement('span');
  paraElement.innerText = message;
  spanElement.innerText = time;
  messageElement.classList.add(position);
  messageElement.append(paraElement);
  messageElement.append(spanElement);
  messageContainer.append(messageElement);
  if (position === 'left' && !muteflag) {
    audio.play();
  }
};

const name = prompt('Enter your name to join: ');
username.innerHTML = name;
socket.emit('new-user-joined', name);

socket.on('user-joined', (name) => {
  if (name !== null && name !== '') append(`${name} joined the chat`, 'left');
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = inpMessage.value;
  append(`You: ${message}`, 'right');
  socket.emit('send', message);
  inpMessage.value = '';
});

socket.on('receive', (data) => {
  append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', (message) => {
  append(`${message} left the chat`, 'left');
});
