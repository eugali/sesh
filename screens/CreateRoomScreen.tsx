import { StackScreenProps } from "@react-navigation/stack";
import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { Button, Switch, Icon } from "react-native-elements";

import {
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight,
} from "../constants/Layout";

import { RootStackParamList } from "../types";
import {
  blueBackground,
  lighterWhite,
  nonSelectedWhite,
  white30,
  white80,
} from "../constants/Colors";
import { defaultScreenPadding } from "../constants/Layout";
import Shared from "../constants/Shared";
import dbInstance from "../shared/dbInstance";

export default function CreateRoomScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "CreateRoom">) {
  const goHome = () => navigation.navigate("Home");
  const [isNewRoomPublic, setIsNewRoomPublic] = useState<boolean>(false);
  const [HMWStatement, setHMWStatement] = useState<string>("");
  const [problemDescription, setProblemDescription] = useState<string>("");

  const createRoom = async () => {
    const roomID = await dbInstance.createRoom(
      HMWStatement,
      problemDescription,
      !isNewRoomPublic
    );
    navigation.navigate("WaitingRoom", { roomID });
    console.log(roomID);
  };

  const openLink = (url: string) => {
    if (Platform.OS == "web") {
      window.open(url, "_blank");
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <View style={styles.backContainer}>
          <Pressable onPress={goHome}>
            <View style={styles.backInnerContainer}>
              <Icon
                type="material-community"
                name="arrow-left"
                color="white"
                size={22}
              />
              <Text style={styles.backLabel}> Back</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.header}>Create a Sesh</Text>
        </View>

        <View style={styles.enterHMWContainer}>
          <Text style={styles.enterHMWLabel}>Create a HMW statement</Text>
          <View style={styles.helpIcon}>
            <Icon
              type="material-community"
              onPress={() =>
                openLink("https://www.odellkeller.com/the-how-might-we-method/")
              }
              name="help-circle-outline"
              color="white"
              size={22}
            />
          </View>
          <TextInput
            multiline
            style={[styles.enterHMWInput, Shared.textArea]}
            placeholder="How might we ..."
            placeholderTextColor={nonSelectedWhite}
            value={HMWStatement}
            maxLength={100}
            onChangeText={setHMWStatement}
          />
        </View>

        <View style={styles.enterProblemContextContainer}>
          <Text style={styles.enterProblemContextLabel}>
            Describe the problem
          </Text>
          <TextInput
            style={[styles.enterProblemContextInput, Shared.textArea]}
            multiline
            placeholder="What information is helpful to know before the brainstom?"
            placeholderTextColor={nonSelectedWhite}
            value={problemDescription}
            onChangeText={setProblemDescription}
          />
        </View>

        <View style={styles.publicRoomSwitchContainer}>
          <Switch
            color="#F2C94C"
            value={isNewRoomPublic}
            onValueChange={() => setIsNewRoomPublic(!isNewRoomPublic)}
          />
          <Text style={styles.publicRoomSwitchLabel}>Public</Text>
        </View>

        <View style={styles.bottomTipContainer}>
          {isNewRoomPublic && (
            <Text style={styles.bottomTipLabel}>
              Your room will be listed publicly for anyone to join
            </Text>
          )}
        </View>

        <View style={styles.submitButtonContainer}>
          <Button
            disabled={HMWStatement.length < 10}
            title={"Submit"}
            buttonStyle={styles.submitButton}
            titleStyle={styles.submitButtonTitle}
            onPress={createRoom}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backInnerContainer: {
    flexDirection: "row",
  },
  submitButtonTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: blueBackground,
  },
  bottomTipLabel: {
    color: white80,
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
  },
  bottomTipContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 30,
    height: 69,
  },
  publicRoomSwitchLabel: {
    marginRight: 10,
    marginLeft: 10,
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "white",
  },
  backLabel: {
    fontFamily: "Nunito_700Bold",
    color: "white",
    fontSize: 15,
  },
  backContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  submitButtonContainer: {
    width: "100%",
    justifyContent: "center",
  },
  submitButton: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "white",
  },
  publicRoomSwitchContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    marginTop: 30,
    marginBottom: 10,
  },
  enterProblemContextContainer: {
    width: "100%",
    marginTop: 15,
  },
  enterProblemContextLabel: {
    color: "white",
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  enterProblemContextInput: {},
  enterHMWLabel: {
    color: "white",
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    marginTop: 10,
    marginBottom: 10,
  },
  helpIcon: {
    position: "absolute",
    right: 0,
    top: 12,
  },
  enterHMWInput: {},
  enterHMWContainer: {
    width: "100%",
  },
  headerContainer: {
    width: "100%",
    height: 80,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  header: {
    fontSize: 23,
    color: "white",
    fontFamily: "Nunito_700Bold",
  },
  container: {
    minHeight: screenHeight,
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
    width: "100%",
  },
});
