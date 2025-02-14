import ThemedButton from '@components/buttons/ThemedButton' // 主题按钮
import ThemedSwitch from '@components/input/ThemedSwitch' // 主题开关
import SectionTitle from '@components/text/SectionTitle' // 分段标题
import Alert from '@components/views/Alert' // 警告框
import HeaderTitle from '@components/views/HeaderTitle' // 标题头
import { AppSettings } from '@lib/constants/GlobalValues' // 应用设置
import { registerForPushNotificationsAsync } from '@lib/notifications/Notifications' // 注册推送通知
import { Characters } from '@lib/state/Characters' // 角色管理
import { Logger } from '@lib/state/Logger' // 日志记录器
import { Theme } from '@lib/theme/ThemeManager' // 主题管理器
import appConfig from 'app.config' // 应用配置
import { copyFile, DocumentDirectoryPath, DownloadDirectoryPath } from 'cui-fs' // 文件操作
import { reloadAppAsync } from 'expo' // 重新加载应用
import { getDocumentAsync } from 'expo-document-picker' // 文件选择器
import { copyAsync, deleteAsync, documentDirectory } from 'expo-file-system' // 文件系统操作
import { useRouter } from 'expo-router' // 路由器
import React from 'react' // React
import { ScrollView, Text, View } from 'react-native' // React Native 组件
import { useMMKVBoolean } from 'react-native-mmkv' // 状态管理

const appVersion = appConfig.expo.version // 应用版本

const exportDB = async (notify: boolean = true) => { // 导出数据库
    await copyFile(
        `${DocumentDirectoryPath}/SQLite/db.db`, // 源文件路径
        `${DownloadDirectoryPath}/${appVersion}-db-backup.db` // 目标文件路径
    )
        .then(() => {
            if (notify) Logger.infoToast('下载成功！') // 下载成功提示
        })
        .catch((e) => Logger.errorToast('复制数据库失败: ' + e)) // 复制失败提示
}

const importDB = async (uri: string, name: string) => { // 导入数据库
    const copyDB = async () => {
        await exportDB(false) // 导出数据库（不提示）
        await deleteAsync(`${documentDirectory}SQLite/db.db`).catch(() => {
            Logger.debug('数据库已删除') // 数据库已删除日志
        })
        await copyAsync({
            from: uri, // 源文件
            to: `${documentDirectory}SQLite/db.db`, // 目标文件
        })
            .then(() => {
                Logger.info('复制成功，正在重启应用。') // 复制成功并重启提示
                reloadAppAsync() // 重新加载应用
            })
            .catch((e) => {
                Logger.errorToast(`导入数据库失败: ${e}`) // 导入失败提示
            })
    }

    const dbAppVersion = name.split('-')?.[0] // 数据库版本号
    if (dbAppVersion !== appVersion) { // 版本号不匹配
        Alert.alert({
            title: `警告：版本不同`, // 警告：版本不同
            description: `导入的数据库文件的版本 (${dbAppVersion}) 与当前安装的版本 (${appVersion}) 不同。\n\n导入此数据库可能会导致数据库损坏或无法正常使用。建议使用相同版本的数据库。`, // 描述：导入的数据库版本与当前版本不同，可能导致数据库损坏，建议使用相同版本
            buttons: [
                { label: '取消' }, // 取消按钮
                { label: '仍然导入', onPress: copyDB, type: 'warning' }, // 强制导入按钮
            ],
        })
    } else copyDB() // 版本匹配，直接导入
}

const AppSettingsMenu = () => {
    const router = useRouter() // 路由器
    const { color, spacing } = Theme.useTheme() // 主题颜色和间距
    const [printContext, setPrintContext] = useMMKVBoolean(AppSettings.PrintContext) // 打印上下文
    const [firstMes, setFirstMes] = useMMKVBoolean(AppSettings.CreateFirstMes) // 使用第一条消息
    const [chatOnStartup, setChatOnStartup] = useMMKVBoolean(AppSettings.ChatOnStartup) // 启动时加载聊天
    const [autoScroll, setAutoScroll] = useMMKVBoolean(AppSettings.AutoScroll) // 自动滚动
    const [sendOnEnter, setSendOnEnter] = useMMKVBoolean(AppSettings.SendOnEnter) // 按 Enter 发送
    const [bypassContextLength, setBypassContextLength] = useMMKVBoolean(
        AppSettings.BypassContextLength
    ) // 绕过上下文长度限制
    const [notificationOnGenerate, setNotificationOnGenerate] = useMMKVBoolean(
        AppSettings.NotifyOnComplete
    ) // 启用通知
    const [notificationSound, setNotificationSound] = useMMKVBoolean(
        AppSettings.PlayNotificationSound
    ) // 通知声音
    const [notificationVibrate, setNotificationVibrate] = useMMKVBoolean(
        AppSettings.VibrateNotification
    ) // 通知震动
    const [showNotificationText, setShowNotificationText] = useMMKVBoolean(
        AppSettings.ShowNotificationText
    ) // 在通知中显示文本
    const [authLocal, setAuthLocal] = useMMKVBoolean(AppSettings.LocallyAuthenticateUser) // 锁定应用程序
    const [unlockOrientation, setUnlockOrientation] = useMMKVBoolean(AppSettings.UnlockOrientation) // 解锁方向

    return (
        <ScrollView
            style={{
                marginVertical: spacing.xl2,
                paddingHorizontal: spacing.xl2,
                paddingBottom: spacing.xl3,
            }}
            contentContainerStyle={{ rowGap: spacing.sm }}>
            <HeaderTitle title="设置" /> // 设置标题

            <SectionTitle>样式</SectionTitle> // 样式

            <ThemedButton
                label="更改主题"
                variant="secondary"
                onPress={() => router.push('/ColorSelector')} // 跳转到颜色选择器
            />

            <SectionTitle>聊天</SectionTitle> // 聊天

            <ThemedSwitch
                label="自动滚动"
                value={autoScroll}
                onChangeValue={setAutoScroll}
                description="在生成过程中自动滚动文本"
            />

            <ThemedSwitch
                label="使用第一条消息"
                value={firstMes}
                onChangeValue={setFirstMes}
                description="禁用后新聊天将为空，某些模型需要此设置"
            />

            <ThemedSwitch
                label="启动时加载聊天"
                value={chatOnStartup}
                onChangeValue={setChatOnStartup}
                description="启动时加载最近的聊天"
            />

            <ThemedSwitch
                label="按 Enter 发送"
                value={sendOnEnter}
                onChangeValue={setSendOnEnter}
                description="按 Enter 提交消息"
            />

            <SectionTitle>生成</SectionTitle> // 生成

            <ThemedSwitch
                label="打印上下文"
                value={printContext}
                onChangeValue={setPrintContext}
                description="将生成上下文打印到日志中以便调试"
            />

            <ThemedSwitch
                label="绕过上下文长度限制"
                value={bypassContextLength}
                onChangeValue={setBypassContextLength}
                description="在构建提示时忽略上下文长度限制"
            />

            <SectionTitle>通知</SectionTitle> // 通知

            <ThemedSwitch
                label="启用通知"
                value={notificationOnGenerate}
                onChangeValue={async (value) => {
                    if (!value) {
                        setNotificationOnGenerate(false)
                        return
                    }

                    const granted = await registerForPushNotificationsAsync() // 注册推送通知
                    if (granted) {
                        setNotificationOnGenerate(true)
                    }
                }}
                description="应用在后台时发送通知"
            />

            {notificationOnGenerate && (
                <View>
                    <ThemedSwitch
                        label="通知声音"
                        value={notificationSound}
                        onChangeValue={setNotificationSound}
                        description=""
                    />

                    <ThemedSwitch
                        label="通知震动"
                        value={notificationVibrate}
                        onChangeValue={setNotificationVibrate}
                        description=""
                    />

                    <ThemedSwitch
                        label="在通知中显示文本"
                        value={showNotificationText}
                        onChangeValue={setShowNotificationText}
                        description="在通知中显示生成的消息"
                    />
                </View>
            )}

            <SectionTitle>角色管理</SectionTitle> // 角色管理

            <ThemedButton
                label="重新生成默认卡片"
                variant="secondary"
                onPress={() => {
                    Alert.alert({
                        title: `重新生成默认卡片`, // 重新生成默认卡片
                        description: `这将把默认 AI 机器人卡片添加到角色列表中。`, // 这将把默认 AI 机器人卡片添加到角色列表中
                        buttons: [
                            { label: '取消' }, // 取消
                            { label: '创建默认卡片', onPress: Characters.createDefaultCard }, // 创建默认卡片
                        ],
                    })
                }}
            />

            <SectionTitle>数据库管理</SectionTitle> // 数据库管理

            <Text
                style={{
                    color: color.text._500,
                    paddingBottom: spacing.xs,
                    marginBottom: spacing.m,
                }}>
                警告：只有当你确定数据来自同一版本时，才进行导入操作！
            </Text>

            <ThemedButton
                label="导出数据库"
                variant="secondary"
                onPress={() => {
                    Alert.alert({
                        title: `导出数据库`, // 导出数据库
                        description: `确定要导出数据库文件吗?\n\n它将自动被下载`, // 确定要导出数据库文件吗？它将自动被下载
                        buttons: [
                            { label: '取消' }, // 取消
                            { label: '导出数据库', onPress: exportDB }, // 导出数据库
                        ],
                    })
                }}
            />

            <ThemedButton
                label="导入数据库"
                variant="secondary"
                onPress={async () => {
                    getDocumentAsync({ type: ['application/*'] }).then(async (result) => {
                        if (result.canceled) return
                        Alert.alert({
                            title: `导入数据库`, // 导入数据库
                            description: `确定要导入此数据库吗？这可能会破坏当前的数据库!\n\n系统将自动下载备份.\n\n应用将自动重新启动`, // 确定要导入此数据库吗？这可能会破坏当前的数据库！系统将自动下载备份。应用将自动重新启动
                            buttons: [
                                { label: '取消' }, // 取消
                                {
                                    label: '导入',
                                    onPress: () =>
                                        importDB(result.assets[0].uri, result.assets[0].name), // 导入数据库
                                    type: 'warning',
                                },
                            ],
                        })
                    })
                }}
            />

            <SectionTitle>安全</SectionTitle> // 安全

            <ThemedSwitch
                label="锁定应用程序"
                value={authLocal}
                onChangeValue={setAuthLocal}
                description="需要用户身份验证才能打开应用程序。如果您没有启用设备锁，则此操作将不起作用."
            />

            <SectionTitle>屏幕</SectionTitle> // 屏幕

            <ThemedSwitch
                label="解锁方向"
                value={unlockOrientation}
                onChangeValue={setUnlockOrientation}
                description="允许在手机上显示窗口 (需要重启应用程序)"
            />

            <View style={{ paddingVertical: spacing.xl3 }} />
        </ScrollView>
    )
}

export default AppSettingsMenu
