{% load i18n %}
{% load emarkdown %}

{% blocktrans with title=content.title|safe admin_name=admin.username|safe admin_url=admin.get_absolute_url message=message_reject|safe %}

Désolé, « [{{ title }}]({{ url }}) » a malheureusement été dépublié par 
[{{ admin_name }}]({{ admin_url }}) pour la raison suivante :

{{ message | quote_text }}

N'hésitez surtout pas à contacter cette personne pour lui demander de 
vous expliquer son choix et de vous conseiller pour remédier à cela. Sur ce 
dernier point, n'oubliez pas que la communauté peut vous aider à travers le 
système de bêta.

{% endblocktrans %}
