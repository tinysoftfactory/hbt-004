import { open, IOS_LIBRARY_PATH, ANDROID_DATABASE_PATH } from '@op-engineering/op-sqlite';
import { Platform } from 'react-native';
import KeysStorage from '@/app/model/keysStorage';

type DatabaseExecutionParameterType = any[];
type DatabaseExecutionResult = {
    changes: number;
    lastInsertRowId: number;
};

class Database {
    private static instance?: Database;

    public static getInstance(): Database {
        if (!this.instance) {
            this.instance = new Database(`habity.db`);
        }
        return this.instance;
    }

    private db?: any;
    private startedTransactionsCount = 0;
    private isClosed = false;

    constructor(public readonly pathToFile: string) {}

    /**************
     * Public
     **************/
    public async prepare() {
        if (!this.db) {
            await this.init();
        }
    }

    /**************
     * IDatabase
     **************/
    public async close() {
        try {
            if (!this.db || this.isClosed) {
                return;
            }

            this.isClosed = true;

            if (this.startedTransactionsCount > 0) {
                try {
                    await this.db.executeAsync('COMMIT;');
                    this.startedTransactionsCount = 0;
                } catch (error) {
                    await this.db.executeAsync('ROLLBACK;');
                }
            }

            await this.db.closeAsync();
            this.db = undefined;
        } catch (error) {
            this.onError(error);
            throw error;
        }
    }

    public async execute(
        sql: string,
        params?: DatabaseExecutionParameterType
    ): Promise<DatabaseExecutionResult> {
        if (this.isClosed) {
            return {
                changes: 0,
                lastInsertRowId: 0,
            };
        }

        try {
            await this.prepare();
            const result = await this.db?.executeAsync(sql, params ?? []);

            return {
                changes: result?.rowsAffected ?? 0,
                lastInsertRowId: result?.insertId ?? 0,
            };
        } catch (e) {
            this.onError(e);

            return {
                changes: 0,
                lastInsertRowId: 0,
            };
        }
    }

    public async getColumn<T>(sql: string, params?: DatabaseExecutionParameterType): Promise<T[]> {
        if (this.isClosed) {
            return [];
        }

        await this.prepare();
        const data = await this.getList<object>(sql, params);
        if (!data || data.length === 0) {
            return [];
        }

        return data.map(item => Object.values(item)[0]);
    }

    public getFullPathToFile(): string | undefined {
        return `${Platform.OS === 'ios' ? IOS_LIBRARY_PATH : ANDROID_DATABASE_PATH}/${this.pathToFile}`;
    }

    public async getList<T>(sql: string, params?: DatabaseExecutionParameterType): Promise<T[]> {
        if (this.isClosed) {
            return [];
        }

        try {
            await this.prepare();

            const result = await this.db?.executeAsync(sql, params ?? []);

            if (!result?.rawRows || !result?.columnNames) {
                return [];
            }

            return result.rawRows.map((row: any[]) => {
                const obj: any = {};
                result.columnNames.forEach((column: string, index: number) => {
                    obj[column] = row[index];
                });
                return obj as T;
            });
        } catch (e) {
            this.onError(e);
            return [];
        }
    }

    public async getRow<T>(
        sql: string,
        params?: DatabaseExecutionParameterType
    ): Promise<T | undefined> {
        if (this.isClosed) {
            return undefined;
        }

        try {
            await this.prepare();

            const result = await this.db?.executeAsync(sql, params ?? []);
            if (!result?.rawRows || result.rawRows.length === 0) {
                return undefined;
            }

            const obj: any = {};
            result.columnNames.forEach((column: string, index: number) => {
                obj[column] = result.rawRows[0][index];
            });
            return obj as T;
        } catch (e) {
            this.onError(e);
            return undefined;
        }
    }

    public async getValue<T>(
        sql: string,
        params?: DatabaseExecutionParameterType
    ): Promise<T | undefined> {
        if (this.isClosed) {
            return undefined;
        }

        try {
            await this.prepare();

            const result = await this.db?.executeAsync(sql, params ?? []);
            if (!result?.rawRows || result.rawRows.length === 0) {
                return undefined;
            }

            return result.rawRows[0][0] as T;
        } catch (e) {
            this.onError(e);
            return undefined;
        }
    }

    /**
     * If transaction was started before, we should commit the results to save them
     * into the permanent database storage
     */
    public async transactionEnd() {
        if (this.isClosed) {
            return;
        }

        if (--this.startedTransactionsCount > 0) {
            return;
        }

        await this.db?.executeAsync('COMMIT;');
    }

    /**
     * If something went wrong - rollback transaction
     */
    public async transactionRollback() {
        if (this.isClosed) {
            return;
        }

        this.startedTransactionsCount--;
        await this.db?.executeAsync('ROLLBACK;');
    }

    /**
     * If inserting data is too big, we should add a special command that
     * will proceed inserting faster and safer
     */
    public async transactionStart() {
        if (this.isClosed) {
            return;
        }

        this.ensureTransaction();

        if (this.startedTransactionsCount++ > 0) {
            return;
        }

        await this.db?.executeAsync('BEGIN TRANSACTION;');
    }

    /**************
     * Private
     **************/
    private ensureTransaction() {
        if (this.startedTransactionsCount < 0) {
            this.startedTransactionsCount = 0;
        }
    }

    private async init() {
        try {
            const encryptionKey = KeysStorage.getInstance().getDbKey();
            const lastSlashIndex = this.getFullPathToFile()?.lastIndexOf('/');
            const directory =
                lastSlashIndex !== -1 ? this.getFullPathToFile()?.substring(0, lastSlashIndex) : '';

            this.db = open({
                name: this.pathToFile,
                location: directory,
                encryptionKey: encryptionKey,
            });

            // Enable memory mapping for better performance
            await this.db.executeAsync('PRAGMA mmap_size=268435456');
        } catch (error) {
            console.error('Failed to open database:', error);
            throw new Error('Failed to initialize database');
        }
    }

    private onError(error: any) {
        console.error(`SQL Error: ${error}`);
        throw error;
    }
}

export default Database;
