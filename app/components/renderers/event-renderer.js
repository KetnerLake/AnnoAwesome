import AAHBox from "../hbox.js";
import AALabel from "../label.js";
import AAVBox from "../vbox.js";

export default class AAEventRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-hbox aa-label:first-of-type {
          flex-basis: 0;
          flex-grow: 1;
        }

        div {
          background-color: blue;
          border-radius: 3px;
          box-sizing: border-box;
          height: 35px;
          min-width: 3px;
          width: 3px;
        }
      </style>
      <aa-label size="m" text="Sat Aug 17" weight="bold"></aa-label>
      <aa-hbox style="align-items: baseline;">
        <aa-label part="summary" size="m" weight="bold"></aa-label>
        <aa-label text="Ends"></aa-label>
      </aa-hbox>
      <aa-hbox>
        <aa-label part="location" style="--label-color: #858585;"></aa-label>
        <aa-label part="ends" style="--label-color: #858585;" text="Sun Aug 18"></aa-label>
      </aa-hbox>      
    `;

    // Private
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$summary = this.shadowRoot.querySelector( 'aa-label[part=summary]' );
    this.$location = this.shadowRoot.querySelector( 'aa-label[part=location]' );
  }

   // When attributes change
  _render() {
    if( this._data === null ) return;

    this.$summary.text = this._data.summary;
    this.$location.text = this._data.location;
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
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
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
  // Array, Date, Function, Object, null
  get data() {
    return this._data;
  }

  set data( value ) {
    this._data = value;
    this._render();
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
}

window.customElements.define( 'aa-event-renderer', AAEventRenderer );
