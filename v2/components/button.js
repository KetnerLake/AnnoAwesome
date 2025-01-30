export default class AaButton extends HTMLElement {
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
          background: none;
          border: none;
          border-radius: var( --button-border-radius );
          box-sizing: border-box;
          color: var( --button-color );
          cursor: pointer;
          font-family: var( --font-family );
          font-size: var( --font-size );
          font-style: var( --font-style );
          font-weight: var( --font-weight );
          height: 36px;
          line-height: 36px;
          margin: 0;
          padding: 0 16px 0 16px;
          outline: none;
          text-rendering: optimizeLegibility;
          text-transform: var( --button-text-transform );
          transition: color 0.25s linear;
          -webkit-tap-highlight-color: transparent;                      
        }        

        button:hover {
          color: var( --button-hover-color );
        }

        button[disabled] {
          color: var( --button-disabled-color );
          cursor: default;
        }

        :host( [kind] ) button {
          background-color: #ffffff;
          width: 100%;          
        }

        :host( [kind] ) button:hover {        
          background-color: #ffffff;
        }

        :host( [kind=danger] ) button {
          color: red;
        }

        :host( [kind=form] ) button {
          color: var( --button-color );
          text-align: left;
        }

        :host( [kind=form] ) button:hover {
          color: var( --button-color );
        }
      </style>
      <button aria-label="Button" type="button"></button>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );
  }
  
  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$button.textContent = this.label === null ? '' : this.label;
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
    this._upgrade( 'kind' );            
    this._upgrade( 'label' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'kind',
      'label'
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

  get kind() {
    if( this.hasAttribute( 'kind' ) ) {
      return this.getAttribute( 'kind' );
    }

    return null;
  }

  set kind( value ) {
    if( value !== null ) {
      this.setAttribute( 'kind', value );
    } else {
      this.removeAttribute( 'kind' );
    }
  }       

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }        
}

window.customElements.define( 'aa-button', AaButton );
