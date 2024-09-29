customElements.define( 'aa-footer', class extends HTMLElement {
  constructor() {
    super();

    this._touch = ( 'ontouchstart' in document.documentElement ) ? 'touchstart' : 'click';

    this.doScaleClick = this.doScaleClick.bind( this );

    this.$count = this.querySelector( 'p:last-of-type' );
    this.$full = this.querySelector( 'button:nth-of-type( 3 )' );
    this.$horizontal = this.querySelector( 'button:nth-of-type( 2 )' );    
    this.$link = this.querySelector( 'a' );
    this.$vertical = this.querySelector( 'button:nth-of-type( 1 )' );        
  }

  doScaleClick( evt ) {
    if( evt.currentTarget === this.$vertical ) {
      this.setAttribute( 'sized', 'vertical' );
    } else if( evt.currentTarget === this.$horizontal ) {
      this.setAttribute( 'sized', 'horizontal' );
    } else {
      this.setAttribute( 'sized', 'full' );
    }

    this.dispatchEvent( new CustomEvent( 'aa-scale', {
      detail: {
        value: this.getAttribute( 'sized' )
      }
    } ) );
  }

  connectedCallback() {
    this.$vertical.addEventListener( this._touch, this.doScaleClick );
    this.$horizontal.addEventListener( this._touch, this.doScaleClick );
    this.$full.addEventListener( this._touch, this.doScaleClick );    
  }

  disconnectedCallback() {
    this.$vertical.removeEventListener( this._touch, this.doScaleClick );
    this.$horizontal.removeEventListener( this._touch, this.doScaleClick );
    this.$full.removeEventListener( this._touch, this.doScaleClick );        
  }

  static get observedAttributes () {
    return [
      'count',
      'disabled',
      'label',
      'sized'
    ];
  }   
  
  attributeChangedCallback( name, oldValue, newValue ) {
    if( name === 'count' ) {      
      const count = newValue === null ? 0 : parseInt( newValue );

      let label = this.getAttribute( 'label' );
      label = label === null ? 'event' : label;

      this.$count.textContent = `${count} ${count === 1 ? label : label + 's'}`;
    }

    if( name === 'disabled' ) {
      const disabled = this.hasAttribute( 'disabled' );

      this.$vertical.disabled = disabled;
      this.$horizontal.disabled = disabled;
      this.$full.disabled = disabled;            

      if( disabled ) {
        this.$link.classList.add( 'disabled' );
      } else {
        this.$link.classList.remove( 'disabled' );
      }
    }

    if( name === 'sized' ) {
      const sized = newValue === null ? 'full' : newValue;
      
      switch( sized ) {
        case 'vertical':
          this.$vertical.classList.add( 'checked' );
          this.$horizontal.classList.remove( 'checked' );
          this.$full.classList.remove( 'checked' );
          break;

        case 'horizontal':
          this.$vertical.classList.remove( 'checked' );
          this.$horizontal.classList.add( 'checked' );
          this.$full.classList.remove( 'checked' );          
          break;

        case 'full': 
          this.$vertical.classList.remove( 'checked' );
          this.$horizontal.classList.remove( 'checked' );
          this.$full.classList.add( 'checked' );        
          break;
      }
    }
  }
} );
