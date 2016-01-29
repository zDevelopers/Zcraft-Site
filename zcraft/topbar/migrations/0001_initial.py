# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='TopBarCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(help_text='Le titre de la cat\xe9gorie, affich\xe9e en haut du menu.', max_length=256, verbose_name='Titre de la cat\xe9gorie', db_index=True)),
                ('display_order', models.PositiveSmallIntegerField(help_text="Les cat\xe9gories sont affich\xe9es par ordre d'affichage croissant.", verbose_name="Ordre d'affichage")),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TopBarLink',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('title', models.CharField(help_text='Le titre du lien, qui sera affich\xe9 et qui, cliqu\xe9, m\xe8nera au lien', max_length=256, verbose_name='Titre du lien', db_index=True)),
                ('url', models.URLField(help_text="L'adresse cible de ce lien", verbose_name='Adresse (URL)')),
                ('display_order', models.IntegerField(help_text="Les liens sont affich\xe9es par ordre d'affichage croissant, dans les cat\xe9gories.", verbose_name="Ordre d'affichage")),
                ('category', models.ForeignKey(verbose_name='La cat\xe9gorie de ce lien', to='topbar.TopBarCategory', help_text='La cat\xe9gorie sous laquelle ce lien sera affich\xe9.')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
