import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    selectedIcon: string;
    onIconSelect: (icon: string) => void;
};

const IconSelector: React.FC<Props> = ({ selectedIcon, onIconSelect }) => {
    // 5 predefined icons for habits
    const icons = ['🏃‍♂️', '💧', '📚', '🧘‍♀️', '🥗'];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Choose Icon</Text>
            <View style={styles.iconsContainer}>
                {icons.map((icon, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.iconButton,
                            selectedIcon === icon && styles.selectedIconButton
                        ]}
                        onPress={() => onIconSelect(icon)}
                    >
                        <Text style={styles.iconText}>{icon}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    iconButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedIconButton: {
        borderColor: '#007AFF',
        backgroundColor: '#E3F2FD',
    },
    iconText: {
        fontSize: 24,
    },
});

export default memo(IconSelector);
