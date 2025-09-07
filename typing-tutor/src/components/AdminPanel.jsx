import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { db } from '../../firebase.jsx';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [banData, setBanData] = useState({
    reason: '',
    banUntil: '',
    isPermanent: false
  });
  const [roleData, setRoleData] = useState({
    newRole: 'user'
  });
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { user, updateUserRole, createAdminUser, error, clearError } = useAuth();
  const { texts, isRTL } = useLanguage();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          user_id: doc.id,
          ...data,
          // Ensure created_at is properly handled
          created_at: data.created_at || null,
          // Handle ban timestamps
          ban_until: data.ban_until || null,
          banned_at: data.banned_at || null,
          unbanned_at: data.unbanned_at || null
        };
      });
      
      // Calculate dashboard data
      const totalUsers = usersData.length;
      const bannedUsers = usersData.filter(u => u.is_banned).length;
      const newUsersToday = usersData.filter(u => {
        if (!u.created_at) return false;
        
        let userDate;
        try {
          // Handle Firebase Timestamp objects
          if (u.created_at && typeof u.created_at === 'object' && u.created_at.seconds) {
            userDate = new Date(u.created_at.seconds * 1000);
          } else if (u.created_at && typeof u.created_at === 'object' && u.created_at.toDate) {
            userDate = u.created_at.toDate();
          } else {
            userDate = new Date(u.created_at);
          }
          
          const today = new Date();
          return userDate.toDateString() === today.toDateString();
        } catch (error) {
          console.error('Error processing user date:', u.created_at, error);
          return false;
        }
      }).length;
      
      const dashboard = {
        total_users: totalUsers,
        banned_users: bannedUsers,
        new_users_today: newUsersToday,
        lessons_completed_today: 0, // TODO: implement from user progress
        active_users: totalUsers - bannedUsers,
      };
      
      setUsers(usersData);
      setDashboardData(dashboard);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banData.reason.trim()) return;

    setIsLoadingAction(true);
    try {
      const userDocRef = doc(db, 'users', selectedUser.user_id);
      const banUntil = banData.isPermanent ? null : new Date(banData.banUntil);
      
      await updateDoc(userDocRef, {
        is_banned: true,
        ban_reason: banData.reason,
        ban_until: banUntil,
        banned_by: user.user_id,
        banned_at: serverTimestamp(),
      });
      
      await loadData();
      setShowBanModal(false);
      setSelectedUser(null);
      setBanData({ reason: '', banUntil: '', isPermanent: false });
      setSuccessMessage(isRTL ? 'המשתמש הורחק בהצלחה!' : 'User banned successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error banning user:', error);
      alert(isRTL ? 'שגיאה בהרחקת המשתמש: ' + error.message : 'Error banning user: ' + error.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleUnbanUser = async (userId) => {
    setIsLoadingAction(true);
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        is_banned: false,
        ban_reason: null,
        ban_until: null,
        banned_by: null,
        banned_at: null,
        unbanned_by: user.user_id,
        unbanned_at: serverTimestamp(),
      });
      await loadData();
    } catch (error) {
      console.error('Error unbanning user:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsLoadingAction(true);
    try {
      const userDocRef = doc(db, 'users', selectedUser.user_id);
      await deleteDoc(userDocRef);
      await loadData();
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const openBanModal = (user) => {
    setSelectedUser(user);
    setBanData({ reason: '', banUntil: '', isPermanent: false });
    setShowBanModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setRoleData({ newRole: user.role_name });
    setShowRoleModal(true);
  };

  const handleRoleUpdate = async () => {
    if (!selectedUser || !roleData.newRole) return;

    setIsLoadingAction(true);
    try {
      await updateUserRole(selectedUser.user_id, roleData.newRole);
      await loadData();
      setShowRoleModal(false);
      setSelectedUser(null);
      setSuccessMessage(isRTL ? 'תפקיד המשתמש עודכן בהצלחה!' : 'User role updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user role:', error);
      alert(isRTL ? 'שגיאה בעדכון תפקיד המשתמש: ' + error.message : 'Error updating user role: ' + error.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!adminData.firstName || !adminData.lastName || !adminData.email || !adminData.password) {
      alert(isRTL ? 'יש למלא את כל השדות' : 'Please fill all fields');
      return;
    }

    if (adminData.password !== adminData.confirmPassword) {
      alert(isRTL ? 'הסיסמאות אינן תואמות' : 'Passwords do not match');
      return;
    }

    setIsLoadingAction(true);
    try {
      await createAdminUser(
        adminData.firstName,
        adminData.lastName,
        adminData.email,
        adminData.password
      );
      await loadData();
      setShowCreateAdminModal(false);
      setAdminData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
      setSuccessMessage(isRTL ? 'משתמש אדמין נוצר בהצלחה!' : 'Admin user created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating admin user:', error);
      alert(isRTL ? 'שגיאה ביצירת משתמש אדמין: ' + error.message : 'Error creating admin user: ' + error.message);
    } finally {
      setIsLoadingAction(false);
    }
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return '-';
    try {
      let date;
      
      // Handle Firebase Timestamp objects
      if (dateInput && typeof dateInput === 'object' && dateInput.seconds) {
        // Firebase Timestamp object
        date = new Date(dateInput.seconds * 1000);
      } else if (dateInput && typeof dateInput === 'object' && dateInput.toDate) {
        // Firebase Timestamp with toDate method
        date = dateInput.toDate();
      } else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
        // String or number timestamp
        date = new Date(dateInput);
      } else {
        console.error('Invalid date input:', dateInput);
        return '-';
      }
      
      if (isNaN(date.getTime())) {
        console.error('Invalid date after conversion:', dateInput);
        return '-';
      }
      
      return date.toLocaleDateString(isRTL ? 'he-IL' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', dateInput, error);
      return '-';
    }
  };

  const getRoleDisplayName = (roleName) => {
    switch (roleName) {
      case 'admin':
        return isRTL ? 'מנהל' : 'Admin';
      case 'moderator':
        return isRTL ? 'מנחה' : 'Moderator';
      case 'user':
        return isRTL ? 'משתמש' : 'User';
      default:
        return roleName;
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>{isRTL ? 'טוען נתונים...' : 'Loading data...'}</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <h1>{isRTL ? 'פאנל ניהול' : 'Admin Panel'}</h1>
          {successMessage && (
            <div className="success-message">
              ✅ {successMessage}
            </div>
          )}
        </div>

        {/* Dashboard Stats */}
        {dashboardData && (
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{isRTL ? 'סה"כ משתמשים' : 'Total Users'}</h3>
                <p className="stat-value">{dashboardData.total_users}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🚫</div>
              <div className="stat-info">
                <h3>{isRTL ? 'משתמשים מוחרמים' : 'Banned Users'}</h3>
                <p className="stat-value">{dashboardData.banned_users}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🆕</div>
              <div className="stat-info">
                <h3>{isRTL ? 'משתמשים חדשים היום' : 'New Users Today'}</h3>
                <p className="stat-value">{dashboardData.new_users_today}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{isRTL ? 'שיעורים שהושלמו היום' : 'Lessons Completed Today'}</h3>
                <p className="stat-value">{dashboardData.lessons_completed_today}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-info">
                <h3>{isRTL ? 'משתמשים פעילים' : 'Active Users'}</h3>
                <p className="stat-value">{dashboardData.active_users}</p>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="users-section">
          <div className="section-header">
            <h2>{isRTL ? 'ניהול משתמשים' : 'User Management'}</h2>
            <div className="header-actions">
              <button 
                className="create-admin-button" 
                onClick={() => setShowCreateAdminModal(true)}
              >
                👑 {isRTL ? 'צור אדמין' : 'Create Admin'}
              </button>
              <button className="refresh-button" onClick={loadData}>
                🔄 {isRTL ? 'רענן' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>{isRTL ? 'שם' : 'Name'}</th>
                  <th>{isRTL ? 'אימייל' : 'Email'}</th>
                  <th>{isRTL ? 'תפקיד' : 'Role'}</th>
                  <th>{isRTL ? 'תאריך הצטרפות' : 'Join Date'}</th>
                  <th>{isRTL ? 'סטטוס' : 'Status'}</th>
                  <th>{isRTL ? 'פעולות' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem.user_id} className={userItem.is_banned ? 'banned-user' : ''}>

                    <td>
                      <div className="user-name">
                        {userItem.first_name} {userItem.last_name}
                      </div>
                    </td>
                    <td>{userItem.user_email}</td>
                    <td>
                      <span className={`role-badge role-${userItem.role_name}`}>
                        {getRoleDisplayName(userItem.role_name)}
                      </span>
                    </td>
                    <td>{formatDate(userItem.created_at)}</td>
                    <td>
                      {userItem.is_banned ? (
                        <div className="ban-status">
                          <span className="status-badge banned">
                            {isRTL ? 'מוחרם' : 'Banned'}
                          </span>
                          {userItem.ban_until ? (
                            <div className="ban-details">
                              <small>{isRTL ? 'עד:' : 'Until:'} {formatDate(userItem.ban_until)}</small>
                            </div>
                          ) : (
                            <div className="ban-details">
                              <small>{isRTL ? 'הרחקה קבועה' : 'Permanent'}</small>
                            </div>
                          )}
                          {userItem.ban_reason && (
                            <div className="ban-details">
                              <small>{isRTL ? 'סיבה:' : 'Reason:'} {userItem.ban_reason}</small>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="status-badge active">
                          {isRTL ? 'פעיל' : 'Active'}
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button role"
                          onClick={() => openRoleModal(userItem)}
                          disabled={isLoadingAction || userItem.user_id === user.user_id}
                        >
                          🔄 {isRTL ? 'תפקיד' : 'Role'}
                        </button>
                        
                        {userItem.is_banned ? (
                          <button
                            className="action-button unban"
                            onClick={() => handleUnbanUser(userItem.user_id)}
                            disabled={isLoadingAction}
                          >
                            {isRTL ? 'בטל הרחקה' : 'Unban'}
                          </button>
                        ) : (
                          <button
                            className="action-button ban"
                            onClick={() => openBanModal(userItem)}
                            disabled={isLoadingAction || userItem.user_id === user.user_id}
                          >
                            {isRTL ? 'הרחק' : 'Ban'}
                          </button>
                        )}
                        
                        <button
                          className="action-button delete"
                          onClick={() => openDeleteModal(userItem)}
                          disabled={isLoadingAction || userItem.user_id === user.user_id}
                        >
                          {isRTL ? 'מחק' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {showBanModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{isRTL ? 'הרחקת משתמש' : 'Ban User'}</h3>
              <button
                className="modal-close"
                onClick={() => setShowBanModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <p>
                {isRTL ? 'הרחקת משתמש:' : 'Ban user:'} <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
              </p>
              
              <div className="form-group">
                <label htmlFor="banReason">
                  {isRTL ? 'סיבת ההרחקה:' : 'Ban Reason:'}
                </label>
                <textarea
                  id="banReason"
                  value={banData.reason}
                  onChange={(e) => setBanData(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder={isRTL ? 'הכנס סיבת ההרחקה...' : 'Enter ban reason...'}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="permanent-ban-label">
                  <input
                    type="checkbox"
                    checked={banData.isPermanent}
                    onChange={(e) => setBanData(prev => ({ ...prev, isPermanent: e.target.checked }))}
                    className="permanent-ban-checkbox"
                  />
                  <span className="permanent-ban-text">
                    {isRTL ? 'הרחקה קבועה' : 'Permanent ban'}
                  </span>
                </label>
              </div>

              {!banData.isPermanent && (
                <div className="form-group">
                  <label htmlFor="banUntil">
                    {isRTL ? 'תאריך סיום הרחקה:' : 'Ban until:'}
                  </label>
                  <input
                    type="datetime-local"
                    id="banUntil"
                    value={banData.banUntil}
                    onChange={(e) => setBanData(prev => ({ ...prev, banUntil: e.target.value }))}
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="modal-button confirm"
                  onClick={handleBanUser}
                  disabled={isLoadingAction || !banData.reason.trim()}
                >
                  {isLoadingAction ? (
                    <span className="loading-spinner">
                      <div className="spinner"></div>
                      {isRTL ? 'מרחיק...' : 'Banning...'}
                    </span>
                  ) : (
                    isRTL ? 'הרחק' : 'Ban'
                  )}
                </button>
                <button
                  className="modal-button cancel"
                  onClick={() => setShowBanModal(false)}
                  disabled={isLoadingAction}
                >
                  {isRTL ? 'ביטול' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{isRTL ? 'מחיקת משתמש' : 'Delete User'}</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="warning-message">
                ⚠️ {isRTL ? 'פעולה זו אינה הפיכה!' : 'This action is irreversible!'}
              </div>
              <p>
                {isRTL ? 'האם אתה בטוח שברצונך למחוק את המשתמש:' : 'Are you sure you want to delete the user:'}
                <br />
                <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
                <br />
                <em>{selectedUser?.user_email}</em>
              </p>

              <div className="modal-actions">
                <button
                  className="modal-button delete"
                  onClick={handleDeleteUser}
                  disabled={isLoadingAction}
                >
                  {isLoadingAction ? (
                    <span className="loading-spinner">
                      <div className="spinner"></div>
                      {isRTL ? 'מוחק...' : 'Deleting...'}
                    </span>
                  ) : (
                    isRTL ? 'מחק' : 'Delete'
                  )}
                </button>
                <button
                  className="modal-button cancel"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isLoadingAction}
                >
                  {isRTL ? 'ביטול' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role Update Modal */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{isRTL ? 'עדכון תפקיד משתמש' : 'Update User Role'}</h3>
              <button
                className="modal-close"
                onClick={() => setShowRoleModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <p>
                {isRTL ? 'עדכון תפקיד למשתמש:' : 'Update role for user:'} <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
              </p>
              
              <div className="form-group">
                <label htmlFor="newRole">
                  {isRTL ? 'תפקיד חדש:' : 'New Role:'}
                </label>
                <select
                  id="newRole"
                  value={roleData.newRole}
                  onChange={(e) => setRoleData(prev => ({ ...prev, newRole: e.target.value }))}
                >
                  <option value="user">{isRTL ? 'משתמש' : 'User'}</option>
                  <option value="moderator">{isRTL ? 'מנחה' : 'Moderator'}</option>
                  <option value="admin">{isRTL ? 'מנהל' : 'Admin'}</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  className="modal-button confirm"
                  onClick={handleRoleUpdate}
                  disabled={isLoadingAction}
                >
                  {isLoadingAction ? (
                    <span className="loading-spinner">
                      <div className="spinner"></div>
                      {isRTL ? 'מעדכן...' : 'Updating...'}
                    </span>
                  ) : (
                    isRTL ? 'עדכן' : 'Update'
                  )}
                </button>
                <button
                  className="modal-button cancel"
                  onClick={() => setShowRoleModal(false)}
                  disabled={isLoadingAction}
                >
                  {isRTL ? 'ביטול' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Admin Modal */}
      {showCreateAdminModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{isRTL ? 'יצירת משתמש אדמין' : 'Create Admin User'}</h3>
              <button
                className="modal-close"
                onClick={() => setShowCreateAdminModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group">
                <label htmlFor="adminFirstName">
                  {isRTL ? 'שם פרטי:' : 'First Name:'}
                </label>
                <input
                  type="text"
                  id="adminFirstName"
                  value={adminData.firstName}
                  onChange={(e) => setAdminData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder={isRTL ? 'הכנס שם פרטי' : 'Enter first name'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminLastName">
                  {isRTL ? 'שם משפחה:' : 'Last Name:'}
                </label>
                <input
                  type="text"
                  id="adminLastName"
                  value={adminData.lastName}
                  onChange={(e) => setAdminData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder={isRTL ? 'הכנס שם משפחה' : 'Enter last name'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminEmail">
                  {isRTL ? 'אימייל:' : 'Email:'}
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  value={adminData.email}
                  onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={isRTL ? 'הכנס אימייל' : 'Enter email'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminPassword">
                  {isRTL ? 'סיסמה:' : 'Password:'}
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminData.password}
                  onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder={isRTL ? 'הכנס סיסמה' : 'Enter password'}
                />
              </div>

              <div className="form-group">
                <label htmlFor="adminConfirmPassword">
                  {isRTL ? 'אישור סיסמה:' : 'Confirm Password:'}
                </label>
                <input
                  type="password"
                  id="adminConfirmPassword"
                  value={adminData.confirmPassword}
                  onChange={(e) => setAdminData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder={isRTL ? 'אישור סיסמה' : 'Confirm password'}
                />
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button
                  className="modal-button confirm"
                  onClick={handleCreateAdmin}
                  disabled={isLoadingAction || !adminData.firstName || !adminData.lastName || !adminData.email || !adminData.password}
                >
                  {isLoadingAction ? (
                    <span className="loading-spinner">
                      <div className="spinner"></div>
                      {isRTL ? 'יוצר...' : 'Creating...'}
                    </span>
                  ) : (
                    isRTL ? 'צור אדמין' : 'Create Admin'
                  )}
                </button>
                <button
                  className="modal-button cancel"
                  onClick={() => setShowCreateAdminModal(false)}
                  disabled={isLoadingAction}
                >
                  {isRTL ? 'ביטול' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
