module.exports = (function(DEBUG){

/***********************************************************************/
// import helpers
/***********************************************************************/
  
  var __ = {
    defined: require('dsb-defined'),
    toArray: require('dsb-to-array'),
    each: require('dsb-each'),
    chop: require('dsb-chop')
  };
  
/***********************************************************************/
// has
/***********************************************************************/ 

  /* @method has
   * checks if object owns ALL or ANY of the properties provided
   * if ANY, returns a single key as string and multiple keys as array
   * if firstOnly is true, returns first match found as a string.
   * @param object {object} the object to check
   * @param keys [array|string spaced|strings via rest...]
   * @param [all] {boolean} true by default. if false, returns true if ANY matching properties are found in the object
   * @param [firstOnly] {boolean} false by default. if true, returns first match as a string
   * @note will not work with global|window|root object
   * @returns 
   */  

  var has = function(){
    
/*---------------------------------------------------------------------*/

    //initial setup 
    
    //our arguments as an array
    var a = __.toArray( arguments ),
    //require all keys to be contained?
      all = true,
    //return the first matching key?
    first = false,
    //will flip to false if a key is missing
   hasAll = true, 
    //will flip to true if any key is found
   hasAny = false,
    //will return if {hasAny} and !{all}. if {first}, becomes the 1st matching key
    found = [],
    //really for DEBUG, can remove
  classic = false,
    //the source object
        s,
    //the array of keys
     keys,
    //{all} boolean provided
     _all,
    //{first} boolean provided
   _first,
    //triggers to true on first match if {first} is true
  __first,
    //the classic has method, cross-browser safe
     _has = function(o,p){
       
       if( typeof o !== 'object' )
         throw new Error('has cannot process on a non-object..., given '+o);
       
       if ( !Object.prototype.hasOwnProperty ) {
	 var __has = function(obj, prop) {
	   var proto = obj.__proto__ || obj.constructor.prototype;
	   return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
         };
         return __has( o, p );
       } 
       
       return Object.prototype.hasOwnProperty.call( o, p );
     };
  
/*---------------------------------------------------------------------*/

    //resolve options
    
    //check for source object as 1st param
    if( a.length && ( typeof a[0] === 'object' ) ){      
      classic = true;     
      s = a.shift();
    }
    
    //check for boolean as last parameter
    if( a.length && ( typeof a[ a.length - 1 ] === 'boolean' ) ){
      //pull last arg
      var last = a.pop();      
      //check again, if found, apply to firstOnly
      if( a.length && ( typeof a[ a.length - 1 ] === 'boolean' ) ){               
        _first = true;
        _all = true;
        all = a.pop();
        first = last;
      }
      else {
        //shortcut signature for firstOnly
        if( last === true ){
          first = true;
          all = false;
        }
        else all = last; //all=false
      }
    }
    
/*---------------------------------------------------------------------*/

    //handle single string || array param
    
    if( a.length === 1 ){            
      var f = a[0];
      if( typeof f === 'string' ) a = __.chop( f );     
      if( f instanceof Array ) a = f;
    }

/*---------------------------------------------------------------------*/

    //so theres no confusion
    keys = a;
    
/*---------------------------------------------------------------------*/

    //return null if no object is provided    
    if(typeof s !== 'object' ) return false;

/*---------------------------------------------------------------------*/

    //process all other arguments {keys} provided checking string(s) against keys in source object
    
    __.each( keys, function(p){
      
      //determine if property key is found
      var has = _has( s, p )
        //set hasAny for !all uses
        ? ( !hasAny ? hasAny = true : true ) 
        //reject hasAll if one isn't found
        : hasAll = false;
    
      if(DEBUG) console.log( 'has? ', has );
      
      //push any found keys into {found} array
      if( has && !__first ){
        if( !first ) found.push( p );
        //set found as string and flip __first conditional if {first}
        else __first = found = p;
      }
      
      //why not return
      return has;
      
    });
    
/*---------------------------------------------------------------------*/    
    
    var result = ( all ? hasAll : ( hasAny ? found : false ) );

/*---------------------------------------------------------------------*/

    if( DEBUG ){
      
      var sig = {
        object: s,
        keys: keys,
        all: all,
        hasAll: hasAll,
        hasAny: hasAny,
        first: first,
        classic: classic,
        returning: result
      };      
      
      var short = {},             
              k = require('dsb-keys')(s),
              f = k[0],
              x = '...',
            str = '{ '+f+': '+x+', '+k[1]+': '+x+', '+x+' }';
            
      if( !__.defined( sig.object ) ) sig.object = '[object Global]';
      else {
        if( require('dsb-count')( s ) > 3 ) sig.object = str;
      }
      
      var b = '\n\r';
      var br = b+'----------------------------'+b;
      console.log(br);
      console.log( sig );
      console.log(br);
    }
/*---------------------------------------------------------------------*      
      console.log( 'keys: ', keys );
      console.log( 'return on any?', !all );
      console.log( 'return on first?', first );
      //console.log( 'has: root defined: ', __.defined( sig.object ) );      
      //console.log( 'keys', sig.keys );
      //console.log( 'found classic signature' );
      var signature = 'has( '+sig.object+', ["'+sig.keys.join('", "')+'"]';
      if( __.defined( _all ) ) signature += ', '+( sig.all ? 'true' : 'false' );
      if( __.defined( _first ) ) signature += ', '+( sig.first ? 'true' : 'false' );
      signature += ' )';
      console.log(signature+' => '+result);
        console.log(br);
    }
/*---------------------------------------------------------------------*/    

/*---------------------------------------------------------------------*/

    return result;

/*---------------------------------------------------------------------*/

  };  
  
/***********************************************************************/
  
  return has;
  
/*---------------------------------------------------------------------*/  
}(!true));