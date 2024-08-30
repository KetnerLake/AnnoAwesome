export default class AAList extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          overflow: auto;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        div[part=empty] {
          align-items: center;
          height: 100%;
          justify-content: center;
        }

        div[part=list] aa-calendar-list-renderer:last-of-type {
          border-bottom: solid 1px transparent;
        } 
      </style>
      <div part="list"></div>
      <div part="empty">
        <slot></slot>
      </div>
    `;

    // Private
    this._data = [];
    this._label = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$empty = this.shadowRoot.querySelector( 'div[part=empty]' );
    this.$list = this.shadowRoot.querySelector( 'div[part=list]' );
  }

   // When attributes change
  _render() {
    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].disabled = this.disabled;
    }
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
    this._upgrade( 'disabled' );          
    this._upgrade( 'hidden' );    
    this._upgrade( 'itemRenderer' );        
    this._upgrade( 'labelField' );  
    this._upgrade( 'labelFunction' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'disabled',
      'hidden',
      'item-renderer',
      'label-field'      
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
    return this._data.length === 0 ? null : this._data;
  }

  set data( value ) {
    this._data = value === null ? [] : [... value];
    
    this.$list.style.display = this._data.length === 0 ? 'none' : '';
    this.$empty.style.display = this._data.length === 0 ? 'flex' : 'none';

    while( this.$list.children.length > this._data.length ) {
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._data.length ) {
      const renderer = this.itemRenderer === null ? 'p' : this.itemRenderer;
      const element = document.createElement( renderer );
      this.$list.appendChild( element );
    }

    for( let c = 0; c < this.$list.children.length; c++ ) {
      if( this.itemRenderer === null ) {
        if( this.labelField !== null ) {
          this.$list.children[c].data = this._data[c][this.labelField];
        } else if( this.labelFunction !== null ) {
          this.$list.children[c].data = this._label( this._data[c] );
        } else {
          this.$list.children[c].data = this._data[c].toString();
        }
      } else {
        this.$list.children[c].data = this._data[c];
      }
    }
  }  

  get labelFunction() {
    return this._label;
  }

  set labelFunction( func ) {
    this._label = func;
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
  
  get itemRenderer() {
    if( this.hasAttribute( 'item-renderer' ) ) {
      return this.getAttribute( 'item-renderer' );
    }

    return null;
  }

  set itemRenderer( value ) {
    if( value !== null ) {
      this.setAttribute( 'item-renderer', value );
    } else {
      this.removeAttribute( 'item-renderer' );
    }
  }  

  get labelField() {
    if( this.hasAttribute( 'label-field' ) ) {
      return this.getAttribute( 'label-field' );
    }

    return null;
  }

  set labelField( value ) {
    if( value !== null ) {
      this.setAttribute( 'label-field', value );
    } else {
      this.removeAttribute( 'label-field' );
    }
  }    
}

window.customElements.define( 'aa-list', AAList );
