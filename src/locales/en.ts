import { AppTranslations } from "./app-translations";

const en: AppTranslations = {
    global: {
        user: {
            anonymousLabel: 'anonymous'
        },
        enums: {
            distance: {
                here: 'here',
                very_close: 'very close',
                close: 'close',
                far: 'far',
                very_far: 'very far'
            },
            gender: {
                gender: 'Gender',
                male: 'Male',
                female: 'Female',
                other: 'Other'
            }
        }
    },
    screens: {
        appLoading: {
            greeting: 'See what people are talking about near {{location}}!',
            locationNotAuthorized: {
                message: 'You need to allow access to your location information to use Habla.',
                buttons: {
                    openSettings: 'Open settings',
                    retry: 'Retry'
                }
            },
            errors: {
                fetchingProfile: {
                    unexpected: 'An unexpected error occurred while loading your profile information.',
                    connection: 'There was a problem loading your profile information. Please check your connection.'
                },
                updateExpoPushToken:{
                    internalServerError: "Error updating expo push token."
                }
            }
            
        },
        login: {
            inputs: {
                email: {
                    placeholder: 'Email'
                },
                password: {
                    placeholder: 'Password'
                }
            },
            buttons: {
                signInWithFacebook: 'Sign in with Facebook',
                signInWithCredentials: 'Sign in',
                signUpWithCredentials: 'Sign up'
            },
            errors:{
                signInWithFacebook: "An error occurred while logging in with facebook.",
                signInWithCredentials: "An error occurred while logging in with your credentials.",
                signUpWithCredentials: "An error occurred while signing up with your credentials."
            }
        },
        profileCreation: {
            title: 'Profile',
            subtitle: "You're almost ready to start using Habla! Let's create your public profile.",
            subtitleWithName: "You're almost ready to start using Habla, {{name}}! Let's create your public profile.",
            labels: {
                name: 'Name',
                username: 'Username',
                bio: 'Bio',
                website: 'Website',
                phone: 'Phone',
            },
            buttons: {
                next: 'Next'
            },
            errors:{
                unexpected: 'An unexpected error occurred while creating the profile.',
                connection: 'There was a problem creating the profile. Please check your connection.'
            }
        },
        timeline: {
            title: 'Timeline',
            errors: {
                fetchingPosts: {
                    unexpected: 'An unexpected error occurred while loading the posts.',
                    connection: 'There was a problem loading the posts. Please check your connection.'
                }
            },
            tabs: {
                recent: 'Recent',
                trending: 'Trending'
            }
        },
        channels: {
            title: 'Channels',
            searchPlaceholder: 'Type here...',
            errors: {
                fetchingChannels: {
                    unexpected: 'An unexpected error occurred while loading the channels.',
                    connection: 'There was a problem loading the channels. Please check your connection.'
                }
            }
        },
        newPost: {
            inputPlaceholder: "What's up?",
            buttons: {
                submit: 'Send'
            },
            errors: {
                insufficentScore: 'Insufficient score to make anonymous posts.',
                internalServerError: 'Post picture could not be saved.',
                connection: 'There was a problem creating the post. Please check your connection.',
                unexpected: 'An unexpected error occurred while creating the post.'
            },
            anonymous: 'Anonymous'
        },
        notifications: {
            title: 'Notifications',
            notificationTypes: {
                commentOnOwnedPost: '{{username}} commented on your post',
                voteOnOwnedPost: '{{voteCount}} people voted on your post',
                commentOnThirdPartyPost: "{{username}} commented on {{postOwner}}'s post",
                commentOnThirdPartyPostAnonymous: "{{username}} commented on a post that you follow"
            },
            errors: {
                fetchingNotifications: {
                    unexpected: 'An unexpected error occurred while loading the notifications.',
                    connection: 'There was a problem loading the notifications. Please check your connection.'
                }
            }
        },
        post: {
            title: 'Post',
            exactDistance: '{{meters}} meters',
            comments: {
                newCommentInputPlaceholder: 'Type a comment...',
                buttons: {
                    submit: 'Send'
                }
            },
            buttons: {
                show: 'Show',
                cancel: 'Cancel',
                define: 'Define'
            },
            alert: {
                title: 'Reveal exact location of this post?',
                message: 'This will cost 10 points.'
            },
            errors: {
                loadingPost: {
                    unexpected: 'An unexpected error occurred while loading the post.',
                    connection: 'There was a problem loading the post. Please check your connection.'
                },
                commentingPost:{
                    unexpected: 'An unexpected error occurred while commenting the post.',
                    connection: 'There was a problem commenting the post. Please check your connection.'
                },
                votingPost:{
                    unexpected: 'An unexpected error occurred while voting the post.',
                    connection: 'There was a problem voting the post. Please check your connection.'
                },
                revealDistancePost:{
                    unexpected: 'Insufficient score to reveal post information.',
                    connection: 'There was a problem voting the post. Please check your connection.'
                }
            }
        },
        profile: {
            title: 'Profile',
            changePhoto: {
                title: 'Change photo',
                option1: 'Camera',
                option2: 'Gallery',
                cancel: 'Cancel'
            },
            buttons: {
                signOut: 'Sign out',
                editProfile: 'Edit profile'
            },
            labels: {
                score: 'Score',
                scoreBalance: 'Score balance'
            },
            errors: {
                loadingProfile: {
                    unexpected: 'An unexpected error occurred while loading the profile.',
                    connection: 'There was a problem loading the profile. Please check your connection.'
                }
            }
        },
        profileEdition: {
            title: 'Edit profile',
            labels: {
                name: 'Name',
                username: 'Username',
                bio: 'Bio',
                website: 'Website',
                phone: 'Phone',
                home: 'Home',
                undefined: 'Undefined'
            },
            buttons: {
                save: 'Save',
                cancel: 'Cancel',
                define: 'Define'
            },
            alert: {
                title: 'Define current location as your home?',
                message: "You will be able to see the posts from the region you defined as home even if you're not there."
            },
            errors:{
                unexpected: 'An unexpected error occurred while editing the profile.',
                connection: 'There was a problem editing the profile. Please check your connection.'
            }
        }
    },
    components: {
        post: {
            actionSheet: {
                follow: 'Follow',
                unfollow: 'Unfollow',
                delete: 'Delete',
                cancel: 'Cancel'
            }
        }
    }
};

export default en;