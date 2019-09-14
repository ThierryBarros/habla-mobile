export interface AppTranslations {
    global: {
        user: {
            anonymousLabel: string;
        },
        enums: {
            distance: {
                here: string;
                very_close: string;
                close: string;
                far: string;
                very_far: string;
            },
            gender: {
                gender: string;
                male: string;
                female: string;
                other: string;
            };
        }
    },
    screens: {
        appLoading: {
            greeting: string;
            locationNotAuthorized: {
                message: string;
                buttons: {
                    openSettings: string;
                    retry: string;
                }
            };
            errors: { 
                fetchingProfile: {
                    unexpected: string;
                    connection: string;
                };
                updateExpoPushToken:{
                    internalServerError: string;
                }
            };

        },
        login: {
            inputs: {
                email: {
                    placeholder: string;
                },
                password: {
                    placeholder: string;
                }
            }
            buttons: {
                signInWithFacebook: string;
                signInWithCredentials: string;
                signUpWithCredentials: string;
            }
            errors:{
                signInWithFacebook: string;
                signInWithCredentials: string;
                signUpWithCredentials: string;
            }
        },
        profileCreation: {
            title: string;
            subtitle: string;
            subtitleWithName: string;
            labels: {
                name: string;
                username: string;
                bio: string;
                website: string;
                phone: string;
            },
            buttons: {
                next: string
            },
            errors:{
                unexpected: string;
                connection: string;
            }
        },
        timeline: {
            title: string;
            errors: { 
                fetchingPosts: {
                    unexpected: string;
                    connection: string;
                }
            },
            tabs: {
                recent: string;
                trending: string;
            }
        },
        channels: {
            title: string;
            searchPlaceholder: string;
            errors: { 
                fetchingChannels: {
                    unexpected: string;
                    connection: string;
                }
            }
        },
        newPost: {
            inputPlaceholder: string;
            buttons: {
                submit: string;
            },
            errors: {
                insufficentScore: string;
                internalServerError: string;
                connection: string;
                unexpected: string;
            },
            anonymous: string;
            
        },
        notifications: {
            title: string;
            notificationTypes: {
                commentOnOwnedPost: string;
                voteOnOwnedPost: string;
                commentOnThirdPartyPost:string;
                commentOnThirdPartyPostAnonymous:string;
            };
            errors: { 
                fetchingNotifications: {
                    unexpected: string;
                    connection: string;
                }
            }
        },
        post: {
            title: string;
            exactDistance: string; 
            comments: {
                newCommentInputPlaceholder: string;
                buttons: {
                    submit: string;
                }
            },
            buttons: {
                show: string;
                cancel: string;
                define: string;
            },
            alert: {
                title: string;
                message: string;
            },
            errors: { 
                loadingPost: {
                    unexpected: string;
                    connection: string;
                },
                commentingPost:{
                    unexpected: string;
                    connection: string;
                },
                votingPost:{
                    unexpected: string;
                    connection: string;
                },
                revealDistancePost:{
                    unexpected: string;
                    connection: string;
                },
            }
        },
        profile: {
            title: string;
            changePhoto: {
                title: string;
                option1: string,
                option2: string,
                cancel: string
            },
            buttons: {
                signOut: string;
                editProfile: string;
            },
            labels: {
                score: string;
                scoreBalance: string;
            },
            errors: { 
                loadingProfile: {
                    unexpected: string;
                    connection: string;
                }
            }
        },
        profileEdition: {
            title: string;
            labels: {
                name: string;
                username: string;
                bio: string;
                website: string;
                phone: string;
                home: string;
                undefined: string;
            },
            buttons: {
                save: string,
                cancel: string,
                define: string
            },
            alert: {
                title: string,
                message: string
            },
            errors:{
                unexpected: string;
                connection: string;
            }
        }
    },
    components: {
        post: {
            actionSheet: {
                follow: string;
                unfollow: string;
                delete: string;
                cancel: string;
            }
        }
    }
}