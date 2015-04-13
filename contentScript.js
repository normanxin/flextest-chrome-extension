// Extend the getPath function for getting
// current selector with jQuery element
jQuery.fn.extend({
	getPath: function() {
		var path, node = this;

		while (node.length) {
			var realNode = node[0], name = realNode.localName;

			if (!name) { break; }
			name = name.toLowerCase();

			var parent = node.parent();

			var sameTagSiblings = parent.children(name);
			if (sameTagSiblings.length > 1) {
				allSiblings = parent.children();
				var index = allSiblings.index(realNode) + 1;
				if (index > 1) {
						name += ':nth-child(' + index + ')';
				}
			}

			path = name + (path ? '>' + path : '');
			node = parent;
		}

		return path;
	}
});

$(function() {

	var currentMousePos = {
		x: -1,
		y: -1
	};

	$(document)

	// Track the current mouse position
	.mousemove(function (event) {

		var positionX = event.pageX,
			positionY = event.pageY,
			// The target at mouse position
			target = document.elementFromPoint(positionX, positionY);

		$.extend(currentMousePos, {
			x: event.pageX,
			y: event.pageY
		});

		// Send message to eventPage, and used in devTools
		// TODO: May send per 300 ms to optimize performance
		chrome.runtime.sendMessage({
			currentMousePos: currentMousePos,
			path: $(target).getPath(),
			action: 'mousemove'
		});

	})

	// Track the clicked element
	.click(function (event) {

		var target = event.target;

		// Send message to eventPage, and used in devTools
		chrome.runtime.sendMessage({
			currentMousePos: currentMousePos,
			path: $(target).getPath(),
			action: 'click'
		});

	})

	// Track the keypress events
	.keypress(function (event) {

		var target = event.target;

		// Send message to eventPage, and used in devTools
		chrome.runtime.sendMessage({
			path: $(target).getPath(),
			action: 'keypress',
			keyCode: event.which
		});

	});

});
