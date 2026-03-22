import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { NotesProvider } from '@/components/NotesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <NotesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="index" options={{ title: 'CloudNote' }} />
          <Stack.Screen name="new-note" options={{ title: 'New Note' }} />
          <Stack.Screen name="note-detail" options={{ title: 'Note Details' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </NotesProvider>
  );
}