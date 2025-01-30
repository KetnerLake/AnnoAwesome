export default class AaNavigation extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat( 2, 1fr );
          padding: 0 16px 0 16px;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        input {
          box-sizing: border-box;
          justify-self: end;
          margin: 0;
          padding: 0;
          height: 36px;
        }

        aa-group {
          display: flex;
          flex-direction: row;
          gap: 8px;
        }

        aa-hbox {
          gap: 8px;
        }
      </style>
      <aa-hbox>
        <aa-icon-button src="./img/account.svg"></aa-icon-button>
        <aa-group>
          <aa-icon-button src="./img/calendar.svg"></aa-icon-button>
          <aa-icon-button src="./img/list.svg"></aa-icon-button>        
        </aa-group>
        <aa-icon-button src="./img/add.svg"></aa-icon-button>      
      </aa-hbox>
      <input type="text" />
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$account = this.shadowRoot.querySelector( 'aa-hbox > aa-icon-button:first-of-type' );
    this.$account.addEventListener( 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-account' ) );
    } );
    this.$add = this.shadowRoot.querySelector( 'aa-hbox > aa-icon-button:last-of-type' );
    this.$add.addEventListener( 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-add' ) );
    } );    
    this.$group = this.shadowRoot.querySelector( 'aa-group' );
  }
  
  // When attributes change
  _render() {
    this.$account.disabled = this.disabled;
    this.$group.disabled = this.disabled;
    this.$add.disabled = this.disabled;
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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden'
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
}

window.customElements.define( 'aa-navigation', AaNavigation );
