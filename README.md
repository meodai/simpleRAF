# simpleRAF
simplifies requestAnimationFrame with AMD friendly callbacks

[Demo](http://codepen.io/meodai/pen/BNjaar?editors=001)

### Installation
#### Bower 
`bower install simpleRAF --save`

#### NPM
`npm install simpleraf --save`

## Usage
### Registering a callback
#### AMD 
```javascript
  require(['simpleRAF'], function(raf){
    var callback = function(){
      // do something fancy at 60fps
    };
    
    raf.on(callback);
    // ..later on
    raf.off(callback);
  });
```
#### Classic

```javascript
  var callback = function(){}
  simpleRAF.on(callback);
```

## Methods
simpleRAF has two methods `.on()` and `.off()`, used to add and remove callback functions that will be called on each animation frame.

### `.on()`
Adds a function that will be called on every animation frame.

#### Syntax
```javascript
simpleRAF.on(callback, increment)
```
#### callback
A parameter specifying a function to call when it's time to update your animation for the next repaint. The callback has two arguments, a `DOMHighResTimeStamp`, which indicates the current time for when requestAnimationFrame starts to fire callbacks. The second argument is the amount of the total iterations time the increment.

If the callback function returns false at any time, it will remove it self and not be called anymore,

#### increment
A number that will be incremented on each animation frame and passed to the callback function. If the argument is left away the default will be `1`.

### `.off()`
Will remove a function from the callbacks to call on every frame.

### Syntax
```javascript
simpleRAF.off(callback)
```
#### callback
A parameter referencing any function that was passed to the `.on()` method.

## Example
```javascript
  simpleRAF.on(function(timeStamp, i){
    $body.style.backgroundColor = 'hsl(' + i % 360 + ',90%,70%)';
    $body.style.color = 'hsl(' + (i + 180) % 360 + ',90%,70%)';
    
    $elem.style.left = i + .25 + 'px';
    if (i > (1000 * .75)) {
      // will automatically unregister the function from the callbacks
      // after 1000 calls
      return false;
    }
  },.75);
```
