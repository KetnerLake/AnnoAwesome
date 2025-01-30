export default class AaIconButton extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          border-radius: var( --button-border-radius );
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          height: 36px;
          justify-content: center;
          margin: 0;
          padding: 0;
          outline: none;
          width: 36px;
          -webkit-tap-highlight-color: transparent;                      
        }

        img {
          box-sizing: border-box;
          height: var( --icon-button-size, 20px );
          filter: var( --icon-color );
          width: var( --icon-button-size, 20px );
        }

        button[disabled] {
          cursor: default;
        }

        button[disabled] img {
          filter: var( --icon-disabled-color );
        }

        :host( [selected] ) button {
          background-color: var( --button-color );
        }

        :host( [selected] ) button img {
          filter: var( --icon-selected-color );
        }

        :host( [selected][disabled] ) button {
          background-color: var( --button-disabled-background-color );
        }

        :host( [selected][disabled] ) button img {
          filter: var( --icon-disabled-color );
        }        
      </style>
      <button aria-label="Button" type="button">
        <img alt="Icon" />
      </button>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
    this.$icon = this.shadowRoot.querySelector( 'img' );
  }
  
  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$icon.src = this.src;
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
    this._upgrade( 'selected' );                         
    this._upgrade( 'src' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'selected',
      'src'
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

  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
    }
  }  

  get src() {
    if( this.hasAttribute( 'src' ) ) {
      return this.getAttribute( 'src' );
    }

    return null;
  }

  set src( value ) {
    if( value !== null ) {
      this.setAttribute( 'src', value );
    } else {
      this.removeAttribute( 'src' );
    }
  }          
}

window.customElements.define( 'aa-icon-button', AaIconButton );
