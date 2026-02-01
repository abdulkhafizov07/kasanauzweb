#!/bin/sh

PIDFILE="/var/run/pgbouncer/pgbouncer.pid"

if [ -f "$PIDFILE" ]; then
  echo "Removing stale PID file: $PIDFILE"
  rm -f "$PIDFILE"
fi

exec /usr/bin/pgbouncer /etc/pgbouncer/pgbouncer.ini
