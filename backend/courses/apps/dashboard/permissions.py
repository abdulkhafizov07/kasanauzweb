from rest_framework.permissions import BasePermission


class HasPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if getattr(request.user, "role", None) == "admin":
            return True

        required_perm = None
        if hasattr(view, "get_required_permission"):
            required_perm = view.get_required_permission()

        if not required_perm:
            return True

        section, action = required_perm
        perms = getattr(request.user, "permissions", {}) or {}
        return action in perms.get(section, [])
