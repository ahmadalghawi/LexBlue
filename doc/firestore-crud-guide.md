# LexBlue — Firestore CRUD Guide 📚

This guide explains how to connect to Firestore and perform the four basic database operations: **Create, Read, Update, and Delete (CRUD)**.

---

## 1. The Connection Setup
We initialize Firebase in `src/lib/firebase.ts`. To use the database in any component, simply import the `db` instance:

```typescript
import { db } from "@/lib/firebase";
```

---

## 2. Create (Adding Data)
There are two main ways to add data:

### A. `addDoc` (Auto-generated ID)
Use this when you want Firestore to create a unique ID for you (best for Courses, Enrollments).
```typescript
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const handleCreate = async () => {
  const docRef = await addDoc(collection(db, "courses"), {
    title: "New Course",
    createdAt: serverTimestamp(), // Always use server timestamps!
  });
  console.log("Document written with ID: ", docRef.id);
};
```

### B. `setDoc` (Custom ID)
Use this when you already have an ID (best for Users, where ID = Auth UID).
```typescript
import { doc, setDoc } from "firebase/firestore";

const handleCreateUser = async (uid: string) => {
  await setDoc(doc(db, "users", uid), {
    email: "user@example.com",
    role: "student"
  });
};
```

---

## 3. Read (Fetching Data)

### A. Get a Single Document
```typescript
import { doc, getDoc } from "firebase/firestore";

const fetchOne = async (id: string) => {
  const docRef = doc(db, "courses", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
  }
};
```

### B. Get Multiple Documents (Querying)
```typescript
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

const fetchAll = async () => {
  const q = query(
    collection(db, "courses"),
    where("isPublished", "==", true), // Filter
    orderBy("createdAt", "desc")      // Sort
  );

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

---

## 4. Update (Modifying Data)
Use `updateDoc` to change specific fields without overwriting the whole document.

```typescript
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const handleUpdate = async (id: string) => {
  const docRef = doc(db, "courses", id);

  await updateDoc(docRef, {
    title: "Updated Title",
    updatedAt: serverTimestamp()
  });
};
```

---

## 5. Delete (Removing Data)
```typescript
import { doc, deleteDoc } from "firebase/firestore";

const handleDelete = async (id: string) => {
  await deleteDoc(doc(db, "courses", id));
};
```

---

## 6. Real-time Updates (Listen)
Instead of fetching once, you can "listen" for changes. The UI will update automatically when the database changes.

```typescript
import { collection, onSnapshot } from "firebase/firestore";

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCourses(list);
  });

  return () => unsubscribe(); // Cleanup listener on unmount
}, []);
```

---

## 💡 Best Practices
1. **Error Handling**: Always wrap your database calls in `try { ... } catch (e) { ... }`.
2. **Type Safety**: Use the interfaces from `src/types/index.ts` to ensure your data is correct.
   ```typescript
   const course = docSnap.data() as Course;
   ```
3. **Security**: Remember that all these calls are checked against your **Firestore Security Rules**. If a call fails with "Permission Denied", check your rules!
