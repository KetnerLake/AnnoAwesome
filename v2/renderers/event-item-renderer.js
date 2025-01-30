export default class AaEventItemRenderer extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          border-radius: var( --button-border-radius );
          box-sizing: border-box;
          cursor: pointer;
          display: flex;
          flex-direction: row;
          gap: 8px;
          margin: 0 8px 0 8px;
          padding: 8px;
          position: relative;
        }

        :host( [selected] ) {
          background-color: var( --button-disabled-background-color );
        }

        p {
          color: var( --color );
          cursor: pointer;
          font-family: var( --font-family );
          font-size: var( --font-size );
          font-style: var( --font-style );
          font-weight: var( --font-weight );
          line-height: 16px;
          margin: 0;
          padding: 0;
          text-rendering: optimizeLegibility;
        }

        aa-vbox:first-of-type {
          align-items: center;
          border-radius: var( --button-border-radius );
          height: 36px;
          justify-content: center;
          width: 36px;
        }        

        aa-vbox:first-of-type p:first-of-type {                
          font-weight: 600;
        }

        aa-vbox:first-of-type p:last-of-type {                        
          font-size: 14px;
          line-height: 14px;
          text-transform: uppercase;
        }

        aa-vbox:last-of-type {
          flex-basis: 0;
          flex-grow: 1;          
          height: 36px;
          justify-content: center;
        }

        aa-vbox:last-of-type aa-hbox p:first-of-type {                
          flex-basis: 0;
          flex-grow: 1;
        }

        aa-vbox:last-of-type aa-hbox:first-of-type p:first-of-type {                        
          font-weight: 600;
        }

        aa-vbox:last-of-type aa-hbox:first-of-type p:last-of-type {                                
          font-size: 14px;
        }

        aa-vbox:last-of-type aa-hbox:last-of-type p {                        
          color: var( --color-secondary );
          font-size: 14px;
          line-height: 14px;
        }        

        :host( [disabled] ) {
          cursor: default;
        }

        :host( [disabled] ) p {
          color: var( --button-disabled-color ) !important;
          cursor: default;
        }
      </style>
      <aa-vbox>
        <p>99</p>
        <p>Dec</p>
      </aa-vbox>
      <aa-vbox>
        <aa-hbox>
          <p>Summary</p>
          <p>Starts</p>
        </aa-hbox>
        <aa-hbox>
          <p>Parker</p>
          <p>Ends</p>
        </aa-hbox>        
      </aa-vbox>
    `;

    // Properties
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$box = this.shadowRoot.querySelector( 'aa-vbox:first-of-type' );
    this.$date = this.shadowRoot.querySelector( 'aa-vbox:first-of-type > p:first-of-type' );
    this.$month = this.shadowRoot.querySelector( 'aa-vbox:first-of-type > p:last-of-type' );    
    this.$summary = this.shadowRoot.querySelector( 'aa-vbox > aa-hbox:first-of-type > p:first-of-type' );        
    this.$starts = this.shadowRoot.querySelector( 'aa-vbox > aa-hbox:first-of-type > p:last-of-type' );
    this.$location = this.shadowRoot.querySelector( 'aa-vbox > aa-hbox:last-of-type > p:first-of-type' );        
    this.$ends = this.shadowRoot.querySelector( 'aa-vbox > aa-hbox:last-of-type > p:last-of-type' );                
  }
  
  // When attributes change
  _render() {;}

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
    this._upgrade( 'selected' );               
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'disabled',
      'hidden',
      'selected'
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
    this.$box.style.backgroundColor = `${this._data[this._data.color]}4d`;
    this.$date.style.color = `hsl( from ${this._data[this._data.color]} h s calc( l - 20 ) )`;
    this.$month.style.color = `hsl( from ${this._data[this._data.color]} h s calc( l - 20 ) )`;
    this.$summary.textContent = this._data.summary;
    this.$location.textContent = this._data.location === null ? '' : this._data.location;
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
  
  get selected() {
    return this.hasAttribute( 'selected' );
  }

  set selected( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'selected' );
      } else {
        this.setAttribute( 'selected', '' );
      }
    } else {
      this.removeAttribute( 'selected' );
    }
  }  
}

window.customElements.define( 'aa-event-item-renderer', AaEventItemRenderer );
