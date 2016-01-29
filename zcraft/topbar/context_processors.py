from zcraft.topbar.models import get_topbar_links


def load_topbar_links(request):
    return {'top_bar_categories': get_topbar_links()}
