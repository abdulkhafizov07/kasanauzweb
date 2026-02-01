#!/bin/sh
set -e

# Default to 4 workers, override with WORKERS env var if needed
WORKERS=${WORKERS:-2}
PORT=${PORT:-8000}

# Start Gunicorn with uvicorn workers (ASGI, supports WebSockets)
exec gunicorn config.asgi:application \
  -k uvicorn.workers.UvicornWorker \
  -b 0.0.0.0:$PORT \
  -w $WORKERS
