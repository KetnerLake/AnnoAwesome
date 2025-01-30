export default class Writeable {
  constructor( value ) {
    this.value = value;
    this.listeners = [];
  }

  set( value ) {
    if( this.value !== value ) {
      this.value = value;
      this.dispatch( this.value );
    }
  }

  subscribe( callback ) {
    this.listeners.push( callback );
  }

  dispatch( evt ) {
    for( let h = 0; h < this.listeners.length; h++ ) {
      this.listeners[h]( evt );
    }
  }      
}
