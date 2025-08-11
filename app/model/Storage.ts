import { MMKV } from 'react-native-mmkv';

export class Storage {
    private static instance: Storage;
    private storage: MMKV;

    private constructor() {
        this.storage = new MMKV();
    }

    public static getInstance(): Storage {
        if (!Storage.instance) {
            Storage.instance = new Storage();
        }
        return Storage.instance;
    }

    public set<T>(key: string, value: T): void {
        if (value === undefined) {
            this.storage.delete(key);
            return;
        }
        this.storage.set(key, JSON.stringify(value));
    }

    public get<T>(key: string, defaultValue?: T): T | undefined {
        const value = this.storage.getString(key);
        if (value === undefined) {
            return defaultValue;
        }
        try {
            return JSON.parse(value) as T;
        } catch {
            return defaultValue;
        }
    }

    public delete(key: string): void {
        this.storage.delete(key);
    }

    public clearAll(): void {
        this.storage.clearAll();
    }

    public getAllKeys(): string[] {
        return this.storage.getAllKeys();
    }
}

export default class StorageFactory {
    public static getDefault() {
        return Storage.getInstance();
    }
}
