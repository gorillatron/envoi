# Envoi

Application message passing and loosly coupled module communication library. Mediators with namespaces and shit.

## Installation

```
$ npm install envoi
```

## Mediator

Mediator class. Publish and subscribe to namespaced events

### Usage

```js
var Mediator = require( 'envoi' ).Mediator

var mediator = new Mediator()

mediator.subscribe( "chat", logChatEvent )
mediator.subscribe( "chat::message", displayMessage )

mediator.publish( "chat::message", "shaggy87", "lol dope" )
// -> logChatEvent()
// -> displayMessage()

```

#### Api

##### Mediator.prototype.subscribe( channel, callback, context )

Subscribe to the given channel/namespace. Call the given callback with the given context as 'this'
when that channels is published to.

##### Mediator.prototype.unsubscribe( channel, callback )

Unsubscribe from channel. If only channel is given all callbacks that match the channels namspace will be 
removed. If callback is given it will only remove subscriptions that has that specific callback

##### Mediator.prototype.publish( channel, args.. )

Publishes to the channel, calling all subscribing callbacks with the rest of the arguments as arguments
to the calback function[s].


## License 

MIT licensed