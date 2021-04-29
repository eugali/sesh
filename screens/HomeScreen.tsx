import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  SafeAreaView,
  Alert,
  TextInput
} from 'react-native';
import { 
  Button
} from 'react-native-elements'

import {
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight
} from '../constants/Layout'

import { RootStackParamList } from '../types';


export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Sesh</Text>
      </View>

      <View style={styles.joinRoomContainer}>
        <TextInput 
          style={styles.joinRoomInputContainer}
          placeholder={'Room ID'}
        />

        <Button 
          title='Join'
          onPress={() => Alert.alert('Pressed')}
          buttonStyle={styles.joinButton}
        />

      </View>

      <View style={styles.createNewRoomContainer}>
        <Button 
          title='Create New Room'
          onPress={() => Alert.alert('Create room')}
          buttonStyle={styles.createNewRoomButton}
        />
     </View>

      <View style={styles.availableRoomsContainer}>

 
     </View>
     <View style={styles.createNewRoomContainer}>

     </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createNewRoomContainer: {
    width: screenWidth,
  },
  createNewRoomButton: {
    width: '100%'
  },
  joinButton: {
    borderRadius: borderRadiuses.normal,
    width: 80,
    marginHorizontal: margins.small
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%'
  },
  joinRoomInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: borderRadiuses.normal,
    justifyContent: 'space-around',
    marginHorizontal: margins.small
  },
  createNewRoomContainer: {
  },
  availableRoomsContainer: {
    flex: 1,
  },
  joinRoomContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    padding: paddings.normal
  },
  container: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: paddings.normal
  }
});
