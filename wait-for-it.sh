#!/usr/bin/env bash
# wait-for-it.sh — wait until a TCP host:port is available

HOST=$1
PORT=$2

echo "⏳ Waiting for $HOST:$PORT..."

while ! nc -z $HOST $PORT; do
  sleep 1
done

echo "✅ $HOST:$PORT is available!"
shift 2
exec "$@"
