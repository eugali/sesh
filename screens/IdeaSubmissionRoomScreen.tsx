import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { Button, Icon, Switch } from "react-native-elements";
import { Idea } from "../types";
import { useTimer } from "react-timer-hook";
import moment from "moment";

import { defaultScreenPadding, screenHeight } from "../constants/Layout";

import BailButton from "../components/BailButton";

import { RootStackParamList } from "../types";
import { blueBackground, nonSelectedWhite, white50 } from "../constants/Colors";
import Shared from "../constants/Shared";
import dbInstance from "../shared/dbInstance";
import { SubmissionDuration } from "../constants/Config";

const noGlow = `
textarea, select, input, button {
	-webkit-appearance: none;
	outline: none!important;
}
textarea:focus, select:focus, input:focus, button:focus {
	-webkit-appearance: none;
	outline: none!important;
}
`;

export const injectWebCss = () => {
  // Only on web
  if (Platform.OS != "web") {
    return;
  }

  // Inject style
  const style = document.createElement("style");
  style.textContent = `textarea, select, input, button { outline: none!important; }`;
  return document.head.append(style);
};

injectWebCss();

export default function IdeaSubmissionRoomScreen({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, "Room">) {
  const roomID = route?.params?.roomID;
  const [hmwTitle, setHmwTitle] = useState<string>("");
  const [participantsCount, setParticipantsCount] = useState<string>("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [niceJobModalVisible, setNiceJobModalVisible] = useState<boolean>(
    false
  );
  const [idea, setIdea] = useState<string>("");
  const [ideas, setIdeas] = useState<Idea[]>([]);

  const goBackHome = () => navigation.navigate("Home");

  const leaveRoom = async () => {
    await dbInstance.leaveRoom(roomID);
    goBackHome();
  };

  const onTimerExpired = async () => {
    // submit ideas
    for (let idea of ideas) {
      await dbInstance.createSolution(roomID, idea.title);
    }
    navigation.navigate("IdeaVotingRoom", { roomID });
  };

  // initial value for the timer before the room is loaded
  const initTime = new Date();
  initTime.setSeconds(initTime.getSeconds() + 100);

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: initTime,
    onExpire: onTimerExpired,
  });

  useEffect(() => {
    const unsubscribe = dbInstance.watchRoomParticipants(
      roomID,
      (participants) => {
        setParticipantsCount(participants.length.toString());
      },
      (error) => {}
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    (async () => {
      await dbInstance.waitForPendingWrites();

      const room = await dbInstance.getRoom(roomID);

      if (room === null) {
        navigation.navigate("Home");
        return;
      }

      const participants = await dbInstance.getParticipants(roomID);

      setHmwTitle(room.question);
      setParticipantsCount(participants.length.toString());

      const roomStartedAt = new Date(
        (room.startedAt.seconds + SubmissionDuration) * 1000
      );
      restart(roomStartedAt);
      setShowCountdown(true);
    })();
  }, [route.params]);

  const deleteIdea = (indexToDelete: number) => {
    setIdeas(ideas.filter((item, index) => index !== indexToDelete));
  };

  const submitIdea = () => {
    if (idea.length < 3) {
      return;
    }
    setIdeas([{ title: idea }, ...ideas]);
    setIdea("");
  };

  const renderIdea = ({ item, index }: { item: Idea; index: number }) => {
    return (
      <View style={styles.ideaContainer} key={index}>
        <View style={styles.ideaInnerContainer}>
          <Text style={styles.ideaTitle}>{item.title}</Text>

          <Pressable onPress={() => deleteIdea(index)}>
            <Icon
              type="material-community"
              name="close"
              size={20}
              color={"#AAAAAA"}
              style={styles.deleteIdeaIcon}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  const NiceJobModal = () => {
    if (niceJobModalVisible === false) return null;

    return (
      <View style={styles.niceJobModalContainer}>
        <View style={styles.niceJobModalInnerContainer}>
          <View style={styles.niceJobModalHeaderContainer}>
            <Text style={styles.niceJobModalHeader}>🤩 Nice job!</Text>
            <View style={{ flex: 1 }} />
            <Text style={styles.niceJobModalHeader}>0:03</Text>
          </View>

          <View style={styles.niceJobSubModalHeaderContainer}>
            <Text style={styles.niceJobSubModalHeader}>
              Transferring you to the voting room
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BailButton onPress={leaveRoom} participantsCount={participantsCount} />

        <Icon
          type="material-community"
          name="music"
          color={nonSelectedWhite}
          style={styles.music}
        />

        <View style={{ flex: 1 }} />

        <View style={styles.timerContainer}>
          {showCountdown && (
            <Text style={styles.timer}>
              {`${minutes.pad(2)}:${seconds.pad(2)}`}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.hmwTitleContainer}>
          <Text style={styles.hmwTitle}>{hmwTitle}</Text>
        </View>

        <View style={[styles.ideaInputContainer, Shared.inputField]}>
          <TextInput
            placeholder="Type your answer here"
            placeholderTextColor={nonSelectedWhite}
            style={styles.ideaInput}
            onSubmitEditing={() => submitIdea()}
            blurOnSubmit={false}
            onChangeText={setIdea}
            value={idea}
            maxLength={140}
          />
        </View>
        <View style={styles.tipContainer}>
          <Text style={styles.tipBox}>TIP</Text>
          <Text style={styles.tip}>
            Shoot for 10+ ideas, don't overthink it!
          </Text>
        </View>
        <View style={Shared.buttonContainer}>
          <Button
            title={"Save"}
            buttonStyle={[Shared.button, styles.saveButton]}
            titleStyle={Shared.buttonTitleStyle}
            onPress={() => submitIdea()}
          />
        </View>
        {ideas.map((item, index) => renderIdea({ item, index }))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  deleteIdeaIcon: {
    margin: 10,
    marginRight: 2,
  },
  saveButton: {
    marginBottom: 10,
  },
  ideaTitle: {
    width: "100%",
    flex: 1,
    fontSize: 17,
    fontFamily: "Nunito_700Bold",
    paddingLeft: 10,
  },
  ideaVotingIdeasContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  ideaVotingFooterContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  ideaVotingFooterText: {
    color: "grey",
    fontSize: 20,
  },
  ideaVotingContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  ideaVotingHeaderContainer: {
    width: "100%",
    paddingRight: 20,
    paddingLeft: 20,
  },
  ideaVotingHeader: {
    color: "white",
    fontSize: 20,
  },
  niceJobSubModalHeader: {
    fontSize: 18,
    color: "grey",
  },
  niceJobModalHeader: {
    fontSize: 24,
    fontWeight: "bold",
  },
  niceJobModalHeaderContainer: {
    flex: 1,
  },
  niceJobSubModalHeaderContainer: {
    flex: 1,
  },
  niceJobModalContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: 1,
    position: "absolute",
    backgroundColor: "rgba(0,0,0,.4)",
  },
  niceJobModalInnerContainer: {
    backgroundColor: "white",
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
  },
  ideaContainer: {
    ...Shared.blockItem,
    width: "100%",
    alignItems: "flex-start",

    justifyContent: "center",
  },
  ideaInnerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainer: {},
  timer: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  ideaInputContainer: {
    marginBottom: 15,
  },
  ideaInput: {
    color: "white",
    fontFamily: "Nunito_700Bold",
    outline: 0,
  },
  tipContainer: {
    width: "100%",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  tipBox: {
    backgroundColor: nonSelectedWhite,
    borderRadius: 7,
    marginRight: 8,
    fontSize: 10,
    fontFamily: "Nunito_700Bold",
    color: "#4b31bb",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
  },
  tip: {
    color: nonSelectedWhite,
    fontFamily: "Nunito_700Bold",
  },
  hmwContentContainer: {
    width: "100%",
  },
  hmwContent: {},
  hmwTitleContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  hmwTitle: {
    color: "white",
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    lineHeight: 27,
  },
  headerContainer: {
    position: "fixed",
    width: "100%",
    top: 0,
    background: "#4b31bb",
    zIndex: 9,
    paddingBottom: "15px",
    boxShadow: "-5px 2px 9px 3px #00000021",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    paddingRight: defaultScreenPadding,
    paddingLeft: defaultScreenPadding,
    paddingTop: defaultScreenPadding,
    backgroundColor: blueBackground,
  },
  bodyContainer: {
    paddingRight: defaultScreenPadding,
    paddingLeft: defaultScreenPadding,
    marginTop: 70,
    width: "100%",
    maxWidth: 600,
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    width: "100%",
    minHeight: screenHeight,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: blueBackground,
    fontFamily: "Nunito_700Bold",
  },
  music: {
    padding: 5,
    marginLeft: 10,
  },
});
