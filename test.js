try {
module.exports = (function(){
/***********************************************************************/

  /*    
   * @signature
   * [object], 
   * [key or array of keys or string of spaced keys]...,
   * [all=true],
   * [first=false]
   */
  
/*---------------------------------------------------------------------*/

  //setup
  var has = require('./index'),
        e = { expandAll: true },
    debug = require('dsb-debugger').create( 'dsb-has', e ),
        r = 'real',
        f = 'fake',
        v = 'property value',
      arr = [r],
      obj = {};
      
  //teach obj
  obj[r] = v;
  //can't have obj[f], that's the point
  
/*---------------------------------------------------------------------*/

  debug.method( 'has', function( fn, test ){

/*0--------------------------------------------------------------------*/  

    test( 'real property', fn( obj, r ), true );

/*1--------------------------------------------------------------------*/  

    test( 'fake property', fn( obj, f ), false );

/*2--------------------------------------------------------------------*/  

    var x = fn( obj, r, f, false );    
    test( 'any properties', x, arr );

/*3--------------------------------------------------------------------*/  

    var x = fn( obj, r+' '+f, false );
    debug.test( 'chop string (any)', x, arr );


/*4--------------------------------------------------------------------*/

    obj['jerry'] = 'human';
    obj['rabbit'] = 'animal';
    
    var s = 'fake ham rabbit jerry';
    
    var x = fn( obj, s, false, true );
    test( 'return first found', x, 'rabbit' );

    var x = fn( obj, s, true );
    test( 'shorthand for return first found', x, 'rabbit' );
    
    
    var x = fn( obj, 'real rabbit jerry' );
    test( 'has all', x, true );
    
    var x = fn( obj, 'real rabbit jerry', false );
    test( 'has any (long)', x, 'real rabbit jerry'.split(' ') );
 
/*---------------------------------------------------------------------*/

    //debug.log( fn( { 'real': true, 'another': true }, 'real', 'another', 'fake', false ) );
    
  }, has );
  
/*---------------------------------------------------------------------*/

  debug.complete();
  
/*---------------------------------------------------------------------*/  

  return debug;
  
/***********************************************************************/
}());
} catch( e ){ console.log(e); }