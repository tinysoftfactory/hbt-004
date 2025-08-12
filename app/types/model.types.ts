export interface IKeysStorage {
    getDbKey(): string;
}

// Habit tracker types
export interface IHabit {
    id?: number;
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    frequency?: 'daily' | 'weekly' | 'monthly';
    target_days?: number;
    created_at?: string;
    updated_at?: string;
    is_active?: boolean;
}

export interface IHabitLog {
    id?: number;
    habit_id: number;
    completed_date: string;
    notes?: string;
    created_at?: string;
}
