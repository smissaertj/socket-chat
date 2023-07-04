/* eslint-env browser */
/* eslint-disable no-undef */
const socket = io();

socket.on( "countUpdated", ( count ) => {
  console.log( "The count has been updated!", count );
} );

const incrementCount = document.querySelector( "#increment" );
incrementCount.addEventListener( "click", ()=> {
  console.log( "Clicked" );
  socket.emit( "increment" );
} );