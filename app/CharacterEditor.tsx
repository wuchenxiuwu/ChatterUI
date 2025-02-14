import ThemedButton from '@components/buttons/ThemedButton'
import ThemedTextInput from '@components/input/ThemedTextInput'
import Alert from '@components/views/Alert'
import Avatar from '@components/views/Avatar'
import FadeDownView from '@components/views/FadeDownView'
import HeaderTitle from '@components/views/HeaderTitle'
import PopupMenu from '@components/views/PopupMenu'
import { AntDesign } from '@expo/vector-icons'
import { Tokenizer } from '@lib/engine/Tokenizer'
import { useViewerState } from '@lib/state/AvatarViewer'
import { CharacterCardData, Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import { usePreventRemove } from '@react-navigation/core'
import AvatarViewer from '@screens/ChatMenu/ChatWindow/AvatarViewer'
import * as DocumentPicker from 'expo-document-picker'
import { useNavigation, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

const ChracterEditor = () => {
    const styles = useStyles()
    const { color, spacing } = Theme.useTheme()
    const router = useRouter()
    const navigation = useNavigation()
    const { currentCard, setCurrentCard, charId, charName, unloadCharacter } =
        Characters.useCharacterCard(
            useShallow((state) => ({
                charId: state.id,
                currentCard: state.card,
                setCurrentCard: state.setCard,
                charName: state.card?.name,
                unloadCharacter: state.unloadCard,
            }))
        )

    const getTokenCount = Tokenizer.useTokenizer((state) => state.getTokenCount)
    const [characterCard, setCharacterCard] = useState<CharacterCardData | undefined>(currentCard)
    const { chat, unloadChat } = Chats.useChat()

    const setShowViewer = useViewerState((state) => state.setShow)
    const [edited, setEdited] = useState(false)
    const [altSwipeIndex, setAltSwipeIndex] = useState(0)

    const setCharacterCardEdited = (card: CharacterCardData) => {
        if (!edited) setEdited(true)
        setCharacterCard(card)
    }

    usePreventRemove(edited, ({ data }) => {
        Alert.alert({
            title: `未保存的更改`,
            description: `您有未保存的更改，离开后将丢弃您的进度.`,
            buttons: [
                { label: '取消' },
                {
                    label: '保存',
                    onPress: async () => {
                        await handleSaveCard()
                        navigation.dispatch(data.action)
                    },
                },
                {
                    label: '丢弃更改',
                    onPress: () => {
                        navigation.dispatch(data.action)
                    },
                    type: 'warning',
                },
            ],
        })
    })

    const handleSaveCard = async () => {
        if (characterCard && charId)
            return Characters.db.mutate.updateCard(characterCard, charId).then(() => {
                setCurrentCard(charId)
                setEdited(() => false)
                Logger.infoToast('卡牌已保存!')
            })
    }

    const handleDeleteCard = () => {
        Alert.alert({
            title: `删除角色`,
            description: `您确定要删除 '${charName}' 吗？此操作无法撤销.`,
            buttons: [
                { label: '取消' },
                {
                    label: '删除角色',
                    onPress: () => {
                        Characters.db.mutate.deleteCard(charId ?? -1)
                        unloadCharacter()
                        unloadChat()
                        router.back()
                    },
                    type: 'warning',
                },
            ],
        })
    }

    useEffect(() => {
        return () => {
            if (!chat) unloadCharacter()
        }
    }, [])

    const handleDeleteImage = () => {
        Alert.alert({
            title: `删除图片`,
            description: `您确定要删除这张图片吗？此操作无法撤销.`,
            buttons: [
                { label: '取消' },
                {
                    label: '删除图片',
                    onPress: () => {
                        if (characterCard) Characters.deleteImage(characterCard.image_id)
                    },
                    type: 'warning',
                },
            ],
        })
    }

    const handleImportImage = () => {
        DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: 'image/*',
        }).then((result: DocumentPicker.DocumentPickerResult) => {
            if (result.canceled || !charId) return
            Characters.useCharacterCard.getState().updateImage(result.assets[0].uri)
        })
    }

    const handleAddAltMessage = async () => {
        if (!charId || !characterCard) return
        const id = await Characters.db.mutate.addAltGreeting(charId)
        await setCurrentCard(charId)

        // optimistically update editor state

        const greetings = [
            ...(characterCard?.alternate_greetings ?? []),
            { id: id, greeting: '', character_id: charId },
        ]
        setCharacterCardEdited({ ...characterCard, alternate_greetings: greetings })
        if (characterCard.alternate_greetings.length !== 0) {
            setAltSwipeIndex(altSwipeIndex + 1)
        }
    }

    const deleteAltMessageRoutine = async () => {
        const id = characterCard?.alternate_greetings[altSwipeIndex].id
        if (!id || !charId) {
            Logger.errorToast('删除备用消息出错')
            return
        }
        await Characters.db.mutate.deleteAltGreeting(id)
        await setCurrentCard(charId)
        const greetings = [...(characterCard?.alternate_greetings ?? [])].filter(
            (item) => item.id !== id
        )
        setAltSwipeIndex(0)
        setCharacterCardEdited({ ...characterCard, alternate_greetings: greetings })
    }

    const handleDeleteAltMessage = async () => {
        Alert.alert({
            title: `删除备用消息`,
            description: `您确定要删除这条备用消息吗？此操作无法撤销.`,
            buttons: [
                { label: '取消' },
                {
                    label: '删除',
                    onPress: async () => {
                        await deleteAltMessageRoutine()
                    },
                    type: 'warning',
                },
            ],
        })
    }

    return (
        <FadeDownView style={styles.mainContainer}>
            <HeaderTitle title="编辑角色" />
            <AvatarViewer editorButton={false} />
            {characterCard && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ rowGap: 16 }}>
                    <View style={styles.characterHeader}>
                        <PopupMenu
                            placement="right"
                            options={[
                                {
                                    label: '更改图片',
                                    icon: 'picture',
                                    onPress: (menu) => {
                                        menu.current?.close()
                                        handleImportImage()
                                    },
                                },
                                {
                                    label: '查看图片',
                                    icon: 'search1',
                                    onPress: (menu) => {
                                        menu.current?.close()
                                        setShowViewer(true)
                                    },
                                },
                                {
                                    label: '删除图片',
                                    icon: 'delete',
                                    onPress: (menu) => {
                                        menu.current?.close()
                                        handleDeleteImage()
                                    },
                                    warning: true,
                                },
                            ]}>
                            <Avatar
                                targetImage={Characters.getImageDir(currentCard?.image_id ?? -1)}
                                style={styles.avatar}
                            />
                            <AntDesign
                                name="edit"
                                color={color.text._100}
                                style={styles.editHover}
                            />
                        </PopupMenu>

                        <View style={styles.characterHeaderInfo}>
                            <View style={styles.buttonContainer}>
                                <ThemedButton
                                    iconName="delete"
                                    iconSize={20}
                                    variant="critical"
                                    label="删除"
                                    onPress={handleDeleteCard}
                                />

                                {edited && (
                                    <ThemedButton
                                        iconName="save"
                                        iconSize={20}
                                        label="保存"
                                        onPress={handleSaveCard}
                                    />
                                )}
                            </View>
                            <ThemedTextInput
                                onChangeText={(mes) => {
                                    setCharacterCardEdited({
                                        ...characterCard,
                                        name: mes,
                                    })
                                }}
                                value={characterCard?.name}
                            />
                        </View>
                    </View>

                    <ThemedTextInput
                        scrollEnabled
                        label={`描述字数: ${getTokenCount(characterCard?.description ?? '')}`}
                        multiline
                        numberOfLines={8}
                        onChangeText={(mes) => {
                            setCharacterCardEdited({
                                ...characterCard,
                                description: mes,
                            })
                        }}
                        value={characterCard?.description}
                    />

                    <ThemedTextInput
                        label="首次消息"
                        multiline
                        onChangeText={(mes) => {
                            setCharacterCardEdited({
                                ...characterCard,
                                first_mes: mes,
                            })
                        }}
                        value={characterCard?.first_mes}
                        numberOfLines={8}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <Text style={{ color: color.text._100 }}>
                            备用问候语{' '}
                            {characterCard.alternate_greetings.length !== 0 && (
                                <Text
                                    style={{
                                        color: color.text._100,
                                    }}>
                                    {altSwipeIndex + 1} / {characterCard.alternate_greetings.length}
                                </Text>
                            )}
                        </Text>

                        <View style={{ flexDirection: 'row', columnGap: 32 }}>
                            <TouchableOpacity onPress={handleDeleteAltMessage}>
                                {characterCard.alternate_greetings.length !== 0 && (
                                    <AntDesign color={color.error._400} name="delete" size={20} />
                                )}
                            </TouchableOpacity>
                            {characterCard.alternate_greetings.length > 0 && (
                                <TouchableOpacity
                                    onPress={() =>
                                        setAltSwipeIndex(Math.max(altSwipeIndex - 1, 0))
                                    }>
                                    <AntDesign
                                        color={
                                            altSwipeIndex === 0 ? color.text._700 : color.text._100
                                        }
                                        name="left"
                                        size={20}
                                    />
                                </TouchableOpacity>
                            )}
                            {altSwipeIndex === characterCard.alternate_greetings.length - 1 ||
                            characterCard.alternate_greetings.length === 0 ? (
                                <TouchableOpacity onPress={handleAddAltMessage}>
                                    <AntDesign color={color.text._100} name="plus" size={20} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={() =>
                                        setAltSwipeIndex(
                                            Math.min(
                                                altSwipeIndex + 1,
                                                characterCard.alternate_greetings.length - 1
                                            )
                                        )
                                    }>
                                    <AntDesign color={color.text._100} name="right" size={20} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {characterCard.alternate_greetings.length !== 0 ? (
                        <ThemedTextInput
                            multiline
                            numberOfLines={8}
                            onChangeText={(mes) => {
                                const greetings = [...characterCard.alternate_greetings]
                                greetings[altSwipeIndex].greeting = mes
                                setCharacterCardEdited({
                                    ...characterCard,
                                    alternate_greetings: greetings,
                                })
                            }}
                            value={
                                characterCard?.alternate_greetings?.[altSwipeIndex].greeting ?? ''
                            }
                        />
                    ) : (
                        <Text
                            style={{
                                borderColor: color.neutral._400,
                                borderWidth: 1,
                                borderRadius: 8,
                                padding: spacing.m,
                                color: color.text._500,
                                fontStyle: 'italic',
                            }}>
                            无备用问候语
                        </Text>
                    )}

                    <ThemedTextInput
                        label="个性"
                        multiline
                        numberOfLines={2}
                        onChangeText={(mes) => {
                            setCharacterCardEdited({
                                ...characterCard,
                                personality: mes,
                            })
                        }}
                        value={characterCard?.personality}
                    />

                    <ThemedTextInput
                        label="场景"
                        multiline
                        onChangeText={(mes) => {
                            setCharacterCardEdited({
                                ...characterCard,
                                scenario: mes,
                            })
                        }}
                        value={characterCard?.scenario}
                        numberOfLines={3}
                    />

                    <ThemedTextInput
                        label="示例消息"
                        multiline
                        onChangeText={(mes) => {
                            setCharacterCardEdited({
                                ...characterCard,
                                mes_example: mes,
                            })
                        }}
                        value={characterCard?.mes_example}
                        numberOfLines={8}
                    />
                </ScrollView>
            )}
        </FadeDownView>
    )
}

const useStyles = () => {
    const { color, spacing, borderRadius } = Theme.useTheme()
    return StyleSheet.create({
        mainContainer: {
            flex: 1,
            paddingHorizontal: spacing.xl,
            paddingVertical: spacing.xl,
        },

        characterHeader: {
            alignContent: 'flex-start',
            borderRadius: borderRadius.xl,
            flexDirection: 'row',
            alignItems: 'center',
        },

        characterHeaderInfo: {
            marginLeft: spacing.xl2,
            rowGap: 12,
            flex: 1,
        },

        buttonContainer: {
            justifyContent: 'flex-start',
            flexDirection: 'row',
            columnGap: 4,
        },

        avatar: {
            width: 80,
            height: 80,
            borderRadius: borderRadius.xl2,
            borderColor: color.primary._500,
            borderWidth: 2,
        },

        editHover: {
            position: 'absolute',
            left: '75%',
            top: '75%',
            padding: spacing.m,
            borderColor: color.text._700,
            borderWidth: 1,
            backgroundColor: color.primary._300,
            borderRadius: borderRadius.l,
        },
    })
}

export default ChracterEditor
