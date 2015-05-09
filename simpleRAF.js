'use strict';

(function (root, factory) {
  // optional AMD https://github.com/umdjs/umd/blob/master/amdWeb.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.simpleRAF = factory();
  }
}(this, function () {
  var rafID, callbacks, increments, positions,
      loop, startLoop;

  callbacks = [];
  increments = [];
  positions = [];

  loop = function(id){
    var self = this;
    if( !callbacks.length ) return;
    callbacks.forEach(function(callback, i){
      positions[i] += increments[i];
      callback.call(self, id, positions[i]);
    });
    window.requestAnimationFrame(loop);
  };

  startLoop = function(){
    if( callbacks.length === 1){
        window.requestAnimationFrame(loop);
    }
  };

  return {
    on: function(callback, increment){
      increments.push(increment || 1);
      positions.push(0);
      callbacks.push(callback);
      startLoop();
    },
    off: function(callback){
      var i = callbacks.indexOf(callback);
      if (i > -1) {
        callbacks.splice(i, 1);
        increments.splice(i, 1);
        positions.splice(i, 1);
      }
      if( !callbacks.length ) {
        window.cancelAnimationFrame(rafID);
      }
    }
  };
}));
