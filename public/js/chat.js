/* eslint-env browser */
/* eslint-disable no-undef */
const socket = io();

// Elements
const $messageForm = document.querySelector( "#message-form" );
const $messageFormInput = $messageForm.querySelector( "input" );
const $messageFormButton = $messageForm.querySelector( "button" );
const $sendLocationButton = document.querySelector( "#send-location" );
const $messages = document.querySelector( "#messages" );

// Templates
const messageTemplate = document.querySelector( "#message-template" ).innerHTML;
const locationMessageTemplate = document.querySelector( "#location-message-template" ).innerHTML;
const sidebarTemplate = document.querySelector( "#sidebar-template" ).innerHTML;

// Options
const { username, room } = Qs.parse( location.search, { ignoreQueryPrefix: true } );
const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle( $newMessage );
  const newMessageMargin = parseInt( newMessageStyles.marginBottom );
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How far have we scrolled?
  const scrolledOffset = $messages.scrollTop + visibleHeight;

  if( containerHeight - newMessageHeight <= scrolledOffset ){
    $messages.scrollTop = $messages.scrollHeight;
  }
};

socket.on( "message", ( message ) => {
  const html = Mustache.render( messageTemplate, {
    username: message.username,
    createdAt: moment( message.createdAt ).format( "HH:mm:ss" ),
    message: message.text
  } );
  $messages.insertAdjacentHTML( "beforeend", html );
  autoscroll();
} );

socket.on( "locationMessage", ( message ) => {
  console.log( message );
  const html = Mustache.render( locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment( message.createdAt ).format( "HH:mm:ss" )
  } );
  $messages.insertAdjacentHTML( "beforeend", html );
  autoscroll();
} );

socket.on( "roomData", ( { room, users } ) => {
  const html = Mustache.render( sidebarTemplate, {
    room,
    users
  } );
  document.querySelector( "#sidebar" ).innerHTML = html;
} );

$messageForm.addEventListener( "submit", ( e ) => {
  e.preventDefault();
  // disable send button
  $messageFormButton.setAttribute( "disabled", "disabled" );
  const message = $messageFormInput.value;
  socket.emit( "sendMessage", message, ( error ) => {
    // enable send button
    $messageFormButton.removeAttribute( "disabled" );
    $messageFormInput.value = "";
    $messageFormInput.focus();
    if( error ) {
      return console.log( error );
    }
    console.log( "Message delivered!" );
  } );
} );

$sendLocationButton.addEventListener( "click", () => {
  if( !navigator.geolocation ){
    return alert( "Geolocation is not supported by your browser." );
  }
  $sendLocationButton.setAttribute( "disabled", "disabled" );
  navigator.geolocation.getCurrentPosition( ( position ) => {
    const lat = position.coords.latitude;
    const long = position.coords.longitude;
    socket.emit( "sendLocation", { lat, long }, ( ack ) => {
      if( ack ){
        $sendLocationButton.removeAttribute( "disabled" );
        return console.log( ack );
      }
    } );
  } );
} );

socket.emit( "join", { username, room }, ( error ) => {
  if( error ) {
    alert( error );
    location.href = "/";
  }
} );