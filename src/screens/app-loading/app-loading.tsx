import * as React from "react";
import firebase from 'firebase';
import { client } from "../../services/client";
import gql from "graphql-tag";
import { AsyncStorage, Text, View, StyleSheet, ActivityIndicator, TouchableOpacity, AppState, StatusBar } from "react-native";
import THEME from "../../theme/theme";
import { Location, Linking, Permissions, Notifications } from 'expo';
import { Ionicons } from '@expo/vector-icons';

export default class AppLoadingScreen extends React.Component<any, AppLoadingState> {
  _notificationsSubscription;

  constructor(props) {
    super(props);

    console.disableYellowBox = true;

    this.state = {
      loading: true,
      location: null
    };
  }

  componentWillMount = async() => {
    await this.init();
  }

  init = async() => {
    try {
      await this.checkLocationServices();
    } catch (error) {
      let handler = async(event) => {
        if (event === 'active') {
          AppState.removeEventListener('change', handler);
          await this.init();
        }
      };

      AppState.addEventListener('change', handler);

      return;
    }

    await this.checkAuthentication();
  }

  checkLocationServices = async() => {
    let lastLocation = await AsyncStorage.getItem('last-location');

    if (lastLocation) {
      lastLocation = JSON.parse(lastLocation);

      this.setState({ location: lastLocation });
    }

    try {
      this.setState({ loading: true });

      await Location.requestPermissionsAsync();

      this.setState({ locationNotAuthorized: false });
    } catch (error) {
      this.setState({ locationNotAuthorized: true, loading: false });

      throw error;
    }

    const coords = (await Location.getCurrentPositionAsync()).coords;
    
    let location: any = await Location.reverseGeocodeAsync({ latitude: coords.latitude, longitude: coords.longitude });

    if (location && location[0]) {
      location = location[0];
    }

    await AsyncStorage.setItem('last-location', JSON.stringify(location));

    this.setState({ location: location });
  }

  checkAuthentication = async() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        let token = await firebase.auth().currentUser.getIdToken();

        const storedProfile = await AsyncStorage.getItem('userProfile');
        
        let profile = storedProfile? JSON.parse(await AsyncStorage.getItem('userProfile')): null;

        if (!profile) {
          try {
            const response = await client.query({
              query: gql(`
                {
                  profile(uid: "${user.uid}") {
                    uid
                    name
                    username
                    bio
                    website
                    phone
                    gender
                  }
                }
              `),
              fetchPolicy: 'no-cache'
            });

            profile = (response.data as any).profile;
          } catch (error) {
            console.log(JSON.stringify(error));
          }
        }

        if (profile) {
          await AsyncStorage.setItem('userProfile', JSON.stringify(profile));

          this.props.navigation.navigate('TabsNavigator');

          await this.registerForNotifications();
        } else {
          this.props.navigation.navigate('ProfileCreationScreen', { user: user });
        }
      } else {
        this.props.navigation.navigate('LoginScreen');
        await AsyncStorage.removeItem('userProfile');
      }
    });
  }

  registerForNotifications = async() => {
    if (this.props.exp && this.props.exp.notification) {
      console.log(this.props.exp.notification);
    }

    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    const response = await client.mutate({
      variables: { 
        token: token
      },
      mutation: gql(`
        mutation UpdateExpoPushToken ($token: String) {
          updateExpoPushToken(token: $token)
        }
      `)
    });

    if (response.data.updateExpoPushToken) {
      console.log("Expo push token updated.");
    }

    this._notificationsSubscription = Notifications.addListener(this.handleNotification);
  }

  handleNotification = async(notification) => {
    console.log(notification);
  }

  render() {
    return (
      <View style={styles.page.container}>
        <StatusBar barStyle="light-content"/>
        { this.state.loading && <ActivityIndicator color="white" size="large"/>}
        { this.state.location && !this.state.locationNotAuthorized && <Text style={styles.page.text}>See what people are talking about in { this.state.location.city || this.state.location.name }!</Text> }
        { this.state.locationNotAuthorized && 
          <View style={styles.page.locationNotAuthorizedView}>
            <Ionicons name="ios-sad" size={100} color="white"/>
            <Text style={styles.page.text}>You need to allow access to your location information to use Habla.</Text>
            <TouchableOpacity style={styles.button.touchable} onPress={() => Linking.openURL('app-settings:')}>
              <Text style={styles.button.text}>Open settings</Text>
            </TouchableOpacity>
          </View>}
      </View>
    );
  }
}

const styles = {
  page: StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: THEME.colors.secondary.light
    },
    text: {
      padding: 20,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center'
    },
    locationNotAuthorizedView: {
      justifyContent: 'center',
      alignItems: 'center'
    }
  }),
  button: StyleSheet.create({
    text: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16
    },
    touchable: {
      backgroundColor: THEME.colors.primary.default,
      padding: 12,
      borderRadius: 10
    }
  })
};

interface AppLoadingState {
  loading: boolean;
  location?: any;
  locationNotAuthorized?: boolean;
}