import SupportButton from '@components/buttons/SupportButton'
import ThemedButton from '@components/buttons/ThemedButton'
import HeaderTitle from '@components/views/HeaderTitle'
import { AppSettings } from '@lib/constants/GlobalValues'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import appConfig from 'app.config'
import React, { useState } from 'react'
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useMMKVBoolean } from 'react-native-mmkv'

const About = () => {
    const styles = useStyles()
    const { spacing } = Theme.useTheme()
    const [counter, setCounter] = useState<number>(0)
    const [devMode, setDevMode] = useMMKVBoolean(AppSettings.DevMode)

    const updateCounter = () => {
        if (devMode) return
        if (counter === 6) {
            Logger.infoToast(`你已启用开发者模式！`)
            setDevMode(true)
        }
        setCounter(counter + 1)
    }

    const version = 'v' + appConfig.expo.version
    return (
        <View style={styles.container}>
            <HeaderTitle title="关于" />
            <TouchableOpacity activeOpacity={0.8} onPress={updateCounter}>
                <Image source={require('../assets/images/icon.png')} style={styles.icon} />
            </TouchableOpacity>

            <Text style={styles.titleText}>ChatterUI</Text>
            <Text style={styles.subtitleText}>
                版本 {version} {devMode && '[开发者模式]'}
            </Text>
            {devMode && (
                <ThemedButton
                    label="关闭开发者模式"
                    variant="critical"
                    buttonStyle={{
                        marginTop: spacing.xl,
                    }}
                    onPress={() => {
                        setCounter(0)
                        setDevMode(false)
                        Logger.info('开发者模式已关闭')
                    }}
                />
            )}

            <Text style={styles.body}>
                ChatterUI 是由 Vali-98 开发的免费开源应用程序
            </Text>
            <Text style={{ marginBottom: spacing.xl3, ...styles.body }}>
                这是一个我利用业余时间开发的个人项目。如果你喜欢这个应用，欢迎支持我的开发！
            </Text>
            <Text style={{ ...styles.body, marginBottom: spacing.m }}>
                请在这里捐赠以支持 ChatterUI：
            </Text>

            <SupportButton />

            <Text style={styles.body}>遇到问题？请在这里报告：</Text>
            <Text style={styles.subtitleText}>(别忘上传日志！)</Text>

            <ThemedButton
                buttonStyle={{ marginTop: spacing.m }}
                variant="secondary"
                label="Github 仓库"
                iconName="github"
                iconSize={20}
                onPress={() => {
                    Linking.openURL('https://github.com/Vali-98/ChatterUI')
                }}
            />
        </View>
    )
}

export default About

const useStyles = () => {
    const { color, spacing } = Theme.useTheme()

    return StyleSheet.create({
        container: {
            paddingHorizontal: spacing.xl3,
            paddingBottom: spacing.xl2,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
        },
        titleText: { color: color.text._100, fontSize: 32, marginTop: 16 },
        subtitleText: { color: color.text._400 },
        body: { color: color.text._100, marginTop: spacing.l, textAlign: 'center' },
        icon: {
            width: 120,
            height: 120,
            backgroundColor: 'black',
            // eslint-disable-next-line internal/enforce-spacing-values
            borderRadius: 60,
        },
    })
}
