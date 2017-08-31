/*global console, Math, $, GameStorage, GameSettingsPanel, GameSounds, confirm, GameChrysalisModel, GameChrysalisView*/
/*jslint for this*/

/**
 * Contrôleur du jeu des crysalides.
 *
 * @constructor
 */
var GameChrysalisController = function() {
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
 * Initialisation du jeu.
 *
 * @param {Object} defaults Les paramètres par défaut
 */
GameChrysalisController.prototype.initialize = function(defaults) {
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
		game: new GameChrysalisView(),
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

	this.views.game.initialize(
		this,
		this.models.settings,
		positions
	);

	this.log({event: 'initialize', positions: positions, settings: this.models.settings.read()});

	this.redraw();
	this.start = new Date();
};

/**
 * Enregistre un événement du jeu.
 *
 * @param {Object} event L'événement à enregistrer
 * @returns {undefined}
 */
GameChrysalisController.prototype.log = function(event) {
	"use strict";

	event = $.extend({event: event.event, timestamp: + new Date()}, event);
	this.events.push(event);
//console.log(event);
};

/**
 * Redéfinition de la largeur et de la hauteur des cibles.
 *
 * @returns {undefined}
 */
GameChrysalisController.prototype.redraw = function() {
	"use strict";

	var value = Math.min(
		Math.floor(($('#game').width()-2*$('#toggler').width())/this.columns),
		Math.floor($('#game').height()/this.rows)
	);

	$('.tile').css('width', value).css('height', value);

	this.log({event: 'redraw', width: $('#game').width(), height: $('#game').height()});
};

/**
 * Appelé lorsqe l'utilisateur sélectionne une cellule.
 *
 * @param {Event} event L'événement ayant conduit à la sélection de la cellule
 * @returns {Boolean}
 */
GameChrysalisController.prototype.select = function(event) {
	"use strict";

	var controller = event.data.controller, target = $(event.target);
	event.preventDefault();
	event.stopPropagation();

	if(0 < $('.tile.not-found').length) {
		if(true === target.hasClass('not-found')) {
			controller.sounds.play('hit');
			target.removeClass('not-found');
			target.addClass('found');
			controller.log({event: 'hit', x: event.pageX, y: event.pageY, column: target.data('column'), row: target.data('row')});

			if(0 === $('.tile.not-found').length) {
				controller.finished();
			}
		} else {
			controller.sounds.play('miss');
			controller.log({event: 'miss', x: event.pageX, y: event.pageY});
		}
	}
};

/**
 * Appelé lorsque le jeu est terminé avec succès.
 *
 * @returns {undefined}
 */
GameChrysalisController.prototype.finished = function() {
	"use strict";

	var start = this.start.getTime(),
		stop = new Date().getTime(),
		seconds = parseInt((stop - start)/1000, 10);

	this.views.game.finished(this.models.settings.read('player'), seconds);
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

/**
 * Enregistre les paramètres, les applique et démarre une nouvelle partie.
 *
 * @returns {undefined}
 */
GameChrysalisController.prototype.apply = function() {
	"use strict";

	var settings = this.views.settings.read();
	this.models.settings.write(settings);
	this.initialize();
};

/**
 * Remet les paramètres à zéro et démarre une nouvelle partie.
 *
 * @returns {undefined}
 */
GameChrysalisController.prototype.reset = function() {
	"use strict";

	if( confirm( 'Remettre la configuration par défaut ?' ) ) {
		this.models.settings.clear();
		this.initialize(this.defaults);
	}
};