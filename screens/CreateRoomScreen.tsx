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

export default function CreateRoomScreen({
  navigation,
}: StackScreenProps<RootStackParamList, "CreateRoom">) {
  const goHome = () => navigation.navigate("Home");
  const [isNewRoomPublic, setIsNewRoomPublic] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container}>
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
        <TextInput
          multiline
          style={styles.enterHMWInput}
          placeholder="How might we ..."
        />
      </View>

      <View style={styles.enterProblemContextContainer}>
        <Text style={styles.enterProblemContextLabel}>
          Describe the problem
        </Text>
        <TextInput
          style={styles.enterProblemContextInput}
          multiline
          placeholder="What information is helpful to know before the brainstom?"
        />
      </View>

      <View style={styles.publicRoomSwitchContainer}>
        <Switch
          color="white"
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
          title={"Submit"}
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitButtonTitle}
        />
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
    height: 80,
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
  },
  enterProblemContextLabel: {
    color: "white",
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  enterProblemContextInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: white30,
    borderRadius: borderRadiuses.normal,
    fontFamily: "Nunito_700Bold",
    color: "white",
    padding: paddings.large,
    fontSize: 17,
    textAlignVertical: "top",
  },
  enterHMWLabel: {
    color: "white",
    fontSize: 18,
    fontFamily: "Nunito_700Bold",
    marginTop: 10,
    marginBottom: 10,
  },
  enterHMWInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: white30,
    borderRadius: borderRadiuses.normal,
    fontFamily: "Nunito_700Bold",
    color: "white",
    padding: paddings.large,
    fontSize: 17,
    textAlignVertical: "top",
  },
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
    width: screenWidth,
    height: screenHeight,
    backgroundColor: blueBackground,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingRight: defaultScreenPadding,
    paddingLeft: defaultScreenPadding,
    paddingTop: defaultScreenPadding,
  },
});
