import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from "@react-navigation/drawer";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppStyles } from '../AppStyles';
import Header from '../components/Header';
import DrawerMenu from '../components/DrawerMenu';
import TaskListScreen from '../screens/TaskListScreen';
import TaskAddScreen from '../screens/TaskAddScreen';
import TaskEditScreen from '../screens/TaskEditScreen';
import SettingScreen from '../screens/SettingScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerTitleAlign: "center",
                headerTintColor: AppStyles.color.white,
                headerTitleStyle: {
                    fontWeight: AppStyles.fontSize.title,
                },
            }}
        >
            <Stack.Screen
                name="Home"
                component={TaskListScreen}
                options={{
                    header: () => <Header title="Lista de Tarefas" />,

                }}
            />
            <Stack.Screen
                name="TaskAdd"
                component={TaskAddScreen}
                options={{
                    header: () => <Header title="Agregar Tarefa" />,
                }}
            />
            <Stack.Screen
                name="TaskEdit"
                component={TaskEditScreen}
                options={{
                    header: () => <Header title="Editar Tarefa" />,
                }}
            />
            <Stack.Screen
                name="Settings"
                component={SettingScreen}
                options={{
                    header: () => <Header title="Configurações" />,
                }}
            />
        </Stack.Navigator>
    );
}

const AppDrawer = () => {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerMenu {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#FAFAFA',
                    width: 280,
                },
                drawerActiveTintColor: AppStyles.color.primary,
            }}
        >
            <Drawer.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    drawerLabel: 'To Do',
                    drawerIcon: ({ color, size }) => (
                        <Icon name="assignment" color={color} size={size} />
                    ),
                }}
            />
        </Drawer.Navigator>
    );
}

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <AppDrawer />
        </NavigationContainer>
    );
};

export default AppNavigator;
