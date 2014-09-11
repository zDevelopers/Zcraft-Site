# Boutons


## Base

Les boutons peuvent être construits à partir de la balise `<button>` ou `<a>` selon les besoins. Si le lien ne pointe vers aucune page, préférez utiliser `button` qui est sémantiquement plus correct.

Les boutons sont alignés à droite car uniquement utilisés pour les formulaires ou assimilés. Il sont en flottant, ce qui permet de les "empiler" de côté, ce qu'on retrouve sous les formulaires de soumission avec "Aperçu" et "Envoyer".

Tous les boutons doivent avoir la classe `btn` associé à la couleur que l'on souhaite, ici on choisira gris donc `btn-grey`.

<a href="#" class="btn btn-grey">Ceci est un lien</a>
<button class="btn btn-grey">Ceci est un bouton</button>

<hr class="clearfix">

Code de l'exemple :

```html
<a href="#" class="btn btn-grey">Ceci est un lien</a>
<button class="btn btn-grey">Ceci est un bouton</button>
```

## Couleurs

Les couleurs disponibles sont :

- gris : `btn-grey` ;
- rouge : `btn-cancel` ;
- les boutons de type `submit` n'ont besoin d'aucune classe (pas même `btn`) et seront verts ; si une couleur est appliquée, elle sera prioritaire sur le vert ;
- les boutons `disabled` ont un fond et un texte plus clair.

Démonstration : 

<button type="submit" disabled>Submit disabled</button>
<button type="submit">Submit</button>
<button class="btn btn-cancel">Annuler</button>
<button class="btn btn-grey">Bouton gris</button>

<hr class="clearfix">


## Icône

Ajoutez une icône sur un bouton comme sur n'importe quel autre élément :

<button type="submit" class="ico-after arrow-right light">Submit</button>
<button type="submit" class="btn-cancel ico-after cross light">Supprimer</button>

<hr class="clearfix">

Code de l'exemple : 

```html
<button type="submit" class="ico-after arrow-right light">Submit</button>
<button type="submit" class="btn-cancel ico-after cross light">Supprimer</button>
```

Le style général du site se veut épuré, on évitera les icônes sur les boutons de soumission de formulaire. On les utilisera pour illustrer les boutons d'action : déplacer, supprimer, renommer, éditer, etc.