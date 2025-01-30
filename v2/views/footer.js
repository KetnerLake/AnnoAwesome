export default class AaFooter extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          background-color: var( --background-color );
          border-top: var( --divider-section );
          box-sizing: border-box;
          display: grid;
          grid-template-columns: repeat( 3, 1fr );
          min-height: 48px;
          padding: 0 16px 0 16px;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }

        a {
          color: var( --button-color );
          cursor: pointer;
          text-decoration: none;
        }

        a:hover {
          color: var( --button-color );
        }

        p {
          box-sizing: border-box;
          color: var( --color );
          cursor: default;
          font-family: var( --font-family );
          font-size: var( --font-size );
          font-style: var( --font-style );
          font-weight: var( --font-weight );
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        p:last-of-type {
          justify-self: center;
        }

        aa-icon-button {
          justify-self: end;
        }

        :host( [wizard] ) p:last-of-type {
          display: none;
        }

        :host( [disabled] ) a {
          color: var( --button-disabled-color );
          cursor: default;
        }

        :host( [disabled] ) a:hover {
          color: var( --button-disabled-color );
        }
      </style>
      <p>
        Made with ❤️ by <a href="https://kevinhoyt.com" target="_blank">Kevin Hoyt</a>.
      </p>
      <aa-rainbow hidden label="Tree wizard!"></aa-rainbow>
      <p></p>
      <aa-icon-button src="./img/fullscreen.svg"></aa-icon-button>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$count = this.shadowRoot.querySelector( 'p:last-of-type' );
    this.$count.addEventListener( 'click', () => {
      this.wizard = true;
      this.$rainbow.hidden = false;
      setTimeout( () => {
        this.wizard = false;
        this.$rainbow.hidden = true;
      }, 3000 );
    } );
    this.$fullscreen = this.shadowRoot.querySelector( 'aa-icon-button' );
    this.$fullscreen.addEventListener( 'click', () => {
      if( document.fullscreenElement ) {
        this.$fullscreen.src = './img/fullscreen.svg';
        document.exitFullscreen();
      } else {
        this.$fullscreen.src = './img/fullscreen-exit.svg';        
        document.documentElement.requestFullscreen();
      }
    } );
    this.$rainbow = this.shadowRoot.querySelector( 'aa-rainbow' );    
  }
  
  // When attributes change
  _render() {
    this.$count.textContent = `${this.count === null ? 0 : this.count} event${this.count === 1 ? '' : 's'}`;
    this.$fullscreen.disabled = this.disabled;
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
    this._upgrade( 'count' );                
    this._upgrade( 'disabled' );                    
    this._upgrade( 'hidden' );                        
    this._upgrade( 'wizard' );                            
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'count',
      'disabled',
      'hidden',
      'wizard'
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
  get count() {
    if( this.hasAttribute( 'count' ) ) {
      return parseInt( this.getAttribute( 'count' ) );
    }

    return null;
  }

  set count( value ) {
    if( value !== null ) {
      this.setAttribute( 'count', value );
    } else {
      this.removeAttribute( 'count' );
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
  
  get wizard() {
    return this.hasAttribute( 'wizard' );
  }

  set wizard( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'wizard' );
      } else {
        this.setAttribute( 'wizard', '' );
      }
    } else {
      this.removeAttribute( 'wizard' );
    }
  }  
}

window.customElements.define( 'aa-footer', AaFooter );
