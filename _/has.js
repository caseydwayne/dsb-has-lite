/*
 * The following is 'has', a method from my custom framework, the 
 * DSB. It has a flexible signature, allowing for the most 
 * desired uses all in one method. 
 * 
 * Signatures:
 * has( {object}, 'key' ) => true if key is present
 * has( {object}, 'key1 key2' ) => true if keys are present 
 * has( {object}, 'key1', key2' ) => true if keys are present
 * has( {object}, ['key1', key2'] ) => true if keys are present
 * has( {object}, key1, key2, false ) => array of matching keys or false (if none found)
 * has( {object}, key1, key2, false, true ) => value of first matching key
 * 
 * This, and the many other modules like it, have saved me countless 
 * hours. I hope you like my code! 
 * 
 * @note It's set to be available open-source very soon.
 *   Until then, all rights are reserved. :)
 */

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

  /* 
   * @method has
   * checks if object owns ALL or ANY of the properties provided
   * if ANY (!all), returns a single key as string and multiple keys as array
   * if FIRST, returns first match found as a string
   * @param object {object} the object to check
   * @param keys {array|chop_string|strings via rest...}
   * @param [all=true] {boolean} see description of ANY
   * @param [first=false] {boolean} see description of FIRST
   * @note designed not to work with global|window|root object
   * @return varies by signature   
   */

/*---------------------------------------------------------------------*/

  var has = function(){
    
/*-initial setup--------------------------------------------------------------*/
    
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
    //the source object
        s,
    //the array of keys
     keys,
    //{all} boolean provided
     _all,
    //{first} boolean provided
   _first,
    //triggers to true on first match if {first} is true
  __first;
  
/*---------------------------------------------------------------------*/
  
  //the classic has method, cross-browser safe
    
  var _has = function(o,p){

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

/*-resolve options------------------------------------------------------------*/
    
    //check for source object as 1st param
    if( a.length && ( typeof a[0] === 'object' ) ){      
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

/*----------------------------------------------------------------------------*/

    //so there is no confusion
    keys = a;
    
/*----------------------------------------------------------------------------*/

    //return null if no object is provided    
    if(typeof s !== 'object' ) return false;

/*----------------------------------------------------------------------------*/

    //process all other arguments {keys} provided checking string(s) against keys in source object
    
    __.each( keys, function(p){
      
      //determine if property key is found
      var has = _has( s, p )
        //set hasAny for !all uses
        ? ( !hasAny ? hasAny = true : true ) 
        //reject hasAll if one isn't found
        : hasAll = false;
    
      if( DEBUG ) console.log( 'has? ', has );
      
      //push any found keys into {found} array
      if( has && !__first ){
        if( !first ) found.push( p );
        //set found as string and flip __first conditional if {first}
        else __first = found = p;
      }
      
      //why not return
      return has;
      
    });
    
/*----------------------------------------------------------------------------*/
    
    var result = ( all ? hasAll : ( hasAny ? found : false ) );

/*----------------------------------------------------------------------------*/

    return result;

/*----------------------------------------------------------------------------*/

  };  
  
/******************************************************************************/
  
  return has;
  
/*----------------------------------------------------------------------------*/  
}(0));