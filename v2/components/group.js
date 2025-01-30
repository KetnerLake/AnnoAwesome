export default class AaGroup extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline;
          position: relative;
        }

        :host( [hidden] ) {
          display: none;
        }
      </style>
      <slot></slot>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
    this.addEventListener( 'click', ( evt ) => {
      for( let c = 0; c < this.children.length; c++ ) {
        if( this.children[c] === evt.target ) {
          if( this.selectedIndex === c ) {
            this.selectedIndex = null;
          } else {
            this.selectedIndex = c;
          }

          break;
        }
      }

      this.dispatchEvent( new CustomEvent( 'aa-change', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          selectedIndex: this.selectedIndex
        }
      } ) );
    } );
  }
  
  // When attributes change
  _render() {
    for( let c = 0; c < this.children.length; c++ ) {
      this.children[c].disabled = this.disabled;
      
      if( this.selectedIndex === null ) {
        this.children[c].selected = false;
      } else {
        this.children[c].selected = c === this.selectedIndex ? true : false;
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
    this._upgrade( 'disabled' );       
    this._upgrade( 'hidden' );           
    this._upgrade( 'selectedIndex' );           
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'selected-index'
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

  get selectedIndex() {
    if( this.hasAttribute( 'selected-index' ) ) {
      return parseInt( this.getAttribute( 'selected-index' ) );
    }

    return null;
  }

  set selectedIndex( value ) {
    if( value !== null ) {
      this.setAttribute( 'selected-index', value );
    } else {
      this.removeAttribute( 'selected-index' );
    }
  }  
}

window.customElements.define( 'aa-group', AaGroup );
