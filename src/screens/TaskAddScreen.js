import React, { useState } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useTask } from '../context/TaskContext';
import { AppStyles } from '../AppStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

const TaskAddScreen = () => {
    const navigation = useNavigation();
    const { addTask } = useTask();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

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
            console.log('Salvando tarefa:', { title, description, date, time });
            setLoading(true);

            const taskData = {
                title: title.trim(),
                description: description.trim(),
                date: formatDate(date),
                time: formatTime(time)
            };

            await addTask(taskData.title, taskData.description, taskData.date, taskData.time);
            console.log('Tarefa salva com sucesso:');
            navigation.goBack();

        } catch (error) {
            Alert.alert('Erro', `Não foi possível salvar a tarefa: ${error.message}`);
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
            <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                style={styles.dateTimeButton}
                icon="clock"
                contentStyle={styles.dateTimeButtonContent}
            >
                Horário: {formatTime(time)}
            </Button>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}
            <Button
                mode="contained"
                onPress={handleSave}
                loading={loading}
                disabled={loading || !title.trim()}
                style={styles.button}
            >
                Salvar Tarefa
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
    button: {
        marginTop: 12,
    },
});

export default TaskAddScreen;
