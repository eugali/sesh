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
  Modal,
  Platform
} from "react-native";
import { Button, Icon, Switch } from "react-native-elements";

import {
  defaultScreenPadding,
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight,
} from "../constants/Layout";

import BailButton from "../components/BailButton";

import { RootStackParamList } from "../types";
import { blueBackground, nonSelectedWhite } from "../constants/Colors";
import Shared from "../constants/Shared";

const noGlow = `
textarea, select, input, button {
	-webkit-appearance: none;
	outline: none!important;
}
textarea:focus, select:focus, input:focus, button:focus {
	-webkit-appearance: none;
	outline: none!important;
}
`

export const injectWebCss = () => {

  // Only on web
  if (Platform.OS != "web") {
    return;
  }

  // Inject style
  const style = document.createElement('style')
  style.textContent = `textarea, select, input, button { outline: none!important; }`
  return document.head.append(style)

}

injectWebCss();

type Idea = {
  title: string;
  voted: boolean;
};

enum BottomTags {
  Tip,
  Oops,
}

enum ScreenModes {
  IdeaSubmission,
  IdeaVoting,
}

export default function RoomScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "Room">) {
  const hmwTitle = "How might we help designers break into web3?";
  const remainingTime = "4:28";
  const participantsCount = 6;
  const votesLimit = 4;

  const [idea, setIdea] = useState<string>("");
  const [ideas, setIdeas] = useState<Idea[]>([
    { title: "Create figma only hackathons (no code!)", voted: false },
    { title: "Start a podcast featuring designers in web3 ", voted: false },
    { title: "Curate job web3 design job opportunities", voted: false },
    { title: "Curate the best communities for web3 designrs", voted: false },
    { title: "Curate the best communities for web3 desgners", voted: false },
    { title: "Curate the best communities fr web3 designers", voted: false },
    { title: "Crate the best communities for web3 designrs", voted: false },
    { title: "Curate he best communities for web3 desgners", voted: false },
    { title: "Curate the bet communities fr web3 designers", voted: false },
  ]);
  const [niceJobModalVisible, setNiceJobModalVisible] = useState<boolean>(
    false
  );
  const [screenMode, setScreenMode] = useState<ScreenModes>(
    ScreenModes.IdeaSubmission
  );

  const hasVotesLimitBeenReached = () => {
    return ideas.filter((idea) => idea.voted).length >= votesLimit;
  };

  const renderIdea = ({ item, index }: { item: Idea; index: number }) => {
    return (
      <View style={styles.ideaContainer} key={item.title}>
        <View style={styles.ideaInnerContainer}>
          <Text style={styles.ideaTitle}>{item.title}</Text>

          {screenMode === ScreenModes.IdeaVoting ? (
            <Icon
              type="material-community"
              name="star"
              color={item.voted ? "yellow" : "grey"}
              onPress={() => {
                if (hasVotesLimitBeenReached()) return;

                const tmpIdeas = [...ideas];
                tmpIdeas[index].voted = !tmpIdeas[index].voted;
                setIdeas(tmpIdeas);
              }}
            />
          ) : null}
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
      <NiceJobModal />

      <View style={styles.headerContainer}>
        <BailButton />

        <Icon type="material-community" name="music" color={nonSelectedWhite} style={styles.music} />

        <View style={{ flex: 1 }} />

        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{remainingTime}</Text>
        </View>
      </View>

      <View style={styles.bodyContainer}>
        <View style={styles.hmwTitleContainer}>
          <Text style={styles.hmwTitle}>{hmwTitle}</Text>
        </View>

        {screenMode === ScreenModes.IdeaSubmission && (
          <>
            <View style={[styles.ideaInputContainer, Shared.inputField]}>
              <TextInput
                placeholder="Type your answer here"
                placeholderTextColor={nonSelectedWhite}
                style={styles.ideaInput}
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
                onPress={() => {
                  setIdeas([...ideas, { title: idea, voted: false }]);
                  setIdea("");
                }}
              />
            </View>
            {ideas.map((item, index) => renderIdea({ item, index }))}
          </>
        )}

        {screenMode === ScreenModes.IdeaVoting && (
          <View style={styles.ideaVotingContainer}>
            <View style={styles.ideaVotingHeaderContainer}>
              <Text style={styles.ideaVotingHeader}>
                You have 4 ⭐️'s available to give, which ideas do you think are
                most important?
              </Text>
            </View>

            <View style={styles.ideaVotingIdeasContainer}>
              {ideas.map((item, index) => renderIdea({ item, index }))}
            </View>

            <View style={styles.ideaVotingFooterContainer}>
              <Text style={styles.ideaVotingFooterText}>🤯 Am I right??</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  saveButton: {
    marginBottom: 10,
  },
  ideaTitle: {
    width: "100%",
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
    width: "80%",
    flexDirection: "row",
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
    fontFamily: 'Nunito_700Bold',
    color: "#4b31bb",
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6
  },
  tip: {
    color: nonSelectedWhite,
    fontFamily: 'Nunito_700Bold',
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
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: blueBackground,
    fontFamily: "Nunito_700Bold",
  },
  music: {
    padding: 5,
    marginLeft: 10,
  }
});
