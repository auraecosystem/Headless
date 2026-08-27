class OPFSStore {
  // Get reference to the OPFS root directory
  async getRoot() {
    return await navigator.storage.getDirectory();
  }

  // Write large binary or text datasets to OPFS asynchronously
  async saveFile(fileName, data) {
    const root = await this.getRoot();
    
    // Obtain or create the file handle
    const fileHandle = await root.getFileHandle(fileName, { create: true });
    
    // Create an asynchronous writable stream
    const writable = await fileHandle.createWritable();
    
    // Stream data directly to disk (accepts ArrayBuffer, TypedArray, Blob, or String)
    await writable.write(data);
    
    // Close and flush write operations to disk
    await writable.close();
  }

  // Retrieve dataset from OPFS as an ArrayBuffer
  async readFileAsArrayBuffer(fileName) {
    const root = await this.getRoot();
    const fileHandle = await root.getFileHandle(fileName);
    
    // Retrieve standard HTML5 File object
    const file = await fileHandle.getFile();
    
    // Load buffer into memory
    return await file.arrayBuffer();
  }

  // Stream data out of OPFS to avoid memory spikes on massive files
  async getReadStream(fileName) {
    const root = await this.getRoot();
    const fileHandle = await root.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return file.stream();
  }

  // Delete file from OPFS
  async deleteFile(fileName) {
    const root = await this.getRoot();
    await root.removeEntry(fileName);
  }
}

// --- Usage Example ---
(async () => {
  const opfs = new OPFSStore();
  const fileName = 'large_model_weights.bin';

  // Generate a 100MB dummy payload
  const hundredMBBuffer = new Uint8Array(100 * 1024 * 1024).buffer;

  // Store file
  console.time('OPFS Write');
  await opfs.saveFile(fileName, hundredMBBuffer);
  console.timeEnd('OPFS Write');

  // Read file back into memory
  console.time('OPFS Read');
  const buffer = await opfs.readFileAsArrayBuffer(fileName);
  console.timeEnd('OPFS Read');

  console.log(`Successfully stored & read ${buffer.byteLength} bytes.`);
})();
