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
  var rafID, callbacks, callbacksMeta,
      runCallback, removeCallback, loop, startLoop;

  callbacks = [];
  callbacksMeta = [];

  removeCallback = function (key) {
    var i = typeof key === 'function' ? callbacks.indexOf(key) : key;
    if (i > -1) {
      callbacks.splice(i, 1);
      callbacksMeta.splice(i, 1);
    }
    if (!callbacks.length) {
      window.cancelAnimationFrame(rafID);
    }
  };

  runCallback = function (callback, index, id) {
    var returnValue, meta;

    meta = callbacksMeta[index];
    meta.val += meta.increment;

    returnValue = callback.call(meta, id, meta.val);
    if (returnValue === false) {
      removeCallback(index);
    }
  };

  loop = function (id) {
    if ( !callbacks.length ) return;
    callbacks.forEach(function(obj, i){
      runCallback(obj, i, id);
    });
    rafID = window.requestAnimationFrame(loop);
  };

  startLoop = function () {
    if (callbacks.length === 1) {
        window.requestAnimationFrame(loop);
    }
  };

  return {
    on: function (callback, increment) {
      // todo: add the possibility to pass a increment array
      callbacks.push(callback);
      callbacksMeta.push({val: 0, increment: increment || 1 });
      startLoop();
    },
    off: function (callback) {
      removeCallback(callback);
    }
  };
}));
