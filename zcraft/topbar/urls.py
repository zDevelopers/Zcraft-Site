from django.conf.urls import patterns, url

urlpatterns = patterns(
    '',
    url('^$', 'zcraft.topbar.views.list_nav_links', name='list')
)
