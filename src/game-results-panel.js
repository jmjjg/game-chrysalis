/*global $, console, isObject, Math*/
/*jslint this*/
var GameResultsPanel = function(id, controller) {
	"use strict";

	this.id = id;
	this.controller = controller;
};

GameResultsPanel.prototype.write = function(games) {
	"use strict";

	var game, settings, row, link, id = this.id;

	$(id + ' tbody tr').remove();

	$.each(games, function(idx){
		game = games[idx];
		settings = game.events[0].settings;
		//glyphicon-search
		link = '<a href="#" onclick="game.view(\'' + game.start + '\');$(\''+id+'\').hide();return false;"><span class="glyphicon glyphicon-fire"></span> Voir</a>';

		row = $('<tr></tr>')
			.append('<td class="string">' + settings.player + '</td>')
			.append('<td class="date">' + new Date(game.start).toLocaleString('fr-FR') + '</td>')
			.append('<td class="number">' + game.seconds + '</td>')
			.append('<td class="number">' + ( 'success' === game.status ? 'Succès' : 'Abandon' ) + '</td>')
			.append('<td class="number">' + settings.rows*settings.columns + '</td>')
			.append('<td class="number">' + game.events[0].positions.length + '</td>')
			.append('<td class="number">' + game.hits + '</td>')
			.append('<td class="number">' + parseInt(game.hits/Math.max(game.events[0].positions.length, 1)*100, 10) + ' %</td>')
			.append('<td class="number">' + game.selections + '</td>')
			.append('<td class="number">' + parseInt(game.hits/Math.max(game.selections, 1)*100, 10) + ' %</td>')
			.append('<td class="action">'+link+'</td>')
		;

		$('#game-results-panel tbody').prepend(row);
	});
};
