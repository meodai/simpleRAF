'use strict';

(function (root, factory) {
  // optional AMD https://github.com/umdjs/umd/blob/master/amdWeb.js
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.raf = factory();
  }
}(this, function () {
  var rafID, callbacks,
      loop, startLoop;

  callbacks = [];

  loop = function(id){
    var self = this;
    if( !callbacks.length ) return;
    callbacks.forEach(function(callback){
      callback.call(self,id);
    });
    window.requestAnimationFrame(loop);
  };

  startLoop = function(){
    if( callbacks.length === 1){
        window.requestAnimationFrame(loop);
    }
  };

  return {
    on: function(callback){
      callbacks.push(callback);
      startLoop();
    },
    off: function(callback){
      var i = callbacks.indexOf(callback);
      if (i > -1) {
        callbacks.splice(i, 1);
      }
      if( !callbacks.length ) {
        window.cancelAnimationFrame(rafID);
      }
    }
  };
}));
