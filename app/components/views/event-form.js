customElements.define( 'aa-event-form', class extends HTMLElement {
  constructor() {
    super();

    this.doAddClick = this.doAddClick.bind( this );
    this.doCancelClick = this.doCancelClick.bind( this );
    this.doDeleteClick = this.doDeleteClick.bind( this );
    this.doEndsChange = this.doEndsChange.bind( this );    
    this.doEndsToggle = this.doEndsToggle.bind( this );
    this.doStartsChange = this.doStartsChange.bind( this );    
    this.doStartsToggle = this.doStartsToggle.bind( this );
    this.doTitleChange = this.doTitleChange.bind( this );

    this._calendars = [];
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.$add = this.querySelector( '#event_form_add' );
    this.$calendar = this.querySelector( 'aa-select' );    
    this.$cancel = this.querySelector( '#event_form_cancel' );
    this.$delete = this.querySelector( 'button.danger' );
    this.$ends = this.querySelector( 'aa-date-picker:last-of-type' );   
    this.$header = this.querySelector( '#event_form_header' );
    this.$location = this.querySelector( '#event_form_location' );      
    this.$notes = this.querySelector( 'textarea' );   
    this.$starts = this.querySelector( 'aa-date-picker:first-of-type' );
    this.$title = this.querySelector( '#event_form_title' );
    this.$url = this.querySelector( '#event_form_url' );

    const observer = new IntersectionObserver( 
      ( [e] ) => e.target.classList.toggle( 'pinned', e.intersectionRatio < 1 ),
      {threshold: [1]}
    );
    observer.observe( this );
  }

  focus() {
    this.$title.focus();
  }

  doAddClick() {
    if( this._data === null ) {
      this.dispatchEvent( new CustomEvent( 'aa-done' ) );
    } else {
      this.dispatchEvent( new CustomEvent( 'aa-done' ) );
    }
  }

  doCancelClick() {
    this.dispatchEvent( new CustomEvent( 'aa-cancel', {
      bubbles: true,
      cancelable: false,
      composed: true      
    } ) );
  }

  doDeleteClick() {
    const response = confirm( 'Are you sure you want to delete this event?' );
    if( !response ) return;    
    
    this.dispatchEvent( new CustomEvent( 'aa-delete', {
      detail: {
        id: this._data.id
      }
    } ) );
  }

  doEndsChange() {
    console.log( this.$starts.valueAsDate );
    console.log( this.$ends.valueAsDate );

    let starts = this.$starts.valueAsDate;
    if( starts === null ) {
      starts = new Date();
      starts.setHours( 0, 0, 0, 0 );
    }

    let ends = this.$ends.valueAsDate;
    if( ends === null ) {
      ends = new Date();
      ends.setHours( 0, 0, 0, 0 );
    }    

    if( ends.getTime() < starts.getTime() ) {
      this.$ends.setAttribute( 'invalid', '' );
      this.$add.disabled = true;      
    } else {
      this.$ends.removeAttribute( 'invalid' );
      this.$add.disabled = false;          
    }
  }

  doEndsToggle( evt ) {
    if( evt.target.open ) {
      this.$starts.children[0].removeAttribute( 'open' );
    }
  }

  doStartsChange( evt ) {
    this.$ends.valueAsDate = new Date( this.$starts.valueAsDate.getTime() );
  }

  doStartsToggle( evt ) {
    if( evt.target.open ) {
      this.$ends.children[0].removeAttribute( 'open' ); 
    }
  }

  doTitleChange( evt ) {
    this.$add.disabled = evt.detail.value === null ? true : false;
  }

  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  connectedCallback() {
    this._upgrade( 'calendars' );    
    this._upgrade( 'data' );

    this.$add.addEventListener( this._touch, this.doAddClick );
    this.$cancel.addEventListener( this._touch, this.doCancelClick );
    this.$title.addEventListener( 'aa-change', this.doTitleChange );
    this.$starts.addEventListener( 'aa-change', this.doStartsChange );
    this.$starts.children[0].addEventListener( 'toggle', this.doStartsToggle );
    this.$ends.addEventListener( 'aa-change', this.doEndsChange );    
    this.$ends.children[0].addEventListener( 'toggle', this.doEndsToggle );
    this.$delete.addEventListener( this._touch, this.doDeleteClick );
  }

  disconnectedCallback() {
    this.$add.removeEventListener( this._touch, this.doAddClick );    
    this.$cancel.removeEventListener( this._touch, this.doCancelClick );
    this.$title.removeEventListener( 'aa-change', this.doTitleChange );    
    this.$starts.removeEventListener( 'aa-change', this.doStartsChange );
    this.$starts.children[0].removeEventListener( 'toggle', this.doStartsToggle );
    this.$ends.removeEventListener( 'aa-change', this.doEndsChange );    
    this.$ends.children[0].removeEventListener( 'toggle', this.doEndsToggle );    
    this.$delete.removeEventListener( this._touch, this.doDeleteClick );    
  }  

  get calendars() {
    return this._calendars.length === 0 ? null : this._calendars;
  }

  set calendars( value ) {
    this._calendars = value === null ? [] : [... value];
    this.$calendar.data = this._calendars;
  }

  get data() {
    const now = new Date();

    return {
      id: this._data === null ? self.crypto.randomUUID() : this._data.id,
      createdAt: this._data === null ? now : this._data.createdAt,
      updatedAt: now,
      calendarId: this.$calendar.getAttribute( 'selected-item' ),
      startsAt: this.$starts.valueAsDate,
      endsAt: this.$ends.valueAsDate,
      summary: this.$title.hasAttribute( 'value' ) ? this.$title.getAttribute( 'value' ) : null,
      location: this.$location.hasAttribute( 'value' ) ? this.$location.getAttribute( 'value' ) : null,
      latitude: null,
      longitude: null,
      url: this.$url.hasAttribute( 'value' ) ? this.$url.getAttribute( 'value' ) : null,
      description: this.$notes.value.trim().length === 0 ? null : this.$notes.value
    };
  }

  set data( value ) {
    this._data = value === null ? null : structuredClone( value );

    if( this._data === null ) {
      this.$header.textContent = 'Add Event';

      this.$add.textContent = 'Add';
      this.$add.disabled = true;

      this.$title.removeAttribute( 'value' );
      this.$location.removeAttribute( 'value' );
      this.$starts.valueAsDate = new Date();
      this.$starts.children[0].removeAttribute( 'open' );
      this.$ends.valueAsDate = new Date();
      this.$ends.children[0].removeAttribute( 'open' );      
      this.$calendar.removeAttribute( 'selected-item' );
      this.$url.removeAttribute( 'value' );
      this.$notes.value = '';
      this.$delete.classList.add( 'hidden' );
    } else {
      this.$header.textContent = 'Edit Event';

      this.$add.textContent = 'Done';
      this.$add.disabled = true;      

      this.$title.setAttribute( 'value', this._data.summary );
      
      if( this._data.location === null ) {
        this.$location.removeAttribute( 'value' );
      } else {
        this.$location.setAttribute( 'value', this._data.location );
      }

      this.$starts.valueAsDate = this._data.startsAt;
      this.$starts.children[0].removeAttribute( 'open' );
      this.$ends.valueAsDate = this._data.endsAt;
      this.$ends.children[0].removeAttribute( 'open' );

      this.$calendar.setAttribute( 'selected-item', this._data.calendarId );

      if( this._data.url === null ) {
        this.$url.removeAttribute( 'value' );
      } else {
        this.$url.setAttribute( 'value', this._data.url );
      }

      this.$notes.value = this._data.description === null ? '' : this._data.description;

      this.$delete.classList.remove( 'hidden' );
    }
  }
} );
