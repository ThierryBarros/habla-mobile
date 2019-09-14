import * as React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Dimensions, Alert} from 'react-native';
import moment from 'moment';
import { FontAwesome } from '@expo/vector-icons';
import { client } from '../../services/client';
import gql from 'graphql-tag';
import i18n from 'i18n-js';
import { getTranslatedDistanceFromEnum } from '../../util';
import ParsedText from 'react-native-parsed-text';
import AutoHeightImage from 'react-native-auto-height-image';
import THEME from '../../theme/theme';
import firebase from 'firebase';

export default class PostComponent extends React.Component<PostComponentProps, PostComponentState> {
  
  constructor(props: PostComponentProps) {
    super(props);

    this.state = { 
      post: this.props.post
    };
  }

  componentWillReceiveProps() {
    
    this.setState({ post: this.props.post });
    
  }

  followPost = async() => {
    this.setState({ post: { ... this.state.post }});

    try {
      const response = await client.mutate({
        variables: { 
          postId: this.state.post.id
        },
        mutation: gql(`
          mutation FollowPost ($postId: ID!) {
            togglePostFollow(postId: $postId) {
              postId
              profileUid
            }
          }
  
        `),
        
      });

      this.setState({
        post: {
          ... this.state.post,
          profileFollowPost: response.data.togglePostFollow,
        }
      });
    } catch (error) {
     
    }
  }
  

  vote = async(type: "UP" | "DOWN") => {
    if (!(type === "UP" || type === "DOWN")) return;

    this.setState({ post: { ... this.state.post }});

    try {
      const response = await client.mutate({
        variables: { 
          postId: this.state.post.id,
          type: type
        },
        mutation: gql(`
          mutation VotePost ($postId: ID!, $type: PostVoteType!) {
            vote(postId: $postId, type: $type) {
              type
              post {
                id
              }
              profile {
                uid
                photoURL
              }
              post {
                rate
              }
            }
          }
        `)
      });

      this.setState({
        post: {
          ... this.state.post, 
          rate: response.data.vote.post.rate,
          profilePostVote: response.data.vote
        }
      });
    } catch (error) {
      const errorMessage = error.networkError? i18n.t('screens.post.errors.votingPost.connection'):i18n.t('screens.post.errors.votingPost.unexpected');
      this.setState({ errorMessage });
      console.log(error);
    }
  }

  handleHashTagPress(name, matchIndex) {
    name = name.replace(/#/, "");
    return this.state.post.channels.find(c => c.name === name);
  }

  deletePost = async() => {
    await client.mutate({
      variables: {
        postId : this.state.post.id
      },
      mutation: gql(`
        mutation deletePost ($postId: ID!) {          
          deletePost (postId: $postId)
        }
      `)
    });

    this.props.onPostDeleted && await this.props.onPostDeleted(this.state.post);
  }

  revealDistance = async(type: "EXACT_DISTANCE") => {
    if (!(type === "EXACT_DISTANCE")) return;

    this.setState({ post: { ... this.state.post }});

    try {
      const response = await client.mutate({
        variables: {
          postId : this.state.post.id,
          type: type
        },
        mutation: gql(`
          mutation revealPost ($postId: ID!, $type: ProfileRevealPostType!) {          
            revealPost (postId: $postId, type: $type){
              type
              postId
              profileUid
              post {
                exactDistance
              }
            }
          }
        `)
      });

      this.setState({
        post: {
          ... this.state.post, 
          exactDistance: response.revealPost.post.exactDistance,
        }
      });

    } catch (error) {
      const errorMessage = error.networkError? i18n.t('screens.post.errors.revealDistancePost.connection'):i18n.t('screens.post.errors.revealDistancePost.unexpected');
      this.setState({ errorMessage });
      console.log(error);
    } 
  }

  showAlert = () => {
    Alert.alert(
      i18n.t('screens.post.alert.title'),
      i18n.t('screens.post.alert.message'),
      [
        {text: i18n.t('screens.post.buttons.cancel'), onPress: () => {}},
        {text: i18n.t('screens.post.buttons.show'), onPress: () => this.revealDistance("EXACT_DISTANCE")}
      ],
      { cancelable: false}
    )
  }
  
  render() {
      const vote = this.state.post.profilePostVote && this.state.post.profilePostVote.type;
      const photoDefault = require('../../../assets/avatar-placeholder.png');
      const { profileFollowPost } = this.state.post;
      
      return (
       
      <View style={styles.container}>
      { this.props.showPostHeader? 
        (<View style={styles.header}>
          <TouchableOpacity style={styles.avatar} disabled={ !this.state.post.owner } onPress={() => this.props.onOpenProfile && this.props.onOpenProfile(this.state.post.owner)}> 
            <Image style={styles.avatarIconImage as any} source={!this.state.post.anonymous && this.state.post.owner && this.state.post.owner.photoURL? { uri: this.state.post.owner.photoURL }: photoDefault} width={40} height={40}/>
            {this.state.post.anonymous? <Text style={styles.headerText}>{ i18n.t('global.user.anonymousLabel')}</Text>: <Text style={styles.headerText}>{ this.state.post.owner.username }</Text>}
          </TouchableOpacity>
          <View style={styles.postOptions}>
            { !(this.state.post.owner && this.state.post.owner.uid === firebase.auth().currentUser.uid) ?
              <TouchableOpacity style={styles.clickableArea} onPress={this.followPost}>
                <FontAwesome name={!profileFollowPost ? "bell-o" : "bell-slash-o"} size={20}/>
              </TouchableOpacity>
            :
              <TouchableOpacity style={styles.clickableArea} onPress={this.deletePost}>
                <FontAwesome name="trash-o" size={20}/>
              </TouchableOpacity>
            } 
          </View>
        </View>)
      : null }
        <View style={styles.postBody}>
          <View style={styles.postLeft}>
            <View style={styles.middle}>
              <ParsedText style={styles.bodyText}
                          parse={ 
                            [
                              {pattern: /#(\w+)/, style: styles.hashTag, onPress:(name,matchIndex)=> this.props.onOpenChannel && this.props.onOpenChannel(this.handleHashTagPress(name,matchIndex))}, 
                            ]
                          }
                          childrenProps={{allowFontScaling: false}}
              >{ this.state.post.body }
              </ParsedText>
            </View>
            {this.state.post.photoURL && <AutoHeightImage width={Dimensions.get('window').width - 80} source={{ uri: this.state.post.photoURL}}/>}
          </View>
          <View style={styles.postRight}>
            <TouchableOpacity disabled={vote === "UP"} onPress={() => this.vote("UP")}>
              <FontAwesome style={styles.voteButton} name="chevron-up" color={vote === "UP"? "#777": null}/>
            </TouchableOpacity>
            <Text style={styles.postRate}>
              { this.state.post.rate || 0 }
            </Text>
            <TouchableOpacity disabled={vote === "DOWN"} onPress={() => this.vote("DOWN")}>
              <FontAwesome style={styles.voteButton} name="chevron-down" color={vote === "DOWN"? "#777": null}/>
            </TouchableOpacity> 
          </View>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.distance} disabled={this.state.post.exactDistance} onPress={this.showAlert} hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}>
            <Text style={styles.bottomText}>{this.state.post.exactDistance ? i18n.t('screens.post.exactDistance', { meters: `${this.state.post.exactDistance}` }) : getTranslatedDistanceFromEnum(this.state.post.distance)}</Text>
          </TouchableOpacity>
          <Text style={styles.separator}>
            •
          </Text>
          <Text style={styles.bottomText}>{ moment(this.state.post.createdAt).fromNow() }</Text>
          {this.state.post.channel? 
          (<View style={styles.footerItem}>
            <Text style={styles.separator}>
              •
            </Text>
            <TouchableOpacity onPress={() => this.props.onOpenChannel && this.props.onOpenChannel(this.state.post.channel)}>
              <Text style={styles.channelTitle}>#{ this.state.post.channel.name } </Text>
            </TouchableOpacity>
          </View>): (null)}
          <Text style={styles.separator}>
            •
          </Text>
          <View style={styles.footerItem}>
            <FontAwesome style={styles.footerItemIcon} name="comments"/>
            <Text style={styles.bottomText}>
              { this.state.post.commentsCount }
            </Text>
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
  postBody: {
    flexDirection: 'row',
  },
  container: { 
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 20,
    borderBottomColor: '#F5F5F5',
    borderBottomWidth: 2
  }, 
  notificationButton: {
    marginRight: 10
  },
  header: {
    flexDirection: 'row',
    marginBottom: 2,
    justifyContent: 'space-between',
    alignItems: "center"
  },
  bottom: {
    flexDirection: 'row',
    marginTop: 2,
    alignItems: "center"
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarIcon: {
    fontSize: 30,
    marginRight: 8
  },
  avatarIconImage: {
    marginRight: 8,
    width: 40,
    height: 40,
    borderRadius: 20
  },
  headerText: {
    fontSize: 14, 
    fontWeight: '400'
  },
  channelTitle: {
    fontSize: 14,
    fontWeight: '400'
  },
  bodyText: {
    fontSize: 20,
    fontWeight: '300',
    color: '#181818',
    marginVertical: 8
  },
  middle: {
    flexDirection: 'row'
  },
  postLeft: {
    width: '90%'
  },
  postRight: {
    flexGrow: 1,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10
  },
  postOptions: {
    flexGrow: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: -5
  },
  voteButton: {
    fontSize: 25,
  },
  postRate: {
    fontSize: 18
  },
  bottomText: {
    fontSize: 10
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItemIcon: {
    fontSize: 20,
    marginRight: 3
  },
  separator: {
    marginHorizontal: 5
  },
  hashTag: {
    color: THEME.colors.primary.default
  },
  clickableArea:{
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 20, 
    paddingRight: 13
  },
  distance:{
    paddingRight: 11
  }
});

export interface PostComponentProps {
  post: any;
  showPostHeader: boolean;
  onOpenProfile?: (profile) => void;
  onOpenChannel?: (channel) => void;
  onPostDeleted?: (post) => void;
}

export interface PostComponentState {
  post: any;
  errorMessage?: string;
}