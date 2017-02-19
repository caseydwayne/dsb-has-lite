module.exports = (function(DEBUG){
/******************************************************************************/

  /*
   * @method _has
   * the classic, cross-browser safe method
   * @param object {object} the object to check
   * @param property {string} a property key to check for
   * @return hasProp {boolean} 
   */

/*----------------------------------------------------------------------------*/

  var _has = function(o,p){
       
    if( typeof o !== 'object' )
      throw new Error('has cannot process on a non-object..., received '+o);

    if ( !Object.prototype.hasOwnProperty ) {
      var __has = function(obj, prop) {
        var proto = obj.__proto__ || obj.constructor.prototype;
        return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
      };
      return __has( o, p );
    } 

    return Object.prototype.hasOwnProperty.call( o, p );
  };

/******************************************************************************/

  return _has;
  
/*---------------------------------------------------------------------*/  
}(0));