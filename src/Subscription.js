var inherits      = require( 'util' ).inherits,
    EventEmitter  = require( 'events' ).EventEmitter,
    identity      = require( './identity' )


/**
  @exports Subscription
*/
module.exports = Subscription


/**
  @constructor
  @class Subscription
  @property {int}       state     - state of the subscription, can be active of canceled
  @property {function}  callback  - callback to call when this subscription is published to
  @property {object}    context   - this value of the callback function
*/
function Subscription( optsOrFn, context ) {
  EventEmitter.apply( this.arguments )
  this.__state = Subscription.ACTIVE

  if( typeof optsOrFn == 'function' ) {
    this.callback = optsOrFn
    this.context = context || this
  }
  else {
    this.callback = optsOrFn.callback
    this.context = optsOrFn.context || this
  }
}


/**
  @static
*/
Subscription.ACTIVE = identity()


/**
  @static
*/
Subscription.CANCELED = identity()


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
  if( this.__state === Subscription.CANCELED ) {
    throw new Error( 'trying to call Subscription that is canceled' )
  }
  this.callback.apply( this.context, args )
  this.emit( 'trigger' )
}


/**
  Cancel this Subscription
  @public
  @type Function
*/
Subscription.prototype.cancel = function() {
  this.__state = Subscription.CANCELED
  this.emit( 'cancel' )
}