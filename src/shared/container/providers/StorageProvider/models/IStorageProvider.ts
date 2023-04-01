interface IStorageProvider {
  saveDataToFile(fileName: string, data: string): Promise<void>;
  getFileContents(fileName: string): Promise<string>;
  getLastFileContents(): string;
  deleteFile(fileName: string): Promise<void>;
}

export default IStorageProvider;
