# Firebase Setup Guide

## הבעיה הנוכחית
השגיאה `400 Bad Request` מ-Firebase Firestore מצביעה על כך שמסד הנתונים ברירת המחדל לא קיים בפרויקט Firebase שלך.

## פתרון הבעיה

### 1. יצירת מסד נתונים Firestore

1. **היכנס לקונסולת Firebase:**
   - לך ל-https://console.firebase.google.com/
   - בחר בפרויקט `typing-website-44c98`

2. **צור מסד נתונים Firestore:**
   - לחץ על "Firestore Database" בתפריט הצד
   - לחץ על "Create database"
   - בחר "Start in test mode" (לפיתוח)
   - בחר מיקום קרוב (למשל: us-central1)
   - **חשוב:** השאר את השדה "Database ID" ריק או הזן `(default)`

3. **הגדר חוקי אבטחה:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users collection
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow create: if request.auth != null;
       }
       
       // User stats subcollection
       match /users/{userId}/stats/{document} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Admin access
       match /{document=**} {
         allow read, write: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role_name == 'admin';
       }
     }
   }
   ```

### 2. הגדרת משתני סביבה

1. **צור קובץ `.env.local`:**
   ```bash
   cp env.example .env.local
   ```

2. **עדכן את הערכים בקובץ `.env.local`:**
   ```
   VITE_FIREBASE_API_KEY=AIzaSyDnlfZF01rKU6h80hsoxKTcWvl3Xcq81uk
   VITE_FIREBASE_AUTH_DOMAIN=typing-website-44c98.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=typing-website-44c98
   VITE_FIREBASE_STORAGE_BUCKET=typing-website-44c98.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=683451576727
   VITE_FIREBASE_APP_ID=1:683451576727:web:7c6da6622588dbd17dd4d2
   ```

### 3. הפעלת הפרויקט

1. **התקן תלויות:**
   ```bash
   npm install
   ```

2. **הפעל את השרת:**
   ```bash
   npm run dev
   ```

## תכונות חדשות שנוספו

### 1. מערכת ניהול משתמשים מתקדמת
- **יצירת אדמין ראשון** - רק אתה תוכל ליצור
- **ניהול תפקידים** - admin/user/moderator
- **ממשק ניהול משתמשים** - עדכון תפקידים, הרחקה, מחיקה
- **אבטחה מבוססת תפקידים** - הגנה מלאה על נתונים

### 2. טיפול מתקדם בשגיאות
- זיהוי אוטומטי של סוגי שגיאות Firebase
- הודעות שגיאה בעברית
- fallback ל-localStorage במקרה של בעיות חיבור

### 3. ניהול חיבור
- מעקב אחר מצב החיבור לאינטרנט
- ניהול אוטומטי של מצב online/offline
- חיבור מחדש אוטומטי

### 4. אבטחה משופרת
- חוקי Firestore מאובטחים עם הרשאות מתקדמות
- אימות משתמשים מתקדם
- הגנה מפני גישה לא מורשית
- מעקב אחר פעולות אדמין

## יצירת אדמין ראשון

### שיטה 1: תוכנת Python עם GUI (מומלץ)
```bash
python create_admin.py
```
**תכונות:**
- ממשק גרפי נוח
- יצירה ישירה ב-Firebase
- אין צורך בהדבקות קוד
- פרטי התחברות ברירת מחדל:
  - אימייל: `admin@typing-tutor.com`
  - סיסמה: `admin123456`

### שיטה 2: סקריפט קונסול פשוט
```bash
npm run create-admin-simple
```

### שיטה 3: סקריפט קונסול אינטראקטיבי
```bash
npm run create-admin
```

### שיטה 4: ממשק האפליקציה
1. הפעל את האפליקציה: `npm run dev`
2. לך ל-`http://localhost:5173/create-admin`
3. מלא את הפרטים ויצור את האדמין הראשון

## בדיקת הפתרון

לאחר ביצוע השלבים לעיל:

1. **רענן את הדפדפן**
2. **בדוק את הקונסול** - לא אמורות להיות שגיאות Firebase
3. **צור אדמין ראשון** - השתמש באחת מהשיטות לעיל
4. **התחבר כאדמין** - בדוק שההתחברות עובדת
5. **גש לפאנל האדמין** - בדוק ניהול משתמשים
6. **בדוק את מסד הנתונים** - אמורים להיווצר מסמכים ב-Firestore

## פתרון בעיות נוספות

### אם הבעיה נמשכת:

1. **נקה את ה-cache:**
   ```bash
   npm run build
   rm -rf node_modules/.vite
   npm run dev
   ```

2. **בדוק את הגדרות Firebase:**
   - ודא שהפרויקט פעיל
   - בדוק שהחוקים נשמרו
   - ודא שמסד הנתונים קיים

3. **בדוק את הקונסול:**
   - חפש שגיאות נוספות
   - בדוק את רשת הבקשות

## תמיכה

אם הבעיה נמשכת, בדוק:
- לוגים בקונסול הדפדפן
- הגדרות Firebase Console
- חיבור לאינטרנט
