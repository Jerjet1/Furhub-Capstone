import urllib.parse
from typing import Callable, Awaitable

from django.contrib.auth.models import AnonymousUser
from django.utils.functional import LazyObject
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from channels.auth import AuthMiddlewareStack
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication


User = get_user_model()


@database_sync_to_async
def get_user_from_token(token: str):
    authenticator = JWTAuthentication()
    try:
        validated = authenticator.get_validated_token(token)
        user = authenticator.get_user(validated)
        print(f"WebSocket Auth: Successfully authenticated user {user.id} ({user.email})")
        return user
    except Exception as e:
        print(f"WebSocket Auth: Failed to authenticate token: {e}")
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Default to anonymous
        scope["user"] = AnonymousUser()

        # Parse token from query string: ?token=<JWT>
        try:
            query_string = scope.get("query_string", b"").decode()
            print(f"WebSocket Auth: Query string: {query_string}")
            params = urllib.parse.parse_qs(query_string)
            token_list = params.get("token") or []
            if token_list:
                token = token_list[0]
                print(f"WebSocket Auth: Found token: {token[:20]}...")
                user = await get_user_from_token(token)
                scope["user"] = user
            else:
                print("WebSocket Auth: No token found in query string")
        except Exception as e:
            print(f"WebSocket Auth: Error parsing query string: {e}")

        return await super().__call__(scope, receive, send)


def JWTAuthMiddlewareStack(inner: Callable[..., Awaitable]):
    return JWTAuthMiddleware(AuthMiddlewareStack(inner))


