# Outils

## Bower

### Présentation

Bower est un gestionnaire de dépendances pour le front. Anciennement, les librairies telles que jQuery, ou normalize.css étaient incluent dans le dépot. Aujourd'hui, elles sont installées dans le dossier `assets/bower_components/` par bower, suivant le fichier `bower.json`

### Utilisation

`bower install` à la racine du projet installera les dépendances définies dans le fichier `bower.json`.

`bower install [--save] [nom du paquet]` installe un paquet du [dépot bower](), où `[nom du paquet]` est le nom du paquet (sans blague ?). L'argument `--save` permet d'ajouter la dépendance au fichier `bower.json`.

Plus d'informations sur le wiki [officiel de bower]().

## Gulp

### Utiliser gulp — tl;dr
*En supposant que vous avez installer les dépendances front, comme expliqué dans [ces insctructions]()*

Si vous voulez juste compiler les fichiers, il vous suffit d'utiliser la commande `gulp build` à la racine du projet.

Si vous voulez que gulp compile les fichiers dès que vous les modifiez, utilisez la commande `gulp` à la racine du projet. *That's it!*

### Présentation
Gulp est un *task-runner* écrit en Javascript avec Node. Il permet d'automatiser des tâches telles que la compilation, la minimification, ou encore la vérification de la syntaxe.

Dans le cas de **Zeste de Savoir**, nous avons des resources *statiques*, qui doivent êtres délivrées au client de manière la plus optimisée possible. Ces resources se trouvent dans le dossier [`assets/`]() du projet. Dans ce dossier, l'on trouve:

- Les scripts javascript, dans le sous-dossier [`js/`](). Ces fichiers sont:
  - Testés via [JSHint]() (syntaxe et convention de code)
  - Concatés (rassemblés) en un seul fichier (`dist/js/main.js`)
  - Minifiés avec [uglify]() (`dist/js/main.min.js`)
- Les images, dans le sous-dossier [`images/`](). Ces fichiers sont optimisés via [imagemin](). Les images se trouvant dans le sous-dossier [`sprites/`]() et [`sprites@2x/`]() sont utilisées pour créer deux sprites, réspectivement, le normal et la version *rétina*. La génération de ce sprite se fait via [`spritesmith`](), et génère ensuite le fichier `_sprites.scss`, contenant les variables nécessaires à l'utilisation du sprite avec SASS.
- Les smileys, dans le sous-dossier [`smileys`]() 
- Les feuilles de styles SCSS dans le sous-dossier `scss/` sont compilées par `node-sass` pour générer la feuille de styles CSS (`dist/css/main.css`), puis minifiées par [minify-css]() (`dist/css/main.min.css`). Plus d'information sur SASS dans la [documentation dédiée]().
- Les dépendences [bower](), dans le sous-dossier [`bower_components/`]() sont utilisées par SASS lors de la compilation (c'est le cas notamment de [normalize.scss]()), et les dépendences Javascript sont, comme les scripts JS, concatées en un seul fichier (`dist/js/vendors.js`) et minifiées (`dist/js/vendors.min.js`). Plus d'information sur bower [plus bas dans ce fichier]().

### Les tâches gulp
Une fois que gulp est installé, comme expliqué dans [ces insctructions](), il peut être utilisé dans le projet simplement en lancant la commande `gulp [tâche]`, où `[tâche]` est la tâche à executer. A noter que si aucune tâche n'est spécifiée, gulp executera la tâche `default`.

Les tâches suivantes, définies dans le fichier [`Gulpfile.js`], sont disponibles:
 - `build` — Lance les tâches suivantes:
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
 - `watch` — Compile les fichiers du dossier `assets/` à la volée dès qu'ils sont modifiés, et en informe le navigateur via [livereload](). Cette tâche a la particularité de ne s'arreter que quand l'utilisateur le demande (`Ctrl+C`).
 - `default` — Tâche par défaut, qui lance les tâches `build` et `watch`.

## Sass

### Présentation

Sass est un pré-processeur CSS, dont la syntaxe se raproche du CSS, mais avec des fonctionalitées beaucoup plus poussées. SASS compile les fichiers `.scss` en fichiers `.css`. Plus d'informations sur Sass dans la documentation officielle.

### Guidelines / best-practicies

Nous préférons imposer quelques "normes" dans le style de code pour les fichiers SCSS.

- Organisation en plusieurs fichiers:
 - `main.scss` — Fichier principal, contenant *uniquement* quelques variables (couleurs, font-family, url du sprite, ...) et les imports des autres fichiers.
 - `_base.scss` — Règles de base, qui ne concernent que les éléments ...
 - `_all-support.scss` — Concerne tous les écrans
 - `_mobile.scss` — Concerne les mobiles (<= 760px de large)
 - `_mobile-tablet.scss` — Concerne les phablettes (< 960px)
 - `_tablet.scss` — Concerne les tablettes (>= 760px)
 - `_wide.scss` — Concerne les écrans d'ordinateurs moyens (>= 960px)
 - `_extra-wide.scss` — Concerne les écrans d'ordinateurs larges (>= 1140px)
 - `_mega-wide.scss` — Concerne les écrans d'ordinateurs très larges (>= 1360px)
 - `_print.scss` — Style pour l'impression
 - `_high-pixel-ratio.scss` — Concerne les écrans avec une densité de pixel élevée (retina et autre)
 - `_editor.scss` — Style de l'éditor Markdown
 - `_form.scss` — Style des formulaires et des modales
 - `_pygments.scss` — Style pour la coloration syntaxique
 - `_sprite.scss` — Variables utilisées pour le sprite ; généré dynamiquement par Gulp
- ...