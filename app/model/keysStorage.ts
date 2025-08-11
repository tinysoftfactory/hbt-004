import { IKeysStorage } from '@/app/types/model.types';

export default class KeysStorage implements IKeysStorage {
    private static instance: KeysStorage;

    private constructor() {}

    public static getInstance(): KeysStorage {
        if (!this.instance) {
            this.instance = new KeysStorage();
        }
        return this.instance;
    }

    public getDbKey(): string {
        return 'testkey';
    }
}
