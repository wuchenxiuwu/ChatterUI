import ThemedButton from '@components/buttons/ThemedButton'
import ThemedText from '@components/text/ThemedText'
import ThemedView from '@components/views/ThemedView'
import { Theme } from '@lib/theme/ThemeManager'
import { StyleSheet } from 'react-native'
import { useState } from 'react'

const UserList = ({ setShowModal }: { setShowModal: (b: boolean) => void }) => {
    const { color, spacing } = Theme.useTheme()

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>用户</ThemedText>
            <ThemedButton
                label="关闭"
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
            />
            {/* 用户列表项显示在此处 */}
        </ThemedView>
    )
}

export default UserList

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: color.text._100,
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginTop: 16,
    },
})
