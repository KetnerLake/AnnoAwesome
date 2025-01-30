export default class AaSection extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        div {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
        }
        
        p {
          box-sizing: border-box;
          color: var( --color-secondary ); 
          cursor: default;
          flex-basis: 0;
          flex-grow: 1;
          font-family: var( --font-family );
          font-size: 14px;
          font-style: var( --font-style );
          font-weight: var( --font-weight );
          line-height: 36px;
          margin: 0;
          padding: 0 16px 0 16px;
          text-transform: uppercase;
          text-rendering: optimizeLegibility;
        }

        ::slotted( aa-button[slot=extra] ) {
          --font-size: 14px;
          --button-text-transform: uppercase;
        }

        ::slotted( p[slot=notes] ) {
          box-sizing: border-box;
          color: var( --color-secondary ); 
          cursor: default;
          font-family: var( --font-family );
          font-size: 14px;
          font-style: var( --font-style );
          font-weight: var( --font-weight );
          line-height: 20px;
          margin: 0;
          padding: 8px 16px 0 16px;
          text-rendering: optimizeLegibility;
        }
      </style>
      <div>
        <p></p>
        <slot name="extra"></slot>
      </div>
      <slot></slot>
      <slot name="notes"></slot>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$label = this.shadowRoot.querySelector( 'p' );
  }
  
  // When attributes change
  _render() {
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
    this._upgrade( 'disabled' );       
    this._upgrade( 'hidden' );       
    this._upgrade( 'label' );           
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
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

window.customElements.define( 'aa-section', AaSection );
