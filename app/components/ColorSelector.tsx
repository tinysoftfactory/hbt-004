import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
    selectedColor: string;
    onColorSelect: (color: string) => void;
};

const ColorSelector: React.FC<Props> = ({ selectedColor, onColorSelect }) => {
    // 5 predefined colors for habits
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Choose Color</Text>
            <View style={styles.colorsContainer}>
                {colors.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.colorButton,
                            { backgroundColor: color },
                            selectedColor === color && styles.selectedColorButton
                        ]}
                        onPress={() => onColorSelect(color)}
                    >
                        {selectedColor === color && (
                            <Text style={styles.checkmark}>✓</Text>
                        )}
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
    colorsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    colorButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    selectedColorButton: {
        borderColor: '#333',
        transform: [{ scale: 1.1 }],
    },
    checkmark: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});

export default memo(ColorSelector);
