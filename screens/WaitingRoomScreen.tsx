import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState, useEffect } from "react";
import { MinParticipants } from "../constants/Config";
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

import Clipboard from "expo-clipboard";

import {
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight,
} from "../constants/Layout";

import { RootStackParamList } from "../types";
import { blueBackground, white50, white30 } from "../constants/Colors";
import { defaultScreenPadding } from "../constants/Layout";
import BailButton from "../components/BailButton";
import dbInstance from "../shared/dbInstance";
import { roomState } from "../constants/Enums";
import {
  isRoomInIdeaSubmissionPhase,
  isRoomInIdeaVotingPhase,
  isRoomInWaitingPhase,
} from "../shared/roomUtils";

export default function WaitingRoomScreen({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, "WaitingRoom">) {
  const roomID = route.params.roomID;

  const goBackHome = () => navigation.navigate("Home");

  const leaveRoom = async () => {
    await dbInstance.leaveRoom(roomID);
    goBackHome();
  };

  const [hmwTitle, setHmwTitle] = useState<string>("");
  const [hmwContent, setHmwContent] = useState<string>("");
  const [participantsCount, setParticipantsCount] = useState<string>("");

  const startRoom = async () => {
    const success = await dbInstance.startRoom(roomID);
    if (success) {
      navigation.navigate("IdeaSubmissionRoom", { roomID });
    } else {
      setNotEnoughParticipantsErrorVisible(true);
    }
  };

  useEffect(() => {
    const unsubscribe = dbInstance.watchRoom(roomID, async (room) => {
      if (isRoomInWaitingPhase(room)) return;

      if (
        room.status === roomState.ACTIVE &&
        isRoomInIdeaSubmissionPhase(room)
      ) {
        navigation.navigate("IdeaSubmissionRoom", { roomID });
        return;
      }

      if (room.status === roomState.ACTIVE && isRoomInIdeaVotingPhase(room)) {
        navigation.navigate("IdeaVotingRoom", { roomID });
        return;
      }

      if (room.status === roomState.CLOSED) {
        navigation.navigate("IdeaVoteResults", { roomID });
        return;
      }

      navigation.navigate("Home");
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = dbInstance.watchRoomParticipants(
      roomID,
      (participants) => {
        //setIsLoaded(true);
        setParticipantsCount(participants.length.toString());
      },
      (error) => {
        //setIsLoaded(true);
        // setError(error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      const room = await dbInstance.getRoom(roomID);

      if (room === null) {
        navigation.navigate("Home");
        return;
      }

      const participantsCount = await dbInstance.getParticipants(roomID);
      setHmwTitle(room.question);
      setHmwContent(room.problemStatement);
      setParticipantsCount(participantsCount.length.toString());
    })();
  }, []);

  const StartButtonOrMessage = () => {
    if (parseInt(participantsCount) > MinParticipants) {
      return (
        <Button
          title={"Start Room"}
          buttonStyle={styles.startRoomBottomButton}
          titleStyle={styles.startRoomBottomButtonTitle}
          onPress={startRoom}
        />
      );
    } else {
      return (
        <Text style={styles.waitingMessageContent}>
          Once there are {MinParticipants} people in the room you will be able
          to start
        </Text>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BailButton
          onPress={leaveRoom}
          participantsCount={`${participantsCount}/${MinParticipants}`}
        />

        <Icon
          type="material-community"
          name="music"
          color={white50}
          style={styles.musicIcon}
        />
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.screenTitleContainer}>
          <Text style={styles.screenTitle}>Waiting Room: GSKL</Text>
        </View>

        <View style={styles.hmwTitleContainer}>
          <Text style={styles.hmwTitle}>{hmwTitle}</Text>
        </View>

        <View style={styles.theProblemLabelContainer}>
          <Text style={styles.theProblemLabel}>The Problem</Text>
        </View>

        <View style={styles.hmwContentContainer}>
          <Text style={styles.hmwContent}>{hmwContent}</Text>
        </View>

        <View style={styles.bottomButtonContainer}>
          <Button
            title={"Copy Link"}
            buttonStyle={styles.copyLinkBottomButton}
            titleStyle={styles.copyLinkBottomButtonTitle}
            onPress={() =>
              Clipboard.setString(
                `https://sesh-e5398.web.app/Home?roomID=${roomID}`
              )
            }
          />
        </View>

        <View style={styles.bottomButtonContainer}>
          <StartButtonOrMessage />
        </View>
      </View>

      <View style={styles.bottomSpace} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomSpace: {
    width: "100%",
    height: 30,
  },
  musicIcon: {
    marginLeft: 16,
  },
  screenTitleContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  screenTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: white50,
  },
  hmwContentContainer: {
    width: "100%",
    flex: 1,
    marginBottom: 20,
  },
  hmwContent: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "white",
  },
  waitingMessageContent: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
  theProblemLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: white50,
  },
  theProblemLabelContainer: {
    width: "100%",
    alginItems: "flex-start",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  bottomButtonContainer: {
    width: "100%",
    marginTop: 5,
    marginBottom: 5,
  },
  bottomButton: {
    width: "100%",
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  copyLinkBottomButton: {
    width: "100%",
    backgroundColor: white30,
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
  },
  copyLinkBottomButtonTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "white",
  },
  startRoomBottomButton: {
    width: "100%",
    backgroundColor: "white",
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 12,
    paddingBottom: 12,
  },
  startRoomBottomButtonTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: blueBackground,
  },
  hmwTitleContainer: {
    width: "100%",
    marginTop: 15,
    marginBottom: 25,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  hmwTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 23,
    color: "white",
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 30,
    flexDirection: "row",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  participantsHeader: {
    fontSize: 18,
  },
  container: {
    width: "100%",
    height: screenHeight,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: blueBackground,
    paddingRight: defaultScreenPadding,
    paddingLeft: defaultScreenPadding,
    paddingTop: defaultScreenPadding,
  },
  bodyContainer: {
    maxWidth: 600,
    width: "100%",
  },
});
