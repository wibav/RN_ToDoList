import React, { createContext, useContext, useReducer, useEffect } from 'react';
import SQLite from 'react-native-sqlite-storage';

const TaskContext = createContext();

// Task reducer to manage state
const taskReducer = (state, action) => {
    switch (action.type) {
        case 'SET_TASKS':
            return { ...state, tasks: action.payload };
        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };
        case 'UPDATE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload.id ? action.payload : task
                )
            };
        case 'DELETE_TASK':
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload)
            };
        case 'TOGGLE_TASK':
            return {
                ...state,
                tasks: state.tasks.map(task =>
                    task.id === action.payload
                        ? { ...task, completed: !task.completed }
                        : task
                )
            };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
};

const initialState = {
    tasks: [],
    loading: false,
};

export const TaskProvider = ({ children }) => {
    const [state, dispatch] = useReducer(taskReducer, initialState);

    useEffect(() => {
        initializeDatabase();
        loadTasks();
    }, []);

    // Initialize the SQLite database
    const initializeDatabase = async () => {
        const db = await SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    description TEXT,
                    date TEXT,
                    time TEXT,
                    completed INTEGER DEFAULT 0,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );`,
                [],
                () => { },
                error => console.error('Error creating table:', error)
            );
        });
    };

    // Load tasks from the database
    const loadTasks = async () => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const db = await SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
            db.transaction(tx => {
                tx.executeSql(
                    'SELECT * FROM tasks ORDER BY created_at DESC',
                    [],
                    (tx, results) => {
                        const tasksArray = [];
                        for (let i = 0; i < results.rows.length; i++) {
                            tasksArray.push(results.rows.item(i));
                        }
                        dispatch({ type: 'SET_TASKS', payload: tasksArray });
                    },
                    error => console.error('Error loading tasks:', error)
                );
            });
        } catch (error) {
            console.error("Error in loadTasks function:", error);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    // Add task
    const addTask = async (title, description = '', date = null, time = null) => {
        try {
            const db = await SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
            const now = new Date().toISOString();
            console.log('Adding task:', { title, description, date, time });

            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(
                        `INSERT INTO tasks (title, description, date, time, completed, created_at, updated_at) VALUES (?, ?, ?, ?, 0, ?, ?)`,
                        [title, description || '', date, time, now, now],
                        (tx, results) => {
                            const newTaskId = results.insertId;
                            console.log('New task ID:', newTaskId);
                            const newTask = {
                                id: newTaskId,
                                title,
                                description: description || '',
                                date: date || null,
                                time: time || null,
                                completed: 0,
                                created_at: now,
                                updated_at: now,
                            };
                            dispatch({ type: 'ADD_TASK', payload: newTask });
                            resolve(newTask);
                        },
                        error => {
                            console.error("Error adding task to DB:", error);
                            reject(error);
                        }
                    );
                });
            });
        } catch (error) {
            console.error("Error in addTask function:", error);
            return Promise.reject(error);
        }
    };

    // Update task
    const updateTask = async (id, updates) => {
        const db = await SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
        const currentTimestamp = new Date().toISOString();
        const completedValue = updates.completed !== undefined ? updates.completed : 0;

        db.transaction(tx => {
            tx.executeSql(
                `UPDATE tasks SET title = ?, description = ?, date = ?, time = ?, completed = ?, updated_at = ? WHERE id = ?`,
                [updates.title, updates.description || '', updates.date, updates.time, completedValue, currentTimestamp, id],
                () => {
                    const updatedTask = { ...updates, id, updated_at: currentTimestamp };
                    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
                },
                error => console.error('Error updating task:', error)
            );
        });
    };

    // Toggle task completion
    const toggleTask = async (id) => {
        const task = state.tasks.find(t => t.id === id);
        if (!task) return;

        const newCompleted = task.completed ? 0 : 1;
        const currentTimestamp = new Date().toISOString();
        const db = await SQLite.openDatabase({ name: 'tasks.db', location: 'default' });

        db.transaction(tx => {
            tx.executeSql(
                `UPDATE tasks SET completed = ?, updated_at = ? WHERE id = ?`,
                [newCompleted, currentTimestamp, id],
                () => {
                    dispatch({ type: 'TOGGLE_TASK', payload: id });
                },
                error => console.error('Error toggling task:', error)
            );
        });
    };

    // Delete task
    const deleteTask = async (id) => {
        const db = await SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM tasks WHERE id = ?`,
                [id],
                () => {
                    dispatch({ type: 'DELETE_TASK', payload: id });
                },
                error => console.error('Error deleting task:', error)
            );
        });
    };

    const value = {
        tasks: state.tasks,
        loading: state.loading,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        loadTasks,
    };

    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within a TaskProvider');
    }
    return context;
};
