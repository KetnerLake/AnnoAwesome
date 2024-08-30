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
          height: 36px;
          overflow: hidden;
          position: relative;
          transition: height 0.25s linear;
        } 

        :host( [concealed] ) {
          visibility: hidden;
        } 

        :host( [hidden] ) {
          display: none;
        } 

        aa-icon {
          --icon-cursor: pointer;
        }

        aa-label {
          flex-basis: 0;
          flex-grow: 1;
          --label-cursor: pointer;
        }

        aa-vbox {
          opacity: 0;
          transition: opacity 0.25s linear;
        }        

        button {
          align-items: center;
          appearance: none;
          background: var( --button-background, none );
          border: none;
          border-bottom: solid 1px #e5e5e5;
          box-sizing: border-box;
          color: #272727;          
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 12px;
          min-height: 36px;
          line-height: 36px;
          margin: 0;
          outline: none;
          padding: 0 12px 0 16px;
          -webkit-tap-highlight-color: transparent;            
        }

        button:first-of-type {
          padding: 0 16px 0 16px;          
        }

        button:last-of-type {
          border-bottom: solid 1px transparent;
        }

        button > span {
          background-color: #1badf8;
          border-radius: 12px;
          display: block;
          height: 12px;
          width: 12px;
        }

        button:not( [data-index] ) aa-icon {
          --icon-color: 
            invert( 79% ) 
            sepia( 0% ) 
            saturate( 0% ) 
            hue-rotate( 234deg ) 
            brightness( 88% )  
            contrast( 85% ); 
        }

        :host( [open] ) {
          height: 252px;
        }

        :host( [open] ) aa-vbox {
          opacity: 1.0;
        }

        :host( [open] ) button:not( [data-index] ) {
          border-bottom: solid 1px #e5e5e5;          
        }
      </style>
      <button part="button" type="button">
        <span part="color"></span>
        <aa-label part="label"></aa-label>
        <aa-icon part="icon" size="xs" src="./img/chevron-right.svg"></aa-icon>
      </button>
      <aa-vbox part="list"></aa-vbox>
    `;

    // Private
    this._colors = [
      {name: 'Red', value: '#ff2968'},
      {name: 'Orange', value: '#ff9500'},
      {name: 'Yellow', value: '#ffcc02'},
      {name: 'Green', value: '#63da38'},
      {name: 'Blue', value: '#1badf8'},
      {name: 'Purple', value: '#cc73e1'}
    ];
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$button = this.shadowRoot.querySelector( 'button[part=button]' );
    this.$button.addEventListener( 'click', () => {
      this.open = !this.open;
    } );
    this.$color = this.shadowRoot.querySelector( 'span[part=color]' );
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=label]' );
    this.$list = this.shadowRoot.querySelector( 'aa-vbox[part=list]' );

    for( let c = 0; c < this._colors.length; c++ ) {
      const button = document.createElement( 'button' );
      button.setAttribute( 'data-index', c );
      button.setAttribute( 'data-value', this._colors[c].value );      
      button.addEventListener( 'click', ( evt ) => this.doColorClick( evt ) );

      const span = document.createElement( 'span' );
      span.style.backgroundColor = this._colors[c].value;
      button.appendChild( span );

      const label = document.createElement( 'aa-label' );
      label.text = this._colors[c].name;
      button.appendChild( label );

      const icon = document.createElement( 'aa-icon' );
      icon.hidden = c == 2 ? false : true;
      icon.src = './img/check2.svg';
      button.appendChild( icon );

      this.$list.appendChild( button );
    }
  }

  doColorClick( evt ) {
    const index = parseInt( evt.currentTarget.getAttribute( 'data-index' ) );
    this.label = this._colors[index].name;
    this.value = this._colors[index].value;
  }

  // When things change
  _render() {
    const value = this.value === null ? '#1badf8' : this.value;    
    const index = this._colors.findIndex( ( curr ) => curr.value === value );

    this.$color.style.backgroundColor = value;
    this.$label.text = this._colors[index].name;

    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].children[2].hidden = c === index ? false : true;      
    }
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
    this._upgrade( 'value' );                              
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'label',
      'open',
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

window.customElements.define( 'aa-color-picker', AAColorPicker );
