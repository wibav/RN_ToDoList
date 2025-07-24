import React, { useState, useEffect, forwardRef } from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import ActionSheet from 'react-native-actions-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppStyles } from '../AppStyles';

const TaskActionSheet = forwardRef(({
    task = null,
    onSave,
    onCancel
}, ref) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setIsCompleted(task.completed || false);
            // Si la tarea tiene fecha/hora, convertir de string a Date
            if (task.date) {
                setDate(new Date(task.date));
            }
            if (task.time) {
                // Convertir string de tiempo a Date
                const [hours, minutes] = task.time.split(':');
                const timeDate = new Date();
                timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                setTime(timeDate);
            }
        } else {
            setTitle('');
            setDescription('');
            setDate(new Date());
            setTime(new Date());
        }
    }, [task]);

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
            };

            // Si es una edición, incluir el estado de completado
            if (task) {
                taskData.completed = isCompleted ? 1 : 0;
            }

            await onSave(taskData);

            // Limpiar campos
            setTitle('');
            setDescription('');
            setDate(new Date());
            setTime(new Date());
            setShowDatePicker(false);
            setShowTimePicker(false);
            // Cerrar ActionSheet
            ref.current?.hide();
        } catch (_error) {
            Alert.alert('Erro', 'Não foi possível salvar a tarefa');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        setDate(new Date());
        setTime(new Date());
        setShowDatePicker(false);
        setShowTimePicker(false);
        ref.current?.hide();
        onCancel?.();
    };

    return (
        <ActionSheet
            ref={ref}
            containerStyle={styles.actionSheetContainer}
            gestureEnabled={true}
            headerAlwaysVisible={true}
            CustomHeaderComponent={
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {task ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </Text>
                </View>
            }
        >
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Título da tarefa"
                        value={title}
                        onChangeText={setTitle}
                        mode="outlined"
                        style={styles.input}
                        theme={{
                            colors: {
                                primary: AppStyles.color.primary,
                            },
                        }}
                        maxLength={100}
                    />

                    <TextInput
                        label="Descrição (opcional)"
                        value={description}
                        onChangeText={setDescription}
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        style={[styles.input, styles.descriptionInput]}
                        theme={{
                            colors: {
                                primary: AppStyles.color.primary,
                            },
                        }}
                        maxLength={500}
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
                    {task ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Checkbox
                                status={isCompleted ? 'checked' : 'unchecked'}
                                onPress={() => setIsCompleted(!isCompleted)}
                                color={AppStyles.color.primary}
                                uncheckedColor={AppStyles.color.grey}
                                style={{ marginTop: 16 }}
                            />
                            <Text style={{ color: AppStyles.color.grey }}>
                                Concluída?
                            </Text>
                        </View>

                    ) : null}

                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        onPress={handleCancel}
                        style={[styles.button, styles.cancelButton]}
                        labelStyle={styles.cancelButtonText}
                    >
                        Cancelar
                    </Button>

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        style={[styles.button, styles.saveButton]}
                        labelStyle={styles.saveButtonText}
                        loading={loading}
                        disabled={loading}
                    >
                        {task ? 'Atualizar' : 'Salvar'}
                    </Button>
                </View>
            </View>
        </ActionSheet>
    );
});

const styles = StyleSheet.create({
    actionSheetContainer: {
        backgroundColor: AppStyles.color.background,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    header: {
        backgroundColor: AppStyles.color.primary,
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerTitle: {
        fontSize: AppStyles.fontSize.content,
        fontWeight: '600',
        color: AppStyles.color.white,
        textAlign: 'center',
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 16,
        backgroundColor: AppStyles.color.white,
    },
    descriptionInput: {
        minHeight: 80,
    },
    dateTimeButton: {
        marginBottom: 16,
        borderColor: AppStyles.color.primary,
    },
    dateTimeButtonContent: {
        paddingVertical: 8,
        justifyContent: 'flex-start',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 4,
    },
    cancelButton: {
        borderColor: AppStyles.color.grey,
    },
    cancelButtonText: {
        color: AppStyles.color.grey,
    },
    saveButton: {
        backgroundColor: AppStyles.color.primary,
    },
    saveButtonText: {
        color: AppStyles.color.white,
    },
    checkText: {
        fontSize: AppStyles.fontSize.normal,
        color: AppStyles.color.grey,
        marginLeft: 8,
    },
});

TaskActionSheet.displayName = 'TaskActionSheet';

export default TaskActionSheet;
