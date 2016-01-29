{% load i18n %}
{% load emarkdown %}

{% blocktrans with alert_author=alert_author|safe post_author=post_author|safe post_title=post_title|safe post_url=post_url|safe staff_name=staff_name|safe staff_message=staff_message|safe alert_message=alert_message|safe %}
Bonjour {{ alert_author }},

Vous recevez ce message car vous avez signalé le message de {{ post_author }} dans le sujet *[{{ post_title }}]({{ post_url }})*.
Pour rappel, vous aviez laissé le message suivant : 

{{ alert_message }}

{{ alert_message | quote_text }}

Votre alerte a été traitée par **{{ staff_name }}** et il vous a laissé ce message :

{{ staff_message }}

{{ staff_message | quote_text }}

Toute l'équipe de la modération vous remercie !
{% endblocktrans %}
