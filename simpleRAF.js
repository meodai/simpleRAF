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
  var rafID, callbacks, callbacksMeta, lastTimeCalled,
      runCallback, removeCallback, loop, startLoop, currtime, getDelta;

  currtime = window.performance && window.performance.now ? function() {
    return performance.now();
  } : Date.now || function () {
    return new Date;
  };

  callbacks = [];
  /**
   * contains all the meta-information for each callback, like current
   * iteration and iteration
   */
  callbacksMeta = [];

  /**
   * removeCallback: removes a callback and its meta data from the corresponding
   * arrays
   * @param   {[type]} key function or index in callback array
   * @returns {[void]}
   */
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

  /**
   * getDelta: calculates the time between the RAF calls
   * @returns {double} time in milliseconds
   */
  getDelta = function () {
    var now, delta;
    now = currtime();
    delta = (now - lastTimeCalled);
    lastTimeCalled = now;
    return delta;
  };

  /**
   * runCallback: calls the individual callbacks and passes the corresponding
   * meta data as arguments
   * @param   {Function} callback
   * @param   {integer}  index      position in callbacks array
   * @param   {double}   timeStamp  RAF DOMHighResTimeStamp
   * @returns {void}
   */
  runCallback = function (callback, index, timeStamp) {
    var returnValue, meta;

    meta = callbacksMeta[index];
    meta.val += meta.increment;

    returnValue = callback.call(meta, getDelta(), meta.val, timeStamp);
    if (returnValue === false) {
      removeCallback(index);
    }
  };

  /**
   * loop: request animation frame loop
   * @param   {double} timeStamp RAF DOMHighResTimeStamp
   * @returns {void}
   */
  loop = function (timeStamp) {
    if ( !callbacks.length ) return;
    callbacks.forEach(function(obj, i){
      runCallback(obj, i, timeStamp);
    });
    rafID = w.requestAnimationFrame(loop);
  };

  /**
   * startLoop kicks of the RAF loop if there is at least one callback
   * @returns {void}
   */
  startLoop = function () {
    if (callbacks.length === 1) {
        w.requestAnimationFrame(loop);
    }
  };

  return {
    /**
     * on: public method to register a callback
     * @param   {Function} callback
     * @param   {float}   increment increment value on every callback
     * @returns {void}
     */
    on: function (callback, increment) {
      // todo: add the possibility to pass a increment array
      callbacks.push(callback);
      callbacksMeta.push({val: 0, increment: increment || 1 });
      startLoop();
    },
    /**
     * off description]
     * @param   {Function} callback callback function to remove
     * @returns {void}
     */
    off: function (callback) {
      removeCallback(callback);
    }
  };
}));
