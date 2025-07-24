// Setting screen
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppStyles } from '../AppStyles';

const SettingScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppStyles.color.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: 'bold',
        color: AppStyles.color.title,
    },
});

export default SettingScreen;