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
  var rafID, callbacks, callbacksMeta, lastTimeCalled, w,
      runCallbacks, runCallback, removeCallback, loop, startLoop, currtime,
      getDelta;

  w = window;

  callbacks = [];
  /**
   * contains all the meta-information for each callback, like current
   * iteration and iteration
   */
  callbacksMeta = [];
  /**
   * currentime: returns performance.now() or Date as fallback
   * @returns {double}    DOMHighResTimeStamp || Dete
   */
  currtime = w.performance && w.performance.now ? function() {
    return performance.now();
  } : Date.now || function () {
    return new Date;
  };
  /**
   * removeCallback: removes a callback and its meta data from the corresponding
   * arrays
   * @param   {function || integer} key function or index in callback array
   * @returns {void}
   */
  removeCallback = function (key) {
    var i = typeof key === 'function' ? callbacks.indexOf(key) : key;
    if (i > -1) {
      callbacks.splice(i, 1);
      callbacksMeta.splice(i, 1);
    }
    if (callbacks.length === 0) {
      w.cancelAnimationFrame(rafID);
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
   * @param   {double}   delta      time since the last call in ms
   * @param   {double}   timeStamp  RAF DOMHighResTimeStamp
   * @returns {void}
   */
  runCallback = function (callback, index, delta, timeStamp) {
    var returnValue, meta;

    meta = callbacksMeta[index];
    meta.val += meta.increment;

    returnValue = callback.call(meta, delta, meta.val, timeStamp);
    if (returnValue === false) {
      removeCallback(index);
    }
  };
  /**
   * runCallbacks: loops the callback array and passes the delta and the timeStamp
   * @param   {double} timeStamp timestamp from RAF
   * @returns {void}
   */
  runCallbacks = function (timeStamp) {
    var delta = getDelta();
    callbacks.forEach(function(callback, index){
      runCallback(callback, index, delta, timeStamp);
    });
  };
  /**
   * loop: request animation frame loop
   * @param   {double} timeStamp RAF DOMHighResTimeStamp
   * @returns {void}
   */
  loop = function (timeStamp) {
    if ( callbacks.length === 0 ) return;
    runCallbacks(timeStamp);
    rafID = w.requestAnimationFrame(loop);
  };
  /**
   * startLoop kicks of the RAF loop if there is at least one callback
   * @returns {void}
   */
  startLoop = function () {
    if ( callbacks.length === 1 ) {
        w.requestAnimationFrame(loop);
    }
  };

  return {
    /**
     * on: public method to register a callback
     * @param   {Function} callback
     * @param   {float}    increment increment value on every callback
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
