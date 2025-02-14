import Alert from '@components/views/Alert'
import PopupMenu, { MenuRef } from '@components/views/PopupMenu'
import TextBoxModal from '@components/views/TextBoxModal'
import { Characters } from '@lib/state/Characters'
import { Chats } from '@lib/state/Chat'
import { Logger } from '@lib/state/Logger'
import { saveStringToDownload } from '@lib/utils/File'
import React, { useState } from 'react'
import { View } from 'react-native'

type ListItem = {
    id: number
    character_id: number
    create_date: Date
    name: string
    last_modified: null | number
    entryCount: number
}

type ChatEditPopupProps = {
    item: ListItem
    nowLoading: boolean
    setNowLoading: (b: boolean) => void
}

const ChatEditPopup: React.FC<ChatEditPopupProps> = ({ item, setNowLoading, nowLoading }) => {
    const [showRename, setShowRename] = useState<boolean>(false)

    const { charName, charId } = Characters.useCharacterCard((state) => ({
        charId: state.id,
        charName: state.card?.name ?? '未知',
    }))

    const { deleteChat, loadChat, chatId, unloadChat } = Chats.useChat()

    const handleDeleteChat = (menuRef: MenuRef) => {
        Alert.alert({
            title: `删除聊天记录`,
            description: `您确定要删除 '${item.name}' 吗？此操作无法撤销.`,
            buttons: [
                { label: '取消' },
                {
                    label: '删除聊天记录',
                    onPress: async () => {
                        await deleteChat(item.id)
                        if (charId && chatId === item.id) {
                            const returnedChatId = await Chats.db.query.chatNewestId(charId)
                            const chatId = returnedChatId
                                ? returnedChatId
                                : await Chats.db.mutate.createChat(charId)
                            chatId && (await loadChat(chatId))
                        } else if (item.id === chatId) {
                            Logger.errorToast(`创建默认聊天记录时出错`)
                            unloadChat()
                        }
                        menuRef.current?.close()
                    },
                    type: 'warning',
                },
            ],
        })
    }

    const handleCloneChat = (menuRef: MenuRef) => {
        Alert.alert({
            title: `克隆聊天记录`,
            description: `您确定要克隆 '${item.name}' 吗？`,
            buttons: [
                { label: '取消' },
                {
                    label: '克隆聊天记录',
                    onPress: async () => {
                        await Chats.db.mutate.cloneChat(item.id)
                        menuRef.current?.close()
                    },
                },
            ],
        })
    }

    const handleExportChat = async (menuRef: MenuRef) => {
        const name = `Chatlogs-${charName}-${item.id}.json`.replaceAll(' ', '_')
        await saveStringToDownload(JSON.stringify(await Chats.db.query.chat(item.id)), name, 'utf8')
        menuRef.current?.close()
        Logger.infoToast(`文件: ${name} 已保存到下载目录!`)
    }

    return (
        <View>
            <TextBoxModal
                booleans={[showRename, setShowRename]}
                onConfirm={async (text) => {
                    await Chats.db.mutate.renameChat(item.id, text)
                }}
                textCheck={(text) => text.length === 0}
            />
            <PopupMenu
                icon="edit"
                disabled={nowLoading}
                options={[
                    {
                        label: '重命名',
                        icon: 'edit',
                        onPress: (menuRef) => {
                            setShowRename(true)
                            menuRef.current?.close()
                        },
                    },
                    {
                        label: '导出',
                        icon: 'download',
                        onPress: (menuRef) => handleExportChat(menuRef),
                    },
                    {
                        label: '克隆',
                        icon: 'copy1',
                        onPress: handleCloneChat,
                    },
                    {
                        label: '删除',
                        icon: 'delete',
                        warning: true,
                        onPress: handleDeleteChat,
                    },
                ]}
            />
        </View>
    )
}

export default ChatEditPopup
