import ThemedButton from '@components/buttons/ThemedButton'
import DropdownSheet from '@components/input/DropdownSheet'
import ThemedSwitch from '@components/input/ThemedSwitch'
import ThemedTextInput from '@components/input/ThemedTextInput'
import SectionTitle from '@components/text/SectionTitle'
import HeaderTitle from '@components/views/HeaderTitle'
import { Global } from '@lib/constants/GlobalValues'
import { Logger } from '@lib/state/Logger'
import { Theme } from '@lib/theme/ThemeManager'
import { groupBy } from '@lib/utils/Array'
import * as Speech from 'expo-speech'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useMMKVBoolean, useMMKVObject } from 'react-native-mmkv'

type LanguageListItem = {
    [key: string]: Speech.Voice[]
}

const TTSMenu = () => {
    const { color } = Theme.useTheme()
    const [currentSpeaker, setCurrentSpeaker] = useMMKVObject<Speech.Voice>(Global.TTSSpeaker)
    const [enableTTS, setEnableTTS] = useMMKVBoolean(Global.TTSEnable)
    const [autoTTS, setAutoTTS] = useMMKVBoolean(Global.TTSAuto)
    const [lang, setLang] = useState(currentSpeaker?.language ?? 'en-US')
    const [modelList, setModelList] = useState<Speech.Voice[]>([])
    const languageList: LanguageListItem = groupBy(modelList, 'language')
    const [testAudioText, setTestAudioText] = useState('这是一个测试音频')

    const languages = Object.keys(languageList)
        .sort()
        .map((name) => {
            return name
        })

    useEffect(() => {
        getVoices()
    }, [])

    const getVoices = (value = false) => {
        Speech.getAvailableVoicesAsync().then((list) => setModelList(list))
    }

    return (
        <View
            style={{
                flex: 1,
                marginVertical: 16,
                paddingVertical: 16,
                paddingHorizontal: 16,
                rowGap: 8,
            }}>
            <HeaderTitle title="文本转语音" />

            <SectionTitle>设置</SectionTitle>

            <ThemedSwitch
                label="启用"
                value={enableTTS}
                onChangeValue={(value) => {
                    if (value) {
                        getVoices(true)
                    } else Speech.stop()
                    setEnableTTS(value)
                }}
            />

            <ThemedSwitch
                value={autoTTS}
                onChangeValue={setAutoTTS}
                label="推理时自动启用 TTS"
            />

            <SectionTitle style={{ marginTop: 8 }}>
                语言 ({Object.keys(languageList).length})
            </SectionTitle>
            <View style={{ marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                    <DropdownSheet
                        containerStyle={{ flex: 1 }}
                        selected={lang}
                        data={languages}
                        labelExtractor={(item) => item}
                        placeholder="选择语言"
                        onChangeValue={(item) => setLang(item)}
                    />
                    <ThemedButton
                        iconName="reload1"
                        iconSize={20}
                        onPress={() => getVoices()}
                        variant="secondary"
                    />
                </View>
            </View>

            <SectionTitle style={{ marginTop: 8 }}>
                发音人 ({modelList.filter((item) => item.language === lang).length})
            </SectionTitle>

            <DropdownSheet
                style={{ marginBottom: 8 }}
                search
                modalTitle="选择发音人"
                selected={currentSpeaker}
                data={languageList?.[lang] ?? []}
                labelExtractor={(item) => item.identifier}
                placeholder="选择发音人"
                onChangeValue={(item) => setCurrentSpeaker(item)}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 8 }}>
                <ThemedTextInput
                    value={testAudioText}
                    onChangeText={setTestAudioText}
                    style={{ color: color.text._400, fontStyle: 'italic', flex: 1 }}
                />
                <ThemedButton
                    label="测试"
                    variant="secondary"
                    onPress={() => {
                        if (currentSpeaker === undefined) {
                            Logger.warnToast(`未选择发音人`)
                            return
                        }
                        Speech.speak(testAudioText, {
                            language: currentSpeaker.language,
                            voice: currentSpeaker.identifier,
                        })
                    }}
                />
            </View>
        </View>
    )
}

export default TTSMenu
