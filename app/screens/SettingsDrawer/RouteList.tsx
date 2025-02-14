import { AntDesign } from '@expo/vector-icons'
import { AppMode, AppSettings, Global } from '@lib/constants/GlobalValues'
import { Theme } from '@lib/theme/ThemeManager'
import { Href, useRouter } from 'expo-router'
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useMMKVBoolean, useMMKVString } from 'react-native-mmkv'
import Animated, { Easing, SlideInLeft } from 'react-native-reanimated'

type ButtonData = {
    name: string
    path: Href
    icon?: keyof typeof AntDesign.glyphMap
}

type DrawerButtonProps = {
    item: ButtonData
    index: number
}

const DrawerButton = ({ item, index }: DrawerButtonProps) => {
    const styles = useStyles()
    const router = useRouter()
    const { color } = Theme.useTheme()
    return (
        <Animated.View
            key={index}
            entering={SlideInLeft.duration(500 + index * 30)
                .withInitialValues({ originX: index * -150 + -400 })
                .easing(Easing.out(Easing.exp))}>
            <TouchableOpacity
                style={styles.largeButton}
                onPress={() => {
                    router.push(item.path)
                }}>
                <AntDesign size={24} name={item.icon ?? 'question'} color={color.text._400} />
                <Text style={styles.largeButtonText}>{item.name}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

const RouteList = () => {
    const [devMode, _] = useMMKVBoolean(AppSettings.DevMode)
    const [appMode, __] = useMMKVString(Global.AppMode)
    const paths = getPaths(appMode === AppMode.REMOTE)
    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={__DEV__ || devMode ? [...paths, ...paths_dev] : paths}
            renderItem={({ item, index }) => <DrawerButton item={item} index={index} />}
            keyExtractor={(item) => item.path.toString()}
        />
    )
}

export default RouteList

const useStyles = () => {
    const { color, spacing, fontSize } = Theme.useTheme()
    return StyleSheet.create({
        largeButtonText: {
            fontSize: fontSize.xl,
            paddingVertical: spacing.l,
            paddingLeft: spacing.xl,
            color: color.text._100,
        },

        largeButton: {
            paddingLeft: spacing.xl,
            flexDirection: 'row',
            alignItems: 'center',
        },
    })
}

const getPaths = (remote: boolean): ButtonData[] => [
    {
        name: '采样器',
        path: '/SamplerMenu',
        icon: 'barschart',
    },
    {
        name: '格式化',
        path: '/screens/FormattingManager',
        icon: 'profile',
    },
    remote
        ? {
              name: 'API',
              path: '/screens/APIManager',
              icon: 'link',
          }
        : {
              name: '模型',
              path: '/screens/ModelManager',
              icon: 'folderopen',
          },
    {
        name: '文本转语音',
        path: '/screens/TTSMenu',
        icon: 'sound',
    },
    {
        name: '日志',
        path: '/Logs',
        icon: 'codesquareo',
    },
    {
        name: '关于',
        path: '/About',
        icon: 'infocirlceo',
    },
    {
        name: '设置',
        path: '/AppSettingsMenu',
        icon: 'setting',
    },
]

const paths_dev: ButtonData[] = [
    {
        name: '[开发] 组件测试',
        path: '/ComponentTest',
    },
    {
        name: '[开发] 颜色测试',
        path: '/ColorTest',
    },
    {
        name: '[开发] Markdown 测试',
        path: '/screens/MarkdownTest',
    },
]
