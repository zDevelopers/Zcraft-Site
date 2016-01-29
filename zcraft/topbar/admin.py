from django.contrib import admin
from zcraft.topbar import models


@admin.register(models.TopBarCategory)
class TopBarCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'display_order')


@admin.register(models.TopBarLink)
class TopBarLinkAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'category', 'display_order')
    list_select_related = True
