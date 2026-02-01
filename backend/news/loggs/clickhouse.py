from django.conf import settings

import clickhouse_connect

# client = clickhouse_connect.get_client(
#     host=settings.CLICKHOUSE_HOST,
#     port=settings.CLICKHOUSE_PORT,
#     username=settings.CLICKHOUSE_USER,
#     password=settings.CLICKHOUSE_PASSWORD,
#      database=settings.CLICKHOUSE_DB,
# )


def log_to_clickhouse(user, action, model, obj_id, message, extra=None):
    return
    client.insert(
        "admin_action_logs",
        [
            [
                str(user.id) if user else None,
                user.username if user else "anonymous",
                action,
                model,
                str(obj_id),
                message,
                extra or {},
            ]
        ],
    )
