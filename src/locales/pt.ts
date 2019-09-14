import { AppTranslations } from "./app-translations";

const pt: AppTranslations = {
    global: {
        user: {
            anonymousLabel: 'anônimo'
        },
        enums: {
            distance: {
                here: 'aqui',
                very_close: 'muito perto',
                close: 'perto',
                far: 'longe',
                very_far: 'muito longe'
            },
            gender: {
                gender: 'Gênero',
                male: 'Masculino',
                female: 'Feminino',
                other: 'Outro'
            }
        }
    },
    screens: {
        appLoading: {
            greeting: 'Saiba o que está em alta perto de {{location}}!',
            locationNotAuthorized: {
                message: 'Você precisa permitir o acesso à sua localização para usar o Habla.',
                buttons: {
                    openSettings: 'Abrir configurações',
                    retry: 'Tentar novamente'
                }
            },
            errors: {
                fetchingProfile: {
                    unexpected: 'Um erro inesperado ocorreu ao carregar o seu perfil.',
                    connection: 'Houve um erro de conexão ao carregar o seu perfil. Verifique se está conectado à internet.'
                },
                updateExpoPushToken:{
                    internalServerError: "Erro ao atualizar o token do expo."
                }
            }
        },
        login: {
            inputs: {
                email: {
                    placeholder: 'Email'
                },
                password: {
                    placeholder: 'Senha'
                }
            },
            buttons: {
                signInWithFacebook: 'Entrar com o Facebook',
                signInWithCredentials: 'Entrar',
                signUpWithCredentials: 'Cadastrar'
            },
            errors:{
                signInWithFacebook: "Ocorreu um erro durante o login com o facebook.",
                signInWithCredentials: "Um erro ocorreu ao logar com as credenciais informadas.",
                signUpWithCredentials: "Um erro ocorreu ao cadastrar com as credenciais informadas."
            }
        },
        profileCreation: {
            title: 'Perfil',
            subtitle: "Você está quase lá! Vamos criar o seu perfil público.",
            subtitleWithName: "Você está quase lá, {{name}}! Vamos criar o seu perfil público.",
            labels: {
                name: 'Nome',
                username: 'Usuário',
                bio: 'Bio',
                website: 'Website',
                phone: 'Telefone',
            },
            buttons: {
                next: 'Continuar'
            },
            errors:{
                unexpected: 'Um erro inesperado ocorreu ao criar o perfil.',
                connection: 'Houve um erro de conexão ao criar o perfil. Verifique se está conectado à internet.'
            }
        },
        timeline: {
            title: 'Linha do tempo',
            errors: {
                fetchingPosts: {
                    unexpected: 'Um erro inesperado ocorreu ao carregar os posts.',
                    connection: 'Houve um erro de conexão ao carregar os posts. Verifique se está conectado à internet.'
                }
            },
            tabs: {
                recent: 'Recente',
                trending: 'Em alta'
            }
        },
        channels: {
            title: 'Canais',
            searchPlaceholder: 'Digite aqui...',
            errors: {
                fetchingChannels: {
                    unexpected: 'Um erro inesperado ocorreu ao carregar os canais.',
                    connection: 'Houve um erro de conexão ao carregar os canais. Verifique se está conectado à internet.'
                }
            }
        },
        newPost: {
            inputPlaceholder: "O que está acontecendo?",
            buttons: {
                submit: 'Enviar'
            },
            errors: {
                insufficentScore: "Pontuação insuficiente para fazer posts anônimos.",
                internalServerError: "A foto do post não pôde ser salva.",
                connection: "Houve um erro de conexão ao criar o post. Verifique se está conectado à internet.",
                unexpected: "Um erro inesperado ocorreu ao criar o post."
            },
            anonymous: "Anônimo"
        },
        notifications: {
            title: 'Notificações',
            notificationTypes: {
                commentOnOwnedPost: '{{username}} comentou na sua publicação',
                voteOnOwnedPost: '{{voteCount}} pessoas votaram na sua publicação',
                commentOnThirdPartyPost: '{{username}} comentou no post de {{postOwner}}',
                commentOnThirdPartyPostAnonymous: "{{username}} comentou em um post que você segue"
            },
            errors: {
                fetchingNotifications: {
                    unexpected: 'Um erro inesperado ocorreu ao carregar as notificações.',
                    connection: 'Houve um erro de conexão ao carregar as notificações. Verifique se está conectado à internet.'
                }
            }
        },
        post: {
            title: 'Publicação',
            exactDistance: '{{meters}} metros', 
            comments: {
                newCommentInputPlaceholder: 'Escreva um comentário...',
                buttons: {
                    submit: 'Enviar'
                }
            },
            buttons: {
                show: 'Mostrar',
                cancel: 'Cancelar',
                define: 'Definir'
            },
            alert: {
                title: 'Revelar a localização exata desse post?',
                message: 'Isso irá custar 10 pontos.'
            },
            errors: {
                loadingPost: {
                    unexpected: 'Um erro inesperado ocorreu ao carregar o post.',
                    connection: 'Houve um erro de conexão ao carregar o post. Verifique se está conectado à internet.'
                },
                commentingPost:{
                    unexpected: 'Um erro inesperado ocorreu ao comentar o post.',
                    connection: 'Houve um erro de conexão ao comentar o post. Verifique se está conectado à internet.'
                },
                votingPost:{
                    unexpected: 'Um erro inesperado ocorreu ao votar no post.',
                    connection: 'Houve um erro de conexão ao votar no post. Verifique se está conectado à internet.'
                },
                revealDistancePost:{
                    unexpected: 'Pontos insuficientes para revelar distância exata.',
                    connection: 'Houve um erro de conexão ao votar no post. Verifique se está conectado à internet.'
                }
            }
        },
        profile: {
            title: 'Perfil',
            changePhoto: {
                title: 'Editar foto',
                option1: 'Câmera',
                option2: 'Galeria',
                cancel: 'Cancelar'
            },
            buttons: {
                signOut: 'Sair',
                editProfile: 'Editar perfil'
            },
            labels: {
                score: 'Pontos',
                scoreBalance: 'Saldo de pontos'
            },
            errors: {
                loadingProfile: {
                    unexpected: 'Um erro inesperado ocorreu ao carregar o perfil.',
                    connection: 'Houve um erro de conexão ao carregar o perfil. Verifique se está conectado à internet.'
                }
            }
        },
        profileEdition: {
            title: 'Editar perfil',
            labels: {
                name: 'Nome',
                username: 'Usuário',
                bio: 'Bio',
                website: 'Website',
                phone: 'Telefone',
                home: 'Casa',
                undefined: 'Não definido'
            },
            buttons: {
                save: 'Salvar',
                cancel: 'Cancelar',
                define: 'Definir'
            },
            alert: {
                title: 'Definir a localização atual como sua casa?',
                message: 'Você poderá ver os posts da região definida como casa mesmo quando não estiver nela.'
            },
            errors:{
                unexpected: 'Um erro inesperado ocorreu ao editar o perfil.',
                connection: 'Houve um erro de conexão ao editar o perfil. Verifique se está conectado à internet.'
            }
        }
    },
    components: {
        post: {
            actionSheet: {
                follow: 'Seguir',
                unfollow: 'Deixar de seguir',
                delete: 'Deletar',
                cancel: 'Cancelar'
            }
        }
    }
};

export default pt;