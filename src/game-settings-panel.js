/*global $, isObject*/
/*jslint this*/
var GameSettingsPanel = function(id, store) {
	"use strict";

	this.id = id;
	this.store = store;

	this.write(this.store.read());
};

GameSettingsPanel.prototype.read = function() {
	"use strict";

	var values = this.store.read(),
		keys = this.store.keys(),
		input, key;

	$.each(keys, function(idx){
		key = keys[idx];
		input = $('#'+key);

		if('checkbox' === input.attr('type')) {
			values[key] = input.is(':checked');
		} else {
			values[key] = input.val();
		}
	});

	return values;
};

GameSettingsPanel.prototype.write = function(key, value) {
	"use strict";

	var input, type, $this = this;

	if (isObject(key) && 'undefined' === typeof value) {
		$.each(key, function(realKey){
			$this.write(realKey, key[realKey]);
		});
	} else {
		input = $('#'+key);
		type = input.attr('type');

		if('checkbox' === type) {
			input.attr('checked', value);
		} else {
			input.val(value);
		}

		$(input).trigger('change');
	}
};