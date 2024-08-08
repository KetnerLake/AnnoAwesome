import AAIcon from "./icon.js";
import AAIconButton from "./icon-button.js";

export default class AASearch extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-block;
          min-width: 200px;
          position: relative;
          width: 200px;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-icon {
          padding: 0 8px 0 8px;          
          --icon-cursor: text;
        }

        aa-icon-button {
          --icon-button-color: #828282;
        }

        aa-icon-button::part( button ) {        
          height: 34px;
        }

        input {
          appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          flex-basis: 0;
          flex-grow: 1;
          font-family: 'Source Sans 3', sans-serif;
          font-size: 17px;
          height: 34px;
          line-height: 34px;          
          margin: 0;
          min-width: 0;
          outline: none;
          padding: 0;
          text-rendering: optimizeLegibility;
          -webkit-tap-highlight-color: transparent;
        }

        input::placeholder {
          color: #828282;
          font-family: 'Source Sans 3', sans-serif;          
          opacity: 1.0;
        }

        label {
          align-items: center;
          background-color: #e9e9e9;
          border: solid 1px transparent;
          border-radius: 8px;
          box-sizing: border-box;
          cursor: text;
          display: flex;
          flex-direction: row;
          width: 100%;
          -webkit-tap-highlight-color: transparent;
        }
      </style>
      <label>
        <aa-icon name="search" size="21" weight="300"></aa-icon>
        <input type="text" />
        <aa-icon-button filled hidden icon="cancel" size="21" weight="400"></aa-icon-button>
      </label>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$clear = this.shadowRoot.querySelector( 'aa-icon-button' );
    this.$clear.addEventListener( 'click', () => {
      this.value = null;
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: null
        }
      } ) );
    } );
    this.$input = this.shadowRoot.querySelector( 'input' );
    this.$input.addEventListener( 'keyup', () => {
      this.value = this.$input.value.trim().length === 0 ? null : this.$input.value;
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        detail: {
          value: this.value
        }
      } ) );
    } );
  }

  // When attributes change
  _render() {
    this.$input.placeholder = this.placeholder === null ? 'Search' : this.placeholder;
    this.$input.value = this.value === null ? '' : this.value;
    this.$clear.hidden = this.value === null ? true : false;
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
    this._upgrade( 'concealed' );    
    this._upgrade( 'data' );
    this._upgrade( 'hidden' );
    this._upgrade( 'placeholder' );    
    this._upgrade( 'value' );
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'placeholder',
      'value'
    ];
  }

  // Observed attribute has changed
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

window.customElements.define( 'aa-search', AASearch );
