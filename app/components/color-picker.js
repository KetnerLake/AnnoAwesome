export default class AAColorPicker extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        button {
          align-items: center;
          appearance: none;
          background: var( --button-background, none );
          border: none;
          border-radius: 4px;
          box-sizing: border-box;
          color: #272727;          
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 12px;
          height: 36px;
          line-height: 36px;
          margin: 0;
          outline: none;
          padding: 0 16px 0 16px;
          -webkit-tap-highlight-color: transparent;            
        }

        span[part=color] {
          background-color: #1badf8;
          border-radius: 12px;
          display: block;
          height: 12px;
          width: 12px;
        }

        aa-icon {
          --icon-color: 
            invert( 79% ) 
            sepia( 0% ) 
            saturate( 0% ) 
            hue-rotate( 234deg ) 
            brightness( 88% )  
            contrast( 85% );          
        }
        
        aa-label[part=label] {
          flex-basis: 0;
          flex-grow: 1;
        }
      </style>
      <button part="button" type="button">
        <span part="color"></span>
        <aa-label part="label"></aa-label>
        <aa-icon part="icon" size="xs" src="./img/chevron-right.svg"></aa-icon>
      </button>
      <button>
        <span part="color" style="background-color: red;"></span>
        <aa-label part="label"></aa-label>
        <aa-icon part="icon" size="xs" src="./img/chevron-right.svg"></aa-icon>      
      </button>
    `;

    // Private
    this._colors = [
      {name: 'Red', value: '#ff2968'},
      {name: 'Orange', value: '#ff9500'},
      {name: 'Yellow', value: '#ffcc02'},
      {name: 'Green', value: '#63da38'},
      {name: 'Blue', value: '#1badf8'},
      {name: 'Purple', value: '#cc73e1'},
      {name: 'Brown', value: '#a2845e'}
    ];
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button[part=button]' );
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=label]' );    
  }

  // When things change
  _render() {
    this.$label.text = this.label;
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
    this._upgrade( 'concealed' );                          
    this._upgrade( 'data' );                      
    this._upgrade( 'hidden' );                      
    this._upgrade( 'label' );                          
    this._upgrade( 'open' );                          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'label',
      'open'
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

  get open() {
    return this.hasAttribute( 'open' );
  }

  set open( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'open' );
      } else {
        this.setAttribute( 'open', '' );
      }
    } else {
      this.removeAttribute( 'open' );
    }
  }  
}

window.customElements.define( 'aa-color-picker', AAColorPicker );
