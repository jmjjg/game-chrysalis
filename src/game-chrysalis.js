/*global console, Math, $, window, GameStorage, GameSettingsPanel, GameSounds, confirm, GameChrysalisModel*/
/*jslint for this*/


var onRangeChange = function(event) {
	"use strict";

	var input = $(event.target),
		label = input.closest('.form-group').find('label:first'),
		text = label.html().replace(/\(.+\)$/, '') + ' (' + input.prop('value') + ')';
	label.html(text);
	input.title = input.value;
};

// -----------------------------------------------------------------------------

/**
 * Jeu des crysalides.
 *
 * @constructor
 */
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

/**
 * Initialisation de la matrice de jeu avec les positions des cibles à afficher.
 *
 * @param {Array} positions
 * @returns {undefined}
 */
GameChrysalis.prototype.initializeBoard = function(positions) {
	"use strict";

	var i, j, row, td, board;

	$('#status').remove();
	$('#game').html('');

	// Population des cellules
	board = $('<table id="board"></table>');
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

	$(window).resize({game: this}, function(){game.redraw();});
};


/**
 * Initialisation du jeu.
 *
 * @param {Object} defaults Les paramètres par défaut
 */
GameChrysalis.prototype.initialize = function(defaults) {
	"use strict";

	var positions = [];

	if ('object' === typeof defaults && false === Array.isArray(defaults)) {
		this.defaults = $.extend(this.defaults, defaults);
	}

	this.models = {
		game: new GameChrysalisModel(),
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

	this.columns = this.models.settings.read('columns');
	this.rows = this.models.settings.read('rows');
	positions = this.models.game.positions(
		this.columns,
		this.rows,
		this.models.settings.read('targets'),
		this.models.settings.read('balance')
	);

	this.initializeBoard(positions);

	this.log({event: 'initialize', positions: positions, settings: this.models.settings.read()});

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
	results[player].games[+this.start] = {
		start: +this.start,
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