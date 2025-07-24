import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { TaskProvider } from './src/context/TaskContext';
import AppNavigator from './src/navigations/AppNavigator';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <TaskProvider>
          <AppNavigator />
        </TaskProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default App;
