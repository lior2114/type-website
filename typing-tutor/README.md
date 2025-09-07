# מורה להקלדה עיוורת - Touch Typing Tutor

אפליקציה אינטראקטיבית ללימוד הקלדה עיוורת בעברית ובאנגלית.

## 🌟 תכונות עיקריות

- **שיעורים מובנים** - 10 שיעורים הדרגתיים לכל שפה
- **תרגול חופשי** - תרגול עם מילים ברמות קושי שונות
- **מבחן מילים רנדומליות** - מבחן מהירות עם מילים אקראיות
- **מקלדת וירטואלית** - הדרכה ויזואלית למיקום נכון של האצבעות
- **מעקב תוצאות** - ניתוח מפורט של מהירות, דיוק ושגיאות
- **ממשק דו-לשוני** - תמיכה מלאה בעברית ואנגלית
- **מוד לילה/יום** - ממשק נוח לעיניים
- **עיצוב רספונסיבי** - עובד על כל המכשירים

## 🚀 התקנה והפעלה

### דרישות מוקדמות
- Node.js 18+ 
- npm או yarn
- חשבון Firebase

### התקנה מהירה

```bash
# התקנת תלויות
npm install

# הגדרת Firebase (חובה!)
# ראה FIREBASE_SETUP.md לפרטים מלאים
npm run setup-firebase

# הפעלת שרת פיתוח
npm run dev
```

### הגדרת Firebase (חובה!)

**⚠️ חשוב:** לפני הפעלת האפליקציה, יש להגדיר את Firebase:

1. **צור מסד נתונים Firestore:**
   - לך ל-[Firebase Console](https://console.firebase.google.com/)
   - בחר בפרויקט `typing-website-44c98`
   - צור Firestore Database עם ID `(default)`

2. **הגדר חוקי אבטחה:**
   - העתק את התוכן מ-`firestore.rules`
   - הדבק ב-Firebase Console > Firestore > Rules

3. **צור אדמין ראשון:**
   
   **שיטה 1: תוכנת Python עם GUI (מומלץ)**
   ```bash
   python create_admin.py
   ```
   
   **שיטה 2: סקריפט Node.js פשוט**
   ```bash
   npm run create-admin-simple
   ```
   
   **שיטה 3: סקריפט Node.js אינטראקטיבי**
   ```bash
   npm run create-admin
   ```
   
   **שיטה 4: ממשק האפליקציה**
   לך ל-`/create-admin` באפליקציה

4. **הפעל את האפליקציה:**
   ```bash
   npm run dev
   ```

📖 **מדריך מפורט:** ראה `FIREBASE_SETUP.md`

### פקודות נוספות

```bash
# בניית גרסה לייצור
npm run build

# בדיקת קוד
npm run lint

# בדיקת הגדרות Firebase
node setup-firebase.js

# יצירת אדמין ראשון (תוכנת Python עם GUI - מומלץ)
python create_admin.py

# יצירת אדמין ראשון (גרסה פשוטה)
npm run create-admin-simple

# יצירת אדמין ראשון (גרסה אינטראקטיבית)
npm run create-admin
```

## 📚 שיעורים

### עברית
1. אותיות הבית - ע וי
2. אותיות הבית - כ וד
3. אותיות הבית - ג וח
4. אותיות הבית - ש ול
5. אותיות עליונות - ק וו
6. אותיות עליונות - א ון
7. אותיות עליונות - ר ום
8. אותיות תחתונות - ז ונ
9. אותיות תחתונות - ס ומ
10. אותיות תחתונות - ב וצ

### English
1. Home Row - F and J
2. Home Row - D and K
3. Home Row - S and L
4. Home Row - A and semicolon
5. Top Row - Q and P
6. Top Row - W and O
7. Top Row - E and I
8. Top Row - R and U
9. Bottom Row - Z and forward slash
10. Bottom Row - X and period

## 🛠️ טכנולוגיות

- **React 19** - ספריית UI
- **React Router** - ניווט
- **Vite** - כלי בנייה
- **CSS3** - עיצוב מתקדם
- **Context API** - ניהול מצב

## 📱 תמיכה במכשירים

- מחשבים אישיים
- טאבלטים
- סמארטפונים

## 🎯 מטרות למידה

- שיפור מהירות ההקלדה
- הגברת הדיוק
- למידת מיקום נכון של האצבעות
- פיתוח מיומנויות הקלדה עיוורת

## 📄 רישיון

פרויקט זה זמין לשימוש חופשי.

## 🤝 תרומה

תרומות יתקבלו בברכה! אנא פתחו issue או pull request.
