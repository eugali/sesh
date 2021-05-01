import * as React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";

import { blueBackground } from "../constants/Colors";
import { Icon } from "react-native-elements";

type Props = {
  onPress: () => any;
  participantsCount: number;
};

const BailButton = ({ onPress, participantsCount }: Props) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.bailButton}>
        <Text style={styles.bailButtonTitle}>✌Bail</Text>
        <Icon
          type="material-community"
          name="account-outline"
          color={blueBackground}
          size={18}
        />
        <Text style={styles.bailButtonParticipantsLabel}>
          {participantsCount}
        </Text>
      </View>
    </Pressable>
  );
};

export default BailButton;

const styles = StyleSheet.create({
  bailButtonParticipantsLabel: {
    color: blueBackground,
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
  },
  bailButtonTitle: {
    color: "#BA0909",
    fontSize: 19,
    marginRight: 12,
    fontFamily: "Nunito_700Bold",
  },
  bailButton: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 7,
    paddingTop: 6,
    paddingBottom: 6,
    paddingRight: 6,
    paddingLeft: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
