import AAIconButton from "./icon-button.js";

export default class AAInput extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        aa-icon-button {
          --icon-button-color: #c6c6c6;
        }

        input {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          color: #272727;
          font-family: 'Source Sans 3', sans-serif;  
          font-size: 17px;
          height: 36px;
          line-height: 36px;
          margin: 0;
          outline: none;
          padding: 0 16px 0 16px;
          text-rendering: optimizeLegibility;
          width: 100%;
          -webkit-tap-highlight-color: transparent;          
        }

        input::placeholder {
          color: #c6c6c6;
          opacity: 1.0;
        }

        :host( [value]:focus-within ) aa-icon-button {
          display: block;
        }

        :host( [value]:not( :focus-within ) ) aa-icon-button {
          display: none;
        }

        :host( :not( [value] ) ) aa-icon-button {
          display: none;
        }

        :host( :not( [type=password] ) ) aa-icon-button[part=visibility] {
          display: none;
        }
      </style>
      <input type="text" />
      <aa-icon-button icon="visibility_off" part="visibility" size="21" weight="400"></aa-icon-button>      
      <aa-icon-button filled icon="cancel" part="clear" size="21" weight="400"></aa-icon-button>
    `;

    // Private
    this._data = null;
    this._touch = ( 'ontouchstart' in document.documentElement ) ? true : false;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = this.shadowRoot.querySelector( 'aa-icon-button[part=clear]' );
    this.$clear.addEventListener( this._touch ? 'touchstart' : 'mousedown', ( evt ) => {
      evt.preventDefault();

      this.value = null
      
      this.$input.type = this.type;
      this.$input.focus();

      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'keyup', () => {
      this.value = this.$input.value.length === 0 ? null : this.$input.value 

      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
    this.$visibility = this.shadowRoot.querySelector( 'aa-icon-button[part=visibility]' );
    this.$visibility.addEventListener( this._touch ? 'touchstart' : 'mousedown', ( evt ) => {
      evt.preventDefault();

      this.$input.type = this.$visibility.icon === 'visibility_off' ? 'text' : 'password';
      this.focus();      

      this.$visibility.icon = this.$visibility.icon === 'visibility_off' ? 'visibility' : 'visibility_off';      
    } );
  }

  blur() {
    this.$input.blur();
  }

  focus() { 
    this.$input.focus();
  }

  // When things change
  _render() {
    this.$input.autofocus = this.autofocus;
    this.$input.placeholder = this.placeholder === null ? '' : this.placeholder;
    this.$input.value = this.value === null ? '' : this.value;
    this.$input.type = this.type === null ? 'text' : this.type;
  }

  // Properties set before module loaded
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }    
  }    

  // Setup
  connectedCallback() {
    this._upgrade( 'autofocus' );                          
    this._upgrade( 'concealed' );                          
    this._upgrade( 'data' );                      
    this._upgrade( 'hidden' );                      
    this._upgrade( 'placeholder' );                          
    this._upgrade( 'type' );                              
    this._upgrade( 'value' );                          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'autofocus',
      'concealed',
      'hidden',
      'placeholder',
      'type',
      'value'
    ];
  }

  // Observed tag attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  }

  // Properties
  // Not reflected
  // Array, Date, Function, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
  }  

  // Attributes
  // Reflected
  // Boolean, Number, String, null
  get autofocus() {
    return this.hasAttribute( 'autofocus' );
  }

  set autofocus( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'autofocus' );
      } else {
        this.setAttribute( 'autofocus', '' );
      }
    } else {
      this.removeAttribute( 'autofocus' );
    }
  }

  get concealed() {
    return this.hasAttribute( 'concealed' );
  }

  set concealed( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'concealed' );
      } else {
        this.setAttribute( 'concealed', '' );
      }
    } else {
      this.removeAttribute( 'concealed' );
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

  get placeholder() {
    if( this.hasAttribute( 'placeholder' ) ) {
      return this.getAttribute( 'placeholder' );
    }

    return null;
  }

  set placeholder( value ) {
    if( value !== null ) {
      this.setAttribute( 'placeholder', value );
    } else {
      this.removeAttribute( 'placeholder' );
    }
  }             

  get type() {
    if( this.hasAttribute( 'type' ) ) {
      return this.getAttribute( 'type' );
    }

    return null;
  }

  set type( value ) {
    if( value !== null ) {
      this.setAttribute( 'type', value );
    } else {
      this.removeAttribute( 'type' );
    }
  }  

  get value() {
    if( this.hasAttribute( 'value' ) ) {
      return this.getAttribute( 'value' );
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

window.customElements.define( 'aa-input', AAInput );
