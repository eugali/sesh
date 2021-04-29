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

const mockData = [
  {
    title: 'How might we ...',
    usersInTheRoom: 2
  },
  {
    title: 'How might we ...',
    usersInTheRoom: 2
  },
  {
    title: 'How might we ...',
    usersInTheRoom: 2
  },
  {
    title: 'How might we ...',
    usersInTheRoom: 2
  },
]


const renderAvailableRoom = ({item}) => {
  return (
    <View style={styles.availableRoomRowContainer}>
      <View style={styles.avaiableRoomRowInnerContainer}>
      <Text style={styles.availableRoomRowTitle}>{item.title}</Text>
      <Text style={styles.availableRoomRowUsersCount}>{`${item.usersInTheRoom}/6`}</Text>
      </View>

      <Button 
        title='Join'
      />
    </View>
  )
}

export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Home'>) {

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Sesh</Text>
      </View>

      <View style={styles.createNewRoomContainer}>
        <Button 
          title='Create New Room'
          onPress={() => Alert.alert('Create room')}
          buttonStyle={styles.createNewRoomButton}
        />
     </View>

    <View style={styles.orLabelContainer}>
      <Text style={styles.orLabel}>OR</Text>
      </View>

      <View style={styles.joinRoomContainer}>
        <TextInput 
          style={styles.joinRoomInputContainer}
          placeholder={'Room Code'}
        />

        <Button 
          title='Join Room'
          onPress={() => Alert.alert('Pressed')}
          buttonStyle={styles.joinButton}
        />
      </View>

      <View style={styles.horizontalLineSeparator}>
      </View>

      <View style={styles.availableRoomsContainer}>

      <FlatList 
          data={mockData}
          renderItem={renderAvailableRoom}
          style={styles.availableRoomsFlatList}
        />
     </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  availableRoomRowUsersCount: {
    color: 'grey'
  },
  avaiableRoomRowInnerContainer: {
    flex: 1
  },
  horizontalLineSeparator: {
    width: '80%',
    height: 1,
    backgroundColor: 'black',
    marginTop: margins.veryLarge,
    marginBottom: margins.veryLarge
  },
  orLabel: {
    
  },
  orLabelContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },
  availableRoomRowTitle:{
    flex: 1
  },
  availableRoomRowContainer:{
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  availableRoomsFlatList: {
    width: screenWidth,
    height: '100%',
    padding: paddings.small
  },
  availableRoomsContainer: {
    display: 'flex',
    flex: 1
  },
  createNewRoomContainer: {
    width: '100%',
  },
  createNewRoomButton: {
    width: screenWidth * 0.8
  },
  joinButton: {
    borderRadius: borderRadiuses.normal,
    width: 120,
    marginHorizontal: margins.small
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50
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
