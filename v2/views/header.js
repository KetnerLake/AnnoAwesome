export default class AaHeader extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          background-color: var( --background-color );
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat( 2, 1fr );          
          padding: 64px 16px 8px 0;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-hbox {
          justify-self: end;
        }

        aa-icon-button {
          --icon-button-size: 16px;
        }

        #value {
          --button-color: var( --color );    
          --button-disabled-color: var( --color );      
          --font-size: 32px;
          --font-weight: 600;
        }
      </style>
      <aa-button id="value"></aa-button>
      <aa-hbox>
        <aa-icon-button src="./img/chevron-left.svg"></aa-icon-button>
        <aa-button label="Today"></aa-button>
        <aa-icon-button src="./img/chevron-right.svg"></aa-icon-button>        
      </aa-hbox>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$next = this.shadowRoot.querySelector( 'aa-hbox > aa-icon-button:last-of-type' );        
    this.$next.addEventListener( 'click', () => {
      this.value = this.value === null ? ( new Date().getFullYear() + 1 ) : ( this.value + 1 );
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );    
    this.$previous = this.shadowRoot.querySelector( 'aa-hbox > aa-icon-button:first-of-type' );    
    this.$previous.addEventListener( 'click', () => {
      this.value = this.value === null ? ( new Date().getFullYear() - 1 ) : ( this.value - 1 );
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
    this.$today = this.shadowRoot.querySelector( 'aa-hbox > aa-button' );    
    this.$today.addEventListener( 'click', () => {
      this.value = new Date().getFullYear();
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
    this.$year = this.shadowRoot.querySelector( '#value' );   
    this.$year.addEventListener( 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-start' ) );
    } ); 
  }
  
  // When attributes change
  _render() {
    this.$year.disabled = this.disabled;
    this.$year.label = this.value === null ? new Date().getFullYear() : this.value;
    this.$previous.disabled = this.disabled;
    this.$today.disabled = this.disabled;
    this.$next.disabled = this.disabled;
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
    this._upgrade( 'disabled' );       
    this._upgrade( 'hidden' );           
    this._upgrade( 'value' );           
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'value'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
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

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return parseInt( this.getAttribute( 'value' ) );
    }

    return null;
  }

  set value( value ) {
    if( value !== null ) {
      this.setAttribute( 'value', value );
    } else {
      this.removeAttribute( 'value' );
    }
  }  
}

window.customElements.define( 'aa-header', AaHeader );
