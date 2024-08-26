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
          align-items: center;
          border-bottom: solid 1px #bebec3;
          box-sizing: border-box;
          display: flex;
          flex-direction: row;
          gap: 8px;
          margin: 0 0 0 16px;
          padding: 8px 16px 8px 0;
          position: relative;
        }

        :host( [concealed] ) {
          visibility: hidden;
        }

        :host( [hidden] ) {
          display: none;
        }

        aa-hbox[part=first] {
          align-items: baseline;
        }

        aa-hbox[part=first],
        aa-hbox[part=second] {
          flex-basis: 0;
          flex-grow: 1;
        }

        aa-hbox[part=second] {
          margin: 4px 0 0 0;
        }

        aa-vbox[part=calendar] {
          background: #ffffff, #f443364d;
          border-radius: 4px;
          height: 36px;
          width: 36px;
        }

        aa-vbox[part=details] {
          flex-basis: 0;
          flex-grow: 1;
        }

        aa-label[part=date] {
          --label-color: #B71C1C;          
        }

        aa-label[part=month] {
          --label-color: #B71C1C;
          --label-text-transform: uppercase;
        }

        aa-label[part=ends] {
          --label-color: #8a8b8e;
        }

        aa-label[part=location] {
          flex-basis: 0;
          flex-grow: 1;
          --label-color: #8a8b8e;
        }

        aa-label[part=summary] {
          flex-basis: 0;
          flex-grow: 1;
        }

        div {
          background: #ffffff;
          border-radius: 4px;
        }

        :host( [outdated] ) aa-label[part=summary],
        :host( [outdated] ) aa-label[part=location],
        :host( [outdated] ) aa-label[part=label],
        :host( [outdated] ) aa-label[part=ends] {
          --label-color: #a9a9b0;
        }
      </style>
      <div>
        <aa-vbox centered justified part="calendar">
          <aa-label part="date" text="6" weight="bold"></aa-label>
          <aa-label part="month" size="xs" text="Jan"></aa-label>
        </aa-vbox>
      </div>
      <aa-vbox part="details">
        <aa-hbox gap="m" part="first">
          <aa-label part="summary" truncate weight="bold"></aa-label>
          <aa-label part="label" size="s" text="Ends"></aa-label>
        </aa-hbox>
        <aa-hbox gap="m" part="second">
          <aa-label part="location" size="s" truncate></aa-label>
          <aa-label part="ends" size="s" text="Fri Aug 23"></aa-label>
        </aa-hbox>        
      </aa-vbox>
    `;

    // Private
    this._colors = [
      {activeBackgroundColor: '#F44336', activeColor: '#ffffff', inactiveColor: '#B71C1C'},
      {activeBackgroundColor: '#E91E63', activeColor: '#ffffff', inactiveColor: '#880E4F'},      
      {activeBackgroundColor: '#9C27B0', activeColor: '#ffffff', inactiveColor: '#4A148C'},            
      {activeBackgroundColor: '#3F51B5', activeColor: '#ffffff', inactiveColor: '#1A237E'},                  
      {activeBackgroundColor: '#2196F3', activeColor: '#ffffff', inactiveColor: '#0D47A1'},                        
      {activeBackgroundColor: '#00BCD4', activeColor: '#ffffff', inactiveColor: '#006064'},                              
      {activeBackgroundColor: '#009688', activeColor: '#ffffff', inactiveColor: '#004D40'},                                    
      {activeBackgroundColor: '#4CAF50', activeColor: '#ffffff', inactiveColor: '#1B5E20'},                                          
      {activeBackgroundColor: '#8BC34A', activeColor: '#ffffff', inactiveColor: '#33691E'},                                                
      {activeBackgroundColor: '#CDDC39', activeColor: '#ffffff', inactiveColor: '#827717'},  
      {activeBackgroundColor: '#FF5722', activeColor: '#ffffff', inactiveColor: '#BF360C'},                                                                  
      {activeBackgroundColor: '#795548', activeColor: '#ffffff', inactiveColor: '#3E2723'}                                                                             
    ];    
    this._data = null;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$calendar = this.shadowRoot.querySelector( 'aa-vbox[part=calendar]' );
    this.$date = this.shadowRoot.querySelector( 'aa-label[part=date]' );
    this.$ends = this.shadowRoot.querySelector( 'aa-label[part=ends]' );
    this.$label = this.shadowRoot.querySelector( 'aa-label[part=label]' );
    this.$location = this.shadowRoot.querySelector( 'aa-label[part=location]' );
    this.$month = this.shadowRoot.querySelector( 'aa-label[part=month]' );
    this.$summary = this.shadowRoot.querySelector( 'aa-label[part=summary]' );
  }

   // When attributes change
  _render() {
    if( this._data === null ) return;

    let parts = this._data.startsAt.split( '-' );
    const starts = new Date(
      parseInt( parts[0] ),
      parseInt( parts[1] ) - 1,
      parseInt( parts[2] )
    );    

    let formatted = new Intl.DateTimeFormat( navigator.language, {
      month: 'short'
    } ).format( starts );        

    this.$calendar.style.setProperty( 'background', this._colors[starts.getMonth()].activeBackgroundColor + '4d' );    
    this.$date.style.setProperty( '--label-color', this._colors[starts.getMonth()].inactiveColor );        
    this.$date.text = starts.getDate();
    this.$month.style.setProperty( '--label-color', this._colors[starts.getMonth()].inactiveColor );            
    this.$month.text = formatted;
    
    parts = this._data.endsAt.split( '-' );
    const ends = new Date(
      parseInt( parts[0] ),
      parseInt( parts[1] ) - 1,
      parseInt( parts[2] )
    );

    this.$summary.text = this._data.summary;
    this.$label.hidden = starts.getDate() === ends.getDate() ? true : false;
    this.$location.text = this._data.location;

    if( starts.getDate() === ends.getDate() &&
        starts.getMonth() === ends.getMonth() ) {
      this.$ends.hidden = true;
    } else {
      formatted = new Intl.DateTimeFormat( navigator.language, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      } ).format( ends );      
      this.$ends.hidden = false;  
      this.$ends.text = formatted;
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
    this._upgrade( 'hidden' );    
    this._upgrade( 'outdated' );          
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'concealed',
      'hidden',
      'outdated'
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

    const parts = this._data.endsAt.split( '-' );
    const ends = new Date(
      parseInt( parts[0] ),
      parseInt( parts[1] ) - 1,
      parseInt( parts[2] )
    );    
    this.outdated = ends.getTime() < Date.now() ? true : false;    

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

  get outdated() {
    return this.hasAttribute( 'outdated' );
  }

  set outdated( value ) {
    if( value !== null ) {
      if( typeof value === 'boolean' ) {
        value = value.toString();
      }

      if( value === 'false' ) {
        this.removeAttribute( 'outdated' );
      } else {
        this.setAttribute( 'outdated', '' );
      }
    } else {
      this.removeAttribute( 'outdated' );
    }
  }  
}

window.customElements.define( 'aa-event-renderer', AAEventRenderer );
