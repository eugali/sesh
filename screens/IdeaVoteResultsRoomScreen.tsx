import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  Pressable,
} from "react-native";
import { Button, Icon } from "react-native-elements";

import { defaultScreenPadding } from "../constants/Layout";
import { Idea } from "../types";
import { tw } from "vanilla-sharing";

import { RootStackParamList } from "../types";
import { blueBackground, nonSelectedWhite, white50 } from "../constants/Colors";
import Shared from "../constants/Shared";
import { baseURL } from "../constants/Config";
import { Nunito_700Bold } from "@expo-google-fonts/nunito";
import dbInstance from "../shared/dbInstance";

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

const YellowVotes = "#F2C94C";
const GreyNoVotes = "#DDDDDD";

export default function IdeaVoteResultsRoomScreen({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, "IdeaVoteResultsRoom">) {
  const hmwTitle = "How might we help designers break into web3?";
  const roomID = route?.params?.roomID;
  const participantsCount = 6;

  const shareRoomOnTwitter = () =>
    tw({
      url: `${baseURL}/Home?roomID=${roomID}`,
      title:
        participantsCount +
        ` people came up with ` +
        ideas.length +
        ` @seshIdeas for "` +
        hmwTitle +
        `". Check out the top ideas here:`,
      hashtags: ["sesh"],
    });

  const [solutions, setSolutions] = useState<SubmittedIdea[]>([]);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const solutions = await dbInstance.getSolutions(roomID);
      setSolutions(solutions);
    })();
  }, []);

  const renderIdea = ({ item, index }: { item: Idea; index: number }) => {
    return (
      <View style={styles.ideaContainer} key={index}>
        <View style={styles.ideaInnerContainer}>
          <Text style={styles.ideaTitle}>{item.text}</Text>

          <View style={styles.ideaVotesLabelContainer}>
            {item.votes > 0 && (
              <Text style={styles.ideaVotesLabel}>{item.votes}</Text>
            )}
          </View>

          <Icon
            type="material-community"
            name="star"
            color={item.votes > 0 ? YellowVotes : GreyNoVotes}
            size={22}
          />
        </View>
      </View>
    );
  };

  const goHome = () => {
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*<View style={styles.headerContainer}></View>*/}

      <View style={styles.bodyContainer}>
        <View style={styles.footerContainer}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => goHome()}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>🧠 Sesh</Text>
              </View>
            </Pressable>

            <View style={styles.tweetButtonContainer}>
              <Button
                title="Tweet Results"
                buttonStyle={styles.footerTweetButton}
                titleStyle={styles.footerTweetButtonTitle}
                onPress={shareRoomOnTwitter}
              />
            </View>
          </View>
        </View>
        <View style={styles.hmwTitleContainer}>
          <Text style={styles.hmwTitle}>{hmwTitle}</Text>
        </View>

        <View style={styles.votingResultsLabelContainer}>
          <Text style={styles.votingResultsLabel}>🏅 Voting Results</Text>
        </View>

        <View style={styles.ideaVotingIdeasContainer}>
          {solutions
            .slice()
            .sort((a, b) => {
              if (a.votes < b.votes) {
                return 1;
              }
              if (a.votes > b.votes) {
                return -1;
              }
              return 0;
            })
            .map((item, index) => renderIdea({ item, index }))}
        </View>
        <Text style={styles.votingCaption}>
          Generated and priotized by 6 people in less than 10 minutes
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footerExitButtonTitle: {
    color: blueBackground,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  footerTweetButtonTitle: {
    color: blueBackground,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  footerExitButton: {
    backgroundColor: "white",
    width: "100%",
  },
  footerTweetButton: {
    backgroundColor: "#F2C94C",
    width: "100%",
  },
  logoContainer: {
    cursor: "pointer",
  },
  logo: {
    color: "#FFF",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 25,
    paddingTop: 5,
  },
  tweetButtonContainer: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 15,
    paddingRight: 0,
    paddingLeft: 25,
    maxWidth: 150,
  },
  footerContainer: {
    width: "100%",
  },
  headerRow: {
    maxWidth: 600,
    width: "100%",
    margin: 0,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  votingResultsLabelContainer: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  votingResultsLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "white",
  },
  ideaVotesLabelContainer: {
    minWidth: 10,
    marginRight: 2,
    marginLeft: 10,
  },
  ideaVotesLabel: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: YellowVotes,
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
    paddingTop: defaultScreenPadding,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  container: {
    width: "100%",
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
  votingCaption: {
    fontFamily: "Nunito_700Bold",
    color: white50,
    paddingBottom: 30,
    textAlign: "center",
    fontSize: 16,
    paddingTop: 20,
  },
});
