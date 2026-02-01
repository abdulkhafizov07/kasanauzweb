import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django_asgi_app = get_asgi_application()


# Wrapper that ignores 'lifespan' events
async def application(scope, receive, send):
    if scope["type"] == "lifespan":
        # Gracefully respond to lifespan events (startup/shutdown)
        async def lifespan_handler(receive, send):
            while True:
                message = await receive()
                if message["type"] == "lifespan.startup":
                    await send({"type": "lifespan.startup.complete"})
                elif message["type"] == "lifespan.shutdown":
                    await send({"type": "lifespan.shutdown.complete"})
                    return

        return await lifespan_handler(receive, send)

    # Otherwise pass through to Django ASGI app
    return await django_asgi_app(scope, receive, send)
