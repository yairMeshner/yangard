# yangard
הנה רשימה של כמה הקבצים החשובים המרכזיים בפרויקט, רוב השאר לא משמעותיים:
keyspy/src/keyspy_client.py — keystroke capture client

api/src/server.py — backend: auth, data storage, AI report generation

admin/src/src/App.jsx — frontend router and structure

admin/src/src/pages/ReportsPage.jsx — main dashboard with AI report cards

admin/src/src/api/client.js — all API calls from the frontend

אלה הקבצים שאני ממליץ בשביל להבין את הפרויקט כרגע. טיפה קונטקסט:
חסרים כמה דברים בפרויקט כרגע, ביניהם התקשורת עם הllm שכרגע לא עובדת לי, הטמעת הuuid במערכת בצורה שהיא לא hardcoded (ניתן לראות בkeyspy שיש משתנה שמחזיק uuid קבוע, ואיתו מתקשר עם הserver)
אני משתמש בpostgrsql, בdb 3 טבלאות:
משתמשים - הורים שנרשמים למערכת
טבלת הקשות (מכילה רשימות, אחת לשורה, שנשלחות לטבלה כל דקה. בכל אחת מהרשימות יש אובייקטים שמייצגים key event,את ההקשות של הילד - האובייקט מכיל זמן הלחיצה, האות שנלחצה, ובאיזו אפליקציה זה קרה)
טבלת ילדים - ההורים רושמים מידע על הילד שלהם במערכת, וזה נכנס לטבלה הזו.

