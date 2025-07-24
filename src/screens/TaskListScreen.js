import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Alert,
    RefreshControl,
} from 'react-native'
import { FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { AppStyles } from '../AppStyles';
import { useTask } from '../context/TaskContext';
import TaskItem from '../components/TaskItem';
import TaskActionSheet from '../components/TaskActionSheet';


const TaskListScreen = () => {
    const navigation = useNavigation();
    const actionSheetRef = useRef(null);
    const { tasks, loading, addTask, updateTask, toggleTask, deleteTask, loadTasks } = useTask();
    const [selectedTask, setSelectedTask] = useState(null);

    const handleAddTask = () => {
        setSelectedTask(null);
        // Use navigation like test required
        navigation.navigate('TaskAdd');
        // Use ActionSheet minimalist approach
        // actionSheetRef.current?.show();
    };

    const handleEditTask = (task) => {
        setSelectedTask(task);
        // Use navigation like test required
        navigation.navigate('TaskEdit', { taskId: task.id });
        // Use ActionSheet minimalist approach
        // actionSheetRef.current?.show();
    };

    const handleSaveTask = async (taskData) => {
        if (selectedTask) {
            await updateTask(selectedTask.id, taskData);
            setSelectedTask(null);
        } else {
            await addTask(taskData.title, taskData.description, taskData.date, taskData.time);
            setSelectedTask(null);
        }
    };

    const handleDeleteTask = (taskId) => {
        Alert.alert(
            'Excluir Tarefa',
            'Tem certeza de que deseja excluir esta tarefa?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => deleteTask(taskId),
                },
            ]
        );
    };

    const handleToggleTask = (taskId) => {
        toggleTask(taskId);
    };

    const renderTaskItem = ({ item }) => (
        <TaskItem
            task={item}
            onToggle={handleToggleTask}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Nenhuma tarefa</Text>
            <Text style={styles.emptySubtitle}>
                Crie uma nova tarefa
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={tasks}
                renderItem={renderTaskItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.list}
                contentContainerStyle={styles.emptyList}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={loadTasks}
                        colors={[AppStyles.color.primary]}
                        tintColor={AppStyles.color.primary}
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={handleAddTask}
                color={AppStyles.color.white}
            />

            <TaskActionSheet
                ref={actionSheetRef}
                task={selectedTask}
                onSave={handleSaveTask}
                onCancel={() => setSelectedTask(null)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppStyles.color.background,
    },
    list: {
        flex: 1,
    },
    emptyList: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: AppStyles.fontSize.content,
        fontWeight: '600',
        color: AppStyles.color.title,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: AppStyles.fontSize.normal,
        color: AppStyles.color.text,
        textAlign: 'center',
        lineHeight: 20,
    },
    fab: {
        position: 'absolute',
        right: AppStyles.size.width * 0.1,
        bottom: AppStyles.size.width * 0.1,
        backgroundColor: AppStyles.color.red,
        borderRadius: AppStyles.borderRadius.main,
    },
});

export default TaskListScreen;
