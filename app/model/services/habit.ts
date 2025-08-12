import Database from '@/app/model/database';
import { IHabit } from '@/app/types/model.types';

export default class HabitService {
    private static instance: HabitService;
    private db: Database;

    private constructor() {
        this.db = Database.getInstance();
    }

    public static getInstance(): HabitService {
        if (!HabitService.instance) {
            HabitService.instance = new HabitService();
        }
        return HabitService.instance;
    }

    /**
     * Add a new habit to the database
     * @param habit - Habit data to insert
     * @returns Promise<number> - ID of the newly created habit
     */
    public async addHabit(habit: Omit<IHabit, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
        try {
            // Start transaction for data consistency
            await this.db.transactionStart();

            const sql = `
                INSERT INTO habits (
                    name, 
                    description, 
                    color, 
                    icon, 
                    frequency, 
                    target_days, 
                    is_active
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const params = [
                habit.name,
                habit.description || null,
                habit.color || '#007AFF',
                habit.icon || null,
                habit.frequency || 'daily',
                habit.target_days || 1,
                habit.is_active !== undefined ? habit.is_active : true
            ];

            const result = await this.db.execute(sql, params);

            if (result.changes === 0) {
                throw new Error('Failed to insert habit: no rows affected');
            }

            // Commit transaction
            await this.db.transactionEnd();

            return result.lastInsertRowId;
        } catch (error) {
            // Rollback transaction on error
            await this.db.transactionRollback();
            console.error('Error adding habit:', error);
            throw new Error(`Failed to add habit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all active habits
     * @returns Promise<IHabit[]> - Array of active habits
     */
    public async getActiveHabits(): Promise<IHabit[]> {
        try {
            const sql = `
                SELECT 
                    id, 
                    name, 
                    description, 
                    color, 
                    icon, 
                    frequency, 
                    target_days, 
                    created_at, 
                    updated_at, 
                    is_active
                FROM habits 
                WHERE is_active = 1 
                ORDER BY created_at DESC
            `;

            return await this.db.getList<IHabit>(sql);
        } catch (error) {
            console.error('Error getting active habits:', error);
            throw new Error(`Failed to get habits: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get habit by ID
     * @param id - Habit ID
     * @returns Promise<IHabit | undefined> - Habit data or undefined if not found
     */
    public async getHabitById(id: number): Promise<IHabit | undefined> {
        try {
            const sql = `
                SELECT 
                    id, 
                    name, 
                    description, 
                    color, 
                    icon, 
                    frequency, 
                    target_days, 
                    created_at, 
                    updated_at, 
                    is_active
                FROM habits 
                WHERE id = ?
            `;

            return await this.db.getRow<IHabit>(sql, [id]);
        } catch (error) {
            console.error('Error getting habit by ID:', error);
            throw new Error(`Failed to get habit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update existing habit
     * @param id - Habit ID to update
     * @param habit - Updated habit data
     * @returns Promise<boolean> - True if update was successful
     */
    public async updateHabit(id: number, habit: Partial<Omit<IHabit, 'id' | 'created_at'>>): Promise<boolean> {
        try {
            await this.db.transactionStart();

            const updateFields: string[] = [];
            const params: any[] = [];

            // Build dynamic update query
            if (habit.name !== undefined) {
                updateFields.push('name = ?');
                params.push(habit.name);
            }
            if (habit.description !== undefined) {
                updateFields.push('description = ?');
                params.push(habit.description);
            }
            if (habit.color !== undefined) {
                updateFields.push('color = ?');
                params.push(habit.color);
            }
            if (habit.icon !== undefined) {
                updateFields.push('icon = ?');
                params.push(habit.icon);
            }
            if (habit.frequency !== undefined) {
                updateFields.push('frequency = ?');
                params.push(habit.frequency);
            }
            if (habit.target_days !== undefined) {
                updateFields.push('target_days = ?');
                params.push(habit.target_days);
            }
            if (habit.is_active !== undefined) {
                updateFields.push('is_active = ?');
                params.push(habit.is_active);
            }

            // Always update the updated_at timestamp
            updateFields.push('updated_at = CURRENT_TIMESTAMP');

            if (updateFields.length === 0) {
                await this.db.transactionEnd();
                return true; // Nothing to update
            }

            const sql = `
                UPDATE habits 
                SET ${updateFields.join(', ')} 
                WHERE id = ?
            `;

            params.push(id);

            const result = await this.db.execute(sql, params);

            await this.db.transactionEnd();

            return result.changes > 0;
        } catch (error) {
            await this.db.transactionRollback();
            console.error('Error updating habit:', error);
            throw new Error(`Failed to update habit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Soft delete habit (set is_active to false)
     * @param id - Habit ID to deactivate
     * @returns Promise<boolean> - True if deactivation was successful
     */
    public async deactivateHabit(id: number): Promise<boolean> {
        try {
            const sql = `
                UPDATE habits 
                SET is_active = 0, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            `;

            const result = await this.db.execute(sql, [id]);
            return result.changes > 0;
        } catch (error) {
            console.error('Error deactivating habit:', error);
            throw new Error(`Failed to deactivate habit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
