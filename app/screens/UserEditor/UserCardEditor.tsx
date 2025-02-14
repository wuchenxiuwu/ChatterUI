import ThemedButton from '@components/buttons/ThemedButton'
import ThemedTextInput from '@components/input/ThemedTextInput'
import Alert from '@components/views/Alert'
import Avatar from '@components/views/Avatar'
import PopupMenu from '@components/views/PopupMenu'
import { AntDesign } from '@expo/vector-icons'
import { useViewerState } from '@lib/state/AvatarViewer'
import { CharacterCardData, Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'
import AvatarViewer from '@screens/ChatMenu/ChatWindow/AvatarViewer'
import * as DocumentPicker from 'expo-document-picker'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

const UserCardEditor = () => {
    const styles = useStyles()
    const { color, spacing } = Theme.useTheme()

    const { userCard, imageID, id, setCard, updateImage } = Characters.useUserCard(
        useShallow((state) => ({
            userCard: state.card,
            imageID: state.card?.image_id ?? 0,
            id: state.id,
            setCard: state.setCard,
            updateImage: state.updateImage,
        }))
    )

    const [currentCard, setCurrentCard] = useState<CharacterCardData | undefined>(userCard)

    const setShowViewer = useViewerState((state) => state.setShow)

    useEffect(() => {
        setCurrentCard(userCard)
    }, [id])

    const saveCard = async () => {
        if (currentCard && id) {
            await Characters.db.mutate.updateCard(currentCard, id)
            setCard(id)
        }
    }

    const handleUploadImage = () => {
        DocumentPicker.getDocumentAsync({
            copyToCacheDirectory: true,
            type: 'image/*',
        }).then((result) => {
            if (result.canceled) return
            if (id) updateImage(result.assets[0].uri)
        })
    }

    const handleDeleteImage = () => {
        Alert.alert({
            title: `删除图片`,
            description: `您确定要删除这张图片吗？此操作无法撤销。`,
            buttons: [
                { label: '取消' },
                {
                    label: '删除图片',
                    onPress: () => {
                        Characters.deleteImage(imageID)
                    },
                    type: 'warning',
                },
            ],
        })
    }

    return (
        <View style={styles.userContainer}>
            <AvatarViewer editorButton={false} />
            <View style={styles.nameBar}>
                <PopupMenu
                    placement="right"
                    options={[
                        {
                            label: '更改图片',
                            icon: 'picture',
                            onPress: (menu) => {
                                menu.current?.close()
                                handleUploadImage()
                            },
                        },
                        {
                            label: '查看图片',
                            icon: 'search1',
                            onPress: (menu) => {
                                menu.current?.close()
                                setShowViewer(true, true)
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
                        targetImage={Characters.getImageDir(imageID)}
                        style={styles.userImage}
                    />
                    <AntDesign name="edit" color={color.text._100} style={styles.editHover} />
                </PopupMenu>
                <ThemedTextInput
                    multiline
                    numberOfLines={10}
                    label="名称"
                    value={currentCard?.name ?? ''}
                    onChangeText={(text) => {
                        if (currentCard)
                            setCurrentCard({
                                ...currentCard,
                                name: text,
                            })
                    }}
                    placeholder="不建议使用空名称！"
                />
            </View>
            <ThemedTextInput
                multiline
                numberOfLines={10}
                label="描述"
                value={currentCard?.description ?? ''}
                onChangeText={(text) => {
                    if (currentCard)
                        setCurrentCard({
                            ...currentCard,
                            description: text,
                        })
                }}
                placeholder="描述此用户..."
            />
            <View style={{ flex: 1, paddingBottom: spacing.m }} />
            <Text
                style={{
                    color: color.text._400,
                    marginTop: spacing.xl2,
                    alignSelf: 'center',
                }}>
                提示：向左滑动或按下 <AntDesign name="menu-unfold" size={16} /> 以打开用户抽屉
            </Text>
            <ThemedButton label="保存" onPress={saveCard} iconName="save" />
        </View>
    )
}

export default UserCardEditor

const useStyles = () => {
    const { color, spacing, borderWidth, borderRadius } = Theme.useTheme()

    return StyleSheet.create({
        userContainer: {
            flex: 1,
            paddingVertical: spacing.xl,
            paddingHorizontal: spacing.xl,
            rowGap: 16,
        },

        nameBar: {
            flexDirection: 'row',
            columnGap: 24,
        },

        userImage: {
            width: 84,
            height: 84,
            borderRadius: borderRadius.xl2,
            borderColor: color.primary._500,
            borderWidth: borderWidth.m,
        },

        editHover: {
            position: 'absolute',
            left: '75%',
            top: '75%',
            padding: spacing.m,
            borderColor: color.primary._500,
            borderWidth: borderWidth.s,
            backgroundColor: color.neutral._200,
            borderRadius: spacing.l,
        },
    })
}
