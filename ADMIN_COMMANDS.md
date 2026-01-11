# 🔐 Admin Management Commands

## 📋 সকল User দেখার জন্য

```bash
cd Backend
node make-admin.js --list
```

অথবা

```bash
node make-admin.js -l
```

---

## 👑 User কে Admin বানানোর জন্য

### Username দিয়ে:
```bash
node make-admin.js <username>
```

**উদাহরণ:**
```bash
node make-admin.js salahuddin
node make-admin.js Sohanaa
```

### Email দিয়ে:
```bash
node make-admin.js <email>
```

**উদাহরণ:**
```bash
node make-admin.js salahuddin@example.com
node make-admin.js sohanarahaman.sr@gmail.com
```

---

## 🚀 দ্রুত ব্যবহার (Quick Start)

1. **Backend folder এ যান:**
   ```bash
   cd "f:\MVEN Project\Study Flow\Backend"
   ```

2. **সকল user list দেখুন:**
   ```bash
   node make-admin.js --list
   ```

3. **যে user কে admin বানাতে চান তার username/email ব্যবহার করুন:**
   ```bash
   node make-admin.js Sohanaa
   ```

---

## 📖 Help/Usage দেখার জন্য

```bash
node make-admin.js
```

---

## ⚠️ গুরুত্বপূর্ণ নোট:

- Script run করার আগে **Backend folder** এ থাকতে হবে
- `.env` file এ `MONGO_URI` সঠিকভাবে সেট করা থাকতে হবে
- User already admin হলে warning message দেখাবে
- Username এবং Email উভয়ই support করে

---

## 🎯 Example Workflow:

```bash
# Step 1: Backend folder এ যান
cd Backend

# Step 2: সব user দেখুন
node make-admin.js --list

# Output:
# 📋 All Users:
# 1. 👤 testuser (test@mail.com) - user
# 2. 👑 salahuddin (contact@salah.com) - admin
# 3. 👤 Sohanaa (sohanarahaman.sr@gmail.com) - user

# Step 3: Sohanaa কে admin বানান
node make-admin.js Sohanaa

# Output:
# ✅ Success! User promoted to admin:
# 👤 Username: Sohanaa
# 📧 Email: sohanarahaman.sr@gmail.com
# 🔐 Role: admin
```

---

## 🔄 API দিয়ে Admin Management (Alternative)

যদি admin login থাকে এবং API ব্যবহার করতে চান:

### Get All Users:
```
GET /api/admin/users
Authorization: Bearer {admin_token}
```

### Get All Admins:
```
GET /api/admin/admins
Authorization: Bearer {admin_token}
```

### Promote User to Admin:
```
PUT /api/admin/users/{user_id}/promote
Authorization: Bearer {admin_token}
```

### Demote Admin to User:
```
PUT /api/admin/users/{user_id}/demote
Authorization: Bearer {admin_token}
```

### Delete User:
```
DELETE /api/admin/users/{user_id}
Authorization: Bearer {admin_token}
```

**Note:** Admin user দের delete করা যাবে না। প্রথমে demote করতে হবে।

---

## 🛡️ Super Admin Feature

`.env` file এ `SUPER_ADMIN_USERNAME` set করলে শুধু সেই user role manage করতে পারবে:

```env
SUPER_ADMIN_USERNAME=salahuddin
```

এটি optional - set না করলে সব admin role manage করতে পারবে।

---

## 💡 Tips:

- প্রথম admin বানানোর জন্য `make-admin.js` script ব্যবহার করুন
- পরে admin panel থেকেও manage করা যাবে
- সর্বদা কমপক্ষে একজন admin থাকতে হবে
- Last admin কে demote করা যাবে না

---

**Created by:** Salahuddin  
**Date:** January 11, 2026  
**Project:** StudyFlow
