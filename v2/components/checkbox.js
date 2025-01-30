export default class AaCheckbox extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        button {
          align-items: center;
          background: none;
          border: none;
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          height: 36px;
          gap: 8px;
          justify-content: center;
          margin: 0;
          padding: 0;
          outline: none;
          width: 100%;
          -webkit-tap-highlight-color: transparent;                      
        }

        button[disabled] {
          cursor: default;
        }

        p {
          box-sizing: border-box;
          color: var( --color );
          flex-basis: 0;
          flex-grow: 1;
          font-family: var( --font-family );
          font-size: var( --font-size );
          font-style: var( --font-style );
          font-weight: var( --font-weight );
          line-height: 36px;
          margin: 0;
          padding: 0;
          text-align: left;
          text-rendering: optimizeLegibility;
        }

        svg {
          box-sizing: border-box;
          height: 20px;
          width: 20px;
        }

        circle {
          fill: none;
          stroke: var( --checkbox-color, var( --button-color ) );
          stroke-width: 1px;
        }

        path {
          fill: #ffffff;
          transform: translate( 2px, 2px );
        }

        :host( :not( [label] ) ) button {
          height: 20px;
          width: 20px;
        }

        :host( :not( [label] ) ) p {
          display: none;
        }

        :host( [checked] ) circle {
          fill: var( --checkbox-color, var( --button-color ) );
        }

        :host( [disabled] ) circle {
          stroke: var( --button-disabled-color );
        }

        :host( [checked][disabled] ) circle {
          fill: var( --button-disabled-color );
        }        
      </style>
      <button aria-label="Checkbox" part="button" type="button">
        <svg>
          <circle cx="10" cy="10" r="9"></circle>
          <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />          
        </svg>
        <p></p>        
      </button>
      <slot></slot>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button' );   
    this.$button.addEventListener( 'click', () => {
      this.checked = !this.checked;
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          checked: this.checked
        }
      } ) );
    } );  
    this.$label = this.shadowRoot.querySelector( 'p' );
  }
  
  // When attributes change
  _render() {
    this.$button.disabled = this.disabled;
    this.$label.textContent = this.label === null ? '' : this.label;
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
    this._upgrade( 'checked' );           
    this._upgrade( 'disabled' );       
    this._upgrade( 'hidden' );           
    this._upgrade( 'label' );           
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'checked',
      'disabled',
      'hidden',
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
  get checked() {
    return this.hasAttribute( 'checked' );
  }

  set checked( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'checked' );
      } else {
        this.setAttribute( 'checked', '' );
      }
    } else {
      this.removeAttribute( 'checked' );
    }
  }

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

window.customElements.define( 'aa-checkbox', AaCheckbox );
