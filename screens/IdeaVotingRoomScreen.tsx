import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { Button, Icon, Switch } from "react-native-elements";
import { useTimer } from "react-timer-hook";
import moment from "moment";

import {
  defaultScreenPadding,
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight,
} from "../constants/Layout";
import { Idea } from "../types";

import BailButton from "../components/BailButton";

import { RootStackParamList } from "../types";
import {
  blueBackground,
  nonSelectedWhite,
  white50,
  lighterWhite,
} from "../constants/Colors";
import Shared from "../constants/Shared";
import { VotingDuration, SubmissionDuration } from "../constants/Config";
import dbInstance from "../shared/dbInstance";
import { Solution } from "../types";

const MAX_VOTES = 4;

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

const YellowVote = "#F2C94C";
const PinkVote = "#CAC0F4";

export default function IdeaVotingRoomScreen({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, "IdeaVotingRoom">) {
  const roomID = route?.params?.roomID;
  const [hmwTitle, setHmwTitle] = useState<string>("");
  const [participantsCount, setParticipantsCount] = useState<string>("");
  const [roomEndsAt, setRoomEndsAt] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [votesCounter, setVotesCounter] = useState(0);
  const [votedSolutionsIds, setVotedSolutionsIds] = useState([]);

  const goBackHome = () => navigation.navigate("Home");

  const leaveRoom = async () => {
    await dbInstance.leaveRoom(roomID);
    goBackHome();
  };

  const [solutions, setSolutions] = useState<Solution[]>([]);

  const filterOutOneIdAtATime = (ids, idToFilter) => {
    let filteredCount = 0;
    const output = ids.filter((id) => {
      if (filteredCount) return true;

      if (id !== idToFilter) {
        return true;
      } else {
        filteredCount++;
        return false;
      }
    });

    return output;
  };

  const upvote = (index) => {
    if (votesCounter >= MAX_VOTES) return;
    setVotesCounter(votesCounter + 1);
    setVotedSolutionsIds([...votedSolutionsIds, solutions[index].id]);
    dbInstance.upvote(roomID, solutions[index].id, solutions);
  };

  const downvote = (index) => {
    if (votesCounter <= 0) return;

    // you can't downvote something you didn't vote
    if (!votedSolutionsIds.includes(solutions[index].id)) return;

    setVotesCounter(votesCounter - 1);
    setVotedSolutionsIds(
      filterOutOneIdAtATime(votedSolutionsIds, solutions[index].id)
    );
    dbInstance.downvote(roomID, solutions[index].id, solutions);
  };

  const onTimerExpires = async () => {
    await dbInstance.closeRoom(roomID);
    navigation.navigate("IdeaVoteResults", { roomID });
  };

  // initial value for the timer before the room is loaded
  const initTime = new Date();
  initTime.setSeconds(initTime.getSeconds() + 100);

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: initTime,
    onExpire: onTimerExpires,
  });

  useEffect(() => {
    const unsubscribe = dbInstance.watchRoomParticipants(
      roomID,
      (participants) => {
        //setIsLoaded(true);
        setParticipantsCount(participants.length.toString());
      },
      (error) => {
        //setIsLoaded(true);
        //setError(error);
      }
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = dbInstance.watchRoomSolutions(
      roomID,
      (solutions) => {
        //setIsLoaded(true);
        setSolutions(
          solutions.map((solution: any) => ({
            title: solution.text,
            votes: solution.votes,
            id: solution.id,
          })) as Solution[]
        );
      },
      (error) => {
        //setIsLoaded(true);
        //setError(error);
      }
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
        (room.startedAt.seconds + SubmissionDuration + VotingDuration) * 1000
      );

      restart(roomStartedAt);
      setShowCountdown(true);
    })();
  }, [route.params]);

  const renderSolution = ({ item, index }: { item: Idea; index: number }) => {
    return (
      <View style={styles.ideaRowContainer}>
        <View style={styles.ideaContainer} key={index}>
          <View style={styles.ideaInnerContainer}>
            <Text style={styles.ideaTitle}>{item.title}</Text>
          </View>
        </View>
        <View style={styles.ideaVoteControlsContainer}>
          <Pressable onPress={() => upvote(index)}>
            <Icon
              type="material-community"
              name="star-circle-outline"
              size={24}
              color={
                votedSolutionsIds.includes(item.id) ? YellowVote : PinkVote
              }
            />
          </Pressable>
          <Text
            style={[
              styles.votesLabel,
              {
                color: votedSolutionsIds.includes(item.id)
                  ? YellowVote
                  : PinkVote,
              },
            ]}
          >
            {item.votes}
          </Text>
          <Pressable onPress={() => downvote(index)}>
            <Icon
              type="material-community"
              name="minus-circle-outline"
              size={24}
              color={PinkVote}
            />
          </Pressable>
        </View>
      </View>
    );
  };

  /*
  const NiceJobModal = () => {
    if (niceJobModalVisible === false) return null;

    return (
      <View style={styles.niceJobModalContainer}>
        <View style={styles.niceJobModalInnerContainer}>
          <View style={styles.niceJobModalHeaderContainer}>
            <Text style={styles.niceJobModalHeader}>???? Nice job!</Text>
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
  */

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
            <Text style={styles.timer}>{`${minutes.pad(2)}:${seconds.pad(
              2
            )}`}</Text>
          )}
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.hmwTitleContainer}>
          <Text style={styles.hmwTitle}>{hmwTitle}</Text>
        </View>

        <View style={styles.ideaVotingContainer}>
          <View style={styles.ideaVotingHeaderContainer}>
            <Text style={styles.ideaVotingHeader}>
              You have 4 <Text style={{ color: "white" }}>???</Text>'s available
              to give. Which solutions do you think are{" "}
              <Text style={{ fontWeight: "bold" }}>most important?</Text>
            </Text>
          </View>

          <View style={styles.ideaVotingsolutionsContainer}>
            {solutions.map((item, index) => renderSolution({ item, index }))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  votesLabel: {
    color: PinkVote,
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
  },
  ideaRowContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 10,
  },
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
  ideaVotingsolutionsContainer: {
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
    marginBottom: 30,
  },
  ideaVotingHeader: {
    color: lighterWhite,
    fontSize: 16,
    fontFamily: "Nunito_400Regular",
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
  ideaVoteControlsContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    marginRight: 4,
    marginLeft: 4,
  },
  ideaContainer: {
    ...Shared.blockItem,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginBottom: 0,
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
