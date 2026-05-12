import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';

import { MindflowProvider, useMindflow } from '@/context/mindflow-context';

function RootNavigation() {
  const { hydrated, effectiveScheme } = useMindflow();
  const navigationTheme = effectiveScheme === 'dark' ? DarkTheme : DefaultTheme;

  if (!hydrated) {
    return (
      <View style={styles.boot}>
        <ActivityIndicator size="large" color="#EA580C" />
      </View>
    );
  }

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Only override options for modal; (tabs) and note/[id] come from the file system */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', headerShown: true, title: 'Modal' }}
        />
      </Stack>
      <StatusBar style={effectiveScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <MindflowProvider>
      <RootNavigation />
    </MindflowProvider>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F0E8',
  },
});
