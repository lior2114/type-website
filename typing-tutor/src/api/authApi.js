const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:5000`;

class AuthApi {
  // התחברות
  static async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_email: email, user_password: password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'התחברות נכשלה');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // הרשמה
  static async register(firstName, lastName, email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          user_email: email,
          user_password: password,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'הרשמה נכשלה');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // בדיקת מייל קיים
  static async checkEmailExists(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/check_email?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  }

  // קבלת פרטי משתמש
  static async getUserProfile(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Message || 'שגיאה בקבלת פרטי משתמש');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // עדכון פרטי משתמש
  static async updateUserProfile(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'שגיאה בעדכון פרטי משתמש');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // עדכון תמונת פרופיל
  static async updateProfileImage(userId, imageUrl) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile_image: imageUrl }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'שגיאה בעדכון תמונת פרופיל');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // מחיקת תמונת פרופיל
  static async removeProfileImage(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile-image`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'שגיאה במחיקת תמונת פרופיל');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // קבלת התקדמות משתמש
  static async getUserProgress(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/progress`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Message || 'שגיאה בקבלת התקדמות');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // עדכון התקדמות משתמש
  static async updateUserProgress(progressData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.Error || 'שגיאה בעדכון התקדמות');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthApi;
