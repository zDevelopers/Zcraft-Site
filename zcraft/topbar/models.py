# coding=utf-8
from collections import OrderedDict

from django.db import models
from django.utils.translation import ugettext_lazy as _


class TopBarCategory(models.Model):

    class Meta:
        verbose_name = _(u'Catégorie de la barre de navigation')
        verbose_name_plural = _(u'Catégories de la barre de navigation')

    title = models.CharField(
        max_length=256,
        db_index=True,
        verbose_name=_(u'Titre de la catégorie'),
        help_text=_(u'Le titre de la catégorie, affichée en haut du menu.')
    )

    display_order = models.PositiveSmallIntegerField(
        verbose_name=_(u"Ordre d'affichage"),
        help_text=_(u"Les catégories sont affichées par ordre d'affichage croissant.")
    )

    def __unicode__(self):
        return str(self.title) + ' (ordre : ' + str(self.display_order) + ')'


class TopBarLink(models.Model):

    class Meta:
        verbose_name = _(u'Lien de la barre de navigation')
        verbose_name_plural = _(u'Liens de la barre de navigation')

    title = models.CharField(
        max_length=256,
        db_index=True,
        verbose_name=_(u'Titre du lien'),
        help_text=_(u'Le titre du lien, qui sera affiché et qui, cliqué, mènera au lien')
    )

    # We don't use an URLField to allow relative links
    url = models.CharField(
        max_length=256,
        verbose_name=_(u'Adresse (URL)'),
        help_text=_(u"L'adresse cible de ce lien")
    )

    category = models.ForeignKey(
        TopBarCategory,
        verbose_name=_(u'Catégorie du lien'),
        help_text=_(u'La catégorie sous laquelle ce lien sera affiché.')
    )

    display_order = models.IntegerField(
        verbose_name=_(u"Ordre d'affichage"),
        help_text=_(u"Les liens sont affichées par ordre d'affichage croissant, dans les catégories.")
    )

    def __unicode__(self):
        return str(self.title) + ' (→ ' + str(self.url) + ') (dans ' + str(self.category.title) + ')'


def get_topbar_links():
    cats = {}
    cats_orders = {}

    all_links = TopBarLink.objects.order_by("category__display_order", "display_order").select_related("category").all()
    for link in list(all_links):
        key = link.category.title
        if key in cats:
            cats[key].append(link)
        else:
            cats[key] = [link]
            cats_orders[key] = link.category.display_order

    cats = OrderedDict(sorted(cats.items(), key=lambda x: cats_orders[x[0]]))

    return cats
