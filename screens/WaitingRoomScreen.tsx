import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import {
  useState
} from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList,
  Pressable
} from 'react-native';
import { 
  Button,
  Icon,
  Switch
} from 'react-native-elements'

import {
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight
} from '../constants/Layout'

import { RootStackParamList } from '../types';


export default function WaitingRoomScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'WaitingRoom'>) {

  const hmwTitle = 'How might we make college less expensive'
  const participantsCount = 4
  const hmwContent = 'Tuition inflation has risen at a faster rate than the cost of medical service, child care, and housing. While generous...'

  const goBackHome = () => navigation.navigate('Home')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Waiting Room</Text>
        <Text style={styles.participantsHeader}>{`${participantsCount} participants`}</Text>
      </View>

      <View style={styles.hmwTitleContainer}>
        <Text style={styles.hmwTitle}>{hmwTitle}</Text>
      </View>

      <View style={styles.theProblemLabelContainer}>
        <Text style={styles.theProblemLabel}>The Problem</Text>
      </View>

      <View style={styles.hmwContentContainer}>
        <Text style={styles.hmwContent}>
          {hmwContent}
        </Text>
      </View>

      <View style={styles.bottomButtonContainer}>
        <Button 
          title={'Copy Link'}
          buttonStyle={styles.bottomButton}
          onPress={() => console.log('copy link')}
        />
      </View>

      <View style={styles.bottomButtonContainer}>
        <Button 
          title={'Start'}
          buttonStyle={styles.bottomButton}
          onPress={() => console.log('start the room')}
        />
      </View>

      <View style={styles.bottomButtonContainer}>
        <Button 
          title={'Back'}
          buttonStyle={styles.bottomButton}
          onPress={goBackHome}
        />
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hmwContentContainer: {
    width: '100%',

  },
  hmwContent: {

  },
  theProblemLabel: {

  },
  theProblemLabelContainer: {
    width: '100%',
    alginItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 4
  },
  bottomButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  bottomButton: {
    width: 250
  },
  hmwTitleContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hmwTitle: {},
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  participantsHeader: {
    fontSize: 18
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
});

