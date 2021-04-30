import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import {
  useState
} from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  SafeAreaView,
  Alert,
  TextInput,
  FlatList,
  Pressable,
  Modal
} from 'react-native';
import { 
  Button,
  Icon,
  Switch
} from 'react-native-elements'

import {
  paddings,
  margins,
  borderRadiuses,
  screenWidth,
  screenHeight
} from '../constants/Layout'

import { RootStackParamList } from '../types';
import { blueBackground } from '../constants/Colors';

type Idea = {
  title: string,
  voted: boolean
}

enum BottomTags {
  Tip,
  Oops
}

enum ScreenModes {
  IdeaSubmission,
  IdeaVoting
}


export default function RoomScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Room'>) {

  const hmwTitle = 'How might we make college less expensive'
  const remainingTime = '4:28'
  const participantsCount = 6
  const votesLimit = 4

  const [idea, setIdea] = useState<string>('')
  const [ideas, setIdeas] = useState<Idea[]>([
    {title: 'ciao', voted: false}, {title: 'mbare', voted: false}, {title: 'ciao', voted: false}, {title: 'mbare', voted: false}, {title: 'ciao', voted: false}, {title: 'mbare', voted: false}
  ])
  const [niceJobModalVisible, setNiceJobModalVisible] = useState<boolean>(false)
  const [screenMode, setScreenMode] = useState<ScreenModes>(ScreenModes.IdeaSubmission)

  const hasVotesLimitBeenReached = () => {
    return (
      ideas.filter(idea => idea.voted).length >= votesLimit
    )
  }

  const renderIdea = ({item, index}: {item: Idea, index: number}) => {
    return (
      <View style={styles.ideaContainer} key={item.title}>
        <View style={styles.ideaInnerContainer}>
        <Text style={styles.ideaTitle}>{item.title}</Text>

        {
          screenMode === ScreenModes.IdeaVoting ? (
        <Icon 
          type='material-community'
          name='star'
          color={item.voted ? 'yellow' : 'grey'}
          onPress={() => {

            if(hasVotesLimitBeenReached()) return

            const tmpIdeas = [...ideas]
            tmpIdeas[index].voted = !tmpIdeas[index].voted
            setIdeas(tmpIdeas)
        }}
        />
          ) : null
  }
        </View>
      </View>
    )
  }

  const NiceJobModal = () => {

    if(niceJobModalVisible === false) return null

    return (
      <View style={styles.niceJobModalContainer}>
        <View style={styles.niceJobModalInnerContainer}>
          <View style={styles.niceJobModalHeaderContainer}>
            <Text style={styles.niceJobModalHeader}>🤩 Nice job!</Text>
            <View style={{flex: 1}}/>
            <Text style={styles.niceJobModalHeader}>0:03</Text>
          </View>

          <View style={styles.niceJobSubModalHeaderContainer}>
            <Text style={styles.niceJobSubModalHeader}>Transferring you to the voting room</Text>
          </View>
        </View>
      </View>
    )
  }

  const BailButton = () => {
    return (
      <Pressable onPress={() => console.log('bail')}>
      <View style={styles.bailButton}>
        <Text style={styles.bailButtonTitle}>✌Bail</Text>
        <Icon 
          type='material-community'
          name='account-outline'
          color={blueBackground}
        />
        <Text style={styles.bailButtonParticipantsLabel}>{
          participantsCount
        }</Text>
      </View>
      </Pressable>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

<NiceJobModal/>

      <View style={styles.headerContainer}>
        
          <BailButton />  
        
          <Icon 
          type='material-community'
          name='music'
          color='grey'
        />

        <View style={{flex: 1}}/>
  
        <View style={styles.timerContainer}>
          <Text style={styles.timer}>{remainingTime}</Text>
        </View>
      </View>

      <View style={styles.hmwTitleContainer}>
        <Text style={styles.hmwTitle}>{hmwTitle}</Text>
      </View>

      {
        screenMode === ScreenModes.IdeaSubmission && (
<>

{ideas.map((item, index) => renderIdea({item, index}))}
      <View style={styles.ideaInputContainer}>
        <TextInput
          placeholder='Type your answer here'
          style={styles.ideaInput}
          onChangeText={setIdea}
          value={idea}
          maxLength={140}
        />
      </View>


      <View style={styles.saveButtonContainer}>
        <Button 
          title={'Save'}
          buttonStyle={styles.saveButton}
          onPress={() => {
            setIdeas([...ideas, {title: idea, voted: false}])
            setIdea('')
          }}
        />
      </View>


      <View style={styles.tipContainer}>
        <Text style={styles.tip}>Shoot for 10+ ideas, don't overthink it!</Text>
      </View>
</>
        )
        }

        {
          screenMode === ScreenModes.IdeaVoting && (
            <View style={styles.ideaVotingContainer}>
              <View style={styles.ideaVotingHeaderContainer}>
                <Text style={styles.ideaVotingHeader}>You have 4 ⭐️'s available to give, which ideas do you think are most important?</Text>
              </View>

              <View style={styles.ideaVotingIdeasContainer}>
                {ideas.map((item, index) => renderIdea({item, index}))}
              </View>

              <View style={styles.ideaVotingFooterContainer}>
                <Text style={styles.ideaVotingFooterText}>🤯  Am I right??</Text>
              </View>
            </View>
          )
        }


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ideaTitle: {
    width: '100%'
  },
  ideaVotingIdeasContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  ideaVotingFooterContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  ideaVotingFooterText: {
    color: 'grey',
    fontSize: 20
  },
  ideaVotingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  ideaVotingHeaderContainer: {
    width: '100%',
    paddingRight: 20,
    paddingLeft: 20
  },
  ideaVotingHeader: {
    color: 'white',
    fontSize: 20
  },
  niceJobSubModalHeader: {
    fontSize: 18,
    color: 'grey'
  },
  niceJobModalHeader: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  niceJobModalHeaderContainer: {
    flex: 1
  },
  niceJobSubModalHeaderContainer: {
    flex: 1
  },
  niceJobModalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    zIndex: 1,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.4)'
  },
  niceJobModalInnerContainer: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  ideaContainer: {
    width: '100%',
    marginBottom: 8,
    marginTop: 8,
    alignItems:'center',
    justifyContent: 'center'
  },
  ideaInnerContainer: {
    width: '80%',
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  bailButtonParticipantsLabel: {
    color: blueBackground
  },
  bailButtonTitle: {
    color: 'red',
    fontSize: 20,
    marginRight: 12
  },
  bailButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  timerContainer: {

  },
  timer: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  ideaInputContainer: {
    width: '100%',
    height: 60
  },
  ideaInput: {
color: 'white'
  },
  tipContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tip: {
    color: 'white'
  },
  hmwContentContainer: {
    width: '100%',

  },
  hmwContent: {

  },
  saveButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5
  },
  saveButton: {
    width: 250
  },
  hmwTitleContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  hmwTitle: {
    color: 'white'
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: blueBackground
  }
});

