# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('topbar', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='topbarcategory',
            options={'verbose_name': 'Cat\xe9gorie de la barre de navigation', 'verbose_name_plural': 'Cat\xe9gories de la barre de navigation'},
        ),
        migrations.AlterModelOptions(
            name='topbarlink',
            options={'verbose_name': 'Lien de la barre de navigation', 'verbose_name_plural': 'Liens de la barre de navigation'},
        ),
        migrations.AlterField(
            model_name='topbarlink',
            name='url',
            field=models.CharField(help_text="L'adresse cible de ce lien", max_length=256, verbose_name='Adresse (URL)'),
            preserve_default=True,
        ),
    ]
