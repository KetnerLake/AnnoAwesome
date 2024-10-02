customElements.define( 'aa-year', class extends HTMLElement {
  constructor() {
    super();

    this.doDayClick = this.doDayClick.bind( this );
    this.doMonthClick = this.doMonthClick.bind( this );

    this._colors = [];
    this._data = [];
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';    

    this.$headers = this.querySelectorAll( 'h5' );
    this.$months = this.querySelectorAll( 'article' );

    for( let h = 0; h < this.$headers.length; h++ ) {
      this.$headers[h].setAttribute( 'data-month', h );      
    }
  }

  doDayClick( evt ) {
    this.dispatchEvent( new CustomEvent( 'aa-change', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        id: evt.currentTarget.getAttribute( 'data-id' )
      }
    } ) );
  }

  doMonthClick( evt ) {
    const month = parseInt( evt.target.getAttribute( 'data-month' ) );
    this.dispatchEvent( new CustomEvent( 'aa-month', {
      detail: {
        month: month,
        width: evt.target.clientWidth
      }
    } ) );
  }

  collides( a, b ) {
    return a.bottom > b.top && a.top < b.bottom;
  }

  pack( columns, width ) {
    let n = columns.length;

    for( let i = 0; i < n; i++ ) {
      let column = columns[i];
      for( let j = 0; j < column.length; j++ ) {
        const button = column[j];
        button.element.style.left = `${( i / n ) * 100}%`;
        button.element.style.width = `${( width / n - 1 )}px`;
      }
    }
  }

  // https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php/6117889#6117889
  week( date ) {
    date = new Date( Date.UTC( date.getFullYear(), date.getMonth(), date.getDate() ) );
    date.setUTCDate( date.getUTCDate() + 4 - ( date.getUTCDay() || 7 ) );
    const yearStart = new Date( Date.UTC( date.getUTCFullYear(), 0, 1 ) );
    return Math.ceil( ( ( ( date - yearStart ) / 86400000 ) + 1 ) / 7 );
  }

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {    
    this._upgrade( 'colors' );    
    this._upgrade( 'data' );

    for( let h = 0; h < this.$headers.length; h++ ) {
      this.$headers[h].addEventListener( this._touch, this.doMonthClick );
    }
  }

  disconnectedCallback() {
    for( let h = 0; h < this.$headers.length; h++ ) {
      this.$headers[h].removeEventListener( this._touch, this.doMonthClick );
    }    
  }

  static get observedAttributes () {
    return [
      'selected-item',
      'use-colors',
      'value'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'selected-item' ) {
      const events = this.querySelectorAll( 'button' );
      const item = this.hasAttribute( 'selected-item' ) ? this.getAttribute( 'selected-item' ) : null;

      for( let e = 0; e < events.length; e++ ) {
        events[e].blur();
      }      
      
      if( item !== null ) {
        const event = this.querySelector( `button[data-id='${item}']` );
        event.focus();
      }
    }

    if( name === 'use-colors' ) {
      const events = this.querySelectorAll( 'button' );
      for( let e = 0; e < events.length; e++ ) {
        let color = events[e].getAttribute( 'data-month-color' );
        if( this.hasAttribute( 'use-colors' ) ) {
          color = events[e].getAttribute( 'data-calendar-color' );
        }        

        events[e].style.setProperty( '--event-active-background-color', color );        
        events[e].style.setProperty( '--event-inactive-color', `hsl( from ${color} h s calc( l - 20 ) )` );                
        events[e].style.setProperty( '--event-inactive-background-color', color + '4d' );                      
      }
    }

    if( name === 'value' ) {
      const today = new Date();
      const year = this.hasAttribute( 'value' ) ? parseInt( this.getAttribute( 'value' ) ) : new Date().getFullYear();

      let index = 0;

      for( let m = 0; m < 12; m++ ) {
        for( let d = 0; d < 31; d++ ) {
          const cell = new Date( year, m, d + 1 );

          this.$months[m].children[0].children[d].setAttribute( 'weekend', cell.getDay() )
          this.$months[m].children[0].children[d].setAttribute( 'date', d + 1 );
          this.$months[m].children[0].children[d].setAttribute( 'month', m );          
          this.$months[m].children[0].children[d].setAttribute( 'year', year );

          const days = new Date( year, m + 1, 0 );          
          if( ( d + 1 ) > days.getDate() ) {
            this.$months[m].children[0].children[d].classList.add( 'outside' );
          } else {
            this.$months[m].children[0].children[d].classList.remove( 'outside' );
          }

          const track = this.week( cell );
          if( track !== index || d === 0 ) {
            index = track;
            this.$months[m].children[0].children[d].classList.add( 'week' );
            this.$months[m].children[0].children[d].children[0].children[1].textContent = index;
          } else {
            this.$months[m].children[0].children[d].classList.remove( 'week' );
            this.$months[m].children[0].children[d].children[0].children[1].textContent = '';            
          }

          if( today.getFullYear() === cell.getFullYear() &&
              today.getMonth() === cell.getMonth() &&
              today.getDate() === cell.getDate() ) {
            this.$months[m].children[0].children[d].classList.add( 'today' );
          } else {
            this.$months[m].children[0].children[d].classList.remove( 'today' );
          }          
        }
      }        
    }
  }

  get colors() {
    return this._colors.length === 0 ? null : this._colors;
  }

  set colors( value ) {
    this._colors = value === null ? [] : [... value];
  }

  get data() {
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];

    // Width to use for stacking
    const width = this.$months[0].children[1].clientWidth;      

    // For each calendar month
    for( let m = 0; m < this.$months.length; m++ ) {

      // Events just for this month
      const events = this._data.filter( ( value ) => value.startsAt.getMonth() === m ? true : false );      

      // Remove excess
      while( this.$months[m].children[1].children.length > events.length ) {
        this.$months[m].children[1].children[0].removeEventListener( this._touch, this.doDayClick );
        this.$months[m].children[1].children[0].remove();
      }

      // Add needed
      while( this.$months[m].children[1].children.length < events.length ) {
        const button = document.createElement( 'button' );
        button.addEventListener( this._touch, this.doDayClick );        
        
        const label = document.createElement( 'span' );
        button.appendChild( label );

        const location = document.createElement( 'span' );
        button.appendChild( location );

        this.$months[m].children[1].appendChild( button );
      }

      let color = this._colors[m % this._colors.length].value;              

      // Populate and decorate
      for( let c = 0; c < this.$months[m].children[1].children.length; c++ ) {
        const top = ( ( events[c].startsAt.getDate() - 1 ) * 40 );
        const height = ( ( events[c].endsAt.getDate() - events[c].startsAt.getDate() ) * 40 ) + 39;        

        if( this.hasAttribute( 'use-colors' ) ) {
          color = events[c].color;
        }

        this.$months[m].children[1].children[c].setAttribute( 'data-id', events[c].id );
        this.$months[m].children[1].children[c].setAttribute( 'data-calendar-color', events[c].color );          
        this.$months[m].children[1].children[c].setAttribute( 'data-month-color', this._colors[m % this._colors.length].value );                  

        this.$months[m].children[1].children[c].style.setProperty( '--event-active-color', '#ffffff' );
        this.$months[m].children[1].children[c].style.setProperty( '--event-active-background-color', color );        
        this.$months[m].children[1].children[c].style.setProperty( '--event-inactive-color', `hsl( from ${color} h s calc( l - 20 ) )` );                
        this.$months[m].children[1].children[c].style.setProperty( '--event-inactive-background-color', color + '4d' );                

        this.$months[m].children[1].children[c].style.top = `${top}px`;
        this.$months[m].children[1].children[c].style.height = `${height}px`;        

        this.$months[m].children[1].children[c].ariaLabel = events[c].summary;
        this.$months[m].children[1].children[c].children[0].textContent = events[c].summary;
        this.$months[m].children[1].children[c].children[1].textContent = events[c].location === null ? '' : events[c].location;
      }

      let columns = [];
      let last = null;

      // Map button positions
      let buttons = Array.from( this.$months[m].children[1].children );
      buttons = buttons.map( ( value ) => {
        return {
          element: value,
          top: parseInt( value.style.top ),
          bottom: parseInt( value.style.top ) + parseInt( value.style.height )
        };
      } );      

      // Sort buttons based on fit
      buttons.sort( function( a, b ) {
        if( a.top < b.top ) return -1;
        if( a.top > b.top ) return 1;
        if( a.bottom < b.bottom ) return -1;
        if( a.bottom > b.bottom ) return 1;
        return 0;
      } );

      // Pack buttons to columns
      buttons.forEach( ( value ) => {
        if( last !== null && value.top >= last ) {
          this.pack( columns, width );
          columns = [];
          last = null;
        }
  
        let placed = false;
  
        for( let c = 0; c < columns.length; c++ ) {
          let column = columns[c];
          if( !this.collides( column[column.length - 1], value ) ) {
            column.push( value );
            placed = true;
            break;
          }
        }
  
        if( !placed ) {
          columns.push( [value] );
        }
  
        if( last === null || value.bottom > last ) {
          last = value.bottom;
        }
      } );      

      // Place buttons in columns
      if( columns.length > 0 ) {
        this.pack( columns, width );
      }      
    }
  }
} );
