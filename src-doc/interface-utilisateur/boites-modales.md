# Boites modales

<div class="warning ico-after">
    <p>
        Cette page de la documentation est en cours de rédaction.  
        Il se peut qu'elle soit incomplète, que des liens ne soient pas renseignés ou erronés.
    </p>
</div>


## Les bases

Les boîtes modales sont à utiliser pour les confirmations (formulaire), informations complémentaires (lecture seule) ou encore pour des actions secondaires (pagination, etc.).

Un lien, généralement sous la forme d'un bouton, ayant comme `href` l'`id` de la modale associée. Le titre et l'icône de la modale sont issues du lien qui ouvre la modale, la dernière partie de cette page détail comment en changer.

Une boite modale et son lien associés peuvent être n'importe où dans la page, le système se base sur un `id` qui est par définition unique.

<a href="#doc-modal-1" class="open-modal">Ce lien ouvre une boite modale</a>
<div class="modal modal-small" id="doc-modal-1">
    Voici le contenu de la modale.
</div>


## Tailles des modales

Par défaut, la modale prendra toute la page.

Il y a 3 classes pour 3 dimensions qui changent la hauteur de celle-ci : 

- `modal-small`
- `modal-medium`
- `modal-big`


## Informations supplémentatires

TODO

`data-modal-close` lecture seule, titre du bouton pour fermer.