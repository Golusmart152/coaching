// --- DATA MANAGEMENT CORE ---
// This object abstracts the data layer, allowing us to switch between localStorage and Firestore.
const dataService = {
    mode: 'offline', // Default mode
    db: null,
    auth: null,
    userId: null,

    setMode: function(newMode, db, auth, userId) {
        this.mode = newMode;
        this.db = db;
        this.auth = auth;
        this.userId = userId;
    },

    // --- Generic CRUD Operations ---
    getCollection: async function(collectionName) {
        if (this.mode === 'cloud') {
            const q = this.auth.currentUser ? query(collection(this.db, `artifacts/__app_id__/users/${this.auth.currentUser.uid}/${collectionName}`)) : null;
            if (!q) return [];
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            return JSON.parse(localStorage.getItem(collectionName)) || [];
        }
    },

    saveToCollection: async function(collectionName, data) {
        if (this.mode === 'cloud') {
            const user = this.auth.currentUser;
            if (user) {
                const docRef = doc(collection(this.db, `artifacts/__app_id__/users/${user.uid}/${collectionName}`));
                await setDoc(docRef, data);
                return { id: docRef.id, ...data };
            } else {
                return null;
            }
        } else {
            const currentData = JSON.parse(localStorage.getItem(collectionName)) || [];
            const newData = { ...data, id: crypto.randomUUID() };
            localStorage.setItem(collectionName, JSON.stringify([...currentData, newData]));
            return newData;
        }
    },

    updateDocument: async function(collectionName, id, data) {
        if (this.mode === 'cloud') {
            const docRef = doc(this.db, `artifacts/__app_id__/users/${this.auth.currentUser.uid}/${collectionName}`, id);
            await updateDoc(docRef, data);
            return true;
        } else {
            const currentData = JSON.parse(localStorage.getItem(collectionName)) || [];
            const updatedData = currentData.map(item => item.id === id ? { ...item, ...data } : item);
            localStorage.setItem(collectionName, JSON.stringify(updatedData));
            return true;
        }
    },

    deleteDocument: async function(collectionName, id) {
        if (this.mode === 'cloud') {
            const docRef = doc(this.db, `artifacts/__app_id__/users/${this.auth.currentUser.uid}/${collectionName}`, id);
            await deleteDoc(docRef);
            return true;
        } else {
            const currentData = JSON.parse(localStorage.getItem(collectionName)) || [];
            const updatedData = currentData.filter(item => item.id !== id);
            localStorage.setItem(collectionName, JSON.stringify(updatedData));
            return true;
        }
    }
};
