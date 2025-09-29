"""
ASGI config for BackendServer project with Channels support.
"""

import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackendServer.settings')

django_asgi_app = get_asgi_application()
from FurhubApi.wsmiddleware import JWTAuthMiddlewareStack

try:
    from FurhubApi.ws_routing import websocket_urlpatterns  # type: ignore
except Exception:
    websocket_urlpatterns = []

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
