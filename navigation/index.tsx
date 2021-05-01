/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import CreateRoomScreen from "../screens/CreateRoomScreen";
import WaitingRoomScreen from "../screens/WaitingRoomScreen";
import RoomScreen from "../screens/RoomScreen";
import IdeaSubmissionRoomScreen from "../screens/IdeaSubmissionRoomScreen";
import IdeaVotingRoomScreen from "../screens/IdeaVotingRoomScreen";
import IdeaVoteResultsRoomScreen from "../screens/IdeaVoteResultsRoomScreen";
import { RootStackParamList } from "../types";
import LinkingConfiguration from "./LinkingConfiguration";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="IdeaVotingRoom" component={IdeaVotingRoomScreen} />
      <Stack.Screen
        name="IdeaSubmissionRoom"
        component={IdeaSubmissionRoomScreen}
      />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="WaitingRoom" component={WaitingRoomScreen} />
      <Stack.Screen name="CreateRoom" component={CreateRoomScreen} />
    </Stack.Navigator>
  );
}
