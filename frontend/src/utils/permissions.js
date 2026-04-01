export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  CONTROL_DEVICES: 'control_devices',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_USERS: 'manage_users',
};

export const hasPermission = (user, permission) =>
  user?.permissions?.includes(permission) ?? false;

export const hasAnyPermission = (user, permissions) =>
  permissions.some(p => hasPermission(user, p));

export const hasAllPermissions = (user, permissions) =>
  permissions.every(p => hasPermission(user, p));
