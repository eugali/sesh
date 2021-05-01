import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";
import { Button, Icon } from "react-native-elements";

import { defaultScreenPadding } from "../constants/Layout";
import { Idea } from "../types";
import { tw } from "vanilla-sharing";

import { RootStackParamList } from "../types";
import { blueBackground, nonSelectedWhite, white50 } from "../constants/Colors";
import Shared from "../constants/Shared";
import { baseURL } from "../constants/Config";

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
  navigation,
}: StackScreenProps<RootStackParamList, "Room">) {
  const hmwTitle = "How might we help designers break into web3?";
  const roomID = "1234";
  const participantsCount = 6;
  const votesLimit = 4;

  const goBackHome = () => navigation.navigate("Home");

  const shareRoomOnTwitter = () =>
    tw({
      url: `${baseURL}/IdeaVoteResults?roomID=${roomID}`,
      title:
        participantsCount +
        ` people came up with ` +
        ideas.length +
        ` @seshIdeas for "` +
        hmwTitle +
        `". Check out the top ideas here:`,
      hashtags: ["sesh"],
    });

  const [idea, setIdea] = useState<string>("");
  const [ideas, setIdeas] = useState<Idea[]>([
    { title: "Create figma only hackathons (no code!)", votes: 1 },
    { title: "Start a podcast featuring designers in web3 ", votes: 3 },
    { title: "Curate job web3 design job opportunities", votes: 2 },
    { title: "Curate the best communities for web3 designrs", votes: 1 },
    { title: "Curate the best communities for web3 desgners", votes: 1 },
    { title: "Curate the best communities fr web3 designers", votes: 4 },
    { title: "Crate the best communities for web3 designrs", votes: 1 },
    { title: "Curate he best communities for web3 desgners", votes: 3 },
    { title: "Curate the bet communities fr web3 designers", votes: 0 },
  ]);

  const renderIdea = ({ item, index }: { item: Idea; index: number }) => {
    return (
      <View style={styles.ideaContainer} key={index}>
        <View style={styles.ideaInnerContainer}>
          <Text style={styles.ideaTitle}>{item.title}</Text>

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

  return (
    <SafeAreaView style={styles.container}>
      {/*<View style={styles.headerContainer}></View>*/}

      <View style={styles.bodyContainer}>
        <View style={styles.hmwTitleContainer}>
          <Text style={styles.hmwTitle}>{hmwTitle}</Text>
        </View>

        <View style={styles.votingResultsLabelContainer}>
          <Text style={styles.votingResultsLabel}>🏅 Voting Results</Text>
        </View>

        <View style={styles.ideaVotingIdeasContainer}>
          {ideas
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
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footerRow}>
          <View style={styles.footerButtonContainer}>
            <Button
              title="New Sesh"
              buttonStyle={styles.footerExitButton}
              titleStyle={styles.footerExitButtonTitle}
              onPress={goBackHome}
            />
          </View>

          <View style={styles.footerButtonContainer}>
            <Button
              title="Tweet"
              buttonStyle={styles.footerTweetButton}
              titleStyle={styles.footerTweetButtonTitle}
              onPress={shareRoomOnTwitter}
            />
          </View>
        </View>
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
  footerButtonContainer: {
    flex: 1,
    paddingTop: 25,
    paddingBottom: 25,
    paddingRight: 25,
    paddingLeft: 25,
  },
  footerContainer: {
    backgroundColor: blueBackground,
    width: "100%",
    position: "fixed",
    bottom: 0,
  },
  footerRow: {
    maxWidth: 600,
    width: "100%",
    margin: 0,
    marginLeft: "auto",
    marginRight: "auto",
    flexDirection: "row",
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
    paddingBottom: 100,
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
});
