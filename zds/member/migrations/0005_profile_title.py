# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0004_profile_allow_temp_visual_changes'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='title',
            field=models.CharField(max_length=250, verbose_name=b'Titre', blank=True),
            preserve_default=True,
        ),
    ]
