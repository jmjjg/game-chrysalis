/**
 * Tests unitaires des fonctions utilitaires
 */
/*global describe, it, xit, expect, array_shuffle, is_object, matrix_to_csv*/
(function() {
	'use strict';

	describe('Test des fonctions utilitaires', function() {

		describe('La fonction array_shuffle', function() {
			it('doit retourner une copie de l\'array passée en paramètre avec les valeurs randomisées', function() {
				var array = [0,1,1,2,3,5,8,13,21],
					shuffled = array_shuffle(array),
					reordered = shuffled.slice().sort(function(a,b){return a-b;});

				expect(shuffled).not.toEqual(array);
				expect(reordered).toEqual(array);
			});
		});

		describe('La fonction is_object', function() {
			it('doit retourner vrai lorsqu\'elle est appelée avec un objet', function() {
				expect(is_object({})).toEqual(true);
			});
			it('doit retourner faux lorsqu\'elle est appelée avec autre chose qu\'un objet', function() {
				expect(is_object([])).toEqual(false);
				expect(is_object(true)).toEqual(false);
				expect(is_object(false)).toEqual(false);
				expect(is_object(null)).toEqual(false);
				expect(is_object(5)).toEqual(false);
				expect(is_object(5.6)).toEqual(false);
				expect(is_object("")).toEqual(false);
				expect(is_object(undefined)).toEqual(false);
			});
		});

		describe('La fonction matrix_to_csv', function() {
			it('doit pouvoir retourner plusieurs colonnes', function() {
				var rows = [[1, 2, 3]],
					expected = '"1","2","3"';

				expect(matrix_to_csv(rows)).toEqual(expected);
			});
			it('doit pouvoir retourner plusieurs lignes', function() {
				var rows = [[1],[2],[3]],
					expected = "\"1\"\r\n\"2\"\r\n\"3\"";
				expect(matrix_to_csv(rows)).toEqual(expected);
			});
			it('doit fonctionner avec des caractères spéciaux', function() {
				var rows = [['C\'est "Thérion"!'],['Dès Noël où un zéphyr haï me vêt de glaçons würmiens je dîne d’exquis rôtis de bœuf au kir à l’aÿ d’âge mûr & cætera']],
					expected = "\"C'est \"\"Thérion\"\"!\"\r\n\"Dès Noël où un zéphyr haï me vêt de glaçons würmiens je dîne d’exquis rôtis de bœuf au kir à l’aÿ d’âge mûr & cætera\"";
				expect(matrix_to_csv(rows)).toEqual(expected);
			});
		});
	});
} ());