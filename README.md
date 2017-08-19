# Jeu des chrysalides

## Description

Un [jeu sérieux](https://fr.wikipedia.org/wiki/Jeu_s%C3%A9rieux) pour navigateurs
Web permettant de tester et d'entraîner les patients atteints de [négligence
spatiale unilatérale (héminégligence)](https://fr.wikipedia.org/wiki/Négligence_spatiale_unilatérale),
à destination des ergothérapeutes. Sous license open source MIT.

## Navigateurs Web supportés

- Mozilla Firefox
- Google Chrome

## Utilisation

Ouvrir le fichier `index.html` avec un navigateur Web.

Il cliquer sur toutes les images représentant des jumelles pour terminer la partie.

Lorsqu'une image représentant des jumelles a été sélectionnée, elle se transforme
en une image représentant un papillon et n'est plus cliquable.

## Crédits

Ce logiciel a été développé en HTML 5, CSS et JavaScript (ECMAScript).

Il utilise [grunt](https://gruntjs.com/), [jquery](https://jquery.com/), [boostrap](http://getbootstrap.com/)
ainsi que des icones SVG venant de [40 Flat Animal Icons](https://www.creativetail.com/40-free-flat-animal-icons/)
et de [Objects Icons](https://www.creativetail.com/free-objects-icons/) de [Creative
Tail](https://www.creativetail.com/) sous [license](https://www.creativetail.com/licensing/)
[Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

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