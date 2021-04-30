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
import { blueBackground } from '../constants/Colors'

import { RootStackParamList } from "../types";

enum HomeTabs {
  JoinRoom,
  CreateRoom
}

const mockData = [
  {
    title: 'How might we ...'
  },
  {
    title: 'How might we ...'
  },
  {
    title: 'How might we ...'
  },
  {
    title: 'How might we ...'
  }
];

export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Home'>) {

  const [currentTab, setCurrentTab] = useState(HomeTabs.CreateRoom)
  const [isNewRoomPublic, setIsNewRoomPublic] = useState(true)
  const joinRoom = () => navigation.navigate('WaitingRoom')
  const createRoom = () => navigation.navigate('Room')

  const renderAvailableRoom = ({ item }) => {
    return (
      <Pressable onPress={joinRoom}>
        <View style={styles.availableRoomRowContainer}>
          <View style={styles.availableRoomRowInnerContainer}>
            <Text style={styles.availableRoomRowTitle}>{item.title}</Text>
          </View>
        </View>
      </Pressable>
    )
  }


  export default function HomeScreen({
    navigation,
  }: StackScreenProps<RootStackParamList, "Home">) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Sesh</Text>
        </View>


        <View style={styles.headerContainer}>
          <Text style={styles.header}>Generate better ideas in half the time</Text>
        </View>

        <View style={styles.subHeaderContainer}>
          <Text style={styles.subHeader}>Problem solving exercises inspired by Jake Knapp, AJ&Smart, and Deep Work Studio</Text>
        </View>


        <View style={styles.roomTabsContainer}>

          <Pressable onPress={() => setCurrentTab(HomeTabs.JoinRoom)}>
            <Text style={[styles.roomTab, { color: currentTab === HomeTabs.JoinRoom ? 'white' : 'grey' }]}>Join Room</Text>
          </Pressable>

          <Pressable onPress={() => setCurrentTab(HomeTabs.CreateRoom)}>
            <Text style={[styles.roomTab, { color: currentTab === HomeTabs.CreateRoom ? 'white' : 'grey' }]}>Create Room</Text>
          </Pressable>
        </View>



        {
          currentTab === HomeTabs.JoinRoom && (
            <View style={styles.availableRoomsContainer}>

              <View style={styles.joinRoomContainer}>
                <TextInput
                  style={styles.joinRoomInputContainer}
                  placeholder={'Enter Code'}
                />

                <Icon
                  type='material-community'
                  name='arrow-right-circle-outline'
                  size={30}
                  color='white'
                  onPress={joinRoom}
                />
              </View>

              <View style={styles.communityRoomsLabelContainer}>
                <Text style={styles.communityRoomsLabel}>Community Rooms</Text>
              </View>

              <FlatList
                data={mockData}
                renderItem={renderAvailableRoom}
                style={styles.availableRoomsFlatList}
              />
            </View>
          )
        }

        {
          currentTab === HomeTabs.CreateRoom && (
            <View>

              <View style={styles.createRoomActionsContainer}>
                <View style={styles.createRoomPublicSwitchContainer}>

                  <Switch color='blue' value={isNewRoomPublic} onValueChange={() => setIsNewRoomPublic(!isNewRoomPublic)} />
                  <Text style={styles.createRoomPublicLabel}>Public</Text>
                </View>

                <View style={styles.createRoomButtonContainer}>
                  <Icon
                    type='material-community'
                    name='arrow-right-circle-outline'
                    size={30}
                    color='white'
                    onPress={createRoom}
                  />
                </View>
              </View>

              {
                isNewRoomPublic && (
                  <View style={styles.createRoomSubLabelContainer}>
                    <Text style={styles.createRoomSubLabel}>Your room will be listed publicly for anyone to join</Text>
                  </View>
                )
              }

            </View>
          )
        }
      </SafeAreaView>
    );
  }

  const styles = StyleSheet.create({
    createRoomPublicLabel: {
      color: 'white'
    },
    createRoomPublicSwitchContainer: {
      flexDirection: 'row'
    },
    createRoomButtonContainer: {

    },
    createRoomActionsContainer: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    createRoomSubLabelContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    createRoomSubLabel: {
      color: 'white'
    },
    communityRoomsLabelContainer: {
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center'
    },
    communityRoomsLabel: {
      color: 'white'
    },
    roomTab: {
      color: 'white',
      fontWeight: 'bold'
    },
    roomTabsContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-evenly',
      marginTop: 20,
      marginBottom: 20
    },
    subHeaderContainer: {
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: paddings.veryLarge
    },
    subHeader: {
      color: 'white'
    },
    headerContainer: {
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: paddings.veryLarge
    },
    header: {
      color: 'white'
    },
    availableRoomRowUsersCount: {
      color: "grey",
    },
    availableRoomRowInnerContainer: {
      width: '80%',
      backgroundColor: 'white',
      padding: 15,
      margin: 5,
      borderRadius: 10
    },
    horizontalLineSeparator: {
      width: "80%",
      height: 1,
      backgroundColor: "black",
      marginTop: margins.veryLarge,
      marginBottom: margins.veryLarge,
    },
    orLabel: {},
    orLabelContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      height: 60,
    },
    availableRoomRowTitle: {
      width: '100%'
    },
    availableRoomRowContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    availableRoomsFlatList: {
      width: '100%',
      height: '100%',
      padding: paddings.small
    },
    availableRoomsContainer: {
      width: '100%'
    },
    createNewRoomContainer: {
      width: "100%",
    },
    createNewRoomButton: {
      width: '80%'
    },
    joinButton: {
      borderRadius: borderRadiuses.normal,
      width: 120,
      marginHorizontal: margins.small,
    },
    logo: {
      fontSize: 24,
      fontWeight: "bold",
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: 50,
    },
    joinRoomInputContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: "grey",
      borderRadius: borderRadiuses.normal,
      justifyContent: 'space-around',
      marginHorizontal: margins.small,
      backgroundColor: 'white'
    },

    joinRoomContainer: {
      flexDirection: "row",
      width: "100%",
      justifyContent: "center",
      padding: paddings.normal,
    },
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: blueBackground,
      alignItems: 'center',
      justifyContent: 'flex-start'
    }
  });

