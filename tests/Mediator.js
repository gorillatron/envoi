
var Mediator = require("../index").Mediator,
    expect = require("expect.js")

describe("Mediator", function() {
  

  describe("Mediator.prototype.subscribe", function() {
    
    var mediator

    beforeEach(function() {
      mediator = new Mediator()
    })

    it("should bind the third context callback as the this value for the callback", function() {
      
      var _this, that

      _this = { foo: 'bar' }

      mediator.subscribe("context", function() {
        that = this
      }, _this)

      mediator.publish( "context" )

      expect( _this ).to.equal( that )
      expect( that["foo"] ).to.equal( "bar" )

    })

    it('should setup listening to "cancel" event on subscription and stopp calling it when its killed', function() {
      var spy, subscription

      spy = sinon.spy()
      subscription = mediator.subscribe( 'foo', spy )

      mediator.publish( 'foo' )
      mediator.publish( 'foo' )

      expect( spy.callCount ).to.eql( 2 )

      subscription.cancel()

      mediator.publish( 'foo' )
      mediator.publish( 'foo' )

      expect( spy.callCount ).to.eql( 2 )
    })

  })


  describe("Mediator.prototype.publish", function() {
    
    var mediator

    beforeEach(function() {
      mediator = new Mediator()
    })

    it("should fire all subscribing callbacks with the arguments.. after channel", function() {
      
      var a, b, c

      mediator.subscribe("abc", function( _a, _b, _c) {
        a = _a
        b = _b
        c = _c
      })

      mediator.publish( "abc", 'a', 'b', 'c' )

      expect( a ).to.equal( "a" )
      expect( b ).to.equal( "b" )
      expect( c ).to.equal( "c" )

    })

  })


  describe("Mediator.prototype.unsubscribe", function() {
    
    var mediator

    beforeEach(function() {
      mediator = new Mediator()
    })

    it("should remove all callbacks if only channel is given", function() {

      var calls = 0

      mediator.subscribe( "foo", function() { calls++ } )
      mediator.subscribe( "foo", function() { calls++ } )
      mediator.subscribe( "foo", function() { calls++ } )
      mediator.subscribe( "bar", function() { calls++ } )
      mediator.subscribe( "bar", function() { calls++ } )

      mediator.publish("foo")
      expect( calls ).to.equal( 3 )

      mediator.unsubscribe( "foo" )

      mediator.publish("foo")
      expect( calls ).to.equal( 3 )
    })

    it("should remove a specific subscription that has the callback specified in parameters", function() {
      
      var i, callback

      i = 0
      callback = function() { i++ }

      mediator.subscribe( "increment", callback )

      mediator.publish( "increment" )
      mediator.publish( "increment" )

      expect( i ).to.equal( 2 )

      mediator.unsubscribe( "increment", callback )

      mediator.publish( "increment" )

      expect( i ).to.equal( 2 )

    })

  })
  

  describe("Mediator.prototype.namespaceMatch", function() {

    var mediator

    beforeEach(function() {
      mediator = new Mediator()
    })

    it("should return a boolean if the first namespace is within the second namespace parameter", function() {

      expect( mediator.namespaceMatch("foo", "foo") ).to.equal( true )  
      expect( mediator.namespaceMatch("foo::bar", "foo") ).to.equal( true )
      expect( mediator.namespaceMatch("foo::bar::lol", "foo") ).to.equal( true )

      expect( mediator.namespaceMatch("foo::bar", "foo::bar") ).to.equal( true )  
      expect( mediator.namespaceMatch("foo::bar::nice", "foo::bar") ).to.equal( true )

      expect( mediator.namespaceMatch("foo::bar::nice", "foo::bar") ).to.equal( true )

      expect( mediator.namespaceMatch("not::bar::nice", "foo::bar") ).to.equal( false )  

    })
    

  })


  describe("Mediator.prototype.getSubscriptionsForNamespace", function() {

    var mediator

    beforeEach(function() {
      mediator = new Mediator()
    })

    it("should return subscription objects for the correct namespace", function() {

      function foo(){}
      function bar(){}

      mediator.subscribe( "foo", foo )
      mediator.subscribe( "bar", bar )

      var fooSubs = mediator.getSubscriptionsForNamespace( "foo" )
      var barSubs = mediator.getSubscriptionsForNamespace( "bar" )

      expect( fooSubs.length ).to.eql( 1 )
      expect( barSubs.length ).to.eql( 1 )
      expect( fooSubs[0].callback ).to.eql( foo )
      expect( barSubs[0].callback ).to.eql( bar )

    })

    it("should return all for namespace", function() {

      function foo(){}

      mediator.subscribe( "foo", foo )
      mediator.subscribe( "foo::bar", foo )
      mediator.subscribe( "foo::bar::lol", foo )

      var fooSubs = mediator.getSubscriptionsForNamespace( "foo::bar::lol" )

      expect( fooSubs.length ).to.eql( 3 )
    })

  })


  describe("namespaces", function() {

    var mediator

    beforeEach(function() {
      mediator = new Mediator()
    })

    it("should fire all subscribers where where subscriber namespace is within the published namespace", function() {

      var stat = {
        "foo": 0,
        "foo::bar": 0,
        "foo::bar::lol": 0
      }

      mediator.subscribe("foo", function( n ) { stat["foo"] += n })
      mediator.subscribe("foo::bar", function( n ) { stat["foo::bar"] += n })
      mediator.subscribe("foo::bar::lol", function( n ) { stat["foo::bar::lol"] += n })
      
      mediator.publish("foo", 1)
      mediator.publish("foo::bar", 1)
      mediator.publish("foo::doesntexist", 1)
      mediator.publish("foo::bar::lol", 1)
      
      expect( stat["foo"] ).to.equal( 4 )
      expect( stat["foo::bar"] ).to.equal( 2 )
      expect( stat["foo::bar::lol"] ).to.equal( 1 )

    })

    it("should remove all subscribers where where subscriber namespace is within the unsubscribed namespace", function() {

      var stat = {
        "foo": 0,
        "foo::bar": 0,
        "foo::bar::lol": 0
      }

      mediator.subscribe("foo", function( n ) { stat["foo"] += n })
      mediator.subscribe("foo::bar", function( n ) { stat["foo::bar"] += n })
      mediator.subscribe("foo::bar::lol", function( n ) { stat["foo::bar::lol"] += n })
      
      mediator.publish("foo", 1)
      mediator.publish("foo::bar", 1)
      mediator.publish("foo::bar::lol", 1)

      expect( stat["foo"] ).to.equal( 3 )
      expect( stat["foo::bar"] ).to.equal( 2 )
      expect( stat["foo::bar::lol"] ).to.equal( 1 )

      mediator.unsubscribe("foo")

      mediator.publish("foo", 1)
      mediator.publish("foo::bar", 1)
      mediator.publish("foo::bar::lol", 1)

      expect( stat["foo"] ).to.equal( 3 )
      expect( stat["foo::bar"] ).to.equal( 2 )
      expect( stat["foo::bar::lol"] ).to.equal( 1 )

    })

  })
  

})