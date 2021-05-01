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

export default function WaitingRoomScreen({
  route,
  navigation,
}: StackScreenProps<RootStackParamList, "WaitingRoom">) {
  const participantsCount = 4;
  const roomID = route.params.roomID;
  const hmwContent =
    "Tuition inflation has risen at a faster rate than the cost of medical service, child care, and housing. While generous...";

  const goBackHome = () => navigation.navigate("Home");

  const [hmwTitle, setHmwTitle] = useState<string>("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <BailButton
          onPress={goBackHome}
          participantsCount={participantsCount}
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
            onPress={() => Clipboard.setString(roomID)}
          />
        </View>

        <View style={styles.bottomButtonContainer}>
          <Button
            title={"Start Room"}
            buttonStyle={styles.startRoomBottomButton}
            titleStyle={styles.startRoomBottomButtonTitle}
            onPress={() => console.log("start the room")}
          />
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
  },
  hmwContent: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "white",
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
    height: "100%",
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
