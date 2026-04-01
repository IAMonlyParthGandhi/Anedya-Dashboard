import React, { useState, useEffect, useCallback, useRef } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import CreateUserModal from './CreateUserModal';
import './UserManagement.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const debounceRef = useRef({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getUsers(),
        userService.getRoles()
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      addToast('Failed to load users data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRoleChange = useCallback(async (userId, newRoleId) => {
    clearTimeout(debounceRef.current[userId]);

    debounceRef.current[userId] = setTimeout(async () => {
      try {
        await userService.updateUser(userId, { roleId: newRoleId });
        addToast('Role updated successfully', 'success');
        fetchData();
      } catch (error) {
        addToast(error.response?.data?.message || 'Failed to update role', 'error');
        fetchData();
      }
    }, 500);
  }, [addToast, fetchData]);

  const handleDeactivate = async (userId) => {
    try {
      await userService.deactivateUser(userId);
      addToast('User deactivated successfully', 'success');
      fetchData();
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to deactivate user', 'error');
    }
  };

  return (
    <div className="um-container">
      <Toast toasts={toasts} removeToast={removeToast} />
      
      <div className="um-header">
        <h2 className="um-title">Users List</h2>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          Add User
        </button>
      </div>

      <div className="um-table-container">
        <table className="um-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td><div className="skeleton skeleton-cell"></div></td>
                  <td><div className="skeleton skeleton-cell"></div></td>
                  <td><div className="skeleton skeleton-cell-sm"></div></td>
                  <td><div className="skeleton skeleton-cell-sm"></div></td>
                  <td><div className="skeleton skeleton-cell-sm"></div></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="um-empty">No users found</td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u.id} className={!u.is_active ? 'row-inactive' : ''}>
                  <td>{`${u.first_name} ${u.last_name}`}</td>
                  <td>{u.email}</td>
                  <td>
                    <select
                      className="um-select"
                      defaultValue={u.role_id}
                      onChange={(e) => handleRoleChange(u.id, parseInt(e.target.value))}
                      disabled={!u.is_active || u.id === currentUser.id}
                    >
                      {roles.map(r => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={`status-badge ${u.is_active ? 'active' : 'inactive'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-danger"
                      onClick={() => handleDeactivate(u.id)}
                      disabled={!u.is_active || u.id === currentUser.id}
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <CreateUserModal
          roles={roles}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            addToast('User created successfully', 'success');
            fetchData();
          }}
        />
      )}
    </div>
  );
}
