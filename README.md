# ng- tip
An simple yet functional Angular tooltip directive

See [DEMO PAGE](http://daniran.github.io/ng-tip/) here

### To install it:

`bower install --save ng-tip`

The main.css file contains a basic tooltip desing (see example page)

### To build:

`npm install`

`grunt build`

## Usage:

### Directive

```html
<button ng-tooltip="isTooltipOpened" ng-tooltip-config="configObj">
```

### Config Object

This is the configuration of the tooltip

```javascript
{
    width: 150,  // tooltip width
    height: 250,  // tooltip height
    templateUrl: 'template.html',
    controller: 'myTooltipCtrl',   // with $tooltipInstance injected
    placement: 'top|bottom|left|right',
    appendToBody: false, // append to body?
    isolateScope: true,  // inject isolate scope to controller, or the parent scope?
    data: {} // optional data object for the tooltip
}
```

### $tooltipInstance

The $tooltipInstance is injected to the controller you use for the tooltip
```javascript
$tooltipInstance : {
    config: {},  // the tooltip config object
    close: function() {}  //  method to close the tooltip
}
```
          

