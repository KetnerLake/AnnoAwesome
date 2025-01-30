export default class AaCalendarDetails extends HTMLElement {
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

        div {
          align-items: center;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat( 2, 1fr );          
          height: 47px;
        }

        div > aa-button:last-of-type {
          justify-self: end;
        }

        h3 {
          color: var( --color );
          cursor: default;
          font-family: var( --font-family );
          font-size: 32px;
          font-style: var( --font-style );
          font-weight: 600;
          line-height: 36px;
          margin: 0;
          padding: 0 16px 8px 16px;
          text-rendering: optimizeLegibility;
        }

        aa-checkbox {
          background-color: #ffffff;
          border-radius: var( --button-border-radius );
          margin: 16px 0 0 0;
          padding: 0 0 0 16px;
        }

        aa-list::part( list ) {
          background-color: #ffffff;
          border-radius: var( --button-border-radius );
        }

        aa-vbox {
          flex-basis: 0;
          flex-grow: 1;
          gap: 16px;
          padding: 0 16px 0 16px;          
        }
      </style>
      <h3>Calendars</h3>
      <aa-vbox>
        <aa-section label="My Awesome">
          <aa-button label="Show All" slot="extra"></aa-button>
          <aa-list item-renderer="aa-calendar-item-renderer"></aa-list>
        </aa-section>
        <aa-section label="Shared">
          <aa-button label="Show All" slot="extra"></aa-button>        
          <aa-list item-renderer="aa-calendar-item-renderer"></aa-list>
          <p slot="notes">Hiding a shared or public calendar does not make it private.</p>
        </aa-section>      
        <aa-section label="Public">
          <aa-button label="Show All" slot="extra"></aa-button>        
          <aa-list item-renderer="aa-calendar-item-renderer"></aa-list>
          <p slot="notes">Hiding a shared or public calendar does not make it private.</p>
        </aa-section>      
        <aa-checkbox label="Use calendar color"></aa-checkbox>
      </aa-vbox>
      <div>
        <aa-button label="Add Calendar"></aa-button>
        <aa-button label="Hide All"></aa-button>
      </div>
    `;
    
    // Properties
    this._data = [];

    // Events
    this.doItemChange = this.doItemChange.bind( this );    
    this.doShowChange = this.doShowChange.bind( this );

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$add = this.shadowRoot.querySelector( 'div > aa-button:first-of-type' );
    this.$add.addEventListener( 'click', () => this.dispatchEvent( new CustomEvent( 'aa-add' ) ) );

    this.$color = this.shadowRoot.querySelector( 'aa-vbox > aa-checkbox:last-of-type' );
    this.$color.addEventListener( 'aa-change', () => {
      this.useCalendarColor = !this.useCalendarColor;
      this.dispatchEvent( new CustomEvent( 'aa-color', {
        detail: {
          checked: this.$color.checked
        }
      } ) );
    } );

    this.$mine_list = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 1 ) > aa-list' );
    this.$mine_list.addEventListener( 'aa-change', this.doItemChange );
    this.$mine_show = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 1 ) > aa-button' );    
    this.$mine_show.addEventListener( 'click', this.doShowChange );

    this.$shared_list = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 2 ) > aa-list' );
    this.$shared_list.addEventListener( 'aa-change', this.doItemChange );    
    this.$shared_notes = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 2 ) > p' );     
    this.$shared_section = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 2 )' );       
    this.$shared_show = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 2 ) > aa-button' );        
    this.$shared_show.addEventListener( 'click', this.doShowChange );

    this.$public_list = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 3 ) > aa-list' );   
    this.$public_list.addEventListener( 'aa-change', this.doItemChange );        
    this.$public_notes = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 3 ) > p' );                 
    this.$public_section = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 3 )' );    
    this.$public_show = this.shadowRoot.querySelector( 'aa-section:nth-of-type( 3 ) > aa-button' );            
    this.$public_show.addEventListener( 'click', this.doShowChange );

    this.$show_all = this.shadowRoot.querySelector( 'div > aa-button:last-of-type' );
    this.$show_all.addEventListener( 'click', () => {
      this.$show_all.label = this.$show_all.label === 'Show All' ? 'Hide All' : 'Show All';

      const items = this._data.map( ( value ) => {
        return {
          id: value.id,
          active_at: this.$show_all.label === 'Hide All' ? Date.now() : null
        }
      }, [] );
      this.data = this._data.map( ( value ) => {
        value.active_at = this.$show_all.label === 'Hide All' ? Date.now() : null;
        return value;
      } );

      this.dispatchEvent( new CustomEvent( 'aa-active', {
        detail: {
          items: items
        }
      } ) );
    } );
  }

  doItemChange( evt ) {
    this.data = this._data.map( ( value ) => {
      if( value.uuid === evt.detail.uuid ) {
        value.active_at = evt.detail.checked ? Date.now() :  null;
      }

      return value;
    } );

    this.dispatchEvent( new CustomEvent( 'aa-active', {
      detail: {
        items: [{
          uuid: evt.detail.uuid,
          active_at: evt.detail.checked ? Date.now() : null
        }]
      }
    } ) );    
  }

  doShowChange( evt ) {
    evt.currentTarget.label = evt.currentTarget.label === 'Show All' ? 'Hide All' : 'Show All';    
    const list = evt.currentTarget.parentElement.querySelector( 'aa-list' );
    const items = list.data.map( ( value ) => {
      return {
        uuid: value.uuid,
        active_at: evt.currentTarget.label === 'Hide All' ? Date.now() : null
      }
    }, [] );
    list.data = list.data.map( ( value ) => {
      value.active_at = evt.currentTarget.label === 'Hide All' ? Date.now() : null;
      return value;
    } );    
    this.dispatchEvent( new CustomEvent( 'aa-active', {
      detail: {
        items: items
      }
    } ) );
  }
  
  // When attributes change
  _render() {
    this.$color.checked = this.useCalendarColor;
    this.$mine_show.disabled = this.disabled;
    this.$mine_list.disabled = this.disabled;
    this.$shared_show.disabled = this.disabled;
    this.$shared_list.disabled = this.disabled;
    this.$public_show.disabled = this.disabled;
    this.$public_list.disabled = this.disabled;
    this.$color.disabled = this.disabled;
    this.$add.disabled = this.disabled;
    this.$show_all.disabled = this.disabled;
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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'use-calendar-color'
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

    const mine = this._data.filter( ( value ) => ( value.shared_at === null && value.public_at === null ) ? true : false );
    const mine_count = mine.reduce( ( acc, curr ) => {
      return curr.active_at === null ? acc + 1 : acc;
    }, 0 );
    this.$mine_show.label = mine_count > 0 ? 'Show All' : 'Hide All';
    this.$mine_list.data = mine;

    const shared = this._data.filter( ( value ) => value.shared_at !== null ? true : false );
    const shared_count = shared.reduce( ( acc, curr ) => {
      return curr.active_at === null ? acc + 1 : acc;
    }, 0 );
    this.$shared_show.label = shared_count > 0 ? 'Show All' : 'Hide All';    
    this.$shared_list.data = shared;
    this.$shared_section.hidden = shared.length === 0 ? true : false;

    const publics = this._data.filter( ( value ) => value.public_at !== null ? true : false );
    const publics_count = publics.reduce( ( acc, curr ) => {
      return curr.active_at === null ? acc + 1 : acc;
    }, 0 );
    this.$public_show.label = publics_count > 0 ? 'Show All' : 'Hide All';        
    this.$public_list.data = publics;        
    this.$public_section.hidden = publics.length === 0 ? true : false;

    this.$show_all.label = mine_count > 0 || shared_count > 0 || publics_count > 0 ? 'Show All' : 'Hide All';
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
}

window.customElements.define( 'aa-calendar-details', AaCalendarDetails );
