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
import {
  isRoomInIdeaSubmissionPhase,
  isRoomInIdeaVotingPhase,
} from "../shared/roomUtils";

export default function HomeScreen({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, "Home">) {
  const [joinRoomID, setJoinRoomID] = useState<string>("");

  useFocusEffect(
    useCallback(() => {
      setJoinRoomID("");
    }, [])
  );

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    dbInstance.watchRooms(
      (rooms) => {
        setIsLoaded(true);
        setRooms(rooms);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, []);

  const joinRoom = async (roomID: string) => {
    const room = await dbInstance.getRoom(roomID);

    if (room === null) {
      // TODO - alert
      return;
    }

    if (room.status === roomState.CLOSED) {
      navigation.navigate("IdeaVoteResults", { roomID });
      return;
    }

    if (room.status === roomState.WAITING) {
      await dbInstance.joinRoom(roomID);
      navigation.navigate("WaitingRoom", { roomID });
    }

    if (room.status === roomState.ACTIVE) {
      // idea submission phase
      const roomInIdeaSubmissionPhase = await isRoomInIdeaSubmissionPhase(
        roomID
      );

      if (roomInIdeaSubmissionPhase) {
        await dbInstance.joinRoom(roomID);
        navigation.navigate("IdeaSubmissionRoom", { roomID });
        return;
      }

      const roomInIdeaVotingPhase = await isRoomInIdeaVotingPhase(roomID);

      // idea voting phase
      if (roomInIdeaVotingPhase) {
        await dbInstance.joinRoom(roomID);
        navigation.navigate("IdeaVotingRoom", { roomID });
        return;
      }
    }
  };

  useEffect(() => {
    (async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const roomID = urlParams.get("roomID");

      if (roomID !== null) {
        // redirect to the proper room

        joinRoom(roomID);
      }
    })();
  }, []);

  const createRoom = () => navigation.navigate("CreateRoom");

  const renderAvailableRoom = ({ item }) => {
    console.log(item.id);
    return (
      <Pressable onPress={() => joinRoom(item.id)}>
        <View style={styles.availableRoomRowContainer}>
          <View style={styles.availableRoomRowInnerContainer}>
            <Text style={styles.availableRoomRowTitle}>{item.question}</Text>
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
          <Text style={styles.header}>
            Generate better ideas in just 10 minutes
          </Text>
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
                onPress={() => joinRoom(joinRoomID)}
              />
            </View>
          </View>

          <View style={styles.communityRoomsLabelContainer}>
            <Text style={styles.communityRoomsLabel}>
              Explore community rooms
            </Text>
          </View>

          <FlatList
            data={isLoaded ? rooms : []}
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
    lineHeight: 35,
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
    cursor: "pointer",
  },
  availableRoomsFlatList: {
    width: "100%",
    height: "100%",
    padding: paddings.small,
    paddingBottom: 60,
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
    height: "100%",
  },
});
