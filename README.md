# Jeu des chrysalides

## Description

Un [jeu sérieux](https://fr.wikipedia.org/wiki/Jeu_s%C3%A9rieux) pour navigateurs
Web permettant de tester et d'entraîner des patients présentant un handicap mental
atteints de [négligence spatiale unilatérale (héminégligence)](https://fr.wikipedia.org/wiki/Négligence_spatiale_unilatérale),
à destination des ergothérapeutes.

Sous license open source [MIT](https://tldrlegal.com/license/mit-license) et donc gratuit.

## Navigateurs Web supportés

- [Mozilla Firefox](https://www.mozilla.org/fr/firefox/)
- [Google Chrome](https://www.google.fr/chrome/browser/desktop/index.html)

## Utilisation

Ouvrir le fichier `index.html` avec un navigateur Web.

Il faut cliquer sur toutes les images représentant des jumelles pour terminer la
partie.

Lorsqu'une image représentant des jumelles a été sélectionnée, elle se transforme
en une image représentant un papillon et n'est plus cliquable.

## Crédits

Ce logiciel a été développé en HTML 5, CSS et JavaScript (ECMAScript).

Au nivau technique, il utilise:

- [grunt](https://gruntjs.com/)
- [jquery](https://jquery.com/)
- [boostrap](http://getbootstrap.com/)

Les icones SVG viennent de [Creative Tail](https://www.creativetail.com/), sous
[license](https://www.creativetail.com/licensing/) [Attribution 4.0 International
(CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

- [40 Flat Animal Icons](https://www.creativetail.com/40-free-flat-animal-icons/)
- [Objects Icons](https://www.creativetail.com/free-objects-icons/)

Les sons viennent du jeu *Consent*, par Jairo Alonso Badillo Bedoya, qui est un
exemple pour l'IDE et langage de programmation [Gambas](http://gambas.sourceforge.net/),
qui est sous license [GNU GPL v. 2](https://tldrlegal.com/license/gnu-general-public-license-v2).

## Développement

### Installation

```bash
sudo npm install -g grunt-cli
sudo npm install -g grunt-init

npm install grunt-contrib-uglify --save-dev
npm install grunt-jsvalidate --save-dev
npm install grunt-jslint --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-contrib-cssmin --save-dev
```