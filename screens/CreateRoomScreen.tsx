import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList
} from 'react-native';
import { 
  Button,
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

export default function CreateRoomScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'CreateRoom'>) {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Create Room</Text>
      </View>

      <View style={styles.enterHMWContainer}>
        <Text style={styles.enterHMWLabel}>Enter a HMW</Text>
        <TextInput
          style={styles.enterHMWInput}
        />
      </View>

      <View style={styles.enterProblemContextContainer}>
        <Text style={styles.enterProblemContextLabel}>Problem context</Text>
        <TextInput
          style={styles.enterProblemContextInput}
        />
      </View>

      <View style={styles.publicRoomSwitchContainer}>
    <Switch color='blue' value={true}/>
    <Text>Public room</Text>
      </View>

      <View style={styles.nextButtonContainer}>
        <Button
          title={'Next'}
          buttonStyle={styles.nextButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  nextButtonContainer: {
    width: '100%',
    height: 100,
    justifyContent: 'center'
  },
  nextButton: {
    width: '80%',
    alignSelf: 'center'
  },
  publicRoomSwitchContainer: {
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  enterProblemContextContainer: {
    width: '100%'
  },
  enterProblemContextLabel: {

  },
  enterProblemContextInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: borderRadiuses.small
  },
  enterHMWLabel: {

  },
  enterHMWInput:{
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: borderRadiuses.small
  },
  enterHMWContainer: {
    width: '100%',

  },
  headerContainer: {
    width: '100%',
    height: 60,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    color: 'grey'
  },
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: paddings.veryLarge,
    paddingLeft: paddings.veryLarge
  }
});
