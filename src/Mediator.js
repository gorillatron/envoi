var _             = require( 'underscore' ),
    Subscription  = require( './Subscription' )


/**
  @exports Mediator
*/
module.exports = Mediator


/**
  @constructor
  @class Mediator
  @property {object}   namespaces                       - object containing array with Subscription bound to the namespace 
  @property {object}   configuration                    - configuration of this mediator
  @property {string}   configuraion.namespaceDelimiter  - delimiter for namespaced events
*/
function Mediator( config ) {
  this.namespaces = {}
  this.configuration = _.extend({}, Mediator.configuration, config || {} )
}


/**
  Configuration for mediators.
  @public
  @static
  @type Object
*/
Mediator.configuration = {
  namespaceDelimiter: "::"
}


/**
  Binds a callback to be called when an event is published to the namespace given
  as first parameter.
  @public
  @type Function
  @param {String} namespace The name of the namespace to bind the callback to
  @param {Function} callback The callback to fire
  @param {Object} context The context of the callback. The callback will have this paramter as its this value
  @return {Subscription} subscription the created Subscription
*/
Mediator.prototype.subscribe = function( namespace, callback, context ) {
  var subscription

  if( typeof namespace !== 'string' ) 
    throw new TypeError( 'namespace must be string' ) 
  if( typeof callback !== 'function' )
    throw new TypeError( 'callback must be function' ) 

  if( !this.namespaces[namespace] )
    this.namespaces[ namespace ] = [ ]

  subscription = new Subscription({
    callback: callback,
    context: context
  })

  subscription.once( 'cancel', _.bind(this.unsubscribe, this, namespace, subscription) )

  this.namespaces[ namespace ].push( subscription )

  return subscription
}


/**
  Removes a callback where the given arguments mathes the listener properties
  @public
  @type Function
  @param {String} namespace The name of the namespace to bind the callback to
  @param {Function} callback The callback to fire
*/
Mediator.prototype.unsubscribe = function( namespace, callbackOrSubscription ) {
  var subscribingChannel, subscriptions, i, subscription

  for( subscribingChannel in this.namespaces ) {
    if( !this.namespaceMatch(subscribingChannel, namespace) )
      continue

    if( !callbackOrSubscription ) {
      delete this.namespaces[ subscribingChannel ]
      continue
    }

    subscriptions = this.namespaces[ subscribingChannel ]

    for( i = subscriptions.length - 1; i >= 0; i-- ) {
      subscription = subscriptions[ i ]
      if( subscription.callback === callbackOrSubscription ) {
        subscriptions.splice( i, 1 )
      }
      if( subscription === callbackOrSubscription) {
        subscriptions.splice( i, 1 )
      }
    }
  }
}


/**
  Publish to a namespace, passing the arguments after namespace to the callback.
  @public
  @type Function
  @param {String} namespace The name of the namespace to unbind the callback from
  @param {Mixed[]} args The arguments after namespace to be passed to callback
  @returns {Boolean}
*/
Mediator.prototype.publish = function( namespace ) {
  var subscriptions, args, subscribingChannel, i, subscription

  subscriptions = this.getSubscriptionsForNamespace( namespace )

  if( !subscriptions.length ) 
    return false

  args = [].slice.call( arguments, 1 )
  for( i = 0; i < subscriptions.length; i = i+1 ) {
    subscription = subscriptions[i]
    subscription.trigger( args )
  }

  return true
}


/**
  Get all subscriptions for a given namespace
  @public
  @type Function
  @param {String} namespace The name of the namespace to unbind the callback from
  @returns [Object]
*/
Mediator.prototype.getSubscriptionsForNamespace = function( namespace ) {
  var subscriptions

  subscriptions = []

  for( subscribingChannel in this.namespaces ) {
    if( this.namespaceMatch(namespace, subscribingChannel) && this.namespaces[subscribingChannel] ) {
      subscriptions = subscriptions.concat( this.namespaces[subscribingChannel] )
    }
  }

  return subscriptions
}


/**
  Check if a namespace name is within the bound of another namespace namespace.
  @public
  @type Function
  @param {String} targetNs The name of the namespace published to
  @param {String} outerNs The name of the subscribing namespace to test against
  @returns Boolean
*/
Mediator.prototype.namespaceMatch = function( targetNs, outerNs ) {
  var targetNamespace, outerNamespace, i

  targetNamespace = targetNs.split( this.configuration.namespaceDelimiter )
  outerNamespace = outerNs.split( this.configuration.namespaceDelimiter )

  for( i = 0; i < outerNamespace.length; i++ ) {
    if( outerNamespace[i] !== targetNamespace[i] ) {
      return false
    }
  }

  return true
}

