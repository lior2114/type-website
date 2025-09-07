const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000`;

class AdminApi {
  // קבלת כל המשתמשים
  static async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Message || 'שגיאה בקבלת רשימת משתמשים');
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  // מחיקת משתמש
  static async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Message || 'שגיאה במחיקת משתמש');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // הרחקת משתמש
  static async banUser(userId, banReason, banUntil = null, bannedBy = null) {
    try {
      const requestBody = {
        ban_reason: banReason,
        ban_until: banUntil,
        banned_by: bannedBy,
      };

      const response = await fetch(`${API_BASE_URL}/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || data.Message || 'שגיאה בהרחקת משתמש');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('בעיית חיבור לשרת. אנא בדוק שהשרת רץ ונסה שוב.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('בעיית חיבור לשרת. אנא בדוק שהשרת רץ ונסה שוב.');
      } else if (error.message.includes('NetworkError')) {
        throw new Error('בעיית רשת. אנא בדוק את החיבור לאינטרנט ונסה שוב.');
      }
      throw error;
    }
  }

  // ביטול הרחקת משתמש
  static async unbanUser(userId, unbannedBy = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unbanned_by: unbannedBy,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'שגיאה בביטול הרחקת משתמש');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // קבלת נתוני דשבורד אדמין
  static async getAdminDashboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Message || 'שגיאה בקבלת נתוני דשבורד');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // יצירת משתמש אדמין ראשון
  static async createAdminUser(adminData) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'שגיאה ביצירת משתמש אדמין');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // עדכון תפקיד משתמש
  static async updateUserRole(userId, roleId, currentPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role_id: roleId,
          current_password: currentPassword,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'שגיאה בעדכון תפקיד משתמש');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default AdminApi;
