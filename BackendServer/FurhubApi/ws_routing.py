from django.urls import re_path

from .wsconsumers import ChatConsumer

websocket_urlpatterns = [
    # ws://<host>/ws/messages/<conversation_id>/
    re_path(r"^ws/messages/(?P<conversation_id>\d+)/$", ChatConsumer.as_asgi()),
]


