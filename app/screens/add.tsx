import ColorSelector from '@/app/components/ColorSelector';
import IconSelector from '@/app/components/IconSelector';
import HabitService from '@/app/model/services/habit';
import React, { memo, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

type Props = {
    onBack: () => void;
};

const AddHabit: React.FC<Props> = ({ onBack }) => {
    const { styles } = useStyles(stylesheet);
    
    // Form state
    const [habitName, setHabitName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('🏃‍♂️');
    const [selectedColor, setSelectedColor] = useState('#FF6B6B');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!habitName.trim()) {
            Alert.alert('Error', 'Please enter a habit name');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const habitService = HabitService.getInstance();
            
            const newHabit = {
                name: habitName.trim(),
                icon: selectedIcon,
                color: selectedColor,
                frequency: 'daily' as const,
                target_days: 1,
                is_active: true
            };
            
            const habitId = await habitService.addHabit(newHabit);
            
            console.log('Habit created successfully with ID:', habitId);
            
            Alert.alert('Success', 'Habit created successfully!', [
                { text: 'OK', onPress: onBack }
            ]);
        } catch (error) {
            console.error('Error creating habit:', error);
            Alert.alert('Error', `Failed to create habit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    /**************
     * Render
     **************/
    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Habit</Text>
            </View>
            
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Habit name input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Habit Name</Text>
                    <TextInput
                        style={styles.textInput}
                        value={habitName}
                        onChangeText={setHabitName}
                        placeholder="Enter habit name..."
                        placeholderTextColor="#999"
                        maxLength={50}
                        editable={!isLoading}
                    />
                </View>

                {/* Icon selector */}
                <IconSelector
                    selectedIcon={selectedIcon}
                    onIconSelect={setSelectedIcon}
                />

                {/* Color selector */}
                <ColorSelector
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                />

                {/* Preview section */}
                <View style={styles.previewContainer}>
                    <Text style={styles.previewLabel}>Preview</Text>
                    <View style={styles.previewItem}>
                        <Text style={styles.previewIcon}>{selectedIcon}</Text>
                        <Text style={[styles.previewText, { color: selectedColor }]}>
                            {habitName || 'Your habit name'}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Save button */}
            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[
                        styles.saveButton, 
                        (!habitName.trim() || isLoading) && styles.saveButtonDisabled
                    ]} 
                    onPress={handleSave}
                    disabled={!habitName.trim() || isLoading}
                >
                    <Text style={styles.saveButtonText}>
                        {isLoading ? 'Creating...' : 'Create Habit'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

/**************
 * Styles
 **************/
const stylesheet = createStyleSheet((theme) => ({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    backButtonText: {
        fontSize: 18,
        color: '#333',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        backgroundColor: '#F8F9FA',
    },
    previewContainer: {
        marginBottom: 24,
        padding: 16,
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
    },
    previewLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    previewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    previewIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    previewText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 30,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    saveButton: {
        backgroundColor: '#007AFF',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        backgroundColor: '#C7C7CC',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
}));

export default memo(AddHabit);
