import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import firebase from "firebase/app"

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBRb4_6tE_OJv7GbORE0BcugAasAJR2Lv0",
  authDomain: "sesh-e5398.firebaseapp.com",
  projectId: "sesh-e5398",
  storageBucket: "sesh-e5398.appspot.com",
  messagingSenderId: "526817755196",
  appId: "1:526817755196:web:11f6e3c174177ed80d8339",
  measurementId: "G-GQN94NFWQT"
};

firebase.initializeApp(firebaseConfig);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
