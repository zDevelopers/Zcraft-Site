from django.shortcuts import render

from zcraft.topbar.models import get_topbar_links


def list_nav_links(request):
    categories = get_topbar_links()
    return render(request, 'zcraft/topbar/index.html', locals())
