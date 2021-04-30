import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {Text} from 'react-native'

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import {
  useFonts, 
  Nunito_400Regular, 
  Nunito_700Bold,
  Nunito_800ExtraBold
} from '@expo-google-fonts/nunito'

import firebase from "firebase/app"
import "firebase/firestore";
import db from "./shared/db"

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

  useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
    Nunito_800ExtraBold
  })

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
