export function hasAll(
    perms: Record<string, string[]>,
    required: string[] = []
) {
    return required.every((r) => {
        const [section, action] = r.split(":");
        return perms[section]?.includes(action);
    });
}

export function hasOne(perms: Record<string, string[]>, required?: string) {
    if (!required) return true;
    const [section, action] = required.split(":");
    return perms[section]?.includes(action) ?? false;
}
