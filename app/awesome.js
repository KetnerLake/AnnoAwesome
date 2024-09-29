const TOUCH = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';      
const COLORS = [
  {name: 'Red', value: '#ff2968'},
  {name: 'Orange', value: '#ff9500'},
  {name: 'Yellow', value: '#ffcc02'},
  {name: 'Green', value: '#63da38'},
  {name: 'Blue', value: '#1badf8'},
  {name: 'Purple', value: '#cc73e1'}
];      

const navigation = document.querySelector( 'aa-navigation' );
const header = document.querySelector( 'aa-header' );
const footer = document.querySelector( 'aa-footer' );
const left_panel = document.querySelector( '#left' );
const left_stack = document.querySelector( '#left aa-stack' );
const right_panel = document.querySelector( '#right' );

const event_details = document.querySelector( 'aa-event-details' );      
const event_form = document.querySelector( 'aa-event-form' );
const event_list = document.querySelector( '#left aa-event-list' );
const event_dialog = document.querySelector( '#event' );
const event_search = document.querySelector( '#right aa-event-list' );
const event_stack = document.querySelector( '#event aa-stack' );

const calendar_dialog = document.querySelector( '#calendar' );
const calendar_details = document.querySelector( 'aa-calendar-details' );
const calendar_form = document.querySelector( 'aa-calendar-form' );

const account_dialog = document.querySelector( '#account' );
const account_form = document.querySelector( 'aa-account-form' );

const year_view = document.querySelector( 'aa-year' );

/*
 * Navigation
 */

navigation.addEventListener( 'aa-account', () => {
  event_search.data = null;
  right.classList.add( 'hidden' );
  year_view.data = events;
  footer.setAttribute( 'count' , events.length );
  blocker( true );
  account_dialog.showModal();
  account_form.focus();
} );
navigation.addEventListener( 'aa-calendar', ( evt ) => controlsChange( evt ) );
navigation.addEventListener( 'aa-event', ( evt ) => controlsChange( evt ) );  
navigation.addEventListener( 'aa-add', () => {
  event_search.data = null;
  right_panel.classList.add( 'hidden' );
  year_view.data = events;
  footer.setAttribute( 'count', events.length );
  event_form.data = null;
  event_form.calendars = calendars;
  event_stack.setAttribute( 'selected-index', 0 );
  blocker( true );
  event_dialog.showModal();
  event_form.focus();
} );    
navigation.addEventListener( 'aa-search', () => {
  event_search.data = events;
  footer.setAttribute( 'count', events.length );
  left_panel.classList.add( 'hidden' );
  right_panel.classList.remove( 'hidden' );
  window.localStorage.removeItem( 'awesome_drawer' );
} );
navigation.addEventListener( 'aa-change', ( evt ) => {
  if( evt.detail.value !== null ) {
    const filtered = events.filter( ( value ) => {
      const query = evt.detail.value.toLowerCase();
      let match = false;

      if( value.summary !== null ) {
        if( value.summary.toLowerCase().indexOf( query ) >= 0 ) match = true;
      }
  
      if( value.description !== null ) {
        if( value.description.toLowerCase().indexOf( query ) >= 0 ) match = true;
      }
  
      return match;
    } );

    year_view.data = filtered;
    event_search.data = filtered;
    footer.setAttribute( 'count', filtered.length );
  } else {
    event_search.data = events;
    footer.setAttribute( 'count', events.length );
  }
} );
navigation.addEventListener( 'aa-cancel', () => {
  event_search.data = events;
  right_panel.classList.add( 'hidden' );
  year_view.data = events;
  footer.setAttribute( 'count', events.length );
} );

/*
 * Header 
 */ 

header.addEventListener( 'aa-previous', ( evt ) => headerChange( evt ) );
header.addEventListener( 'aa-next', ( evt ) => headerChange( evt ) );
header.addEventListener( 'aa-today', ( evt ) => {
  const today = new Date();
  year_view.children[0].scrollTo( {
    left: ( today.getMonth() * 236 ) - ( year_view.clientWidth / 2 ),
    top: ( today.getDate() * 40 ) - ( year_view.clientHeight / 2 ),
    behavior: 'smooth'
  } );
  year_view.value = evt.detail.year;
  headerChange( evt );
} );
header.addEventListener( 'aa-year', () => {
  year_view.children[0].scrollTo( {
    left: 0, 
    top: 0, 
    behavior: 'smooth'
  } );
} );

/*
 * Account
 */

// Dialog
account_dialog.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === account_dialog ) {
    account_dialog.close();
  }
} );
account_dialog.addEventListener( 'close', () => {
  blocker( false );
} );

// Form
account_form.addEventListener( 'aa-demo', () => {
  blocker( false );
  account_dialog.close();
} );
account_form.addEventListener( 'aa-export', () => {
  const output = {
    calendars: [],
    events: []
  };

  db.calendar.toArray() 
  .then( ( data ) => {
    output.calendars = [... data];
    return db.event.toArray();
  } )
  .then( ( data ) => {
    output.events = [... data];

    const blob = new Blob( [JSON.stringify( output )], {type: 'application/json'} ); 
    const link = document.createElement( 'a' );
    link.setAttribute( 'href', window.URL.createObjectURL( blob ) );
    link.setAttribute( 'download', 'awesome.json' );
    document.body.appendChild( link );
    link.click();

    setTimeout( ( link ) => {
      link.remove();
    }, 5000, link );
  } );
} );
account_form.addEventListener( 'aa-sign-in', ( evt ) => {
  alert( 'Not yet available.' );
  console.log( 'SIGN IN' );
  console.log( evt.detail );
} );
account_form.addEventListener( 'aa-sign-up', () => {
  window.open( './sign-up.html', '_blank' );
  blocker( false );        
  account_dialog.close();
} );      

/*
 * Event 
 */ 

// Dialog
event_dialog.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === event_dialog ) {
    event_dialog.close();
  }
} );
event_dialog.addEventListener( 'close', () => {
  blocker( false );
  year_view.removeAttribute( 'selected-item' );    
  event_list.removeAttribute( 'selected-item' );
  event_search.removeAttribute( 'selected-index' );  
} );

// Form
event_form.addEventListener( 'aa-cancel', () => {
  blocker( false );
  event_dialog.close();
  event_form.data = null;
  year_view.removeAttribute( 'selected-item' );
  event_list.removeAttribute( 'selected-item' );
  event_search.removeAttribute( 'selected-item' );
} );
event_form.addEventListener( 'aa-delete', () => {
  db.event.delete( evt.detail.id )
  .then( () => {
    if( sort_store === 'desc' ) {
      return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
    }
  } )
  .then( ( data ) => {
    if( color_store ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    year_view.data = events;
    event_list.data = events;
    blocker( false );
    event_dialog.close();
    footer.setAttribute( 'count', events.length );
  } );
} );
event_form.addEventListener( 'aa-done', () => {
  db.event.put( event_form.data )
  .then( () => {
    blocker( false );
    event_dialog.close();

    if( sort_store === 'desc' ) {
      return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
    }
  } )
  .then( ( data ) => {
    if( color_store ) {
      for( let d = 0; d < data.length; d++ ) {
        data[d].color = colors[data[d].calendarId];
      }
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    year_view.data = events;
    event_list.data = events;
    footer.setAttribute( 'count', events.length  );
  } );
} );

// Details
event_details.addEventListener( 'aa-change', ( evt ) => {
  db.event.get( evt.detail.id )
  .then( ( data ) => {
    data.calendarId = evt.detail.calendarId;
    return db.event.put( data );
  } )
  .then( () => {
    if( sort_store === 'desc' ) {
      return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
    }    
  } )
  .then( ( data ) => {
    data = data.map( ( value ) => {
      value.color = colors[value.calendarId];
      return value;
    } );
    
    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );
    
    year_view.data = events;
    year_view.setAttribute( 'selected-item', evt.detail.id );
    event_list.data = events;
    event_list.setAttribute( 'selected-item', evt.detail.id );
    footer.setAttribute( 'count', events.length );
  } );
} );
event_details.addEventListener( 'aa-delete', ( evt ) => {
  db.event.delete( evt.detail.id )
  .then( () => {
    if( sort_store === 'desc' ) {
      return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
    }
  } )
  .then( ( data ) => {
    data = data.map( ( value ) => {
      value.color = colors[value.calendarId];
      return value;
    } );

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    year_view.data = events;
    event_list.data = events;
    blocker( false );
    event_dialog.close();
    footer.setAttribute( 'count', events.length );
  } );
} );
event_details.addEventListener( 'aa-edit', ( evt ) => {
  db.event.get( evt.detail.id )
  .then( ( data ) => {
    event_form.calendars = calendars;
    event_form.data = data;
    event_stack.setAttribute( 'selected-index', 0 );
    event_form.focus();
  } );
} );

// List
event_list.addEventListener( 'aa-add', () => {
  event_form.data = null;
  event_form.calendars = calendars;
  event_stack.setAttribute( 'selected-index', 0 );
  blocker( true );
  event_dialog.showModal();
  event_form.focus();
} );    
event_list.addEventListener( 'aa-change', ( evt ) => {
  year_view.selectedItem = evt.detail.id;
  event_search.selectedItem = evt.detail.id;

  db.event.get( evt.detail.id )
  .then( ( event ) => {
    event_details.calendars = calendars;
    event_details.data = event;
    event_stack.setAttribute( 'selected-index', 1 );
    blocker( true );
    event_dialog.showModal();
  } );
} );
event_list.addEventListener( 'aa-sort', () => {
  sort_store = sort_store === 'asc' ? 'desc' : 'asc';
  window.localStorage.setItem( 'awesome_sort', sort_store );

  if( sort_store === 'desc' ) {
    db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray()
    .then( ( data ) => {
      const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
      events = data.filter( ( value ) => active.includes( value.calendarId ) );

      events = [... events];
      event_list.data = events;    
    } );
  } else {
    db.event.where( 'startsAt' ).between( starts, ends ).toArray()
    .then( ( data ) => {
      const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
      events = data.filter( ( value ) => active.includes( value.calendarId ) );

      events = [... events];
      event_list.data = events;  
    } );
  }
} );

/*
 * Calendar
 */

// Dialog
calendar_dialog.addEventListener( TOUCH, ( evt ) => {
  if( evt.target === calendar_dialog ) {
    calendar_dialog.close();
  }
} );
calendar_dialog.addEventListener( 'close', () => {
  blocker( false );
} );

// Form
calendar_form.addEventListener( 'aa-cancel', () => {
  blocker( false );
  calendar_dialog.close();
} );
calendar_form.addEventListener( 'aa-delete', ( evt ) => {
  blocker( false );
  calendar_dialog.close();

  const id = evt.detail.id;

  db.event.where( {calendarId: id} ).toArray()
  .then( ( data ) => {
    const keys = data.map( ( value ) => value.id );
    return db.event.bulkDelete( keys );
  } )
  .then( () => {
    return db.calendar.delete( id );
  } )
  .then( () => {
    return db.calendar.toCollection().sortBy( 'name' );     
  } )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );      

    calendars = [... data];
    calendar_details.data = calendars;
    calendar_form.data = null;

    if( sort_store === 'desc' ) {
      return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
    }
  } )
  .then( ( data ) => {
    for( let d = 0; d < data.length; d++ ) {
      data[d].color = colors[data[d].calendarId];
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );
    
    event_list.data = events;
    year_view.data = events;
    footer.setAttribute( 'count', events.length );
  } );
} );
calendar_form.addEventListener( 'aa-done', () => {
  blocker( false );
  calendar_dialog.close();

  db.calendar.put( calendar_form.data )
  .then( () => {
    return db.calendar.toCollection().sortBy( 'name' );
  } )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );  

    calendars = [... data];
    calendar_details.data = calendars;

    if( sort_store === 'desc' ) {
      return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
    }
  } )
  .then( ( data ) => {
    for( let d = 0; d < data.length; d++ ) {
      data[d].color = colors[data[d].calendarId];
    }    

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );
    
    event_list.data = events;
    year_view.data = events;
    footer.setAttribute( 'count', events.length );
  } );
} );

// Details
calendar_details.addEventListener( 'aa-active', ( evt ) => {
  if( !evt.detail.hasOwnProperty( 'calendars' ) ) {
    evt.detail.calendars = [evt.detail.id];
  }

  db.calendar.bulkGet( evt.detail.calendars )
  .then( ( data ) => {
    for( let d = 0; d < data.length; d++ ) {
      data[d].isActive = evt.detail.active;
    }

    return db.calendar.bulkPut( data );      
  } )
  .then( () => {
    return db.calendar.toCollection().sortBy( 'name' );
  } )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );      

    calendars = [... data];
    calendar_details.data = calendars;

    if( sort_store === 'desc' ) {
      return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
    } else {
      return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
    }
  } )
  .then( ( data ) => {
    for( let d = 0; d < data.length; d++ ) {
      data[d].color = colors[data[d].calendarId];
    }

    const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
    events = data.filter( ( value ) => active.includes( value.calendarId ) );

    event_list.data = events;  
    year_view.data = events;
    footer.setAttribute( 'count', events.length );
  } );
} );
calendar_details.addEventListener( 'aa-add', () => {
  calendar_form.colors = COLORS;
  calendar_form.data = null;
  calendar_form.removeAttribute( 'can-delete' );
  blocker( true );
  calendar_dialog.showModal();
  calendar_form.focus();
} );
calendar_details.addEventListener( 'aa-colors', ( evt ) => {
  if( evt.detail.checked ) {
    window.localStorage.setItem( 'awesome_colors', true );
    event_list.setAttribute( 'use-colors', '' );
    year_view.setAttribute( 'use-colors', '' );
    event_search.setAttribute( 'use-colors', '' );
  } else {
    window.localStorage.removeItem( 'awesome_colors' );
    event_list.removeAttribute( 'use-colors' );
    year_view.removeAttribute( 'use-colors' );
    event_search.removeAttribute( 'use-colors', '' );
  }
} );
calendar_details.addEventListener( 'aa-info', ( evt ) => {
  db.calendar.get( evt.detail.id )
  .then( ( data ) => {
    calendar_form.colors = COLORS;
    calendar_form.data = data;

    if( calendars.length > 1 ) {
      calendar_form.setAttribute( 'can-delete', '' );
    } else {
      calendar_form.removeAttribute( 'can-delete' );
    }
    
    blocker( true );
    calendar_dialog.showModal();
    calendar_form.focus();
  } );
} );
calendar_details.addEventListener( 'aa-hide', async ( evt ) => {
  const keys = Object.keys( evt.detail.active );
  console.log( keys );

  for( let k = 0; k < keys.length; k++ ) {
    const calendar = await db.calendar.get( keys[k] );
    calendar.isActive = evt.detail.active[keys[k]];
    await db.calendar.put( calendar );
  }

  db.calendar.toCollection().sortBy( 'name' )
  .then( ( data ) => {
    colors = data.reduce( ( prev, curr ) => {
      prev[curr.id] = curr.color;
      return prev;
    }, {} );      

    calendars = [... data];
    calendar_details.data = calendars;
    // btnCalendarsHide.label = btnCalendarsHide.label === HIDE_ALL ? SHOW_ALL : HIDE_ALL;
  } );
} );

/*
 * Year
 */

year_view.addEventListener( 'aa-change', ( evt ) => {
  db.event.get( evt.detail.id )
  .then( ( event ) => {
    event_list.setAttribute( 'selected-item', event.id );
    event_details.calendars = calendars;
    event_details.data = event;
    event_stack.setAttribute( 'selected-index', 1 );
    blocker( true );
    event_dialog.showModal();
  } );
} );
year_view.addEventListener( 'aa-month', () => {  
  year_view.children[0].scrollTo( {
    top: 0, 
    behavior: 'smooth'
  } );
} );

/*
 * Setup
 */

// Colors
let color_store = window.localStorage.getItem( 'awesome_colors' );
color_store = color_store === null ? false : true;

if( color_store ) {
  calendar_details.setAttribute( 'use-colors', '' );
  event_list.setAttribute( 'use-colors', '' );
  year_view.setAttribute( 'use-colors', '' );
  event_search.setAttribute( 'use-colors', '' );
} else {
  calendar_details.removeAttribute( 'use-colors' );  
  event_list.removeAttribute( 'use-colors' );  
  year_view.removeAttribute( 'use-colors' );
  event_search.removeAttribute( 'use-colors', '' );  
}

// Drawer
let left_store = window.localStorage.getItem( 'awesome_drawer' );

if( left_store === null ) {
  left_panel.classList.add( 'hidden' );
  calendar_details.removeAttribute( 'mode' );
} else {
  left_store = parseInt( left_store );
  left_panel.classList.remove( 'hidden' );
  left_stack.setAttribute( 'selected-index', left_store );
  navigation.setAttribute( 'mode', left_store === 0 ? 'calendar' : 'event' );
}

// Sort
let sort_store = window.localStorage.getItem( 'awesome_sort' );
if( sort_store === null ) {
  sort_store = 'desc';
  window.localStorage.setItem( 'awesome_sort', sort_store ); 
}

// Session
let session_store = window.localStorage.getItem( 'awesome_token' );      

// Year
let year_store = window.localStorage.getItem( 'awesome_year' );
if( year_store === null ) {
  year_store = new Date().getFullYear();  
  window.localStorage.setItem( 'awesome_year', year_store );        
} else {
  year_store = parseInt( year_store );
}

header.setAttribute( 'year', year_store );
year_view.setAttribute( 'value', year_store );

// Variables
let calendars = [];
let colors = null;
let ends = new Date( year_store + 1, 0, 1 );
let events = [];
let starts = new Date( year_store, 0, 1 );

// Database
const db = new Dexie( 'AnnoAwesome' );
db.version( 5 ).stores( {
  event: 'id, calendarId, startsAt',
  calendar: 'id'
} );

db.calendar.toCollection().sortBy( 'name' )
.then( async ( data ) => {
  if( data.length === 0 ) {
    const id = self.crypto.randomUUID();
    const now = Date.now();
    await db.calendar.put( {
      id: id,
      createdAt: new Date( now ),
      updatedAt: new Date( now ),
      name: 'Calendar',
      color: '#1badf8',
      isShared: false,
      isPublic: false,
      isActive: true
    } );
    data = await db.calendar.toArray();
  }

  calendars = [... data];
  calendar_details.data = calendars;

  colors = calendars.reduce( ( prev, curr ) => {
    prev[curr.id] = curr.color;
    return prev;
  }, {} );

  if( sort_store === 'desc' ) {
    return db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray();  
  } else {
    return db.event.where( 'startsAt' ).between( starts, ends ).toArray();      
  }
} )
.then( ( data ) => {
  data = data.map( ( value ) => {
    value.color = colors[value.calendarId];
    return value;
  } );

  const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
  events = data.filter( ( value ) => active.includes( value.calendarId ) );

  event_list.colors = COLORS;
  event_list.data = events;  
  year_view.colors = COLORS;
  year_view.data = events;
  event_search.colors = COLORS;
  event_search.data = events;
  footer.setAttribute( 'count', events.length );
} );      

/* 
 * Helpers
 */

function blocker( disabled = true ) {
  if( disabled ) {
    navigation.setAttribute( 'disabled', '' );
    header.setAttribute( 'disabled', '' ); 
    footer.setAttribute( 'disabled', '' ); 
    calendar_details.setAttribute( 'disabled', '' );    
    event_list.setAttribute( 'disabled', '' );
  } else {
    navigation.removeAttribute( 'disabled', '' );
    header.removeAttribute( 'disabled', '' ); 
    footer.removeAttribute( 'disabled', '' ); 
    calendar_details.removeAttribute( 'disabled', '' );    
    event_list.removeAttribute( 'disabled' );          
  }
}

function controlsChange( evt ) {
  const calendar = evt.detail.calendar;
  const event = evt.detail.event;

  event_search.data = null;
  right_panel.classList.add( 'hidden' );
  year_view.data = events;
  footer.setAttribute( 'count', events.length );

  if( calendar === true && event === false ) {
    left_stack.setAttribute( 'selected-index', 0 );
    left_panel.classList.remove( 'hidden' );
    window.localStorage.setItem( 'awesome_drawer', 0 );        
  } else if( calendar === false && event === true ) {
    left_stack.setAttribute( 'selected-index', 1 );
    left_panel.classList.remove( 'hidden' );
    window.localStorage.setItem( 'awesome_drawer', 1 );            
  } else if( calendar === false && event === false ) {
    left_panel.classList.add( 'hidden' );
    left_stack.setAttribute( 'selected-index', 0 );
    window.localStorage.removeItem( 'awesome_drawer' );    
  } 
}      

function headerChange( evt ) {
  window.localStorage.setItem( 'awesome_year', evt.detail.starts.getFullYear() );
  year_store = evt.detail.starts.getFullYear();
  starts = new Date( evt.detail.starts.getFullYear(), 0, 1 );
  ends = new Date( evt.detail.ends.getFullYear(), 0, 1 );

  year_view.setAttribute( 'value', year_store );

  if( sort_store === 'desc' ) {
    db.event.where( 'startsAt' ).between( starts, ends ).reverse().toArray()
    .then( ( data ) => {
      data = data.map( ( value ) => {
        value.color = colors[value.calendarId];
        return value;
      } );
    
      const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
      events = data.filter( ( value ) => active.includes( value.calendarId ) );
  
      year_view.data = events;
      event_list.data = events;
      footer.setAttribute( 'count', events.length );
    } );    
  } else {
    db.event.where( 'startsAt' ).between( starts, ends ).toArray()
    .then( ( data ) => {
      data = data.map( ( value ) => {
        value.color = colors[value.calendarId];
        return value;
      } );
    
      const active = calendars.filter( ( value ) => value.isActive ).map( ( value ) => value.id );
      events = data.filter( ( value ) => active.includes( value.calendarId ) );
  
      year_view.data = events;
      event_list.data = events;
      footer.setAttribute( 'count', events.length );
    } );    
  }
}      
