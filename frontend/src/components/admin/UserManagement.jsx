import React, { useState, useEffect, useCallback, useRef } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import Toast from '../common/Toast';
import CreateUserModal from './CreateUserModal';
import './UserManagement.css';

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg className="um-search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.75"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BlockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
);

const UsersEmptyIcon = () => (
  <svg className="um-empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function getInitials(firstName, lastName) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
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

  useEffect(() => { fetchData(); }, [fetchData]);

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

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount  = users.filter(u => u.is_active).length;
  const inactiveCount = users.filter(u => !u.is_active).length;

  return (
    <div className="um-page">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Page Header */}
      <div className="um-page-header">
        <div className="um-page-header-left">
          <h2 className="um-page-title">User Management</h2>
          <p className="um-page-desc">
            Provision and manage admin access across your IoT infrastructure.
          </p>
        </div>
        <button className="btn-add-user" onClick={() => setIsModalOpen(true)} id="add-user-btn">
          <PlusIcon />
          Add User
        </button>
      </div>

      {/* Stats Row */}
      <div className="um-stats-row">
        <div className="um-stat-card">
          <div className="um-stat-label">Total Users</div>
          <div className="um-stat-value primary">{loading ? '—' : users.length}</div>
          <div className="um-stat-sub">System Accounts</div>
        </div>
        <div className="um-stat-card">
          <div className="um-stat-label">Active Now</div>
          <div className="um-stat-value success">{loading ? '—' : activeCount}</div>
          <div className="um-stat-sub">Authenticated accounts</div>
        </div>
        <div className="um-stat-card">
          <div className="um-stat-label">Deactivated</div>
          <div className="um-stat-value error">{loading ? '—' : inactiveCount}</div>
          <div className="um-stat-sub">Blocked accounts</div>
        </div>
        <div className="um-stat-card">
          <div className="um-stat-label">Roles</div>
          <div className="um-stat-value">{loading ? '—' : roles.length}</div>
          <div className="um-stat-sub">Permission groups</div>
        </div>
      </div>

      {/* Table */}
      <div className="um-table-container">
        {/* Controls */}
        <div className="um-table-controls">
          <div className="um-search-wrap">
            <SearchIcon />
            <input
              type="text"
              className="um-search"
              placeholder="Search users by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              id="user-search"
            />
          </div>
          <div className="um-table-actions">
            <button className="um-action-btn">
              <FilterIcon />
              Filter
            </button>
            <button className="um-action-btn">
              <DownloadIcon />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>Identity</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td><div className="skeleton skeleton-cell" /></td>
                    <td><div className="skeleton skeleton-cell-sm" /></td>
                    <td><div className="skeleton skeleton-cell-sm" /></td>
                    <td><div className="skeleton skeleton-cell-sm" /></td>
                    <td><div className="skeleton skeleton-cell-sm" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="um-empty">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <UsersEmptyIcon />
                      <div style={{ fontWeight: 600, color: 'var(--clr-text-2)', marginBottom: 4 }}>
                        {search ? 'No matching users' : 'No users yet'}
                      </div>
                      <div style={{ fontSize: 13 }}>
                        {search ? 'Try a different search term' : 'Add your first user to get started'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => {
                  const initials = getInitials(u.first_name, u.last_name);
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className={!u.is_active ? 'row-inactive' : ''}>
                      <td>
                        <div className="td-identity">
                          <div className="td-avatar">{initials}</div>
                          <div>
                            <div className="td-name">{`${u.first_name} ${u.last_name}`}</div>
                            <div className="td-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select
                          className="um-select"
                          defaultValue={u.role_id}
                          onChange={e => handleRoleChange(u.id, parseInt(e.target.value))}
                          disabled={!u.is_active || isSelf}
                          title={isSelf ? "Cannot change your own role" : ""}
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
                      <td style={{ fontSize: 12, color: 'var(--clr-text-3)', fontStyle: 'italic' }}>
                        {u.last_seen || '—'}
                      </td>
                      <td>
                        <div className="um-row-actions">
                          <button className="btn-row" title="Edit user" disabled={isSelf}>
                            <EditIcon />
                          </button>
                          <button
                            className="btn-row danger"
                            title={u.is_active ? 'Deactivate user' : 'Already deactivated'}
                            onClick={() => handleDeactivate(u.id)}
                            disabled={!u.is_active || isSelf}
                          >
                            <BlockIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        {!loading && filteredUsers.length > 0 && (
          <div className="um-pagination">
            <span>Showing {filteredUsers.length} of {users.length} users</span>
            <div className="um-pagination-pages">
              <button className="pg-btn">‹</button>
              <button className="pg-btn active">1</button>
              <button className="pg-btn">›</button>
            </div>
          </div>
        )}
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
