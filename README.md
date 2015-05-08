# simpleRAF
simplifies requestAnimationFrame with AMD friendly callbacks

[Demo](http://codepen.io/meodai/pen/BNjaar?editors=001)

### Installation
####Bower 
`bower install simpleRAF --save`

####NPM
`npm install simpleRAF --save`

## Usage
####AMD 
```javascript
  require(['simpleRAF'], function(raf){
    var loop = function(){
      // do something fancy at 60fps
    };
    
    raf.on(loop);
    // ..later on
    raf.off(loop);
  });
```
####Classic

```javascript
  simpleRAF.on(function(){
    // your loop
  });
```
