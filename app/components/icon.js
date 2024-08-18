export default class AAIcon extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' )
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        span {
          box-sizing: border-box;
          color: var( --icon-color, #828282 );
          cursor: var( --icon-cursor, default );
          direction: ltr;
          display: inline-block;
          font-family: 'Material Symbols Outlined';
          font-style: normal;
          font-weight: normal;    
          letter-spacing: normal;
          text-rendering: optimizeLegibility;
          text-transform: none;
          white-space: nowrap;
          word-wrap: normal;
        }

        :host( :not( [size] ) ) span {
          font-size: 34px;
          line-height: 34px;
        }
      </style>
      <span part="icon"></span>
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$icon = this.shadowRoot.querySelector( 'span' );
  }

  // When things change
  _render() {
    this.$icon.innerText = this.name === null ? '' : this.name;

    const variation = [];

    if( this.filled ) {
      variation.push( '\'FILL\' 1' );
    } else {
      variation.push( '\'FILL\' 0' );
    }

    if( this.size === null ) {
      variation.push( '\'opsz\' 34' );
    } else {
      variation.push( `'opsz' ${this.size}` );
      
      this.$icon.style.fontSize = `${this.size}px`;
      this.$icon.style.lineHeight = `${this.size}px`;
      this.style.height = `${this.size}px`;
    }

    variation.push( '\'GRAD\' 0' );

    if( this.weight === null ) {
      variation.push( '\'wght\' 200' );
    } else {
      variation.push( `'wght' ${this.weight}` );
    }

    this.$icon.style.fontVariationSettings = variation.toString();    
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
    this._upgrade( 'filled' );                          
    this._upgrade( 'hidden' );                      
    this._upgrade( 'name' );                          
    this._upgrade( 'size' );                              
    this._upgrade( 'weight' );                          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'filled',
      'hidden',
      'name',
      'size',
      'weight'
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

  get filled() {
    return this.hasAttribute( 'filled' );
  }

  set filled( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'filled' );
      } else {
        this.setAttribute( 'filled', '' );
      }
    } else {
      this.removeAttribute( 'filled' );
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

  get name() {
    if( this.hasAttribute( 'name' ) ) {
      return this.getAttribute( 'name' );
    }

    return null;
  }

  set name( value ) {
    if( value !== null ) {
      this.setAttribute( 'name', value );
    } else {
      this.removeAttribute( 'name' );
    }
  }  
  
  get size() {
    if( this.hasAttribute( 'size' ) ) {
      return this.getAttribute( 'size' );
    }

    return null;
  }

  set size( value ) {
    if( value !== null ) {
      this.setAttribute( 'size', value );
    } else {
      this.removeAttribute( 'size' );
    }
  }  
  
  get weight() {
    if( this.hasAttribute( 'weight' ) ) {
      return parseInt( this.getAttribute( 'weight' ) );
    }

    return null;
  }

  set weight( value ) {
    if( value !== null ) {
      this.setAttribute( 'weight', value );
    } else {
      this.removeAttribute( 'weight' );
    }
  }  
}

window.customElements.define( 'aa-icon', AAIcon );
