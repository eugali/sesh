import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { Button, Icon, Switch } from "react-native-elements";

import {
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight,
} from "../constants/Layout";
import {
  blueBackground,
  nonSelectedWhite,
  lighterWhite,
} from "../constants/Colors";

import { RootStackParamList } from "../types";
import { defaultScreenPadding } from "../constants/Layout";

enum HomeTabs {
  JoinRoom,
  CreateRoom,
}

const mockData = [
  {
    title: "How might we ...",
  },
  {
    title: "How might we ...",
  },
  {
    title: "How might we ...",
  },
  {
    title: "How might we ...",
  },
];

export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Home">) {
  const [currentTab, setCurrentTab] = useState(HomeTabs.JoinRoom);
  const [isNewRoomPublic, setIsNewRoomPublic] = useState(true);
  const joinRoom = () => navigation.navigate("WaitingRoom");
  const createRoom = () => navigation.navigate("CreateRoom");

  const renderAvailableRoom = ({ item }) => {
    return (
      <Pressable onPress={joinRoom}>
        <View style={styles.availableRoomRowContainer}>
          <View style={styles.availableRoomRowInnerContainer}>
            <Text style={styles.availableRoomRowTitle}>{item.title}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🧠 Sesh</Text>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          Generate better ideas in half the time
        </Text>
      </View>

      {/*
        <View style={styles.roomTabsContainer}>
          <Pressable onPress={() => setCurrentTab(HomeTabs.JoinRoom)}>
            <Text style={[styles.roomTab, { color: currentTab === HomeTabs.JoinRoom ? 'white' : nonSelectedWhite }]}>Join Room</Text>
          </Pressable>
          <Pressable onPress={() => setCurrentTab(HomeTabs.CreateRoom)}>
            <Text style={[styles.roomTab, { color: currentTab === HomeTabs.CreateRoom ? 'white' : nonSelectedWhite }]}>Create Room</Text>
          </Pressable>
        </View>
        */}

      <View style={styles.createRoomButtonContainer}>
        <Button
          title="Create Room"
          onPress={createRoom}
          buttonStyle={styles.createRoomButton}
          titleStyle={styles.createRoomButtonTitleStyle}
        />
      </View>

      <View style={styles.availableRoomsContainer}>
        <View style={styles.joinRoomContainer}>
          <TextInput
            style={styles.joinRoomInputContainer}
            placeholder={"Type room code here"}
          />

          <Icon
            type="material-community"
            name="arrow-right-circle-outline"
            size={40}
            color="white"
            onPress={joinRoom}
          />
        </View>

        <View style={styles.communityRoomsLabelContainer}>
          <Text style={styles.communityRoomsLabel}>
            Explore community Rroms
          </Text>
        </View>

        <FlatList
          data={mockData}
          renderItem={renderAvailableRoom}
          style={styles.availableRoomsFlatList}
        />
      </View>

      {/*
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
          */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createRoomPublicLabel: {
    color: "white",
  },
  createRoomPublicSwitchContainer: {
    flexDirection: "row",
  },
  createRoomButtonContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },
  createRoomButton: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  createRoomButtonTitleStyle: {
    fontFamily: "Nunito_700Bold",
    color: blueBackground,
    fontSize: 16,
  },
  createRoomActionsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  createRoomSubLabelContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  createRoomSubLabel: {
    color: "white",
  },
  communityRoomsLabelContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  communityRoomsLabel: {
    color: lighterWhite,
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
  },
  roomTab: {
    color: lighterWhite,
  },
  roomTabsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginTop: 20,
    marginBottom: 20,
  },
  subHeaderContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: paddings.veryLarge,
  },
  subHeader: {
    color: lighterWhite,
    fontFamily: "Nunito_700Bold",
  },
  headerContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: paddings.veryLarge,
  },
  header: {
    color: lighterWhite,
    fontFamily: "Nunito_700Bold",
    fontSize: 31,
  },
  availableRoomRowUsersCount: {
    color: "grey",
  },
  availableRoomRowInnerContainer: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    padding: 15,
    margin: 5,
    borderRadius: 33,
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
    width: "100%",
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
  },
  availableRoomRowContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  availableRoomsFlatList: {
    width: "100%",
    height: "100%",
    padding: paddings.small,
  },
  availableRoomsContainer: {
    width: "100%",
  },
  createNewRoomContainer: {
    width: "100%",
  },
  createNewRoomButton: {
    width: "80%",
  },
  joinButton: {
    borderRadius: borderRadiuses.normal,
    width: 120,
    marginHorizontal: margins.small,
  },
  logo: {
    fontSize: 40,
    fontWeight: "bold",
    color: lighterWhite,
    fontFamily: "Nunito_800ExtraBold",
  },
  logoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    height: 50,
  },
  joinRoomInputContainer: {
    flex: 1,
    justifyContent: "space-around",
    marginHorizontal: margins.small,
    fontFamily: "Nunito_700Bold",
  },
  joinRoomContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: blueBackground,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: defaultScreenPadding,
    paddingLeft: defaultScreenPadding,
    paddingTop: defaultScreenPadding,
  },
});
