import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppStyles } from '../AppStyles';

const SettingsScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <Appbar.Header style={styles.appBar}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => navigation.openDrawer()}
                    iconColor={AppStyles.color.white}
                />
                <Appbar.Content
                    title="Configuración"
                    titleStyle={styles.appBarTitle}
                />
            </Appbar.Header>

            <View style={styles.content}>
                <Text style={styles.title}>Configuración</Text>
                <Text style={styles.subtitle}>
                    Aquí puedes configurar las opciones de la aplicación
                </Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppStyles.color.background,
    },
    appBar: {
        backgroundColor: AppStyles.color.primary,
        elevation: 4,
    },
    appBarTitle: {
        color: AppStyles.color.white,
        fontSize: AppStyles.fontSize.content,
        fontWeight: '600',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: '600',
        color: AppStyles.color.title,
        marginBottom: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: AppStyles.fontSize.normal,
        color: AppStyles.color.text,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default SettingsScreen;
