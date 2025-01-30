export default class AaRainbow extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        @keyframes rainbow {
          to {
            background-position: 0 -200%
          }
        }

        :host {
          box-sizing: border-box;
          display: inline-block;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        p {
          animation: rainbow 2s linear infinite;                              
          background: 
            linear-gradient( 
              rgb( 255, 0, 0 ) 0%, 
              rgb( 255, 154, 0 ) 10%, 
              rgb( 208, 222, 33 ) 20%, 
              rgb( 79, 220, 74 ) 30%, 
              rgb( 63, 218, 216 ) 40%, 
              rgb( 47, 201, 226 ) 50%, 
              rgb( 28, 127, 238 ) 60%, 
              rgb( 95, 21, 242 ) 70%, 
              rgb( 186, 12, 248 ) 80%, 
              rgb( 251, 7, 217 ) 90%, 
              rgba( 255, 0, 0 ) 100%
            ) 0 0 / 100% 200%;
          background-clip: text;
          color: transparent;
          cursor: default;
          font-family: var( --font-family );
          font-size: var( --font-size );
          font-style: var( --font-style );
          font-weight: 600;
          line-height: var( --font-size );
          margin: 0;
          padding: 0; 
          text-align: center;         
          text-rendering: optimizeLegibility;
        }
      </style>
      <p></p>
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
    this._upgrade( 'hidden' );    
    this._upgrade( 'label' );            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
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
  // Boolean, Number, String, null
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

window.customElements.define( 'aa-rainbow', AaRainbow );
