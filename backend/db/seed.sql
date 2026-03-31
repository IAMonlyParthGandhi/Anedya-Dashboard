-- Insert Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'Admin', 'Full system access including user management'),
(2, 'Operator', 'Device monitoring, relay control, and analytics'),
(3, 'Viewer', 'Read-only access to sensor data')
ON CONFLICT (id) DO NOTHING;

-- Insert Permissions
INSERT INTO permissions (id, name, description, resource, action) VALUES
(1, 'view_dashboard', 'Ability to see real-time sensor data', 'dashboard', 'view'),
(2, 'control_devices', 'Ability to toggle relays', 'devices', 'control'),
(3, 'view_analytics', 'Ability to see historical charts', 'analytics', 'view'),
(4, 'manage_users', 'Ability to create/edit/deactivate users', 'users', 'manage')
ON CONFLICT (id) DO NOTHING;

-- Map Permissions to Roles
-- Admin: all 4
INSERT INTO role_permissions (role_id, permission_id) VALUES (1, 1), (1, 2), (1, 3), (1, 4) ON CONFLICT DO NOTHING;
-- Operator: first 3
INSERT INTO role_permissions (role_id, permission_id) VALUES (2, 1), (2, 2), (2, 3) ON CONFLICT DO NOTHING;
-- Viewer: first 1
INSERT INTO role_permissions (role_id, permission_id) VALUES (3, 1) ON CONFLICT DO NOTHING;

-- Insert Default Admin (Password: Admin@123)
INSERT INTO users (email, password_hash, first_name, last_name, role_id)
VALUES ('admin@test.com', '$2a$10$vO6p1W.z6p1W.z6p1W.z6uV0G6p1W.z6p1W.z6p1W.z6p1W.z6p1W.z', 'System', 'Admin', 1)
ON CONFLICT (email) DO NOTHING;
