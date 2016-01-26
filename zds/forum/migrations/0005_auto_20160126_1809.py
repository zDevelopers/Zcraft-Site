# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import zds.forum.models


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0004_topic_update_index_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='forum',
            name='image',
            field=models.ImageField(null=True, upload_to=zds.forum.models.image_path_forum),
            preserve_default=True,
        ),
    ]
