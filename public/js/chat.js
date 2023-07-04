/* eslint-env browser */
/* eslint-disable no-undef */
const socket = io();

socket.on( "message", ( message ) => {
  console.log( message );
} );

const messageForm = document.querySelector( "#message-form" );
messageForm.addEventListener( "submit", ( e ) => {
  e.preventDefault();
  const messageEl = document.querySelector( "#message" );
  const message = messageEl.value;
  socket.emit( "sendMessage", message );
  messageEl.value = "";
} );