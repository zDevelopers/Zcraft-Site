# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('topbar', '0002_auto_20160129_0316'),
    ]

    operations = [
        migrations.AlterField(
            model_name='topbarlink',
            name='category',
            field=models.ForeignKey(verbose_name='Cat\xe9gorie du lien', to='topbar.TopBarCategory', help_text='La cat\xe9gorie sous laquelle ce lien sera affich\xe9.'),
            preserve_default=True,
        ),
    ]
