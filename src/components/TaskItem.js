import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Checkbox, IconButton } from 'react-native-paper';
import { AppStyles } from '../AppStyles';
import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        return moment(dateString).format('dddd, MMM DD, YYYY');
    };



    return (
        <View style={styles.container}>
            <View style={styles.checkboxContainer}>
                <Checkbox
                    status={task.completed ? 'checked' : 'unchecked'}
                    onPress={() => onToggle(task.id)}
                    color={AppStyles.color.primary}
                    uncheckedColor={AppStyles.color.grey}
                />
            </View>

            <Pressable
                style={styles.contentContainer}
                onPress={() => onEdit(task)}
                activeOpacity={0.7}
            >
                <View style={styles.textContainer}>
                    <Text
                        style={[
                            styles.title,
                            task.completed && styles.completedTitle
                        ]}
                        numberOfLines={1}
                    >
                        {task.title}
                    </Text>

                    {task.description ? (
                        <Text
                            style={[
                                styles.description,
                                task.completed && styles.completedDescription
                            ]}
                            numberOfLines={2}
                        >
                            {task.description}
                        </Text>
                    ) : null}

                    <Text style={styles.date}>
                        {formatDate(task.created_at)}
                    </Text>
                </View>
            </Pressable>

            <View style={styles.actionContainer}>
                <IconButton
                    icon="delete"
                    size={20}
                    iconColor={AppStyles.color.grey}
                    onPress={() => onDelete(task.id)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: AppStyles.color.white,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 4,
        marginHorizontal: 16,
        borderRadius: AppStyles.borderRadius.small,
        elevation: 2,
        shadowColor: AppStyles.color.black,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    checkboxContainer: {
        marginRight: 12,
    },
    contentContainer: {
        flex: 1,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: AppStyles.fontSize.normal,
        fontWeight: '600',
        color: AppStyles.color.title,
        marginBottom: 4,
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: AppStyles.color.grey,
    },
    description: {
        fontSize: AppStyles.fontSize.normal * 0.85,
        color: AppStyles.color.text,
        marginBottom: 4,
        lineHeight: 18,
    },
    completedDescription: {
        textDecorationLine: 'line-through',
        color: AppStyles.color.grey,
    },
    date: {
        fontSize: AppStyles.fontSize.normal * 0.75,
        color: AppStyles.color.description,
    },
    actionContainer: {
        marginLeft: 8,
    },
});

export default TaskItem;
