import * as React from 'react';
import { StyleSheet, ScrollView, Text, View, RefreshControl, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import firebase from 'firebase';
import PostComponent from '../../components/post/post';
import moment from 'moment';
import { client } from '../../services/client';
import gql from 'graphql-tag';
import { Location } from 'expo';
import THEME from '../../theme/theme';
import i18n from 'i18n-js';
import { getTranslatedDistanceFromEnum } from '../../util';
import { Ionicons } from '@expo/vector-icons';

export default class PostScreen extends React.Component<PostScreenProps, PostScreenState> {
  static navigationOptions = () => {
    return {
      title: i18n.t('screens.post.title'),
      headerStyle: {
        backgroundColor: THEME.colors.primary.default,
        borderBottomWidth: 0,
      },
      headerTitleStyle: {
        color: '#F5F5F5'
      }
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      post: null,
      newComment: { body: null },
      refreshing: false,
      postingComment: false
    };
  }

  async componentWillMount() {
    let navPost = this.props.navigation.state.params && this.props.navigation.state.params.post;

    this.setState({ post: navPost }, async () => {
      await this.refresh();
    });
  }

  refresh = async () => {
    if (!this.postId) return;

    this.setState({ refreshing: true });

    try {
      await this.loadPost();
    } catch (error) {
      console.log(error);
    }

    this.setState({ refreshing: false });
  }

  loadPost = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const response = await client.query<any>({
      query: gql(`
        {
          post(id: ${this.postId}) {
            id
            body
            distance
            exactDistance
            createdAt
            anonymous
            commentsCount
            rate
            photoURL
            profilePostVote {
              type
            }
            profileFollowPost {
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
              name
              photoURL
            }
            profilePostVote {
              type
            }
            owner {
              uid
              username
              name
              photoURL
            }
            channels {
              id
              name
            }
            comments {
              id
              createdAt
              body
              distance
              owner {
                uid
                name
                username
              }
            }
          }
        }
        `),
        context: {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        },
        fetchPolicy: 'no-cache'
      });

      this.setState({ post: response.data.post, errorMessage: null });
    } catch (error) {
      const errorMessage = error.networkError ? i18n.t('screens.post.errors.loadingPost.connection') : i18n.t('screens.post.errors.loadingPost.unexpected');
      this.setState({ errorMessage });
      console.log(error);
    }
  }

  logout = () => {
    firebase.auth().signOut();
  }

  openChannel = (channel) => {
    this.props.navigation.push('TimelineScreen', { channel: channel });
  }

  openProfile = (profile) => {
    this.props.navigation.push('ProfileScreen', { profile: profile });
  }
  
  onPostDeleted = () => {
    this.props.navigation.pop();

    this.props.navigation.state.params && this.props.navigation.state.params.onPostDeleted && this.props.navigation.state.params.onPostDeleted(this.state.post);
  }

  handleCommentInput = (text) => {
    this.setState({
      newComment: {
        body: text
      }
    });
  }

  sendComment = async () => {
    this.setState({ postingComment: true });

    const location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });

    try {
      const response = await client.mutate({
        variables: {
          comment: this.state.newComment,
          postId: this.state.post.id
        },
        mutation: gql(`
          mutation CreateComment ($postId: ID!, $comment: CommentInput!) {
            createComment(postId: $postId, comment: $comment) {
              id
              body
              distance
              owner {
                uid
                name
                username
              }
            }
          }
        `),
        context: {
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        }
      });

      
      this.setState({ 
        post: { 
          ...this.state.post, 
          comments: [response.data.createComment, ...this.state.post.comments], 
          commentsCount: this.state.post.commentsCount + 1,
          profileFollowPost: {
            profileUid: firebase.auth().currentUser.uid,
            postId: this.state.post.id
          }
        },
        newComment: { 
          body: null 
        }
      });
    } catch (error) {
      const errorMessage = error.networkError ? i18n.t('screens.post.errors.commentingPost.connection') : i18n.t('screens.post.errors.commentingPost.unexpected');
      this.setState({ errorMessage });
      console.log(error);
    }

    this.setState({ postingComment: false });
  }

  get postId() {
    return this.props.navigation.state.params && (this.props.navigation.state.params.post && this.props.navigation.state.params.post.id || this.props.navigation.state.params.postId);
  }

  render() {
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
        {this.state.post &&
          <PostComponent post={this.state.post}
            showPostHeader={true}
            onOpenProfile={this.openProfile}
            onOpenChannel={this.openChannel} 
            onPostDeleted={this.onPostDeleted}/>}
        {this.state.post &&
          <View style={styles.newComment.container}>
            <TextInput style={styles.newComment.input}
              onChangeText={this.handleCommentInput}
              value={this.state.newComment.body}
              placeholderTextColor="black"
              placeholder={i18n.t('screens.post.comments.newCommentInputPlaceholder')}
              editable={!this.state.postingComment}
              underlineColorAndroid="rgba(0,0,0,0)" />
            {(!!this.state.newComment.body && this.state.newComment.body.trim() !== '') &&
              <TouchableOpacity style={styles.newComment.sendButton}
                onPress={this.sendComment}
                disabled={this.state.postingComment}
                activeOpacity={1}>
                {this.state.postingComment ? <ActivityIndicator color="white" /> : <Text style={styles.newComment.sendButtonText}>{i18n.t('screens.post.comments.buttons.submit')}</Text>}
              </TouchableOpacity>}
          </View>}
        {this.state.post && this.state.post.comments && <FlatList data={this.state.post.comments as any[]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.comment.view}>
              <View style={styles.comment.header}>
                <TouchableOpacity onPress={() => this.openProfile(item.owner)}>
                  <Text style={styles.comment.username}>{item.owner ? item.owner.username : i18n.t('global.user.anonymousLabel')}</Text>
                </TouchableOpacity>
                <Text style={styles.comment.distance}>{getTranslatedDistanceFromEnum(item.distance)}</Text>
              </View>
              <Text style={styles.comment.body}>{item.body}</Text>
              <Text style={styles.comment.bottomText}>{moment(item.createdAt).fromNow(true)}</Text>
            </View>
          )} />}
      </ScrollView>
    );
  }
}

const styles = {
  page: StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
  comment: StyleSheet.create({
    view: {
      backgroundColor: 'white',
      padding: 12,
      marginBottom: 2
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    headerText: {
      fontSize: 10,
      color: '#000'
    },
    distance: {
      fontSize: 10,
      fontWeight: 'bold'
    },
    bottomText: {
      fontSize: 10,
      color: '#000'
    },
    body: {
      fontSize: 16,
      color: '#000'
    },
    username: {
      fontSize: 12,
      fontWeight: 'bold',
      marginRight: 2,
      color: '#000'
    },
  }),
  newComment: StyleSheet.create({
    container: {
      backgroundColor: 'white',
      marginVertical: 2,
      flexDirection: 'row',
    },
    input: {
      padding: 16,
      backgroundColor: 'white',
      color: 'black',
      flex: 1,
      fontSize: 18
    },
    sendButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: THEME.colors.secondary.default,
      padding: 8,
      width: 50,
      height: 35,
      borderRadius: 100,
      margin: 5
    },
    sendButtonText: {
      color: 'white',
      fontWeight: 'bold',
    }
  })
};

interface PostScreenState {
  post: any;
  newComment: { body: string };
  refreshing: boolean;
  postingComment: boolean;
  errorMessage?: string;
}

interface PostScreenProps {
  navigation: any;
}