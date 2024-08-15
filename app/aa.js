// Constants
const KETNER_LAKE_API = 'http://localhost:3000/v1';
const TOUCH = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

// Globals
let calendars = [];
let events = [];
let session = window.localStorage.getItem( 'awesome_token' );
let year = new Date().getFullYear();

/*
// Elements
*/

// Header
const btnHeaderCalendars = document.querySelector( '#header_calendars' );
const btnHeaderList = document.querySelector( '#header_list' );
const btnHeaderAdd = document.querySelector( '#header_add' );
const txtHeaderSearch = document.querySelector( 'aa-search' );
const btnHeaderCancel = document.querySelector( '#header_cancel' );
const btnHeaderAccount = document.querySelector( '#header_account' );
const btnHeaderPrevious = document.querySelector( '#header_previous' );
const lblHeaderYear = document.querySelector( '#header_year' );
const btnHeaderNext = document.querySelector( '#header_next' );
const btnHeaderToday = document.querySelector( '#header_today' );
const btnHeaderWizard = document.querySelector( '#header_wizard' );

// Drawers
const pnlLeft = document.querySelector( '#drawer_left' );
const stkLeft = document.querySelector( '#left_stack' );
const pnlRight = document.querySelector( '#drawer_right' );

// Year grid
const calYear = document.querySelector( 'aa-year' );

// Footer
const lblFooterCount = document.querySelector( '#footer_count' );
const lblFooterWizard = document.querySelector( '#footer_wizard' );

// Account
const dlgAccount = document.querySelector( '#account' );
const stkAccount = document.querySelector( '#account_stack' );
const txtAccountEmail = document.querySelector( '#account_email' );
const txtAccountPassword = document.querySelector( '#account_password' );
const btnAccountSignIn = document.querySelector( '#account_signin' );
const btnAccountDemo = document.querySelector( '#account_demo' );

// Details
const dlgDetails = document.querySelector( '#details' );
const stkDetails = document.querySelector( '#details_stack' );

// Form
const btnFormCancel = document.querySelector( '#form_cancel' );
const lblFormLabel = document.querySelector( '#form_label' );
const btnFormAdd = document.querySelector( '#form_add' );
const txtFormTitle = document.querySelector( '#form_title' );
const txtFormLocation = document.querySelector( '#form_location' );
const calFormStarts = document.querySelector( '#form_starts' );
const calFormEnds = document.querySelector( '#form_ends' );
const txtFormUrl = document.querySelector( '#form_url' );
const txtFormNotes = document.querySelector( '#form_notes' );

// View
const lblViewTitle = document.querySelector( '#view_title' );
const btnViewEdit = document.querySelector( '#view_edit' );
const lnkViewLocation = document.querySelector( '#view_location_link' );
const lblViewLocation = document.querySelector( '#view_location_label' );
const lblViewStartLabel = document.querySelector( '#view_start_label' );
const lblViewStart = document.querySelector( '#view_start' );
const boxViewEnd = document.querySelector( '#view_end_box' );
const lblViewEnd = document.querySelector( '#view_end' );
const boxViewUrl = document.querySelector( '#view_url_box' );
const lblViewUrl = document.querySelector( '#view_url_label' );
const lnkViewUrl = document.querySelector( '#view_url_link' );
const divViewUrl = document.querySelector( '#view_url_divider' );
const boxViewNotes = document.querySelector( '#view_notes_box' );
const lblViewNotes = document.querySelector( '#view_notes' );
const lblViewDescription = document.querySelector( '#view_description' );
const divViewNotes = document.querySelector( '#view_notes_divider' );
const mapViewLocation = document.querySelector( '#view_map' );
const divViewLocation = document.querySelector( '#view_map_divider' );
const btnViewDelete = document.querySelector( '#view_delete' );

/*
// Events
*/

// Easter
btnHeaderWizard.addEventListener( TOUCH, () => {
  lblFooterCount.hidden = true;
  lblFooterWizard.hidden = false;
  
  setTimeout( () => {
    lblFooterCount.hidden = false;
    lblFooterWizard.hidden = true;
  }, 5000 );
} );

// Header
btnHeaderAccount.addEventListener( TOUCH, () => {
  dlgAccount.open = !dlgAccount.open;
} );

btnHeaderAdd.addEventListener( TOUCH, () => {
  stkDetails.selectedIndex = 0;
  resetForm();
  dlgDetails.removeAttribute( 'data-id' );
  dlgDetails.open = true;
  txtFormTitle.focus();
} );

btnHeaderCalendars.addEventListener( TOUCH, () => {
  txtHeaderSearch.value = null;  
  btnHeaderCancel.hidden = true;
  pnlRight.hidden = true;

  if( !pnlLeft.hidden && stkLeft.selectedIndex === 0 ) {
    pnlLeft.hidden = true;
    stkLeft.selectedIndex = 0;
  } else {
    stkLeft.selectedIndex = 0;    
    pnlLeft.hidden = false;
  }
} );

btnHeaderCancel.addEventListener( TOUCH, () => {
  txtHeaderSearch.value = null;
  btnHeaderCancel.hidden = true;
  pnlRight.hidden = true;
} );

btnHeaderList.addEventListener( TOUCH, () => {
  txtHeaderSearch.value = null;
  btnHeaderCancel.hidden = true;  
  pnlRight.hidden = true;

  if( !pnlLeft.hidden && stkLeft.selectedIndex === 1 ) {
    pnlLeft.hidden = true;
    stkLeft.selectedIndex = 1;
  } else {
    stkLeft.selectedIndex = 1;    
    pnlLeft.hidden = false;
  }
} );

btnHeaderNext.addEventListener( TOUCH, () => {
  year = year + 1;
  lblHeaderYear.text = year;

  browseEvents( year )
  .then( ( data ) => {
    events = data === null ? [] : [... data];
    calYear.data = events;
    summarize( events.length );
  } );
} );

btnHeaderToday.addEventListener( TOUCH, () => {
  year = new Date().getFullYear();
  lblHeaderYear.text = year;

  // TODO: Scroll into view

  browseEvents( year )
  .then( ( data ) => {
    events = data === null ? [] : [... data];
    calYear.data = events;
    summarize( events.length );
  } );  
} );

btnHeaderPrevious.addEventListener( TOUCH, () => {
  year = year - 1;
  lblHeaderYear.text = year;

  browseEvents( year )
  .then( ( data ) => {
    events = data === null ? [] : [... data];
    calYear.data = events;
    summarize( events.length );
  } );
} );

txtHeaderSearch.addEventListener( 'aa-change', () => {
  if( txtHeaderSearch.value === null ) {
    calYear.data = events;
    summarize( events.length );
    return;
  }

  const filtered = events.filter( ( value ) => {
    const query = txtHeaderSearch.value.toLowerCase();
    let match = false;

    if( value.summary !== null ) {
      if( value.summary.toLowerCase().indexOf( query ) >= 0 ) match = true;
    }

    if( value.description !== null ) {
      if( value.description.toLowerCase().indexOf( query ) >= 0 ) match = true;
    }

    return match;
  } );

  calYear.data = filtered;
  summarize( filtered.length );
  
  pnlLeft.hidden = true;
  pnlRight.hidden = false;
  btnHeaderCancel.hidden = false;
} );

// Account
btnAccountDemo.addEventListener( TOUCH, () => {
  dlgAccount.open = false;
} );

btnAccountSignIn.addEventListener( TOUCH, () => {
  if( txtAccountEmail.value.trim().length === 0 ) {
    txtAccountEmail.focus();
    return;
  }

  if( txtAccountPassword.value.trim().length === 0 ) {
    txtAccountPassword.focus();
    return;
  }

  const user = {
    email: txtAccountEmail.value,
    password: txtAccountPassword.value
  };

  accountLogin( user )
  .then( ( data ) => {
    session = data;
    window.localStorage.setItem( 'awesome_token', session );

    txtAccountEmail.value = null;
    txtAccountPassword.value = null;
    dlgAccount.open = false;

    return browseCalendars();
  } )
  .then( ( data ) => {
    calendars = [... data];    
    return browseEvents( year );
  } )
  .then( ( data ) => {
    events = data === null ? [] : [... data];
    calYear.data = events;
    summarize( events.length );
  } );
} );

// Form
btnFormAdd.addEventListener( TOUCH, () => {
  if( dlgDetails.hasAttribute( 'data-id' ) ) {
    const id = dlgDetails.getAttribute( 'data-id' );
    
    if( session === null ) {
      const update = buildEvent( id );
      const index = events.findIndex( ( value ) => value.id === id );
      events[index] = update;

      calYear.data = events;
      
      fillView( update );
      stkDetails.selectedIndex = 1;      
    } else {
      editEvent( buildEvent( id ) )
      .then( ( data ) => {
        const index = events.findIndex( ( value ) => value.id === id );
        events[index] = data;
  
        calYear.data = events;
        
        fillView( data );
        stkDetails.selectedIndex = 1;
      } );
    }
  } else {
    dlgDetails.open = false;

    if( session === null ) {
      events.push( buildEvent() );
      calYear.data = events;
      summarize( events.length );
      resetForm();
    } else {
      addEvent( buildEvent() )
      .then( ( data ) => {
        events.push( data );
  
        calYear.data = events;
        summarize( events.length );
        resetForm();    
      } );
    }
  }
} );

btnFormCancel.addEventListener( TOUCH, () => {
  if( dlgDetails.hasAttribute( 'data-id' ) ) {
    stkDetails.selectedIndex = 1;
  } else {
    dlgDetails.open = false;
  }

  resetForm();
} );

txtFormTitle.addEventListener( 'aa-change', () => {
  btnFormAdd.disabled = txtFormTitle.value === null ? true : false;
} );

// View
btnViewDelete.addEventListener( TOUCH, () => {
  const response = confirm( 'Are you sure you want to delete this event?' );
  if( !response ) return;

  const id = dlgDetails.getAttribute( 'data-id' );

  if( session === null ) {
    const index = events.findIndex( ( value ) => value.id === id );
    events.splice( index, 1 );

    calYear.data = events;
    dlgDetails.open = false;
    dlgDetails.removeAttribute( 'data-id' );

    summarize( events.length );    
  } else {
    deleteEvent( id )
    .then( ( data ) => {
      const index = events.findIndex( ( value ) => value.id === data.id );
      events.splice( index, 1 );
  
      calYear.data = events;
      dlgDetails.open = false;
      dlgDetails.removeAttribute( 'data-id' );
  
      summarize( events.length );
    } );
  }
} );

btnViewEdit.addEventListener( TOUCH, () => {
  const id = dlgDetails.getAttribute( 'data-id' );
  const event = events.filter( ( value ) => value.id === id )[0];

  fillForm( event );

  lblFormLabel.text = 'Edit Event';
  btnFormAdd.label = 'Done';
  stkDetails.selectedIndex = 0;
} );

// Calendar
calYear.addEventListener( 'aa-change', ( evt ) => {
  if( evt.detail.id === null ) {
    dlgDetails.open = false;
    return;
  }

  const event = events.filter( ( value ) => value.id === evt.detail.id )[0];
  fillView( event );  

  stkDetails.selectedIndex = 1;
  dlgDetails.setAttribute( 'data-id', event.id );
  dlgDetails.open = true;
} );

// Setup
if( session === null ) {
  const now = new Date().toISOString();
  calendars = [{
    id: self.crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    accountId: self.crypto.randomUUID(),
    name: 'Calendar',
    color: null,
    isShared: false,
    isPublic: false,
    isActive: true
  }];
  events = [];
  summarize( events.length );

  dlgAccount.open = true;
} else {
  browseCalendars()
  .then( ( data ) => {
    calendars = [... data];
    return browseEvents( year );
  } )
  .then( ( data ) => {
    events = data === null ? [] : [... data];
    calYear.data = events;
    summarize( events.length );
  } );
}

/*
// Utility
*/

function buildEvent( id = null ) {
  const now = new Date().toISOString();

  const event = {
    updatedAt: now,
    calendarId: calendars[0].id,
    startsAt: calFormStarts.value,
    endsAt: calFormEnds.value,
    summary: txtFormTitle.value,
    location: txtFormLocation.value,
    latitude: null,
    longitude: null,
    url: txtFormUrl.value,
    description: txtFormNotes.value    
  };

  if( id === null ) {
    event.id = self.crypto.randomUUID();
    event.createdAt = now;
  } else {
    event.id = id;
  }

  return event;
}

function fillForm( event ) {  
  txtFormTitle.value = event.summary;
  txtFormLocation.value = event.location;
  calFormStarts.value = event.startsAt;
  calFormEnds.value = event.endsAt;
  txtFormUrl.value = event.url;
  txtFormNotes.value = event.description;
}

function fillView( event ) {
  lblViewTitle.text = event.summary;

  if( event.url === null ) {
    lnkViewLocation.hidden = true;
    lblViewLocation.hidden = false;
    lblViewLocation.text = event.location;
  } else {
    lnkViewLocation.hidden = false;
    lnkViewLocation.label = event.location;
    lnkViewLocation.href = event.url;
    lblViewLocation.hidden = true;
  }

  let parts = event.startsAt.split( '-' );
  const start = new Date( 
    parseInt( parts[0] ),
    parseInt( parts[1] - 1 ),
    parseInt( parts[2] )
  );
  parts = event.endsAt.split( '-' );
  const end = new Date( 
    parseInt( parts[0] ),
    parseInt( parts[1] - 1 ),
    parseInt( parts[2] )
  );  
  const formatter = new Intl.DateTimeFormat( navigator.language, {
    day: 'numeric',
    weekday: 'long',
    month: 'short',
    year: 'numeric'
  } );      

  if( start.getDate() === end.getDate() ) {
    lblViewStartLabel.hidden = true;
    lblViewStart.text = formatter.format( start );
    boxViewEnd.hidden = true;
  } else {
    lblViewStartLabel.hidden = false;    
    lblViewStart.text = formatter.format( start );
    lblViewEnd.text = formatter.format( end );
    boxViewEnd.hidden = false;
  }

  if( event.url === null ) {
    boxViewUrl.hidden = true;
    lnkViewUrl.label = null;
    lnkViewUrl.href = null;
    divViewUrl.hidden = true;
  } else {
    boxViewUrl.hidden = false;
    lnkViewUrl.label = event.url;
    lnkViewUrl.href = event.url;
    divViewUrl.hidden = false;    
  }

  if( event.description === null ) {
    boxViewNotes.hidden = true;
    lblViewDescription.text = null;
    divViewNotes.hidden = true;
  } else {
    boxViewNotes.hidden = false;
    lblViewDescription.text = event.description;
    divViewNotes.hidden = false;
  }

  if( event.latitude === null ) {
    mapViewLocation.hidden = true;
    divViewLocation.hidden = true;
  } else {
    mapViewLocation.hidden = false;
    divViewLocation.hidden = false;    
  }
}

function resetForm() {
  const now = new Date();

  lblFormLabel.text = 'New Event';
  btnFormAdd.label = 'Add';
  btnFormAdd.disabled = true;
  txtFormTitle.value = null;
  txtFormLocation.value = null;
  calFormStarts.valueAsDate = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
  calFormEnds.valueAsDate = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
  txtFormUrl.value = null;
  txtFormNotes.value = null;
}

function summarize( count = null ) {
  if( count === null ) {
    lblFooterCount.hidden = true;
  } else {
    lblFooterCount.text = `${count} event${count !== 1 ? 's' : ''}`;  
    lblFooterCount.hidden = false;
  }
}

/*
// BREAD
*/

function accountLogin( user ) {
  return fetch( `${KETNER_LAKE_API}/account/login`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify( user )
  } )
  .then( ( response ) => response.text() )
  .then( ( data ) => {
    return data.substring( 1, data.length - 1 );  
  } );
}

function browseCalendars() {
  return fetch( `${KETNER_LAKE_API}/calendar`, {
    headers: {
      'x-anno-awesome': session
    }    
  } )
  .then( ( response ) => response.json() );
}

function browseEvents( year = null ) {
  year = year === null ? new Date().getFullYear() : year;
  return fetch( `${KETNER_LAKE_API}/event/year/${year}`, {
    headers: {
      'x-anno-awesome': session
    }
  } )
  .then( ( response ) => response.json() );
}

function editEvent( event ) {
  return fetch( `${KETNER_LAKE_API}/event/${event.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-anno-awesome': session
    }, 
    method: 'PUT',
    body: JSON.stringify( event )
  } )
  .then( ( response ) => response.json() );
}

function addEvent( event ) {
  return fetch( `${KETNER_LAKE_API}/event/${event.id}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-anno-awesome': session
    }, 
    method: 'POST',
    body: JSON.stringify( event )
  } )
  .then( ( response ) => response.json() );
}

function deleteEvent( id ) {
  return fetch( `${KETNER_LAKE_API}/event/${id}`, {
    headers: {
      'Content-Type': 'application/json',      
      'x-anno-awesome': session
    },
    method: 'DELETE',
    body: JSON.stringify( {id: id} )
  } )
  .then( ( response ) => response.json() );
}
