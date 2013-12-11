
var Subscription = require("../index").Subscription,
    expect       = require("expect.js")

describe("Subscription", function() {


  describe("Subscription.prototype.trigger", function () {

    it("should trigger the callback function of the subscription", function() {

      var spy = sinon.spy()
      var subscription = new Subscription( spy )

      subscription.trigger()

      expect( spy.called ).to.eql( true )
    })

    it('should take the trigger a function as first parameter and as callback property on options parameter', function() {

      var spy = sinon.spy()
      var subA = new Subscription( spy )
      var subB = new Subscription({ callback: spy })

      subA.trigger()
      subB.trigger()

      expect( spy.callCount ).to.eql( 2 )
    })

    it('should apply the first array parameter passed to trigger as parameters to the callback function', function() {

      var spy = sinon.spy()
      var subscription = new Subscription( spy )

      subscription.trigger([ 'a', 'b' ])

      expect( spy.calledWith('a', 'b') ).to.be.ok()

    })

  })


  describe('Subscription.prototype.cancel', function() {

    it('should make the Subscription throw an exception if triggered after it is canceled', function() {
      
      var subscription = new Subscription(function(){})

      subscription.cancel()

      expect(function() {
        subscription.trigger()
      })
      .to.throwException()
    })

  })


})