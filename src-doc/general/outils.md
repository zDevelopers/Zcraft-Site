# Outils

<div class="warning ico-after">
    <p>
        Cette page de la documentation est en cours de rédaction.  
        Il se peut qu'elle soit incomplète, que des liens ne soient pas renseignés ou erronés.
    </p>
</div>


## Bower

### Présentation

Bower est un gestionnaire de dépendances pour le front. Anciennement, les librairies telles que jQuery, ou normalize.css étaient incluent dans le dépot. Aujourd'hui, elles sont installées dans le dossier `assets/bower_components/` par bower, suivant le fichier `bower.json`


### Utilisation

`bower install` à la racine du projet installera les dépendances définies dans le fichier `bower.json`.

`bower install [--save] [nom du paquet]` installe un paquet du dépot bower, où `[nom du paquet]` est le nom du paquet. L'argument `--save` permet d'ajouter la dépendance au fichier `bower.json`.

Plus d'informations sur la documentation [officielle de bower](http://bower.io/).



## Gulp

### Utiliser gulp — TL;DR

*En supposant que vous ayez installé les dépendances front, comme expliqué sur la page [installation](#/general/installation)*

Si vous voulez juste compiler les fichiers, il vous suffit d'utiliser la commande `gulp build` à la racine du projet.

Si vous voulez que gulp compile les fichiers dès que vous les modifiez, utilisez la commande `gulp` à la racine du projet. *That's it!*


### Présentation

Gulp est un *task-runner* écrit en Javascript avec Node. Il permet d'automatiser des tâches telles que la compilation, la minimification, ou encore la vérification de la syntaxe.

Dans le cas de **Zeste de Savoir**, nous avons des resources *statiques*, qui doivent êtres délivrées au client de manière la plus optimisée possible. Ces resources se trouvent dans le dossier [`assets/`]() du projet. Dans ce dossier, on trouve :

- Les scripts JavaScript, dans le sous-dossier [`js/`](). Ces fichiers sont:
    - Testés via [JSHint]() (syntaxe et convention de code)
    - Concaténés (rassemblés) en un seul fichier (`dist/js/main.js`)
    - Minifiés avec [uglify]() (`dist/js/main.min.js`)
- Les images, dans le sous-dossier [`images/`](). Ces fichiers sont optimisés via [imagemin](). Les images se trouvant dans le sous-dossier [`sprites/`]() et [`sprites@2x/`]() sont utilisées pour créer deux sprites, réspectivement, le normal et la version *rétina*. La génération de ce sprite se fait via [`spritesmith`](), et génère ensuite le fichier `_sprites.scss`, contenant les variables nécessaires à l'utilisation du sprite avec Sass.
- Les smileys, dans le sous-dossier [`smileys`]() 
- Les feuilles de styles SCSS dans le sous-dossier `scss/` sont compilées par `node-sass` pour générer la feuille de styles CSS (`dist/css/main.css`), puis minifiées par [minify-css]() (`dist/css/main.min.css`). Plus d'information sur Sass dans la [documentation dédiée]().
- Les dépendences [bower](), dans le sous-dossier [`bower_components/`]() sont utilisées par Sass lors de la compilation (c'est le cas notamment de [`_normalize.scss`]()), et les dépendences Javascript sont, comme les scripts JS, concatées en un seul fichier (`dist/js/vendors.js`) et minifiées (`dist/js/vendors.min.js`). Plus d'information sur bower [plus bas dans ce fichier]().

Gulp va donc nous permettre de :

- Vérifier la syntaxe JavaScript (JSHint)
- Rassembler et minimifier en un seul fichier tous les fichiers JavaScript
- Compiler les fichiers SCSS, pour les transformer CSS (via plusieurs outils dont Sass)
- Compresser les images

Le dossier `assets/` à la racine ressemble à ça :

````shell
assets/
├── bower_components
│   ├── jquery
│   ...
├── images
│   ├── favicon.ico
│   ├── favicon.png
│   ├── logo@2x.png
│   ...
├── js
│   ├── accessibility-links.js
│   ├── data-click.js
│   ...
├── scss
│   ├── main.scss
│   ├── _mobile.scss
│   ├── _mobile-tablet.scss
│   ...
└── smileys
    ├── ange.png
    ├── angry.gif
    ...
````

Et le *build* Gulp donne un dossier `dist/`, avec des fichiers optimisés pour la production, comme pour le développement :

````shell
dist/
├── css
│   ├── main.css # CSS compilé (dev)
│   └── main.min.css # Version minimifié (prod)
├── images # Les images ont été optimisées
│   ├── favicon.ico
│   ├── favicon.png
│   ├── logo@2x.png
│   ...
├── js
│   ├── all.min.js # Vendors + custom, minimifiés (prod)
│   ├── main.js # Tout le JS custom (dev)
│   ├── main.min.js # Version minimifiée (prod)
│   ├── vendors # Les dépendance, non-minimifiées (dev)
│   │   ├── jquery.js
│   │   ├── modernizr.js
│   │   ...
│   ├── vendors.js # Toutes les dépendances rassemblées (dev)
│   └── vendors.min.js # Version minimifiée (prod)
└── smileys # Les smileys ont été optimisées
    ├── ange.png
    ├── angry.gif
    ...
````



### Les différentes tâches

Gulp se lance avec `gulp [tache]`, où "*[tache]*" est la tâche à lancer dont celles-ci :

 - `clean`: Nettoie le dossier `dist/`
 - `build`: Compile tout (CSS, JS, et images) pour recréer le dossier `/dist`
 - `test`: Lance les tests (JSHint, ...)
 - `watch`: Compile les différents fichiers à la volée dès qu'ils sont modifiés (sert lors du développement), `Ctrl+C` pour arrêter. Cette tâche supporte *LiveReload* qu'il vous suffit d'installer et d'activer sur votre navigateur pour y voir vos modifications instantannément sans recharger la page.
 - `pack` : Crée une archive `pack.zip` à donner aux personnes n'ayant pas les outils nécessaires au développement front-end.
 - `errors` : Compile les styles nécessaires aux pages d'erreurs statiques utilisées par le serveur HTTP (5xx).


#### Plus en détails

Les tâches sont définies dans le fichier `Gulpfile.js`, on y trouvera :

- `build` — Lance les tâches suivantes :
    - `scripts` — Lance la tâche `test`, et concate/minifie les scripts JS
    - `stylesheet` — Lance la tâche `sprite` (génération du sprite via *spritesmith*), et compile les fichiers `*.scss` en un fichier `main.css`, puis le minifie.
    - `images` — Optimise toutes les images du dossier `images/` via *imagemin*.
    - `smileys` — Même opération que pour les images, mais avec le dossier `smileys/`
    - `vendors` — Récupère les dépendences *bower*, les concate/minifie dans un fichier `vendors.min.js`.
    - `merge-scripts` — Concate les fichiers générés par les tâches `scripts` et `vendors` (respectivement `main.min.js` et `vendors.min.js`) en un seul fichier `all.min.js`.
- `pack` — Lance la tâche `build` et compresse tout le dossier `dist/` dans un fichier `pack.zip`. Ce fichier est utilisé pour fournir aux contributeurs n'ayant pas installés les outils front les resources statiques déjà compilées.
- `test` — Vérifie la syntaxe des fichiers JS via JSHint. Cette tâche est lancée par travis (via l'alias `travis`), et lancera, à terme, les tests unitaires front.
- `clean` — Supprime les fichiers compilés, c'est à dire le dossier `dist/`.
- `errors` — Compile les fichiers `errors/scss/*.scss` vers un fichier `errors/css/main.css`, qui sert pour les pages d'erreur type *5xx*.
- `watch` — Compile les fichiers du dossier `assets/` à la volée dès qu'ils sont modifiés, et en informe le navigateur via LiveReload. Cette tâche a la particularité de ne s'arreter que quand l'utilisateur le demande (`Ctrl+C`).
- `default` — Tâche par défaut, qui lance les tâches `build` et `watch`.



## Sass

### Présentation

Sass est un pré-processeur CSS, dont la syntaxe se raproche du CSS, mais avec des fonctionalitées beaucoup plus poussées. Sass compile les fichiers `.scss` en fichiers `.css`. Pour plus d'informations, rendez-vous sur [la documentation officielle de Sass](http://sass-lang.com/).

<div class="warning ico-after">
    <p>
        *Zeste de Savoir* utilise bien le *SCSS*, compilé par Sass. Sass lui-même étant une autre syntaxe basée sur l'indentation.
    </p>
</div>