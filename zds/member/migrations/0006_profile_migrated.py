# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('member', '0005_profile_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='migrated',
            field=models.BooleanField(default=True, verbose_name=b"Compte migr\xc3\xa9 apr\xc3\xa8s l'import depuis FluxBB"),
            preserve_default=True,
        ),
    ]
