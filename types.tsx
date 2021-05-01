/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  Home: {
    roomID: string;
  };
  CreateRoom: undefined;
  IdeaVotingRoom: {
    roomID: string;
  };
  IdeaSubmissionRoom: {
    roomID: string;
  };
  IdeaVoteResults: {
    roomID: string;
  };
  WaitingRoom: {
    roomID: string;
  };
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type Idea = {
  title: string;
  votes?: number;
};
