export default class AaList extends HTMLElement {
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
          display: none;
        }

        ul {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        li {
          border-bottom: var( --divider );
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        li:last-of-type {
          border-bottom: none;
        }

        ul:empty {
          display: none;
        }

        ul:empty ~ div {
          align-items: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      </style>
      <ul part="list"></ul>
      <div>
        <slot name="empty"></slot>
      </div>
    `;
    
    // Events
    this.doItemClick = this.doItemClick.bind( this );

    // Properties
    this._data = [];

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$list = this.shadowRoot.querySelector( 'ul' );
    this.$empty = this.shadowRoot.querySelector( 'div' );
  }

  doItemClick( evt ) {
    if( this.disabled ) return;
    const value = this.valueField === null ? 'value' : this.valueField;
    this.selectedItem = evt.currentTarget.data[value];

    this.dispatchEvent( new CustomEvent( 'aa-change', {
      detail: {
        value: this.selectedItem
      }
    } ) );
  }
  
  // When attributes change
  _render() {
    for( let c = 0; c < this.$list.children.length; c++ ) {
      this.$list.children[c].children[0].disabled = this.disabled;

      const value = this.valueField === null ? 'value' : this.valueField;
      if( this.selectedItem !== null ) {
        this.$list.children[c].children[0].selected = this.$list.children[c].children[0].data[value] === this.selectedItem ? true : false;
      } else {
        this.$list.children[c].children[0].selected = false;
      }
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
    this._upgrade( 'data' );
    this._upgrade( 'disabled' );       
    this._upgrade( 'hidden' );         
    this._upgrade( 'interactive' );             
    this._upgrade( 'itemRenderer' );               
    this._upgrade( 'labelField' );               
    this._upgrade( 'selectedItem' );               
    this._upgrade( 'valueField' );               
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'interactive',
      'item-renderer',
      'label-field',
      'selected-item',
      'value-field'     
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 
  
  // Properties
  // Not reflected
  // Array, Date, Object, null
  get data() {
    return this._data.length === 0 ? null : this._data;
  }
  
  set data( value ) {
    this._data = value === null ? [] : [... value];

    while( this.$list.children.length > this._data.length ) {
      this.$list.children[0].removeEventListener( 'click', this.doItemClick );
      this.$list.children[0].remove();
    }

    while( this.$list.children.length < this._data.length ) {
      const item = document.createElement( 'li' );
      const element = document.createElement( this.itemRenderer === null ? 'p' : this.itemRenderer );
    
      if( this.interactive ) {
        element.addEventListener( 'click', this.doItemClick );        
      }

      item.appendChild( element );
      this.$list.appendChild( item );
    }

    for( let d = 0; d < this._data.length; d++ ) {
      this.$list.children[d].children[0].disabled = this.disabled;

      const value = this.valueField === null ? 'value' : this.valueField;
      this.$list.children[d].setAttribute( 'data-id', this._data[d][value] );

      if( this.itemRenderer === null ) {
        if( this.labelField === null ) {
          this.$list.children[d].children[0].textContent = this._data[d].label;                    
        } else {
          this.$list.children[d].children[0].textContent = this._data[d][this.labelField];          
        }
      } else {
        this.$list.children[d].children[0].data = this._data[d];
      }
    }
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
  
  get interactive() {
    return this.hasAttribute( 'interactive' );
  }

  set interactive( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'interactive' );
      } else {
        this.setAttribute( 'interactive', '' );
      }
    } else {
      this.removeAttribute( 'interactive' );
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

  get selectedItem() {
    if( this.hasAttribute( 'selected-item' ) ) {
      return this.getAttribute( 'selected-item' );
    }

    return null;
  }

  set selectedItem( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-item', value );
    } else {
      this.removeAttribute( 'selected-item' );
    }
  }
  
  get valueField() {
    if( this.hasAttribute( 'value-field' ) ) {
      return this.getAttribute( 'value-field' );
    }

    return null;
  }

  set valueField( value ) {
    if( value !== null ) {
      this.setAttribute( 'value-field', value );
    } else {
      this.removeAttribute( 'value-field' );
    }
  }  
}

window.customElements.define( 'aa-list', AaList );
