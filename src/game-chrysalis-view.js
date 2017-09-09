/*global $, console, window*/
/*jslint for*/

var onRangeChange = function(event) {
	"use strict";

	var input = $(event.target),
		label = input.closest('.form-group').find('label:first'),
		text = label.html().replace(/\(.+\)$/, '') + ' (' + input.prop('value') + ')';
	label.html(text);
	input.title = input.value;
};

/**
 * Vue du plateau de jeu pour le jeu des crysalides.
 *
 * @constructor
 */
var GameChrysalisView = function(controller) {
	"use strict";

	this.controller = controller;
};

GameChrysalisView.prototype.toggle = function(what) {
	"use strict";

	var id, show, exception;

	if('results' !== what && 'settings' !== what) {
		exception = 'Erreur, paramètre invalide dans la fonction GameChrysalisView.prototype.toggle: '+String(what);
		throw exception;
	}

	id = $('#game-'+what+'-panel');
	show = false === $(id).is(":visible");
	$('.panel').hide();
	if(true === show) {
		$(id).show();
	}
	return false;
};

/**
 * Initialisation du code HTML de la matrice de jeu avec les targets des cibles
 * à afficher.
 *
 * @param {Integer} columns Le nombre de colonnes
 * @param {Integer} rows Le nombre de lignes
 * @param {Array} targets La liste des cibles sous forme d'index dans le tableau
 * @returns {undefined}
 */
GameChrysalisView.prototype.html = function(columns, rows, targets) {
	"use strict";

	var i, j, row, td, board;

	this.columns = columns;
	this.rows = rows;

	$('#status').remove();
	$('#game').html('');

	// Population des cellules
	board = $('<table id="board"></table>');
	for(i=0;i<rows;i+=1) {
		row = $('<tr></tr>');
		for(j=0;j<columns;j+=1) {
			if(-1 !== targets.indexOf(i*columns+j)) {
				td = $('<td><div class="tile not-found" data-column="' + j + '" data-row="' + i + '"></div></td>');
			} else {
				td = $('<td><div class="tile" data-column="' + j + '" data-row="' + i + '"></div></td>');
			}
			row.append(td);
		}
		board.append(row);
	}

	$('#game').append(board);
};

/**
 * Initialisation de la matrice de jeu et des événements associés au jeu.
 *
 * @param {type} settings
 * @param {Array} positions
 * @returns {undefined}
 */
GameChrysalisView.prototype.initialize = function(settings, positions) {
	"use strict";

	var game = this;
	this.html(settings.read('columns'), settings.read('rows'), positions);

	$('#game')
		.off('click')
		.off('dblclick')
		.on(
			true === settings.read('dblclick')
				? 'dblclick'
				: 'click',
			null,
			{controller: this.controller},
			this.controller.select
		);

	$('input[type="range"]')
		.off('change')
		.on('change', onRangeChange)
		.trigger('change');

	$('input[id="columns"], input[id="rows"]').bind('change', function() {
		var targets = $('#targets'),
			max = $('#columns').val()*$('#rows').val();
		targets.prop('max', max);
		targets.val(Math.min(targets.val(), max));
		targets.trigger('change');
	});

	$(window).resize(function(){game.redraw();});
};

/**
 * Redéfinition de la largeur et de la hauteur des cibles.
 *
 * @returns {undefined}
 */
GameChrysalisView.prototype.redraw = function() {
	"use strict";

	var value = Math.min(
		Math.floor(($('#game').width()-2*$('#toggler').width())/this.columns),
		Math.floor($('#game').height()/this.rows)
	);
	$('.tile').css('width', value).css('height', value);

	$('.tile .order').css('font-size', parseInt(value/2, 10)+'px').css('line-height', value+'px');

	this.controller.log({event: 'redraw', width: $('#game').width(), height: $('#game').height()});
};

/**
 * Affiche le message lorsqu'une partie est terminée (avec succès ou par abandon).
 *
 * @param {String} player Le nom du joueur
 * @param {Integer} seconds Le nombre de secondes mis pour gagner la partie
 * @returns {undefined}
 */
GameChrysalisView.prototype.finished = function(player, seconds) {
	"use strict";

	var success = 0 === $('.tile.not-found').length,
		message = ( true === success )
			? '<div class="message"><strong>Bravo ' + player + ' !!!</strong><br/>Tu as terminé en ' + seconds + ' secondes.</div>'
			: '<div class="message"><strong>Dommage ' + player + ' .</strong><br/>Tu feras mieux la prochaine fois</div>'
		,
		close = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
		restart = '<button type="button" class="btn btn-lg btn-success" onclick="game.initialize();return false;"><i class="glyphicon glyphicon-refresh"></i>&nbsp;Rejouer</button>',
		status = $('<div id="status" class="alert ' + (true === success ? 'alert-success' : 'alert-info') + ' alert-dismissible well well-lg fade in" role="alert">' + close + message + restart + '</div>');

	$('body').append(status);
//@fixme!!! toujours cliquable
//	$('#game, div.tile')
//		.off('click')
//		.off('dblclick');
};

/**
 * Visualisation d'une partie, affichage de l'ordre dans lequel les cibles ont
 * été cliquées.
 *
 * @param {Object} game La partie à visualiser
 * @returns {undefined}
 */
GameChrysalisView.prototype.view = function(game) {
	"use strict";

	var hit = 0, event, init = game.events[0];

	this.html(init.settings.columns, init.settings.rows, init.positions);

	$.each(game.events, function(idx){
		event = game.events[idx];
		if('hit' === event.event) {
			hit+=1;
			$('#board tr:nth-child('+(event.row+1)+') td:nth-child('+(event.column+1)+') div')
				.removeClass('not-found')
				.addClass('found')
				.append($('<div class="order">'+hit+'</div>'));
		}
	});

	this.redraw();
};