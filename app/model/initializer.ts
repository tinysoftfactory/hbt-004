import Database from './database';
import * as FileSystem from 'expo-file-system';
import * as Font from 'expo-font';
import StorageFactory from '@/app/model/Storage';
import { changeLanguage } from '@/app/model/i18n';

export default class Initializer {
    private static instance: Initializer;
    private db: Database;
    private initializationError: Error | null = null;

    private constructor() {
        this.db = Database.getInstance();
    }

    public static getInstance(): Initializer {
        if (!Initializer.instance) {
            Initializer.instance = new Initializer();
        }
        return Initializer.instance;
    }

    public getError(): Error | null {
        return this.initializationError;
    }

    public async initialize(): Promise<void> {
        try {
            // prepare database
            await this.ensureDatabaseExists();
            await this.db.prepare();
            const needsInitialization = await this.checkTablesExist();
            if (needsInitialization) {
                await this.initializeTables();
            }

            // prepare assets
            await this.loadFonts();
            this.loadTranslations();
        } catch (error) {
            this.initializationError = error instanceof Error ? error : new Error(String(error));
            throw this.initializationError;
        }
    }

    /**************
     * Private
     **************/
    private async checkTablesExist(): Promise<boolean> {
        const requiredTables = [
            'languages',
        ];

        try {
            const existingTables = await this.db.getList<{ name: string }>(
                `SELECT name FROM sqlite_master WHERE type='table'`
            );

            const existingTableNames = new Set(existingTables.map(t => t.name));
            const missingTables = requiredTables.filter(table => !existingTableNames.has(table));

            if (missingTables.length > 0) {
                console.log('Missing tables:', missingTables);
                return true; // Need initialization if any tables are missing
            }

            console.log('All tables exists');
            return false; // All tables exist
        } catch (error) {
            console.error('Error checking tables:', error);
            return true; // Assume we need initialization if check fails
        }
    }

    private async initializeTables(): Promise<void> {
        try {
            // Start transaction for all table creation and data insertion
            await this.db.transactionStart();

            // Create languages table
            // await this.db.execute(`
            //     CREATE TABLE IF NOT EXISTS languages (
            //         code VARCHAR NOT NULL,
            //         name VARCHAR NOT NULL,
            //         native_name VARCHAR NOT NULL,
            //         bcp47 VARCHAR NOT NULL,
            //         az VARCHAR,
            //         enabled TINYINT NOT NULL,
            //         PRIMARY KEY (code)
            //     )
            // `);

            // Commit all changes
            await this.db.transactionEnd();
        } catch (error) {
            console.error('Failed to initialize tables:', error);
            await this.db.transactionRollback();
            throw new Error('Failed to initialize database tables');
        }
    }

    private async ensureDatabaseExists(): Promise<void> {
        // Create database directory if it doesn't exist
        const dbDir = `${FileSystem.documentDirectory}db`;

        try {
            const dirInfo = await FileSystem.getInfoAsync(dbDir);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
            }
        } catch (error) {
            console.error('Failed to create database directory:', error);
            throw new Error('Failed to initialize database');
        }
    }

    private async dropAllTables() {
        try {
            await this.db.transactionStart();

            const tables = await this.db.getList<{ name: string }>(
                `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
            );

            for (const table of tables) {
                await this.db.execute(`DROP TABLE IF EXISTS ${table.name}`);
            }

            await this.db.transactionEnd();
        } catch (error) {
            console.error('Failed to drop tables:', error);
            await this.db.transactionRollback();
            throw new Error('Failed to drop database tables');
        }
    }

    private async loadFonts() {
        // await Font.loadAsync({
        //     'Baloo2-Bold': require('@/assets/fonts/Baloo2-Bold.ttf'),
        //     'Baloo2-ExtraBold': require('@/assets/fonts/Baloo2-ExtraBold.ttf'),
        //     'Baloo2-Medium': require('@/assets/fonts/Baloo2-Medium.ttf'),
        //     Baloo2: require('@/assets/fonts/Baloo2-Regular.ttf'),
        //     'Baloo2-SemiBold': require('@/assets/fonts/Baloo2-SemiBold.ttf'),
        // });
    }

    private loadTranslations() {
        // TODO:
        changeLanguage('en');
    }

    private async resetAll() {
        await this.dropAllTables();
        StorageFactory.getDefault().clearAll();
    }
}
