import ThemedButton from '@components/buttons/ThemedButton'
import FadeBackdrop from '@components/views/FadeBackdrop'
import { Chats } from '@lib/state/Chat'
import { Theme } from '@lib/theme/ThemeManager'
import React, { useEffect, useState } from 'react'
import { GestureResponderEvent, Modal, StyleSheet, Text, TextInput, View } from 'react-native'
import Animated, { SlideOutDown } from 'react-native-reanimated'
import { create } from 'zustand'

type ChatEditorStateProps = {
    index: number
    editMode: boolean
    hide: () => void
    show: (index: number) => void
}

//TODO: This is somewhat unsafe, as it always expects index to be valid at 0
export const useChatEditorState = create<ChatEditorStateProps>()((set, get) => ({
    index: 0,
    editMode: false,
    hide: () => {
        set((state) => ({ ...state, editMode: false }))
    },
    show: (index) => {
        set((state) => ({ ...state, editMode: true, index: index }))
    },
}))

const EditorModal = () => {
    const { index, editMode, hide } = useChatEditorState((state) => ({
        index: state.index,
        editMode: state.editMode,
        hide: state.hide,
    }))
    const styles = useStyles()

    const { updateEntry, deleteEntry } = Chats.useEntry()
    const { swipeText, swipe } = Chats.useSwipeData(index)
    const entry = Chats.useEntryData(index)
    const [placeholderText, setPlaceholderText] = useState('')

    useEffect(() => {
        swipeText && setPlaceholderText(swipeText)
    }, [swipeText])

    // TODO: This should safely return if invalid values were given
    if (swipeText === undefined) return

    const handleEditMessage = () => {
        updateEntry(index, placeholderText, false)
        hide()
    }

    const handleDeleteMessage = () => {
        deleteEntry(index)
        hide()
    }

    const handleClose = () => {
        hide()
    }

    const handleOverlayClick = (e: GestureResponderEvent) => {
        if (e.target === e.currentTarget) handleClose()
    }

    const inputRef = React.createRef<TextInput>()

    const handleAutoFocus = () => {
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.setSelection(placeholderText.length, placeholderText.length)
        }, 1)
    }

    return (
        <View>
            <Modal
                visible={editMode}
                animationType="fade"
                transparent
                onShow={handleAutoFocus}
                onRequestClose={handleClose}
                style={{ flex: 1 }}>
                <FadeBackdrop handleOverlayClick={handleOverlayClick} />
                <View style={{ flex: 1 }} />
                <Animated.View exiting={SlideOutDown.duration(100)} style={styles.editorContainer}>
                    <View style={styles.topText}>
                        <Text style={styles.nameText}>{entry?.name}</Text>
                        <Text style={styles.timeText}>{swipe?.send_date.toLocaleTimeString()}</Text>
                    </View>

                    <TextInput
                        ref={inputRef}
                        style={styles.messageInput}
                        value={placeholderText}
                        onChangeText={setPlaceholderText}
                        textBreakStrategy="simple"
                        multiline
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}>
                        <ThemedButton
                            label="删除"
                            iconName="delete"
                            onPress={handleDeleteMessage}
                            variant="critical"
                        />
                        <ThemedButton
                            label="确认"
                            iconName="check"
                            onPress={handleEditMessage}
                            variant="secondary"
                        />
                    </View>
                </Animated.View>
            </Modal>
        </View>
    )
}

export default EditorModal

const useStyles = () => {
    const { color, spacing, borderRadius, fontSize } = Theme.useTheme()
    return StyleSheet.create({
        editorContainer: {
            backgroundColor: color.neutral._100,
            flexShrink: 1,
            paddingTop: spacing.xl,
            paddingBottom: spacing.l,
            paddingHorizontal: spacing.xl,
            borderTopRightRadius: borderRadius.l,
            borderTopLeftRadius: borderRadius.l,
            rowGap: 12,
        },

        topText: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            shadowColor: color.shadow,
            borderTopRightRadius: spacing.m,
            borderTopLeftRadius: spacing.m,
        },

        nameText: {
            color: color.text._100,
            fontSize: fontSize.l,
            marginLeft: spacing.l,
        },

        timeText: {
            color: color.text._400,
            fontSize: fontSize.s,
            marginLeft: spacing.m,
        },

        messageInput: {
            color: color.text._100,
            borderColor: color.neutral._400,
            borderRadius: 8,
            borderWidth: 1,
            padding: 8,
            flexShrink: 1,
        },
    })
}
