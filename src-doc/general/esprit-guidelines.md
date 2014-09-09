# Esprit / Guidelines

<div class="warning ico-after">
    <p>
        Cette page de la documentation est en cours de rédaction.  
        Il se peut qu'elle soit incomplète, que des liens ne soient pas renseignés ou erronés.
    </p>
</div>


## Structure générale

La majeure partie des pages est composée de : 

- En-tête (header) qui se trouve dans le fichier `base.html`. Il n'y a, a priori, aucune raison d'y toucher. Elle contient : 
	- Logo ;
	- Menu ;
	- Boite de connexion (logbox) avec la messagerie, notifications, alertes (staff seulement), paramètres du compte (membres seulement, clic sur l'avatar pour le staff);
	- Fil d'Ariane (breadcrumb) ;
	- Recherche.
- Barre de menu latérale gauche (sidebar), composée de différents blocs modulable selon les pages. C'est le cœur de la navigation en dehors du menu global de l'en-tête : tout doit donc s'y trouver rapidement ;
- Corps, globalement différent sur toutes les pages, malgré certains éléments communs tels que le titre, mais il est contenu dans le fichier `base.html` (block `headline`) ;
- Pied de page (footer).


## Design fluide (responsive design)

Le design est prévu dès le début pour être adapté à un maximum de supports (a priori tous). Ainsi, il faudra prendre garde à quelques détails si l'on souhaite un comportement idéal sur tablettes et mobiles.

Une différence notable sur les petits appareils est que la barre de navigation latérale gauche est masquée par défaut. Elle est disponible au glissé (*swipe*) du bord gauche vers la droite, ou directement via l'icône en haut.

<div class="information ico-after">
	<p>
		Sur les anciens navigateurs mobiles (navigateur natif Android), ce menu n'est pas mis en place au profit de liens directement visibles mais de fait plus encombrants.
		Le soucis vient de l'impossibilité de gérer correctement le menu latéral. Le menu latéral est alors placé tout en bas de la page sur ces navigateurs.
	</p>
</div>

Cette barre latérale sera à soigner, sa structure HTML est relativement complexe principalement au niveau des attributs et classes à placer pour obtenir le comportement souhaité.

Le site est codé selon la pratique **mobile first**, c'est à dire que le design est prévu pour les mobiles en premier : dans le code le style par défaut est celui destiné aux mobiles. Des feuilles de styles avec *media-queries* viendront par la suite surcharger les propriétés pour les appareils plus grands. Cette pratique permet un gain de performances.