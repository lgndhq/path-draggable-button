;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($){
	$.fn.pathDraggableButton = function() {
		var elem = this;
		var opt = arguments[0];
		var button;

		if (typeof opt == 'object') {

			var defaults = {
				'pathSelector': 'path',
				'direction': 'horizontal',
				'negative': false,
				'threshold': 0.99
			};
			var settings = $.extend({}, defaults, opt);

			var draggableButton = function(container, path, direction, negative, threshold) {
				var currentPercentage = 0;
				var dragButtonActive = false;
				var dragPath = path.get(0);
				var dragPathLength = Math.floor(dragPath.getTotalLength());

				var button = container.find('.toggle-button');

				button.on('touchstart mousedown', function(e){
					e.preventDefault();
					dragButtonActive = true;
				});

				/* Function to set the position based on percentage 0-1 */
				var setPathPercentage = function(dragPath, percentage) {
					if (percentage > 1)
						percentage = 1;

					currentPercentage = percentage;

					var pt = dragPath.getPointAtLength(percentage * dragPathLength);

					var nextPt = dragPath.getPointAtLength((percentage + 0.01) * dragPathLength);
					var slope = (nextPt.y - pt.y) / (nextPt.x - pt.x);

					if (direction == 'vertical') {
						var angle = -90;
					} else {
						if (negative) {
							var angle = Math.atan2(slope, 1) * 180 / Math.PI;
						} else {
							var angle = 180 - Math.atan2(slope, 1) * 180 / Math.PI;
						}
					}

					pt.x = Math.round(pt.x);
					pt.y = Math.round(pt.y);

					button.css('transform', 'translate3d('+pt.x+'px,'+pt.y+'px, 0) rotate(' + (180 + angle ) + 'deg)');
					container.trigger('change', [ elem, percentage ]);
				};
				setPathPercentage(dragPath, 0);

				$('body').on('mousemove touchmove', function(e){
					if (dragButtonActive) {
						var clientX, clientY;
						if (e.type === 'touchmove') {
							clientX = e.touches[0].clientX;
							clientY = e.touches[0].clientY;
						} else {
							e.preventDefault();
							clientX = e.clientX;
							clientY = e.clientY;
						}

						if (direction == 'horizontal') {
							// Horizontal dragging
							var switchLeft = container.offset().left;
							var switchWidth = path.get(0).getBBox().width;
							var switchRight = switchLeft + switchWidth;
							if (negative) {
								var percentage = (switchRight - clientX) / switchWidth;
							} else {
								var percentage = (clientX - switchLeft) / switchWidth;
							}
							if (percentage < 0)
								percentage = 0;
						} else {
							// Vertical dragging
							var switchTop = container.offset().top;
							var switchHeight = path.get(0).getBBox().height;
							var percentage = ($(window).scrollTop() + clientY - switchTop) / switchHeight;
						}

						if (percentage < 0)
							percentage = 0;

						setPathPercentage(dragPath, percentage);

						if (percentage > threshold) {
							dragButtonActive = false;
							container.trigger('finish', [ elem ]);
						}
					}
				});

				$('body').on('mouseup touchmoveend', function(e){
					dragButtonActive = false;
				});

				button.on('touchend', function(e){
					dragButtonActive = false;
				});

				return {
					setValue: function(percent) {
						setPathPercentage(dragPath, percent);
					},
					getValue: function() {
						return currentPercentage;
					}
				};
			};

			var l = elem.length;

			for (var i = 0; i < l; i++) {
				elem[i].draggableButton = draggableButton($(elem[i]), $(elem[i]).find(settings.pathSelector), settings.direction, settings.negative, settings.threshold);
			}

		} else {
			if (opt == 'setValue') {
				var l = elem.length;

				for (var i = 0; i < l; i++) {
					elem[i].draggableButton.setValue(arguments[1]);
				}
			}
			if (opt == 'getValue') {
				return elem[0].draggableButton.getValue();
			}
		}

		return this;
	};
}));
