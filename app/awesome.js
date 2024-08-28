// Constants
const HIDE_ALL = 'Hide All'
const SHOW_ALL = 'Show All'
const KETNER_LAKE_API = 'http://localhost:3000/v1';
const TOUCH = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

// Globals
let calendars = [];
let events = [];
let session = window.localStorage.getItem( 'awesome_token' );
let year = new Date().getFullYear();
let starts = new Date( year, 0, 1 );
let ends = new Date( year + 1, 0, 1 );

/*
// Elements
*/

// Header
const btnHeaderCalendars = document.querySelector( '#header_calendars' );
const btnHeaderList = document.querySelector( '#header_list' );
const btnHeaderAdd = document.querySelector( '#header_add' );
const txtHeaderSearch = document.querySelector( '#header_search' );
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
const lstCalendars = document.querySelector( '#drawer_calendars' );
const lstEvents = document.querySelector( '#drawer_events' );
const btnCalendarsAdd = document.querySelector( '#drawer_add' );
const btnCalendarsHide = document.querySelector( '#drawer_hide' );
const pnlRight = document.querySelector( '#drawer_right' );
const lstSearch = document.querySelector( '#drawer_search' );

// Year grid
const calYear = document.querySelector( 'aa-year' );

// Footer
const lnkFooterLink = document.querySelector( '#footer_link' );
const lblFooterCount = document.querySelector( '#footer_count' );
const lblFooterWizard = document.querySelector( '#footer_wizard' );
const sldFooterScale = document.querySelector( '#footer_scale' );

// Account
const dlgAccount = document.querySelector( '#account' );
const stkAccount = document.querySelector( '#account_stack' );
const frmAccount = document.querySelector( '#account_form' );

// Event
const dlgEvent = document.querySelector( '#event' );
const frmEvent = document.querySelector( '#event_form' );
const pnlEvent = document.querySelector( '#event_details' );
const stkEvent = document.querySelector( '#event_stack' );

// Calendar
const dlgCalendar = document.querySelector( '#calendar' );
const frmCalendar = document.querySelector( '#calendar_form' );

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
  txtHeaderSearch.value = null;
  btnHeaderCancel.hidden = true;
  lstSearch.data = null;
  pnlRight.hidden = true;
  calYear.data = events;
  summarize( events.length );

  blocker( true );

  dlgAccount.showModal();
  frmAccount.focus();
} );

btnHeaderAdd.addEventListener( TOUCH, () => {
  txtHeaderSearch.value = null;
  btnHeaderCancel.hidden = true;
  lstSearch.data = null;
  pnlRight.hidden = true;
  calYear.data = events;
  summarize( events.length );

  stkEvent.selectedIndex = 0;
  frmEvent.reset();
  frmEvent.calendars = calendars;
  blocker( true );
  dlgEvent.removeAttribute( 'data-id' );
  dlgEvent.showModal();
  frmEvent.focus();
} );

btnHeaderCalendars.addEventListener( TOUCH, () => {
  txtHeaderSearch.value = null;  
  btnHeaderCancel.hidden = true;
  lstSearch.data = null;
  pnlRight.hidden = true;
  calYear.events = events;
  summarize( events.length );

  btnHeaderList.checked = false;

  if( !pnlLeft.hidden && stkLeft.selectedIndex === 0 ) {
    btnHeaderCalendars.checked = false;
    pnlLeft.hidden = true;
    stkLeft.selectedIndex = 0;
  } else {
    btnHeaderCalendars.checked = true;    
    stkLeft.selectedIndex = 0;    
    pnlLeft.hidden = false;
  }
} );

btnHeaderCancel.addEventListener( TOUCH, () => {
  txtHeaderSearch.value = null;
  btnHeaderCancel.hidden = true;
  pnlRight.hidden = true;
  lstSearch.data = null;
  calYear.data = events;
  summarize( events.length );
} );

btnHeaderList.addEventListener( TOUCH, () => {
  txtHeaderSearch.value = null;
  btnHeaderCancel.hidden = true;  
  lstSearch.data = null;
  pnlRight.hidden = true;
  calYear.data = events;
  summarize( events.length );

  btnHeaderCalendars.checked = false;

  if( !pnlLeft.hidden && stkLeft.selectedIndex === 1 ) {
    btnHeaderList.checked = false;
    pnlLeft.hidden = true;
    stkLeft.selectedIndex = 1;
  } else {
    btnHeaderList.checked = true;
    stkLeft.selectedIndex = 1;    
    pnlLeft.hidden = false;
  }
} );

btnHeaderNext.addEventListener( TOUCH, () => {
  year = year + 1;
  starts = new Date( year, 0, 1 );
  ends = new Date( year + 1, 0, 1 );
  lblHeaderYear.text = year;

  db.event.where( 'startsAt' ).between( starts, ends ).toArray()
  .then( ( data ) => {
    events = [... data];
    calYear.data = events;
    lstEvents.data = events;
    calYear.value = year;
    summarize( events.length );
  } );
} );

btnHeaderPrevious.addEventListener( TOUCH, () => {
  year = year - 1;
  starts = new Date( year, 0, 1 );
  ends = new Date( year + 1, 0, 1 );
  lblHeaderYear.text = year;

  db.event.where( 'startsAt' ).between( starts, ends ).toArray()
  .then( ( data ) => {
    events = [... data];
    calYear.data = events;
    lstEvents.data = events;
    calYear.value = year;
    summarize( events.length );
  } );
} );

btnHeaderToday.addEventListener( TOUCH, () => {
  const today = new Date();
  year = today.getFullYear();
  starts = new Date( year, 0, 1 );
  ends = new Date( year + 1, 0, 1 );

  lblHeaderYear.text = year;

  calYear.value = year;
  calYear.scrollTo( {
    left: ( today.getMonth() * 200 ) - ( calYear.clientWidth / 2 ),
    top: ( today.getDate() * 36 ) - ( calYear.clientHeight / 2 ),
    behavior: 'smooth'
  } );

  db.event.where( 'startsAt' ).between( starts, ends ).toArray()
  .then( ( data ) => {
    events = [... data];
    calYear.data = events;
    lstEvents.data = events;
    summarize( events.length );
  } );  
} );

txtHeaderSearch.addEventListener( 'focus', () => {
  pnlLeft.hidden = true;
  btnHeaderCalendars.checked = false;
  btnHeaderList.checked = false;
  pnlRight.hidden = false;
  btnHeaderCancel.hidden = false;

  lstSearch.data = events;
  summarize( events.length );
} );

txtHeaderSearch.addEventListener( 'aa-change', () => {
  if( txtHeaderSearch.value === null ) {
    calYear.data = events;
    lstSearch.data = events;
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
  lstSearch.data = filtered;
  summarize( filtered.length );
} );

// Account
frmAccount.addEventListener( 'aa-demo', () => {
  blocker( false )
  dlgAccount.close();
} );

frmAccount.addEventListener( 'aa-signin', ( evt ) => {
  const user = {
    email: evt.detail.email,
    password: evt.detail.password
  };

  /*
  accountLogin( user )
  .then( ( data ) => {
    session = data;
    window.localStorage.setItem( 'awesome_token', session );
    frmAccount.reset();
    blocker( false );
    dlgAccount.close();
  } );
  */

  /*
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
  */
} );

// Event
frmEvent.addEventListener( 'aa-cancel', () => {
  blocker( false );
  dlgEvent.close();
  frmEvent.reset();
} );

frmEvent.addEventListener( 'aa-done', () => {
  db.event.put( frmEvent.data )
  .then( () => {
    blocker( false );
    dlgEvent.close();
    frmEvent.reset();

    return db.event.get( frmEvent.data.id );
  } )
  .then( ( data ) => {
    pnlEvent.data = data;
    stkEvent.selectedIndex = 1;    
    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    events = [... data];

    calYear.data = events;
    lstEvents.data = events;
    summarize( events.length );
  } );
} );

// Details
pnlEvent.addEventListener( 'aa-delete', ( evt ) => {
  db.event.delete( evt.detail.id )
  .then( () => {
    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    events = [... data];
    calYear.data = events;
    lstEvents.data = events;
    blocker( false );
    dlgEvent.close();
    frmEvent.reset();
    pnlEvent.data = null;
    summarize( events.length );
  } );
} );

pnlEvent.addEventListener( 'aa-edit', ( evt ) => {
  db.event.where( {id: evt.detail.id} ).first()
  .then( ( event ) => {
    frmEvent.data = event;
    // lblFormLabel.text = 'Edit Event';
    // btnFormAdd.label = 'Done';
    stkEvent.selectedIndex = 0;
    dlgEvent.classList.add( 'transparent' );
  } );
} );

// Drawers
btnCalendarsAdd.addEventListener( TOUCH, () => {
  frmCalendar.canDelete = false;
  blocker( true );
  dlgCalendar.showModal();
  frmCalendar.focus();
} );

btnCalendarsHide.addEventListener( TOUCH, async () => {
  for( let c = 0; c < calendars.length; c++ ) {
    const calendar = await db.calendar.get( calendars[c].id );
    calendar.isActive = btnCalendarsHide.label === HIDE_ALL ? false : true;
    await db.calendar.put( calendar );
  }

  db.calendar.toCollection().sortBy( 'name' )
  .then( ( data ) => {
    calendars = [... data];
    lstCalendars.data = calendars;
    btnCalendarsHide.label = btnCalendarsHide.label === HIDE_ALL ? SHOW_ALL : HIDE_ALL;
  } );
} );

frmCalendar.addEventListener( 'aa-cancel', () => {
  frmCalendar.reset();
  blocker( false );
  dlgCalendar.close();
} );

frmCalendar.addEventListener( 'aa-delete', () => {
  blocker( false );
  dlgCalendar.close();

  db.calendar.delete( frmCalendar.data.id )
  .then( async () => {
    const id = frmCalendar.data.id;

    for( let e = 0; e < events.length; e++ ) {
      if( events[e].calendarId === id ) {
        await db.event.delete( events[e].id );
      }
    }

    return db.calendar.toCollection().sortBy( 'name' );     
  } )
  .then( ( data ) => {
    calendars = [... data];
    lstCalendars.data = calendars;
    frmCalendar.reset();    
    checkCalendars();

    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
  } )
  .then( ( data ) => {
    events = [... data];
    lstEvents.data = events;
    calYear.data = events;
    summarize( events.length );
  } );
} );

frmCalendar.addEventListener( 'aa-done', () => {
  blocker( false );
  dlgCalendar.close();

  db.calendar.put( frmCalendar.data )
  .then( () => {
    return db.calendar.toArray();
  } )
  .then( ( data ) => {
    calendars = [... data];
    lstCalendars.data = calendars;
    frmCalendar.reset();
  } );
} );

lstCalendars.addEventListener( 'aa-active', ( evt ) => {
  db.calendar.get( evt.detail.id )
  .then( ( data ) => {
    data.isActive = evt.detail.active;
    data.updatedAt = new Date();
    return db.calendar.put( data );
  } )
  .then( () => {
    return db.calendar.toArray();
  } )
  .then( ( data ) => {
    calendars = [... data];
    lstCalendars.data = calendars;
    checkCalendars();
  } );
} );

lstCalendars.addEventListener( 'aa-info', ( evt ) => {
  db.calendar.get( evt.detail.id )
  .then( ( data ) => {
    frmCalendar.data = data;
    frmCalendar.canDelete = calendars.length > 1 ? true : false;
    blocker( true );
    dlgCalendar.showModal();
    frmCalendar.focus();
  } );
} );

// Calendar
calYear.addEventListener( 'aa-change', ( evt ) => {
  db.event.where( {id: evt.detail.id} ).first()
  .then( ( event ) => {
    pnlEvent.data = event;
    dlgEvent.classList.remove( 'transparent' );
    stkEvent.selectedIndex = 1;
    blocker( true );
    dlgEvent.showModal();
  } );
} );

/*
// Setup
*/

lblHeaderYear.text = year;

const db = new Dexie( 'AnnoAwesome' );
db.version( 4 ).stores( {
  event: 'id, startsAt',
  calendar: 'id'
} );

db.calendar.toCollection().sortBy( 'name' )
.then( async ( data ) => {
  if( data.length === 0 ) {
    const now = Date.now();
    await db.calendar.put( {
      id: self.crypto.randomUUID(),
      createdAt: new Date( now ),
      updatedAt: new Date( now ),
      name: 'Calendar',
      color: '#00b0ff',
      isShared: false,
      isPublic: false,
      isActive: true
    } );
    data = await db.calendar.toArray();
  }

  calendars = [... data];
  lstCalendars.data = calendars;
  checkCalendars();

  return db.event.where( 'startsAt' ).between( starts, ends ).toArray();
} )
.then( ( data ) => {
  events = [... data];
  lstEvents.data = events;  
  calYear.data = events;
  summarize( events.length );
} );

/*
// Utility
*/

function blocker( disabled = true ) {
  btnHeaderAccount.disabled = disabled;
  btnHeaderCalendars.disabled = disabled;  
  btnHeaderList.disabled = disabled;  
  btnHeaderAdd.disabled = disabled;  
  btnHeaderPrevious.disabled = disabled;  
  btnHeaderNext.disabled = disabled;  
  txtHeaderSearch.disabled = disabled;
  btnHeaderToday.disabled = disabled;
  lnkFooterLink.disabled = disabled;
  sldFooterScale.disabled = disabled;
  lstCalendars.disabled = disabled;  
  btnCalendarsAdd.disabled = disabled;
  btnCalendarsHide.disabled = disabled;
}

function checkCalendars() {
  let all = true;

  for( let c = 0; c < calendars.length; c++ ) {
    if( !calendars[c].isActive ) {
      all = false;
      break;
    }
  }

  btnCalendarsHide.label = all ? HIDE_ALL : SHOW_ALL;  
}

function summarize( count = null ) {
  if( count === null ) {
    lblFooterCount.hidden = true;
  } else {
    lblFooterCount.text = `${count} event${count !== 1 ? 's' : ''}`;  
    lblFooterCount.hidden = false;
  }
}
