export default class AaCalendarItemRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          align-items: center;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 8px;
          padding: 0 8px 0 16px;
          position: relative;
        }

        p {
          color: var( --color );
          cursor: default;
          flex-basis: 0;
          flex-grow: 1;
          font-family: var( --font-family );
          font-size: var( --font-size );
          font-style: var( --font-style );
          font-weight: var( --font-weight );
          line-height: 36px;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }
      </style>
      <aa-checkbox></aa-checkbox>
      <p></p>
      <aa-icon-button src="./img/info-circle.svg"></aa-icon-button>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$active = this.shadowRoot.querySelector( 'aa-checkbox' );
    this.$active.addEventListener( 'aa-change', ( evt ) => {
      this.dispatchEvent( new CustomEvent( 'aa-change', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          uuid: this._data.uuid,
          checked: evt.detail.checked
        }
      } ) );
    } );
    this.$label = this.shadowRoot.querySelector( 'p' );
    this.$info = this.shadowRoot.querySelector( 'aa-icon-button' );
    this.$info.addEventListener( 'click', () => {
      this.dispatchEvent( new CustomEvent( 'aa-info', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: {
          uuid: this._data.uuid
        }
      } ) );
    } );
  }
  
  // When attributes change
  _render() {
    this.$active.disabled = this.disabled;
    this.$info.disabled = this.disabled;    
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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden'
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
    return this._data;
  }
  
  set data( value ) {
    this._data = value === null ? null : structuredClone( value );
    this.$active.style.setProperty( '--checkbox-color', this._data.color );
    this.$active.checked = this._data.active_at === null ? false : true;
    this.$label.textContent = this._data.name;
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
}

window.customElements.define( 'aa-calendar-item-renderer', AaCalendarItemRenderer );
