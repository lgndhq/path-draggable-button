path-draggable-button
-------

This jQuery plugin from [LGND](https://lgnd.com) allows the user to drag a "button" (we typically use an image) along an SVG path, triggering an interaction when it reaches the end of the path.

### Settings

Option | Type | Default | Description
------ | ---- | ------- | -----------
pathSelector | string | "path" | CSS selector for the SVG path to follow
direction | string | "horizontal" | Predominant direction of the path, either "horizontal" or "vertical"
negative | boolean | false | Whether the path is "reversed", e.g. bottom to top or right to left
threshold | float | 0.99 | Percentage (0.0-1.0) of the path the button needs to be dragged before triggering the handler

### Events

Event | Arguments | Description
----- | --------- | -----------
change | event, button, value | When the button is dragged and changes position
finish | event, button | When the button is dragged beyond the `threshold` percentage

### Methods

Methods are called through the pathDraggableButton method, e.g.:

```javascript
// Get percentage (0-1.0) dragged
var distance = $(".toggle-switch").pathDraggableButton('getValue');

// Set to 50% completed
$(".toggle-switch").pathDraggableButton('setValue', 0.5);
```

Method | Argument | Description
------ | -------- | -----------
`getValue` | | Returns the percentage (0-1.0) dragged
`setValue` | value : float | Sets the completion percentage (0-1.0) and moves the button along the path

### Example

Create a draggable button that fades out after completion:

```javascript
$(element).pathDraggableButton({
  direction: 'horizontal'
}).on('finish', function(){
  $(this).fadeOut();
});
```

For more examples, see [https://lgndhq.github.io/path-draggable-button](https://lgndhq.github.io/path-draggable-button)

### Dependencies

jQuery 1.8
