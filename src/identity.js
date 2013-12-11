/**
  Get a new object. Usefull for dooing deep comparion of static class enums.
  See class Subscription for example usage
  @exports identity
  @type Function
  @return {Object}
*/
module.exports = function identity() {
  return new Object
}