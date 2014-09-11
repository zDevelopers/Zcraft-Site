# Organisation du code

<div class="warning ico-after">
    <p>
        Cette page de la documentation est en cours de rédaction.  
        Il se peut qu'elle soit incomplète, que des liens ne soient pas renseignés ou erronés.
    </p>
</div>


## Templates

Toute vue doit étendre de ```base.html``` (directement ou indirectement) car ce template contient la structure générique qui sera la base de toutes les pages du site. Elle contient notamment :

- les liens vers les ressources statiques (CSS, JavaScript) ;
- les liens vers les flux RSS ;
- divers polyfills pour les navigateurs anciens ;
- la structure HTML globale.

Pour étendre de `base.html`, il faut mettre ceci tout en haut du template :

```django
{% extends "base.html" %}
```

Vous aurez alors accès à tous les `blocks`, que vous *devrez* utiliser.


### Les blocks importants

#### Le titre (title)

`title` qui contient le titre de la page dans le navigateur : 

```django
{% block title %}
    Votre titre
{% endblock %}
```

À placer de préférence en haut de votre template : avant le contenu, mais après le `extends`.

#### Le fil d'Ariane (breadcrumb)

Le block `breadcrumb` contient simplement une liste, chaque élément de la liste doit contenir un lien, sauf le dernier puisqu'il représente la page courante. Attention à ne pas oublier les microdata sur les liens intermédiaires. Voici un exemple :

```html+django
{% block breadcrumb %}
    <li itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
        <a href="{{ url }}" itemprop="url">
            <span itemprop="title">{{ titre }}</span>
        </a>
    </li>
    <li>Page courante</li>
{% endblock %}
```

#### La barre latérale gauche

`sidebar` qui contient la barre latérale gauche. Le code minimal est le suivant : 

```html+django
{% block sidebar %}
    <aside class="sidebar">
        <!-- Votre code HTML -->
    </aside>
{% endblock %}
```

##### Page sans sidebar

Sur les pages où vous ne voulez pas de sidebar, ajoutez après le block `breadcrumb` : 

```html+django
{# No sidebar on this page #}
{% block body_class %}no-sidebar{% endblock %}
{% block sidebar %}{% endblock %}
```


#### Titre et sous-titre (h1, h2)

`headline` qui n'est autre que le titre principal de la page (obligatoire) : 

```django
{% block headline %}
    Forum général
{% endblock %}
```

Attention : Ne mettre que du texte. Le balisage est géré dans `base.html`.

`headlinesub` se comporte exactement comme le précédant, à ceci près qu'il est *facultatif*.


#### Contenu

`content` contient le corps de la page.

```html+django
{% block content %}
    <!-- Votre contenu HTML -->
{% endblock %}
```


<div class="information ico-after">
    <p>
        Tous ces blocks sont **obligatoires** (sauf `headlinesub`).
    </p>
    <p>
        N'oubliez pas de tester ou de faire tester vos modifications sur les supports mobiles !
    </p>
</div>


## Styles

Nous préférons imposer quelques "normes" dans le style de code pour les fichiers SCSS.

### Général et imports

- `main.scss` — Fichier principal, contenant *uniquement* quelques variables (couleurs, font-family, url du sprite, ...) et les imports des autres fichiers
- `_base.scss` — Règles de base, qui ne concernent que les éléments génériques
- `_form.scss` — Style des formulaires
- `_editor.scss` — Style de l'assistant d'édition Markdown
- `_pygments.scss` — Style pour la coloration syntaxique

### Selon la taille de l'appareil

- `_all-support.scss` — Concerne tous les écrans
- `_mobile.scss` — Concerne les mobiles (<= 760px de large)
- `_tablet.scss` — Concerne les tablettes (>= 760px)
- `_mobile-tablet.scss` — Concerne les mobiles, tablettes et phablettes (< 960px)
- `_wide.scss` — Concerne les écrans d'ordinateurs moyens (>= 960px)
- `_extra-wide.scss` — Concerne les écrans d'ordinateurs larges (>= 1140px)
- `_mega-wide.scss` — Concerne les écrans d'ordinateurs très larges (>= 1360px)

### Autres

- `_print.scss` — Style pour l'impression
- `_high-pixel-ratio.scss` — Concerne les écrans avec une densité de pixel élevée (@2x, retina et autre)
- `_sprite.scss` — Variables utilisées pour le sprite ; généré dynamiquement par Gulp, ignoré dans Git