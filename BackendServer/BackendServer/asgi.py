import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
import FurhubApi.routing  # Replace with your actual app name

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BackendServer.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            FurhubApi.routing.websocket_urlpatterns  # replace `your_app` with your Django app name
        )
    ), 
})
