# Installation

<div class="information ico-after">
    <p>
        Si vous souhaitez développer le back-end du site uniquement, vous pouvez vous contenter de [télécharger le zip contenant les ressources statiques](http://zestedesavoir.com/static/pack.zip) du projet et de les extraires dans un dossier `/dist` à la racine du projet.
    </p>
</div>



## TL;DR : Installation rapide

Installez [Node.js](http://nodejs.org), puis, dans le dossier du projet :

```shell
# Installez Gulp et Bower, si ce n'est pas déjà fait
$ [sudo] npm install -g bower gulp

# Installez les dépendances du projet
$ npm install

# Lancez Gulp
$ gulp build
```


## Installer Node.js

Pour vérifier si vous avez déjà [Node.js](http://nodejs.org) et `npm` qui sont installés dans leurs bonnes versions :

```shell
$ node -v
v0.10.26
$ npm -v
1.4.7
```

**Note** : Vous devez avoir une version de `node > 0.10.x`, et de `npm > 1.x.x`.

Sinon, suivez les instructions selon votre système d'exploitation.


### Windows

Node.js propose un installeur (*.msi*) pour Windows, disponible à [cette adresse](http://nodejs.org/download/). Choisissez *Windows Installer*, avec l'architecture adéquate, et installez Node.js en ouvrant le fichier téléchargé.


### Mac OS X

Node.js propose un installeur (*.pkg*) pour Mac OS X, disponible à [cette adresse](http://nodejs.org/download/). Choisissez *Mac OS X Installer*, et installez Node.js en ouvrant le fichier téléchargé.


### Linux

#### Ubuntu

Une version récente de Node.js avec npm est disponible sur le PPA `chris-lea/node.js`

```shell
$ sudo add-apt-repository ppa:chris-lea/node.js
$ sudo apt-get update
$ sudo apt-get install python-software-properties python g++ make nodejs
````

#### Debian

Une version récente de Node se trouve dans les répos wheezy-backport, jessie, et sid. Sur ces versions de Debian, l'installation peut se faire de cette manière:

```shell
$ sudo apt-get install node
```

#### Autres distributions

Les instructions détaillées pour toutes les distributions se trouvent dans la [documentation officielle (en anglais)](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager)



## Installer Gulp et Bower

L'installation de Gulp et de Bower se fait via `npm`. Selon votre installation, elle devra se faire en administrateur ou non.

```shell
$ [sudo] npm install -g gulp bower
```



### Installer les dépendances npm du projet

Dans le répertoire du projet, lancez simplement :

```shell
$ npm install
```

Cela installera les dépendances des tâches Gulp, et les dépendances front-end via Bower (jQuery, normalize, ...)