class LargeDataStore {
  constructor(dbName = 'HeadlessStorageDB', storeName = 'large_records') {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  // Opens database connection and auto-creates the object store
  async init() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Save large payload (ArrayBuffer, Blob, or Object)
  async set(key, value) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      store.put(value, key);

      // Wait for the full transaction to commit to disk
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(new Error('Transaction aborted'));
    });
  }

  // Retrieve data by key
  async get(key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete entry by key
  async delete(key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.delete(key);

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  }
}

// --- Usage Example ---
(async () => {
  const store = new LargeDataStore();

  // Create a 50MB dummy binary payload
  const largeArrayBuffer = new Uint8Array(50 * 1024 * 1024).buffer;

  // Store data
  console.time('IDB Save');
  await store.set('dataset_v1', largeArrayBuffer);
  console.timeEnd('IDB Save');

  // Read data
  console.time('IDB Fetch');
  const retrievedData = await store.get('dataset_v1');
  console.timeEnd('IDB Fetch');

  console.log(`Retrieved byte size: ${retrievedData.byteLength} bytes`);
})();
