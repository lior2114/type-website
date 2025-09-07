import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, getConnectionStatus } from '../../firebase.jsx';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateEmail as fbUpdateEmail,
  updatePassword as fbUpdatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(getConnectionStatus());

  // Enhanced error handling for Firestore operations
  const handleFirestoreError = (error, operation = 'Firestore operation') => {
    console.error(`${operation} failed:`, error);
    
    if (error.code === 'unavailable' || error.code === 'deadline-exceeded') {
      return 'בעיית חיבור לשרת. בדוק את החיבור לאינטרנט.';
    } else if (error.code === 'permission-denied') {
      return 'אין הרשאה לבצע פעולה זו.';
    } else if (error.code === 'not-found') {
      return 'המשאב המבוקש לא נמצא.';
    } else if (error.code === 'already-exists') {
      return 'המשאב כבר קיים.';
    } else if (error.code === 'failed-precondition') {
      return 'התנאים המוקדמים לא מתקיימים.';
    } else if (error.message?.includes('400')) {
      return 'שגיאה בהתחברות למסד הנתונים. בדוק את הגדרות Firebase.';
    }
    
    return error.message || 'שגיאה לא ידועה';
  };

  // Safe Firestore operation wrapper
  const safeFirestoreOperation = async (operation, fallbackValue = null) => {
    try {
      if (!getConnectionStatus()) {
        throw new Error('אין חיבור לאינטרנט');
      }
      return await operation();
    } catch (error) {
      const errorMessage = handleFirestoreError(error);
      setError(errorMessage);
      console.warn('Firestore operation failed, using fallback:', errorMessage);
      return fallbackValue;
    }
  };

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // האזנה למצב התחברות של Firebase + טעינת פרופיל Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          // Use safe Firestore operation with fallback
          const profile = await safeFirestoreOperation(async () => {
            const userDocRef = doc(db, 'users', fbUser.uid);
            const snap = await getDoc(userDocRef);
            
            if (!snap.exists()) {
              // Create basic profile if it doesn't exist
              await setDoc(userDocRef, {
                first_name: '',
                last_name: '',
                user_email: fbUser.email || '',
                role_name: 'user',
                created_at: serverTimestamp(),
                is_banned: false,
                profile_image: null,
              }, { merge: true });
              
              return {
                first_name: '',
                last_name: '',
                user_email: fbUser.email || '',
                role_name: 'user',
                created_at: Date.now(),
                is_banned: false,
                profile_image: null,
              };
            }
            
            return snap.data();
          }, {
            first_name: '',
            last_name: '',
            user_email: fbUser.email || '',
            role_name: 'user',
            created_at: Date.now(),
            is_banned: false,
            profile_image: null,
          });

          const composedUser = {
            user_id: fbUser.uid,
            user_email: fbUser.email || profile.user_email || '',
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            role_name: profile.role_name || 'user',
            created_at: profile.created_at || null,
            profile_image: profile.profile_image || null,
            is_banned: !!profile.is_banned,
          };

          // אם המשתמש מוחרם, ננתק ונציג שגיאה
          if (composedUser.is_banned) {
            setError('החשבון הושהה. פנה לתמיכה.');
            await signOut(auth);
            localStorage.removeItem('user');
            setUser(null);
          } else {
            localStorage.setItem('user', JSON.stringify(composedUser));
            setUser(composedUser);
          }
        } else {
          // ניסיון לשחזר מ-localStorage אם יש
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            try {
              setUser(JSON.parse(savedUser));
            } catch {
              localStorage.removeItem('user');
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('שגיאה בטעינת נתוני המשתמש');
        // Fallback to localStorage if available
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // התחברות
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      
      // Use safe Firestore operation
      const profile = await safeFirestoreOperation(async () => {
        const userDocRef = doc(db, 'users', uid);
        const snap = await getDoc(userDocRef);
        return snap.exists() ? snap.data() : {};
      }, {});

      const userData = {
        user_id: uid,
        user_email: cred.user.email || email,
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        role_name: profile.role_name || 'user',
        created_at: profile.created_at || null,
        profile_image: profile.profile_image || null,
        is_banned: !!profile.is_banned,
      };

      if (userData.is_banned) {
        await signOut(auth);
        throw new Error('החשבון הושהה. פנה לתמיכה.');
      }

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      const msg = error?.message || 'התחברות נכשלה';
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // הרשמה
  const register = async (firstName, lastName, email, password) => {
    try {
      setError(null);
      setLoading(true);

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      
      // Use safe Firestore operation
      await safeFirestoreOperation(async () => {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
          first_name: firstName,
          last_name: lastName,
          user_email: email,
          role_name: 'user',
          created_at: serverTimestamp(),
          is_banned: false,
          profile_image: null,
        }, { merge: true });
      });

      const userData = {
        user_id: uid,
        user_email: email,
        first_name: firstName,
        last_name: lastName,
        role_name: 'user',
        created_at: Date.now(),
        profile_image: null,
        is_banned: false,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      const msg = error?.message || 'הרשמה נכשלה';
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // התנתקות
  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  // עדכון פרטי משתמש
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('אין משתמש מחובר');
      }

      const userDocRef = doc(db, 'users', currentUser.uid);

      // אם התקבלה סיסמה נוכחית – מבצעים אימות מחדש לפני שינויי אימייל/סיסמה
      if (userData.current_password) {
        const credential = EmailAuthProvider.credential(currentUser.email || user.user_email, userData.current_password);
        await reauthenticateWithCredential(currentUser, credential);
      }

      // שינוי אימייל במידת הצורך
      if (userData.user_email && userData.user_email !== (currentUser.email || '')) {
        await fbUpdateEmail(currentUser, userData.user_email);
      }

      // שינוי סיסמה במידת הצורך
      if (userData.new_password) {
        await fbUpdatePassword(currentUser, userData.new_password);
      }

      // עדכון פרופיל ב-Firestore
      const updates = {};
      if (typeof userData.first_name !== 'undefined') updates.first_name = userData.first_name;
      if (typeof userData.last_name !== 'undefined') updates.last_name = userData.last_name;
      if (typeof userData.user_email !== 'undefined') updates.user_email = userData.user_email;
      if (Object.keys(updates).length > 0) {
        await updateDoc(userDocRef, updates);
      }

      const updatedUser = {
        ...user,
        first_name: updates.first_name ?? user.first_name,
        last_name: updates.last_name ?? user.last_name,
        user_email: updates.user_email ?? (currentUser.email || user.user_email),
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      const message = error?.message || 'שגיאה בעדכון הפרופיל';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // עדכון תמונת פרופיל
  const updateProfileImage = async (imageUrl) => {
    try {
      setError(null);
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('אין משתמש מחובר');
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { profile_image: imageUrl });
      const updatedUser = { ...user, profile_image: imageUrl };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // מחיקת תמונת פרופיל
  const removeProfileImage = async () => {
    try {
      setError(null);
      setLoading(true);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('אין משתמש מחובר');
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { profile_image: null });
      const updatedUser = { ...user, profile_image: null };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // קבלת התקדמות משתמש לפי שפה ומצב
  const getUserProgress = async (language = 'hebrew', isTranslated = false) => {
    try {
      setError(null);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('אין משתמש מחובר');
      const mode = isTranslated ? 'translated' : 'normal';
      const statsDocRef = doc(db, 'users', currentUser.uid, 'stats', `summary_${language}_${mode}`);
      const snap = await getDoc(statsDocRef);
      if (snap.exists()) return snap.data();
      // ערכי ברירת מחדל
      return {
        completed_lessons: 0,
        average_wpm: 0,
        average_accuracy: 0,
        total_time_spent: 0,
        total_words_typed: 0,
        recent_lessons: [],
        language: language,
        isTranslated: isTranslated
      };
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // קבלת רשימת שיעורים שהושלמו לפי שפה ומצב
  const getCompletedLessons = async (language = 'hebrew', isTranslated = false) => {
    try {
      setError(null);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('אין משתמש מחובר');
      
      const mode = isTranslated ? 'translated' : 'normal';
      const completedLessonsRef = doc(db, 'users', currentUser.uid, 'progress', `completed_lessons_${language}_${mode}`);
      const completedSnap = await getDoc(completedLessonsRef);
      
      if (completedSnap.exists()) {
        const completedData = completedSnap.data();
        // החזרת רשימת ID-ים של שיעורים שהושלמו
        return Object.keys(completedData).map(id => parseInt(id)).filter(id => !isNaN(id));
      }
      
      return [];
    } catch (error) {
      setError(error.message);
      console.error('Error getting completed lessons:', error);
      return [];
    }
  };

  // עדכון התקדמות משתמש
  const updateUserProgress = async (progressData) => {
    try {
      setError(null);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('אין משתמש מחובר');
      
      // קבלת השפה והמצב מהנתונים או ברירת מחדל
      const language = progressData.language || 'hebrew';
      const isTranslated = progressData.isTranslated || false;
      const mode = isTranslated ? 'translated' : 'normal';
      
      // עדכון רשימת שיעורים שהושלמו לפי שפה ומצב
      if (progressData.lesson_id && progressData.lesson_type === 'lesson') {
        const completedLessonsRef = doc(db, 'users', currentUser.uid, 'progress', `completed_lessons_${language}_${mode}`);
        const completedSnap = await getDoc(completedLessonsRef);
        const completedLessons = completedSnap.exists() ? completedSnap.data() : {};
        
        // הוספת השיעור לרשימת השיעורים שהושלמו
        completedLessons[progressData.lesson_id] = {
          completed_at: serverTimestamp(),
          lesson_name: progressData.lesson_name,
          accuracy: progressData.accuracy,
          wpm: progressData.wpm,
          errors: progressData.errors,
          time_spent: progressData.time_spent,
          language: language,
          isTranslated: isTranslated
        };
        
        await setDoc(completedLessonsRef, completedLessons, { merge: true });
      }
      
      // חישוב סטטיסטיקות כוללות
      await calculateAndUpdateStats(currentUser.uid, language, mode);
      
      window.dispatchEvent(new Event('user-progress-updated'));
      return progressData;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // חישוב ועדכון סטטיסטיקות כוללות
  const calculateAndUpdateStats = async (userId, language, mode) => {
    try {
      const completedLessonsRef = doc(db, 'users', userId, 'progress', `completed_lessons_${language}_${mode}`);
      const completedSnap = await getDoc(completedLessonsRef);
      
      if (!completedSnap.exists()) {
        // אם אין שיעורים שהושלמו, אפס את הסטטיסטיקות
        const statsDocRef = doc(db, 'users', userId, 'stats', `summary_${language}_${mode}`);
        await setDoc(statsDocRef, {
          completed_lessons: 0,
          average_wpm: 0,
          average_accuracy: 0,
          total_time_spent: 0,
          total_words_typed: 0,
          recent_lessons: [],
          language: language,
          isTranslated: mode === 'translated',
          last_updated: serverTimestamp()
        });
        return;
      }
      
      const completedLessons = completedSnap.data();
      const lessonIds = Object.keys(completedLessons).filter(id => !isNaN(parseInt(id)));
      
      // חישוב סטטיסטיקות
      let totalWpm = 0;
      let totalAccuracy = 0;
      let totalTimeSpent = 0;
      let totalWordsTyped = 0;
      const recentLessons = [];
      
      lessonIds.forEach(lessonId => {
        const lesson = completedLessons[lessonId];
        if (lesson.wpm) totalWpm += lesson.wpm;
        if (lesson.accuracy) totalAccuracy += lesson.accuracy;
        if (lesson.time_spent) totalTimeSpent += lesson.time_spent;
        if (lesson.wpm && lesson.time_spent) {
          // חישוב מילים שהוקלדו (WPM * זמן בדקות)
          totalWordsTyped += lesson.wpm * (lesson.time_spent / 60);
        }
        
        // הוספה לשיעורים האחרונים (5 האחרונים)
        recentLessons.push({
          lesson_id: lessonId,
          lesson_name: lesson.lesson_name,
          lesson_type: 'lesson',
          completed_at: lesson.completed_at,
          wpm: lesson.wpm,
          accuracy: lesson.accuracy,
          time_spent: lesson.time_spent,
          errors: lesson.errors
        });
      });
      
      // מיון לפי תאריך (החדשים ביותר קודם)
      recentLessons.sort((a, b) => {
        if (a.completed_at && b.completed_at) {
          return b.completed_at.toDate() - a.completed_at.toDate();
        }
        return 0;
      });
      
      // שמירת הסטטיסטיקות
      const statsDocRef = doc(db, 'users', userId, 'stats', `summary_${language}_${mode}`);
      await setDoc(statsDocRef, {
        completed_lessons: lessonIds.length,
        average_wpm: lessonIds.length > 0 ? Math.round(totalWpm / lessonIds.length) : 0,
        average_accuracy: lessonIds.length > 0 ? Math.round(totalAccuracy / lessonIds.length) : 0,
        total_time_spent: Math.round(totalTimeSpent),
        total_words_typed: Math.round(totalWordsTyped),
        recent_lessons: recentLessons.slice(0, 5), // 5 שיעורים אחרונים
        language: language,
        isTranslated: mode === 'translated',
        last_updated: serverTimestamp()
      });
      
    } catch (error) {
      console.error('Error calculating stats:', error);
      throw error;
    }
  };

  // יצירת משתמש אדמין ראשון (רק אם אין אדמינים במערכת)
  const createFirstAdmin = async (firstName, lastName, email, password) => {
    try {
      setError(null);
      setLoading(true);

      // בדיקה אם יש כבר אדמינים במערכת
      const adminCheck = await safeFirestoreOperation(async () => {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const hasAdmin = usersSnapshot.docs.some(doc => doc.data().role_name === 'admin');
        return hasAdmin;
      }, false);

      if (adminCheck) {
        throw new Error('כבר קיים משתמש אדמין במערכת. רק אדמין יכול ליצור אדמינים נוספים.');
      }

      // יצירת המשתמש ב-Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      
      // שמירת נתוני האדמין ב-Firestore
      await safeFirestoreOperation(async () => {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
          first_name: firstName,
          last_name: lastName,
          user_email: email,
          role_name: 'admin',
          created_at: serverTimestamp(),
          is_banned: false,
          profile_image: null,
          is_first_admin: true,
          created_by: 'system',
        }, { merge: true });
      });

      const userData = {
        user_id: uid,
        user_email: email,
        first_name: firstName,
        last_name: lastName,
        role_name: 'admin',
        created_at: Date.now(),
        profile_image: null,
        is_banned: false,
        is_first_admin: true,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      const msg = error?.message || 'יצירת אדמין נכשלה';
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // יצירת משתמש אדמין נוסף (רק על ידי אדמין קיים)
  const createAdminUser = async (firstName, lastName, email, password) => {
    try {
      setError(null);
      setLoading(true);

      if (!user || user.role_name !== 'admin') {
        throw new Error('רק אדמין יכול ליצור אדמינים נוספים');
      }

      // יצירת המשתמש ב-Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = cred.user.uid;
      
      // שמירת נתוני האדמין ב-Firestore
      await safeFirestoreOperation(async () => {
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
          first_name: firstName,
          last_name: lastName,
          user_email: email,
          role_name: 'admin',
          created_at: serverTimestamp(),
          is_banned: false,
          profile_image: null,
          is_first_admin: false,
          created_by: user.user_id,
        }, { merge: true });
      });

      return {
        user_id: uid,
        user_email: email,
        first_name: firstName,
        last_name: lastName,
        role_name: 'admin',
        created_at: Date.now(),
        profile_image: null,
        is_banned: false,
        is_first_admin: false,
        created_by: user.user_id,
      };
    } catch (error) {
      const msg = error?.message || 'יצירת אדמין נכשלה';
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // עדכון תפקיד משתמש (רק על ידי אדמין)
  const updateUserRole = async (userId, newRole) => {
    try {
      setError(null);
      setLoading(true);

      if (!user || user.role_name !== 'admin') {
        throw new Error('רק אדמין יכול לעדכן תפקידים');
      }

      if (!['admin', 'moderator', 'user'].includes(newRole)) {
        throw new Error('תפקיד לא תקין');
      }

      // עדכון התפקיד ב-Firestore
      await safeFirestoreOperation(async () => {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          role_name: newRole,
          role_updated_by: user.user_id,
          role_updated_at: serverTimestamp(),
        });
      });

      return true;
    } catch (error) {
      const msg = error?.message || 'עדכון תפקיד נכשל';
      setError(msg);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // קבלת כל המשתמשים (רק לאדמין)
  const getAllUsers = async () => {
    try {
      setError(null);

      if (!user || user.role_name !== 'admin') {
        throw new Error('רק אדמין יכול לראות את רשימת המשתמשים');
      }

      const users = await safeFirestoreOperation(async () => {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        return usersSnapshot.docs.map(doc => ({
          user_id: doc.id,
          ...doc.data()
        }));
      }, []);

      return users;
    } catch (error) {
      const msg = error?.message || 'שגיאה בטעינת משתמשים';
      setError(msg);
      throw error;
    }
  };

  // בדיקה אם המשתמש הוא אדמין
  const isAdmin = () => {
    return user && user.role_name === 'admin';
  };

  // בדיקה אם המשתמש הוא מנחה
  const isModerator = () => {
    return user && (user.role_name === 'moderator' || user.role_name === 'admin');
  };

  // בדיקה אם יש אדמין במערכת
  const hasAdmin = async () => {
    try {
      const hasAdminUser = await safeFirestoreOperation(async () => {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        return usersSnapshot.docs.some(doc => doc.data().role_name === 'admin');
      }, false);
      
      return hasAdminUser;
    } catch (error) {
      console.error('Error checking for admin:', error);
      return false;
    }
  };

  // ניקוי שגיאות
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isOnline,
    login,
    register,
    logout,
    updateProfile,
    updateProfileImage,
    removeProfileImage,
    getUserProgress,
    getCompletedLessons,
    updateUserProgress,
    calculateAndUpdateStats,
    createFirstAdmin,
    createAdminUser,
    updateUserRole,
    getAllUsers,
    hasAdmin,
    isAdmin,
    isModerator,
    clearError,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
