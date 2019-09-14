import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator, StatusBar, Dimensions } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Permissions, Location } from 'expo';
import { client } from '../../services/client';
import gql from 'graphql-tag';
import THEME from '../../theme/theme';
import i18n from 'i18n-js';
import { CheckBox } from 'react-native-elements';

import ChangePhotoComponent from '../../components/change-photo/change-photo'
import AutoHeightImage from 'react-native-auto-height-image';

export default class NewPostScreen extends React.Component<NewPostScreenProps, NewPostScreenState> {
  constructor(props: NewPostScreenProps) {
    super(props);

    this.state = {
      post: { body: null, anonymous: false }
    };
  }

  componentWillMount() {
    this.resetPost();
  }

  handlePostInput = (text: string) => {
    this.setState({ post: { ...this.state.post, body: text } });
  }

  sendPost = async () => {
    this.setState({ posting: true });
    let customLocation = this.props.customLocation;

    await Permissions.askAsync(Permissions.LOCATION);
    const local = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
    const location = customLocation ? customLocation : [local.coords.latitude, local.coords.longitude];
    try {
      const response = await client.mutate({
        variables: {
          post: this.state.post,
          channelId: this.props.channel ? this.props.channel.id : null,
          photo: this.state.photo && this.state.photo.uri && this.state.photo.uri.startsWith('data') && this.state.photo.uri,
        },
        mutation: gql(`
          mutation CreatePost ($post: PostInput!, $photo: Upload) {
            createPost(post: $post, photo: $photo) {
              id
              body
              distance
              exactDistance
              createdAt
              commentsCount
              rate
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
        `),
        context: {
          location: {
            latitude: location[0],
            longitude: location[1]
          }
        }
      });

      this.props.onSuccess && this.props.onSuccess(response.data.createPost);
    } catch (error) {
      if (error.graphQLErrors.find(e => e.code == 'INSUFFICENT_SCORE_ERROR')) {
        const errorMessage = i18n.t('screens.newPost.errors.insufficentScore');
        this.setState({ errorMessage });
        console.log(error);
      } else if (error.graphQLErrors.find(e => e.code == 'INTERNAL_SERVER_ERROR')) {
        const errorMessage = i18n.t('screens.newPost.errors.internalServerError');
        this.setState({ errorMessage });
        console.log(error);
      } else {
        const errorMessage = error.networkError ? i18n.t('screens.newPost.errors.connection') : i18n.t('screens.newPost.errors.unexpected');
        this.setState({ errorMessage });
        console.log(error);
      }
    }

    this.setState({ posting: false });
  }

  resetPost() {
    this.setState({
      post: {
        body: this.props.channel && `#${this.props.channel.name}`, anonymous: false
      }
    });
  }

  dismiss = () => {
    this.props.onDismiss && this.props.onDismiss();
  }

  importPhoto = async (photo) => {
    if (!photo) return;

    this.setState({ photo: { uri: photo } })
  }

  render() {
    var {height, width} = Dimensions.get('window');
    return (
      <View style={styles.newPost.container}>
        <StatusBar hidden={true}></StatusBar>
        <View style={styles.header.container}>
          <TouchableOpacity onPress={this.dismiss}>
            <FontAwesome name="chevron-left" size={35} color={THEME.colors.primary.default}></FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={this.sendPost}
            disabled={this.state.posting || !this.state.post.body || this.state.post.body.trim() == ''}
            activeOpacity={1}>
            {this.state.posting ? <ActivityIndicator color="white" /> : <Text style={styles.newPost.sendButtonText}>{i18n.t('screens.newPost.buttons.submit')}</Text>}
          </TouchableOpacity>
        </View>
        {this.state.errorMessage &&
          <View style={styles.newPost.errorView}>
            <Ionicons name="ios-sad" size={100} color="white" />
            <Text style={styles.newPost.errorText}>{this.state.errorMessage}</Text>
          </View>}
        <TextInput style={styles.newPost.input}
          onChangeText={this.handlePostInput}
          value={this.state.post.body}
          placeholderTextColor="white"
          placeholder={i18n.t('screens.newPost.inputPlaceholder')}
          editable={!this.state.posting}
          multiline={true}
          underlineColorAndroid="rgba(0,0,0,0)" />
        {this.state.photo && this.state.photo.uri && <AutoHeightImage width={width} source={{ uri: this.state.photo.uri }} />}
        <View style={styles.footer.container}>
          <CheckBox
            title={i18n.t('screens.newPost.anonymous')}
            checked={this.state.post.anonymous}
            checkedColor={THEME.colors.primary.default}
            uncheckedColor={THEME.colors.primary.default}
            textStyle={styles.newPost.anonymousText}
            containerStyle={styles.newPost.anonymousButton}
            onPress={() => this.setState({ post: { ...this.state.post, anonymous: !this.state.post.anonymous } })}
          />
          <ChangePhotoComponent onPhotoSelected={this.importPhoto} enabled={!this.state.posting} squared={true}>
            <FontAwesome name="image" size={35} color={THEME.colors.primary.default}></FontAwesome>
          </ChangePhotoComponent>
        </View>
      </View>
    );
  }
}

const styles = {
  header: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'space-between'
    }
  }),
  footer: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      justifyContent: 'space-between'
    }
  }),
  newPost: StyleSheet.create({
    container: {
      backgroundColor: THEME.colors.secondary.light,
      flexGrow: 1,
    },
    anonymousButton: {
      backgroundColor: THEME.colors.secondary.light,
      borderWidth: 0
    },
    anonymousText: {
      color: 'white'
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
    },
    input: {
      marginTop: 5,
      padding: 16,
      backgroundColor: THEME.colors.secondary.light,
      color: 'white',
      flex: 1,
      fontSize: 25,
      flexGrow: 1,
      fontWeight: "bold",
      textAlignVertical: "top"
    },
    sendButtonText: {
      fontSize: 18,
      textAlign: 'center',
      color: 'white',
      fontWeight: "bold"
    }
  })
};

interface NewPostScreenState {
  post: any;
  posting?: boolean;
  photo?: any;
  errorMessage?: string;
}

interface NewPostScreenProps {
  navigation: any;
  onSuccess: Function;
  onDismiss: Function;
  channel: any;
  customLocation: any;
}
