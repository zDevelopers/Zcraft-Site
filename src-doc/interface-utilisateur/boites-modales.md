# Boites modales


## Les bases

Les boîtes modales sont à utiliser pour les confirmations (formulaire), informations complémentaires (lecture seule) ou encore pour des actions secondaires (pagination, etc.).

Un lien, généralement sous la forme d'un bouton, ayant comme `href` l'`id` de la modale associée. Le titre et l'icône de la modale sont issues du lien qui ouvre la modale, la dernière partie de cette page détail comment en changer.

Une boite modale et son lien associés peuvent être n'importe où dans la page, le système se base sur un `id` qui est par définition unique.

<a href="#doc-modal" class="open-modal">Ce lien ouvre une boite modale</a>
<form class="modal modal-small" id="doc-modal" action="">
    <p>
        Voici le contenu de la modale.
    </p>
    <p>
        Le formulaire ne fonctionne pas ici, cliquez donc sur **Annuler** pour fermer.
    </p>
    <button type="submit">Envoyer</button>
</form>


Code de l'exemple : 
```html
<a href="#doc-modal" class="open-modal">Ce lien ouvre une boite modale</a>
<form class="modal modal-small" id="doc-modal" action="">
    <p>
        Voici le contenu de la modale.
    </p>
    <p>
        Le formulaire ne fonctionne pas ici, cliquez donc sur **Annuler** pour fermer.
    </p>
    <button type="submit">Envoyer</button>
</form>
```


## Tailles des modales

Par défaut, la modale prendra toute la page.

Il y a 3 classes pour 3 dimensions qui changent la hauteur de celle-ci : 

- Sans rien, par défaut <a href="#doc-modal-default" class="open-modal">Exemple default</a>
- `modal-small` <a href="#doc-modal-small" class="open-modal">Exemple small</a>
- `modal-medium` <a href="#doc-modal-medium" class="open-modal">Exemple medium</a>
- `modal-big` <a href="#doc-modal-big" class="open-modal">Exemple big</a>

<form class="modal" id="doc-modal-default" action="">
    <label for="field-modal-small">Un champ :</label>
    <input type="text" id="field-modal-small">

    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi voluptatibus soluta rem nostrum autem nobis cum ducimus. Facere dicta assumenda, tempore sint aut, nesciunt nisi minima laudantium reprehenderit harum, totam.
    </p>
    <p>
        Permet d'y mettre des interfaces secondaires, sans avoir à changer de page.
    </p>

    <button type="submit">Envoyer</button>
</form>

<form class="modal modal-small" id="doc-modal-small" action="">
    <label for="field-modal-small">Un seul champ ? Taille idéale !</label>
    <input type="text" id="field-modal-small">
    <button type="submit">Envoyer</button>
</form>

<form class="modal modal-medium" id="doc-modal-medium" action="">
    <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat nisi eum recusandae, autem itaque veritatis vel aut maxime possimus veniam! Recusandae blanditiis similique quisquam velit repudiandae, voluptatum perferendis eligendi libero?
    </p>
    <button type="submit">Envoyer</button>
</form>

<form class="modal modal-big" id="doc-modal-big" action="">
    <textarea name="" id="" cols="30" rows="6" placeholder="On peut y mettre un textarea, par exemple"></textarea>
    <button type="submit">Envoyer</button>
</form>


## Informations supplémentatires

### Icône

<a href="#doc-modal-ico" class="open-modal btn btn-grey ico-after view blue">Exemple avec icône</a>
<form class="modal modal-small" id="doc-modal-ico" action="">
    <p>
        La modale a une icône devant le titre.
    </p>
    <button type="submit">Me désinscrire</button>
</form>

Si le lien a une <a href="#/interface-utilisateur/icones">icône</a>, la modale la rajoutera automatiquement.

Code de l'exemple : 

```html
<a href="#doc-modal-ico" class="open-modal btn btn-grey ico-after view blue">Exemple avec icône</a>
<form class="modal modal-small" id="doc-modal-ico" action="">
    <p>
        La modale a une icône devant le titre.
    </p>
    <button type="submit">Me désinscrire</button>
</form>
```


### Lecture seule

Dans certains cas, les modales ne sont pas des formulaires mais simplement des boites d'affichage en lecture seule. Il est alors possible de préciser le texte du bouton de fermeture au travers de l'attribut `data-modal-close`.

<a href="#doc-modal-close" class="open-modal">Boite modale en lecture seule</a>
<div class="modal modal-small" id="doc-modal-close" data-modal-close="Fermer">
    <p>
        Que du texte, rien à faire d'autre.
    </p>
</div>

Code de l'exemple : 
```html
<a href="#doc-modal-close" class="open-modal">Ce lien ouvre une boite modale</a>
<div class="modal modal-small" id="doc-modal-close" data-modal-close="Fermer">
    <p>
        Que du texte, rien à faire d'autre.
    </p>
</div>
```