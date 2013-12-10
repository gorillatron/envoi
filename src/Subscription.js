var inherits      = require( 'util' ).inherits,
    EventEmitter  = require( 'events' ).EventEmitter


/**
  @exports Subscription
*/
module.exports = Subscription


/**
  @constructor
  @class Subscription
  @property {function}  callback  - callback to call when this subscription is published to
  @property {object}    context   - this value of the callback function
*/
function Subscription( optsOrFn, context ) {
  EventEmitter.apply( this.arguments )
  if( typeof optsOrFn == 'function' ) {
    this.callback = optsOrFn.callback
    this.context = context || this
  }
  else {
    this.callback = optsOrFn.callback
    this.context = optsOrFn.context || this
  }
}


/**
  @augments EventEmitter
*/
inherits( Subscription, EventEmitter )


/**
  Trigger this subscription with arguments
  @public
  @type Function
  @param {Array} args
*/
Subscription.prototype.trigger = function( args ) {
  this.callback.apply( this.context, args )
  this.emit( 'trigger' )
}


/**
  Cancel this Subscription
  @public
  @type Function
*/
Subscription.prototype.cancel = function() {
  this.emit( 'cancel' )
  this.callback = function() {
    throw new Error( 'trying to call Subscription that is canceled' )
  }
}