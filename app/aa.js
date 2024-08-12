// Constants
const KETNER_LAKE_API = 'http://localhost:3000/v1';
const TOUCH = ( 'ontouchstart' in document.documentElement ) ? true : false;

// account_id = account_id === null ? self.crypto.randomUUID() : account_id;
// window.localStorage.setItem( 'aa_account', account_id );

// Account
const popAccount = document.querySelector( '#account' );
const txtEmail = document.querySelector( '#email' );
const txtPassword = document.querySelector( '#password' );
const btnSignIn = document.querySelector( '#signin' );
btnSignIn.addEventListener( TOUCH ? 'touchstart' : 'click', () => {
  if( txtEmail.value === null ) {

  }

  const user = {
    email: txtEmail.value,
    password: txtPassword.value
  };

  fetch( `${KETNER_LAKE_API}/account/login`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify( user )
  } )
  .then( ( response ) => response.text() )
  .then( ( data ) => {
    console.log( data );
  } );
} );

// Header
const btnHeaderAdd = document.querySelector( '#header_add' );
btnHeaderAdd.addEventListener( TOUCH ? 'touchstart' : 'click', () => {
  stack.selectedIndex = 0;
  resetForm();
  popDetails.showPopover();
  txtFormTitle.focus();
} );

// Footer
const lblCount = document.querySelector( '#footer_count' );

// Form
const btnFormAdd = document.querySelector( '#form_add' );
btnFormAdd.addEventListener( 'click', () => {
  fetch( `${KETNER_LAKE_API}/event`, {
    headers: {
      'Content-Type': 'application/json',
      'x-anno-awesome': account_id
    }, 
    method: 'POST',
    body: JSON.stringify( {
      token: self.crypto.randomUUID(),
      startsAt: calFormStarts.value,
      endsAt: calFormEnds.value,
      summary: txtFormTitle.value,
      location: txtFormLocation.value,
      url: txtFormURL.value,
      description: txtFormNotes.value
    } )
  } );
} );
const btnFormCancel = document.querySelector( '#form_cancel' );
btnFormCancel.addEventListener( TOUCH ? 'touchstart' : 'mousedown', () => {
  popDetails.hidePopover();
} );
const txtFormTitle = document.querySelector( '#form_title' );
txtFormTitle.addEventListener( 'aa-change', () => {
  btnFormAdd.disabled = txtFormTitle.value === null ? true : false;
} );
const txtFormLocation = document.querySelector( '#form_location' );
const calFormStarts = document.querySelector( '#form_starts' );
const calFormEnds = document.querySelector( '#form_ends' );
const btnFormAttach = document.querySelector( 'aa-attachment' );
const txtFormURL = document.querySelector( '#form_url' );
const txtFormNotes = document.querySelector( '#form_notes' );

// Functions
function createEvent() {
  const now = new Date();
  return {
    id: self.crypto.randomUUID(),
    createdAt: new Date( now.getTime() ),
    updatedAt: new Date( now.getTime() ),
    summary: txtFormTitle.value,   
    location: txtFormLocation.value,     
    startsAt: calFormStarts.valueAsDate,
    endsAt: calFormEnds.valueAsDate,
    url: txtFormURL.value,
    description: txtFormNotes.value,    
    attachments: null
  }
}

function resetForm() {
  const now = new Date();

  btnFormAdd.disabled = true;
  txtFormTitle.value = null;
  txtFormLocation.value = null;
  calFormStarts.valueAsDate = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
  calFormEnds.valueAsDate = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
  txtFormURL.value = null;
  txtFormNotes.value = null;
}

// Setup
const popDetails = document.querySelector( '#details' );
const stack = document.querySelector( 'aa-stack' );

const year = document.querySelector( 'aa-year' );

let session = window.localStorage.getItem( 'aa_token' );

if( session === null ) {
  popAccount.open = true;
} else {
  fetch( `${KETNER_LAKE_API}/event`, {
    headers: {
      'x-anno-awesome': session
    }
  } )
  .then( ( response ) => response.json() )
  .then( ( data ) => {
    year.data = data;
    lblCount.text = `${data.length} item${data.length !== 1 ? 's' : ''}`;  
  } );
}
