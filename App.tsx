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

import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "./constants/Config";
import db from "./shared/db";

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
