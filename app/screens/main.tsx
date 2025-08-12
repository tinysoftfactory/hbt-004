import HabitService from '@/app/model/services/habit';
import { IHabit } from '@/app/types/model.types';
import React, { memo, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
    onAdd: () => void;
};

const MainScreen: React.FC<Props> = ({ onAdd }) => {
    const { styles } = useStyles(stylesheet);
    
    // State for habits and loading
    const [habits, setHabits] = useState<IHabit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Load habits on component mount
    useEffect(() => {
        loadHabits();
    }, []);

    // Load habits from database
    const loadHabits = async () => {
        setIsLoading(true);
        try {
            const habitService = HabitService.getInstance();
            const activeHabits = await habitService.getActiveHabits();
            setHabits(activeHabits);
        } catch (error) {
            console.error('Error loading habits:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle pull to refresh
    const onRefresh = async () => {
        setRefreshing(true);
        await loadHabits();
        setRefreshing(false);
    };

    // Render individual habit item
    const renderHabitItem = (habit: IHabit) => (
        <View key={habit.id} style={styles.habitItem}>
            <View style={styles.habitIconContainer}>
                <Text style={styles.habitIcon}>{habit.icon || '📝'}</Text>
            </View>
            <View style={styles.habitInfo}>
                <Text style={styles.habitName}>{habit.name}</Text>
                {habit.description && (
                    <Text style={styles.habitDescription}>{habit.description}</Text>
                )}
                <View style={styles.habitMeta}>
                    <Text style={styles.habitFrequency}>{habit.frequency}</Text>
                    <Text style={styles.habitTarget}>Target: {habit.target_days} days</Text>
                </View>
            </View>
            <View style={[styles.habitColorIndicator, { backgroundColor: habit.color || '#007AFF' }]} />
        </View>
    );

    /**************
     * Render
     **************/
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Habits</Text>
                <Text style={styles.headerSubtitle}>Track your daily progress</Text>
            </View>
            
            {/* Habits list */}
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading habits...</Text>
                    </View>
                ) : habits.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>📝</Text>
                        <Text style={styles.emptyTitle}>No habits yet</Text>
                        <Text style={styles.emptySubtitle}>Create your first habit to get started</Text>
                    </View>
                ) : (
                    <View style={styles.habitsList}>
                        {habits.map(renderHabitItem)}
                    </View>
                )}
            </ScrollView>
            
            {/* Add button positioned absolutely in top right corner */}
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

/**************
 * Styles
 **************/
const stylesheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#F8F9FA',
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    habitsList: {
        paddingBottom: 20,
    },
    habitItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    habitIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    habitIcon: {
        fontSize: 24,
    },
    habitInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    habitName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    habitDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    habitMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    habitFrequency: {
        fontSize: 12,
        color: '#007AFF',
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        marginRight: 8,
        textTransform: 'capitalize',
    },
    habitTarget: {
        fontSize: 12,
        color: '#666',
    },
    habitColorIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        alignSelf: 'center',
    },
    addButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1000,
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
}));

export default memo(MainScreen);
