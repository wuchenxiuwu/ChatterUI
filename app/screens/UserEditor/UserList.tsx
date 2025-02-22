import ThemedButton from '@components/buttons/ThemedButton'
import TextBoxModal from '@components/views/TextBoxModal'
import { Characters } from '@lib/state/Characters'
import { Theme } from '@lib/theme/ThemeManager'
import { FlashList } from '@shopify/flash-list'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

import UserListing from './UserListing'

type UserListProps = {
    setShowModal: (b: boolean) => void
}

const UserList: React.FC<UserListProps> = ({ setShowModal }) => {
    const { color, spacing, borderWidth, borderRadius, fontSize } = Theme.useTheme()

    const { data } = useLiveQuery(Characters.db.query.cardListQuery('user'))

    const [showNewUser, setShowNewUser] = useState(false)
    const [nowLoading, setNowLoading] = useState(false)
    const { setCard, id } = Characters.useUserCard((state) => ({
        setCard: state.setCard,
        id: state.id,
    }))

    const currentIndex = data.findIndex((item) => item.id === id)

    return (
        <View style={{ flex: 1 }}>
            <TextBoxModal
                autoFocus
                booleans={[showNewUser, setShowNewUser]}
                onConfirm={async (text) => {
                    const id = await Characters.db.mutate.createCard(text, 'user')
                    await setCard(id)
                }}
            />
            <View
                style={{
                    paddingHorizontal: spacing.xl,
                    marginBottom: spacing.l,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                <Text
                    style={{
                        fontSize: fontSize.l,
                        color: color.text._300,
                    }}>
                    用户资料 ({data.length})
                </Text>
            </View>
            <View style={{ flex: 1 }}>
                <FlashList
                    data={data}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, index }) => (
                        <UserListing
                            user={item}
                            nowLoading={nowLoading}
                            setNowLoading={setNowLoading}
                            setShowModal={setShowModal}
                        />
                    )}
                    estimatedItemSize={100}
                    initialScrollIndex={Math.max(currentIndex, 0)}
                />
                <ThemedButton label="新建用户" onPress={() => setShowNewUser(true)} />
            </View>
        </View>
    )
}

export default UserList
