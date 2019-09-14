import * as React from 'react';
import { StyleSheet, ScrollView, Text, View, RefreshControl, TouchableOpacity, AsyncStorage } from 'react-native';
import { Badge, Image } from 'react-native-elements';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase';
import { client } from '../../services/client';
import gql from 'graphql-tag';
import THEME from '../../theme/theme';
import PostComponent from '../../components/post/post';
import i18n from 'i18n-js';
import { Permissions, Location } from 'expo';
import _ from 'lodash';

export default class ProfileScreen extends React.Component<ProfileScreenProps, ProfileScreenState> {

  static navigationOptions = ({ navigation }) => {
    const thisRef: ProfileScreen = navigation.getParam('thisRef');

    return {
      title: thisRef && thisRef.state.profile ? `@${thisRef.state.profile.username}` : i18n.t('screens.profile.title'),
      headerStyle: {
        backgroundColor: THEME.colors.primary.default,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#F5F5F5'
      },
      headerRight: thisRef && thisRef.isSelfProfile() ? (
        <TouchableOpacity onPress={thisRef.openProfileEdition} style={styles.page.editButton}>
          <MaterialIcons name="edit" size={30} color="white" />
        </TouchableOpacity>
      ) : null
    }
  };

  constructor(props) {
    super(props);

    this.props.navigation.setParams({ thisRef: this });

    this.state = { profile: null, refreshing: false };
  }

  componentWillMount() {
    return this.refresh();
  }

  refresh = async () => {
    try {
      let navProfile = this.props.navigation.state.params && this.props.navigation.state.params.profile;

      this.props.navigation.setParams({ profile: navProfile });

      let profileUid = navProfile ? navProfile.uid : firebase.auth().currentUser.uid;

      this.setState({ refreshing: true });

      await Permissions.askAsync(Permissions.LOCATION);
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

      const response = await client.query<any>({
        query: gql(`
          {
            profile(uid: "${profileUid}") {
              uid
              name
              username
              bio
              website
              phone
              gender
              photoURL
              score
              scoreBalance
              home

              posts {
                id
                body
                createdAt
                commentsCount
                rate
                distance
                exactDistance
                photoURL
                anonymous
                profilePostVote {
                  type
                }
                profileFollowPost{
                  postId
                  profileUid
                }
                profileRevealPosts{
                  profileUid
                  postId
                  type
                  post {
                    exactDistance
                  }
                }
                owner {
                  uid
                  username
                  photoURL
                }
                channels {
                  id
                  name
                }
              }
            }
          }`),
        fetchPolicy: 'no-cache',
        context: {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        }
      });

      this.setState({ profile: response.data.profile, errorMessage: null });
      this.props.navigation.setParams({ profile: response.data.profile });
      await AsyncStorage.setItem('cached-profile', JSON.stringify(this.state.profile));
    } catch (error) {
      const errorMessage = error.networkError ? i18n.t('screens.profile.errors.loadingProfile.connection') : i18n.t('screens.profile.errors.loadingProfile.unexpected');
      this.setState({ errorMessage });
      console.log(error);
    }

    this.setState({ refreshing: false });
  }

  logout = () => {
    firebase.auth().signOut();
  }

  isSelfProfile = () => {
    return this.state.profile && firebase.auth().currentUser && firebase.auth().currentUser.uid === this.state.profile.uid;
  }

  openChannel = (channel) => {
    this.props.navigation.push('TimelineScreen', { channel: channel });
  }

  openPost = (post) => {
    this.props.navigation.push('PostScreen', { post: post, onPostDeleted: this.onPostDeleted });
  }

  onPostDeleted = (post) => {
    _.remove(this.state.profile.posts, (p: any) => p.id === post.id);

    this.setState({
      profile: this.state.profile
    }); // force update
  }

  openProfileEdition = () => {
    this.props.navigation.push('ProfileEditionScreen', {
      profile: this.state.profile, onProfileEdition: profile => {
        this.setState({ profile: { ...this.state.profile, ...profile } });
      }
    });
  }

  render() {
    const photoDefault = require('../../../assets/avatar-placeholder.png');

    return (
      <ScrollView contentContainerStyle={styles.page.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
          />
        }>
        {this.state.errorMessage &&
          <View style={styles.page.errorView}>
            <Ionicons name="ios-sad" size={100} color="white" />
            <Text style={styles.page.errorText}>{this.state.errorMessage}</Text>
          </View>}
        {this.state.profile ?
          (
            <View>
              <View style={styles.profileInfo.row}>
                <Image width={100} height={100} source={this.state.profile.photoURL ? { uri: this.state.profile.photoURL } : photoDefault} style={styles.profileInfo.photo} />
                <View>
                  <Text style={styles.profileInfo.name}>{this.state.profile.name}</Text>
                  {this.state.profile.bio && <Text style={styles.profileInfo.bio}>{this.state.profile.bio}</Text>}
                  {this.state.profile.website && <Text>{this.state.profile.website}</Text>}

                  <View style={styles.profileInfo.score}>
                    <View style={styles.profileInfo.scoreInfo}>
                      <Badge
                        status='success'
                        value={this.state.profile.score}
                        containerStyle={styles.profileInfo.scoreBadge}
                      />
                    </View>
                    {this.isSelfProfile() && <View style={styles.profileInfo.scoreInfo}>
                      <Badge
                        status='error'
                        value={this.state.profile.scoreBalance}
                        containerStyle={styles.profileInfo.scoreBadge}
                      />
                    </View>}
                  </View>
                </View>
              </View>
            </View>) : null}
        {this.isSelfProfile() ? <TouchableOpacity style={styles.profileInfo.row}
          onPress={this.logout}>
          <Text style={styles.profileInfo.rowText}>{i18n.t('screens.profile.buttons.signOut')}</Text>
        </TouchableOpacity> : null}
        {(this.state.profile && this.state.profile.posts || []).map(item => (
          <TouchableOpacity key={item.id} onPress={() => this.openPost(item)}>
            <PostComponent post={item}
              showPostHeader={true}
              onOpenChannel={this.openChannel}
              onPostDeleted={this.onPostDeleted}/>
          </TouchableOpacity>)
        )}
      </ScrollView>
    );
  }
}

const styles = {
  page: StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: '#fff'
    },
    editButton: {
      marginRight: 10
    },
    errorView: {
      padding: 20,
      backgroundColor: THEME.colors.error.default,
      justifyContent: 'center',
      alignItems: 'center'
    },
    errorText: {
      color: 'white',
      textAlign: 'center'
    }
  }),
  profileInfo: StyleSheet.create({
    row: {
      marginTop: 2,
      padding: 12,
      backgroundColor: '#fff',
      flexDirection: 'row',
      alignItems: 'center'
    },
    rowText: {
      fontSize: 16
    },
    photo: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginRight: 15
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 3
    },
    bio: {
      fontSize: 16,
      marginBottom: 3
    },
    score: {
      flexDirection: 'row'
    },
    scoreInfo: {
      flexDirection: 'column',
    },
    scoreBadge: {
      marginTop: 3,
      marginRight: 10
    },
    scoreText: {
      fontSize: 15
    }
  })
};

interface ProfileScreenState {
  profile: any;
  refreshing: boolean;
  errorMessage?: string;
}

interface ProfileScreenProps {
  navigation: any;
}