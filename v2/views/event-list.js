export default class AaEventList extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-basis: 0;
          flex-direction: column;
          flex-grow: 1;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-button {
          padding: 0 16px 44px 0;
          --button-color: var( --color );    
          --button-disabled-color: var( --color );      
          --font-size: 32px;
          --font-weight: 600;        
        }

        aa-list {
          border-top: var( --divider-section );
          padding: 8px 0 8px 0;
          --divider: none;
        }
      </style>
      <aa-button label="Events"></aa-button>
      <aa-list interactive item-renderer="aa-event-item-renderer" value-field="uuid"></aa-list>
    `;
    
    // Properties
    this._colors = [
      {name: 'Red', value: '#ff2968'},
      {name: 'Orange', value: '#ff9500'},
      {name: 'Yellow', value: '#ffcc02'},
      {name: 'Green', value: '#63da38'},
      {name: 'Blue', value: '#1badf8'},
      {name: 'Purple', value: '#cc73e1'}
    ];
    this._data = [];
    this._sort = 'asc';

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'aa-button' );
    this.$button.addEventListener( 'aa-sort', () => {
      this._sort = this._sort === 'asc' ? 'desc' : 'asc';
      this.dispatchEvent( new CustomEvent( 'aa-sort', {
        detail: {
          value: this._sort
        }
      } ) );
    } );
    this.$list = this.shadowRoot.querySelector( 'aa-list' );
    this.$list.addEventListener( 'aa-change', ( evt ) => {
      this.selectedItem = evt.detail.value;
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.selectedItem
        }
      } ) );
   } );
  }

  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$list.disabled = this.disabled;
    this.$list.selectedItem = this.selectedItem;
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'data' );                        
    this._upgrade( 'disabled' );                    
    this._upgrade( 'hidden' );                        
    this._upgrade( 'useCalendarColor' );                            
    this._upgrade( 'selectedItem' );                                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'use-calendar-color',
      'selected-item'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 
  
  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data.length === 0 ? null : this._data;
  }
  
  set data( value ) {
    this._data = value === null ? [] : [... value];
    this._data = this._data.map( ( value ) => {
      value.calendarColor = value.color;
      value.monthColor = this._colors[value.starts_at.getMonth() % this._colors.length].value;
      value.color = this.useCalendarColor ? 'calendarColor' : 'monthColor';
      return value;
    } );
    this.$list.data = this._data;
  }

  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
  get disabled() {
    return this.hasAttribute( 'disabled' );
  }

  set disabled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'disabled' );
      } else {
        this.setAttribute( 'disabled', '' );
      }
    } else {
      this.removeAttribute( 'disabled' );
    }
  }

  get hidden() {
    return this.hasAttribute( 'hidden' );
  }

  set hidden( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'hidden' );
      } else {
        this.setAttribute( 'hidden', '' );
      }
    } else {
      this.removeAttribute( 'hidden' );
    }
  }  

  get useCalendarColor() {
    return this.hasAttribute( 'use-calendar-color' );
  }

  set useCalendarColor( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'use-calendar-color' );
      } else {
        this.setAttribute( 'use-calendar-color', '' );
      }
    } else {
      this.removeAttribute( 'use-calendar-color' );
    }
  }  

  get selectedItem() {
    if( this.hasAttribute( 'selected-item' ) ) {
      return this.getAttribute( 'selected-item' );
    }

    return null;
  }

  set selectedItem( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-item', value );
    } else {
      this.removeAttribute( 'selected-item' );
    }
  }
}

window.customElements.define( 'aa-event-list', AaEventList );
