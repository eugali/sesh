import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
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
import Shared from "../constants/Shared";

import dbInstance from "../shared/dbInstance";
import { roomState } from "../constants/Enums";
import { createIconSetFromFontello } from "react-native-vector-icons";

const mockData = [
  {
    title: "How might we ...",
    roomID: "yJEBZxgLYO86RFblJuLC",
  },
  {
    title: "How might we ...",
    roomID: "yJEBZxgLYO86RFblJuLC",
  },
  {
    title: "How might we ...",
    roomID: "yJEBZxgLYO86RFblJuLC",
  },
];

export default function HomeScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Home">) {
  //const [currentTab, setCurrentTab] = useState(HomeTabs.JoinRoom);
  //const [isNewRoomPublic, setIsNewRoomPublic] = useState(true);

  //yJEBZxgLYO86RFblJuLC room id to test
  const [joinRoomID, setJoinRoomID] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      setJoinRoomID("");
    }, [])
  );

  // 4ZEXSCrhywDBX2DUdRN3

  const joinRoom = async (roomID: string) => {
    if (roomID.length === 0) return;

    const room = await dbInstance.getRoom(roomID);

    if (room === null) {
      // TODO - alert
      return;
    }

    if (room.status === roomState.CLOSED) {
      // TODO - the closed room should show the results
    }

    if (room.status === roomState.WAITING) {
      navigation.navigate("WaitingRoom", { roomID });
    }

    if (room.status === roomState.ACTIVE) {
      navigation.navigate("Room", { roomID });
    }
  };

  const createRoom = () => navigation.navigate("CreateRoom");

  const renderAvailableRoom = ({ item }) => {
    return (
      <Pressable onPress={() => joinRoom(item.roomID)}>
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
      <View style={styles.bodyContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🧠 Sesh</Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Generate better ideas in 10 minutes</Text>
        </View>

        <View style={Shared.buttonContainer}>
          <Button
            title="Create Room"
            onPress={createRoom}
            buttonStyle={[Shared.button, styles.createNewRoomButton]}
            titleStyle={Shared.buttonTitleStyle}
          />
        </View>

        <View style={styles.availableRoomsContainer}>
          <View style={styles.joinRoomContainer}>
            <TextInput
              style={styles.joinRoomInputContainer}
              placeholder={"Type room code here"}
              placeholderTextColor={nonSelectedWhite}
              value={joinRoomID}
              onChangeText={setJoinRoomID}
            />

            <View style={styles.joinIcon}>
              <Icon
                type="material-community"
                name="arrow-right-circle-outline"
                size={30}
                color="white"
                onPress={joinRoom}
              />
            </View>
          </View>

          <View style={styles.communityRoomsLabelContainer}>
            <Text style={styles.communityRoomsLabel}>
              Explore community rooms
            </Text>
          </View>

          <FlatList
            data={mockData}
            renderItem={renderAvailableRoom}
            style={styles.availableRoomsFlatList}
          />
        </View>
      </View>
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
    marginTop: 15,
    marginBottom: 20,
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
    marginTop: 20,
    marginBottom: 20,
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
    ...Shared.blockItem,
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
    padding: 15,
  },
  joinButton: {
    borderRadius: borderRadiuses.normal,
    width: 120,
    marginHorizontal: margins.small,
  },
  logo: {
    fontSize: 47,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "Nunito_800ExtraBold",
  },
  logoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },
  joinRoomInputContainer: {
    ...Shared.inputField,
    flex: 1,
    justifyContent: "space-around",
    marginHorizontal: margins.small,
    fontFamily: "Nunito_700Bold",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 45,
  },
  joinRoomContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    position: "relative",
  },
  joinIcon: {
    position: "absolute",
    right: 10,
    top: 12,
    zIndex: 10,
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
  bodyContainer: {
    maxWidth: 600,
  },
});
