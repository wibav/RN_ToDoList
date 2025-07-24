// Task Edit Screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTask } from '../context/TaskContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppStyles } from '../AppStyles';

const TaskEditScreen = ({ route }) => {
    const navigation = useNavigation();
    const { taskId } = route.params;
    const { tasks, updateTask } = useTask();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        const currentTask = tasks.find(t => t.id === taskId);
        if (currentTask) {
            setTitle(currentTask.title);
            setDescription(currentTask.description || '');
            setIsCompleted(currentTask.completed === 1);

            if (currentTask.date) {
                setDate(new Date(currentTask.date));
            }
            if (currentTask.time) {
                const [hours, minutes] = currentTask.time.split(':');
                const timeDate = new Date();
                timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                setTime(timeDate);
            }
        }
    }, [taskId, tasks]);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onTimeChange = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const formatTime = (time) => {
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Erro', 'Por favor, insira um título para a tarefa');
            return;
        }

        try {
            setLoading(true);

            const taskData = {
                title: title.trim(),
                description: description.trim(),
                date: formatDate(date),
                time: formatTime(time),
                completed: isCompleted ? 1 : 0
            };

            await updateTask(taskId, taskData);

            navigation.goBack();

        } catch (error) {
            Alert.alert('Erro', `Não foi possível atualizar a tarefa: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Título"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
                mode="outlined"
            />
            <TextInput
                label="Descrição"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                mode="outlined"
                multiline
            />

            <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.dateTimeButton}
                icon="calendar"
                contentStyle={styles.dateTimeButtonContent}
            >
                Data: {formatDate(date)}
            </Button>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={styles.dateTimeButton}
                icon="clock"
                contentStyle={styles.dateTimeButtonContent}
            >
                Horário: {formatTime(time)}
            </Button>

            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}

            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={isCompleted ? 'checked' : 'unchecked'}
                    onPress={() => setIsCompleted(!isCompleted)}
                    color={AppStyles.color.primary}
                    uncheckedColor={AppStyles.color.grey}
                />
                <Text style={styles.checkboxLabel}>
                    Marcar como concluída
                </Text>
            </View>
            <Button
                mode="contained"
                onPress={handleSave}
                loading={loading}
                disabled={loading || !title.trim()}
                style={styles.button}
            >
                Atualizar Tarefa
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: AppStyles.color.background,
    },
    input: {
        marginBottom: 12,
    },
    dateTimeButton: {
        marginBottom: 12,
        borderColor: AppStyles.color.primary,
    },
    dateTimeButtonContent: {
        paddingVertical: 8,
        justifyContent: 'flex-start',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    checkboxLabel: {
        marginLeft: 8,
        color: AppStyles.color.text,
        fontSize: 16,
    },
    button: {
        marginTop: 12,
    },
});
export default TaskEditScreen;