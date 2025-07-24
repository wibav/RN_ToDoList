import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { AppStyles } from '../AppStyles';

const DrawerMenu = (props) => {
    const handleNavigation = (routeName) => {
        props.navigation.navigate(routeName);
        props.navigation.closeDrawer();
    };

    const handleLogout = () => {
        props.navigation.closeDrawer();
    };

    return (
        <View style={styles.container}>
            {/* Header con gradiente */}
            <LinearGradient
                colors={['#FF6B6B', '#4ECDC4', '#45B7D1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/60/333/fff?text=U' }}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.email}>dasilvacristian11@gmail.com</Text>
                </View>
            </LinearGradient>

            {/* Menu Items */}
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.menuSection}>
                    <DrawerItem
                        label="To Do"
                        onPress={() => handleNavigation('Home')}
                        labelStyle={[styles.menuItemLabel, styles.activeMenuLabel]}
                        style={styles.menuItem}
                        icon={({ color, size }) => (
                            <Icon name="assignment" color="#FF6B6B" size={24} />
                        )}
                    />

                    <DrawerItem
                        label="Configurações"
                        onPress={() => handleNavigation('Settings')}
                        labelStyle={styles.menuItemLabel}
                        style={styles.menuItem}
                        icon={({ color, size }) => (
                            <Icon name="settings" color="#666" size={24} />
                        )}
                    />

                    <DrawerItem
                        label="Sair"
                        onPress={handleLogout}
                        labelStyle={styles.menuItemLabel}
                        style={styles.menuItem}
                        icon={({ color, size }) => (
                            <Icon name="exit-to-app" color="#666" size={24} />
                        )}
                    />
                </View>
            </DrawerContentScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        width: AppStyles.size.width * 0.7,
        height: 200,
        justifyContent: 'flex-end',
        paddingBottom: AppStyles.size.height * 0.01,
    },
    profileSection: {
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: AppStyles.size.height * 0.01,
    },
    avatar: {
        width: AppStyles.size.width * 0.15,
        height: AppStyles.size.width * 0.15,
        borderRadius: AppStyles.size.width * 0.075,
        borderWidth: AppStyles.size.width * 0.0075,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    email: {
        color: AppStyles.color.white,
        fontSize: AppStyles.fontSize.normal,
        fontWeight: '500',
        textAlign: 'center',
    },
    scrollViewContent: {
        paddingTop: 0,
    },
    menuSection: {
        paddingTop: AppStyles.size.height * 0.02,
    },
    menuItem: {
        marginHorizontal: AppStyles.size.width * 0.02,
        marginVertical: AppStyles.size.height * 0.002,
        borderRadius: AppStyles.borderRadius.main,
    },
    menuItemLabel: {
        fontSize: AppStyles.fontSize.content,
        color: '#333',
        fontWeight: '500',
        marginLeft: AppStyles.size.width * -0.02,
    },
    activeMenuLabel: {
        color: '#FF6B6B',
        fontWeight: '600',
    },
});

export default DrawerMenu;
