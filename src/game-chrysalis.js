/*global console, Math, $, window, GameStorage, GameSettingsPanel, GameSounds, confirm*/
/*jslint for this*/

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 * @url https://stackoverflow.com/a/6274381
 */
var shuffle = function(a) {
	"use strict";

	var j, x, i;
	for (i = a.length; i; i-=1) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
};

var onRangeChange = function(event) {
	"use strict";

	var input = $(event.target),
		label = input.closest('.form-group').find('label:first'),
		text = label.html().replace(/\(.+\)$/, '') + ' (' + input.prop('value') + ')';
	label.html(text);
	input.title = input.value;
};

// -----------------------------------------------------------------------------

var GameChrysalis = function() {
	"use strict";

	this.start = null;
	this.events = [];
	this.defaults = {
		player: 'Quentin',
		dblclick: false,
		sound: true,
		columns: 20,
		rows: 10,
		targets: 10,
		balance: 0
	};
};

GameChrysalis.prototype.initialize = function(defaults) {
	"use strict";

	var i,
		j,
		row,
		td,
		board = $('<table id="board"></table>'),
		positions = [],
		balance;

	if ('object' === typeof defaults && false === Array.isArray(defaults)) {
		this.defaults = $.extend(this.defaults, defaults);
	}

	//@todo m + v: board/game ?
	this.models = {
		results: new GameStorage('game-chrysalis-results'),
		settings: new GameStorage('game-chrysalis-settings', this.defaults)
	};
	this.views = {
		settings: new GameSettingsPanel('#game-settings-panel', this.models.settings)
	};

	this.sounds = new GameSounds(
		{
			hit: new Audio('sounds/move.wav'),
			miss: new Audio('sounds/Paddle.wav'),
			success: new Audio('sounds/applause.wav')
		},
		this.models.settings
	);

	$('#status').remove();
	$('#game').html('');

	this.columns = this.models.settings.read('columns');
	this.rows = this.models.settings.read('rows');

	// Positions des cibles -> @todo function
	for(i=0;i<this.columns*this.rows;i+=1) {
		positions.push(i);
	}
	balance = parseInt(this.models.settings.read('balance'), 10);
	if (-1 === balance) {
		for(i=0;i<this.columns*this.rows;i+=1) {
			if(i%this.columns<=Math.floor(this.columns/2)) {
				positions.push(i);
			}
		}
	} else if (1 === balance) {
		for(i=0;i<this.columns*this.rows;i+=1) {
			if(i%this.columns>=Math.ceil(this.columns/2)) {
				positions.push(i);
			}
		}
	}
	shuffle(positions);
	positions = positions.slice(0, this.models.settings.read('targets'));

	// Population des cellules
	for(i=0;i<this.rows;i+=1) {
		row = $('<tr></tr>');
		for(j=0;j<this.columns;j+=1) {
			if(-1 !== positions.indexOf(i*this.columns+j)) {
				td = $('<td><div class="tile not-found" data-column="' + i + '" data-row="' + j + '"></div></td>');
			} else {
				td = $('<td><div class="tile" data-column="' + i + '" data-row="' + j + '"></div></td>');
			}
			row.append(td);
		}
		board.append(row);
	}

	$('#game').append(board);

	$('#game').off('click');
	$('#game').off('dblclick');
	$('#game').on(
		true === this.models.settings.read('dblclick')
			? 'dblclick'
			: 'click',
		null,
		{game: this},
		this.select
	);

	$('input[type="range"]').off('change');
	$('input[type="range"]').on('change', onRangeChange);
	$('input[type="range"]').trigger('change');

	$('input[id="columns"], input[id="rows"]').bind('change', function() {
		var targets = $('#targets'),
			max = $('#columns').val()*$('#rows').val();
		targets.prop('max', max);
		targets.val(Math.min(targets.val(), max));
		targets.trigger('change');
	});

	this.log({event: 'initialize', positions: positions, settings: this.models.settings.read()});

	$( window ).resize(
		{game: this},
		function() {
			game.redraw();
		}
	);
	this.redraw();

	this.start = new Date();
};

GameChrysalis.prototype.log = function(event) {
	"use strict";

	event = $.extend({event: event.event, timestamp: + new Date()}, event);
	this.events.push(event);
//console.log(event);
};

GameChrysalis.prototype.redraw = function() {
	"use strict";

	var value = Math.min(
		Math.floor(($('#game').width()-2*$('#toggler').width())/this.columns),
		Math.floor($('#game').height()/this.rows)
	);

	$('.tile').css('width', value).css('height', value);

	this.log({event: 'redraw', width: $('#game').width(), height: $('#game').height()});
};

GameChrysalis.prototype.select = function(event) {
	"use strict";

	var game = event.data.game, target = $(event.target);
	event.preventDefault();
	event.stopPropagation();

	if(0 < $('.tile.not-found').length) {
		if(true === target.hasClass('not-found')) {
			game.sounds.play('hit');
			target.removeClass('not-found');
			target.addClass('found');
			game.log({event: 'hit', x: event.pageX, y: event.pageY, column: target.data('column'), row: target.data('row')});

			if(0 === $('.tile.not-found').length) {
				game.finished();
			}
		} else {
			game.sounds.play('miss');
			game.log({event: 'miss', x: event.pageX, y: event.pageY});
		}
	}

	return false;
};

GameChrysalis.prototype.finished = function() {
	"use strict";

	var start = this.start.getTime(),
		stop = new Date().getTime(),
		seconds = parseInt((stop - start)/1000, 10),
		message = '<div class="message"><strong>Bravo ' + this.models.settings.read('player') + ' !!!</strong><br/>Tu as terminé en ' + seconds + ' secondes.</div>',
		close = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
		restart = '<button type="button" class="btn btn-lg btn-success" onclick="game.initialize();return false;"><i class="glyphicon glyphicon-refresh"></i>&nbsp;Rejouer</button>',
		status = $('<div id="status" class="alert alert-success alert-dismissible well well-lg fade in" role="alert">' + close + message + restart + '</div>');

	$('body').append(status);

	this.sounds.play('success');
	this.log({event: 'success'});

	var results = this.models.results.read(),
		player = this.models.settings.read('player');

	results[player] = 'undefined' === typeof results[player]
		? {'games': {}, 'settings': null}
		: results[player];

	results[player].settings = this.models.settings.read();
	results[player].games[+ this.start] = {
		start: + this.start,
		stop: stop,
		seconds: seconds,
		events: this.events
	};

	this.models.results.write(results);
console.log(this.models.results.read());
};

GameChrysalis.prototype.apply = function() {
	"use strict";

	var settings = this.views.settings.read();
	this.models.settings.write(settings);
	this.initialize();
};

GameChrysalis.prototype.reset = function() {
	"use strict";

	if( confirm( 'Remettre la configuration par défaut ?' ) ) {
		this.models.settings.clear();
		this.initialize(this.defaults);
	}
};