import ThemedButton from '@components/buttons/ThemedButton'
import ThemedSlider from '@components/input/ThemedSlider'
import ThemedSwitch from '@components/input/ThemedSwitch'
import SectionTitle from '@components/text/SectionTitle'
import Alert from '@components/views/Alert'
import { AppSettings, Global } from '@lib/constants/GlobalValues'
import { Llama, LlamaConfig } from '@lib/engine/Local/LlamaLocal'
import { KV } from '@lib/engine/Local/Model'
import { Logger } from '@lib/state/Logger'
import { readableFileSize } from '@lib/utils/File'
import { useFocusEffect } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { BackHandler, Platform, View } from 'react-native'
import { useMMKVBoolean, useMMKVObject } from 'react-native-mmkv'
import Animated, { Easing, SlideInRight, SlideOutRight } from 'react-native-reanimated'

type ModelSettingsProp = {
    modelImporting: boolean
    modelLoading: boolean
    exit: () => void
}

type CPUFeatures = {
    armv8: boolean
    dotprod: boolean
    i8mm: boolean
}

const ModelSettings: React.FC<ModelSettingsProp> = ({ modelImporting, modelLoading, exit }) => {
    const { config, setConfig } = Llama.useEngineData((state) => ({
        config: state.config,
        setConfig: state.setConfiguration,
    }))

    const [saveKV, setSaveKV] = useMMKVBoolean(AppSettings.SaveLocalKV)
    const [autoloadLocal, setAutoloadLocal] = useMMKVBoolean(AppSettings.AutoLoadLocal)

    const [kvSize, setKVSize] = useState(0)

    const getKVSize = async () => {
        const size = await KV.getKVSize()
        setKVSize(size)
    }

    useEffect(() => {
        getKVSize()
    }, [])

    const backAction = () => {
        exit()
        return true
    }

    useFocusEffect(() => {
        const handler = BackHandler.addEventListener('hardwareBackPress', backAction)
        return () => handler.remove()
    })

    const handleDeleteKV = () => {
        Alert.alert({
            title: '删除 KV 缓存',
            description: `您确定要删除 KV 缓存吗？此操作无法撤销。 \n\n 这将释放 ${readableFileSize(kvSize)} 的空间.`,
            buttons: [
                { label: '取消' },
                {
                    label: '删除 KV 缓存',
                    onPress: async () => {
                        await KV.deleteKV()
                        Logger.info('KV 缓存已删除!')
                        getKVSize()
                    },
                    type: 'warning',
                },
            ],
        })
    }

    return (
        <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            entering={SlideInRight.easing(Easing.inOut(Easing.cubic))}
            exiting={SlideOutRight.easing(Easing.inOut(Easing.cubic))}>
            <SectionTitle>CPU 设置</SectionTitle>
            <View style={{ marginTop: 16 }} />
            {config && (
                <View>
                    <ThemedSlider
                        label="最大上下文长度"
                        value={config.context_length}
                        onValueChange={(value) => setConfig({ ...config, context_length: value })}
                        min={1024}
                        max={32768}
                        step={1024}
                        disabled={modelImporting || modelLoading}
                    />
                    <ThemedSlider
                        label="线程数"
                        value={config.threads}
                        onValueChange={(value) => setConfig({ ...config, threads: value })}
                        min={1}
                        max={8}
                        step={1}
                        disabled={modelImporting || modelLoading}
                    />

                    <ThemedSlider
                        label="批量大小"
                        value={config.batch}
                        onValueChange={(value) => setConfig({ ...config, batch: value })}
                        min={16}
                        max={512}
                        step={16}
                        disabled={modelImporting || modelLoading}
                    />
                    {/* Note: llama.rn does not have any Android gpu acceleration */}
                    {Platform.OS === 'ios' && (
                        <ThemedSlider
                            label="GPU 层数"
                            value={config.gpu_layers}
                            onValueChange={(value) => setConfig({ ...config, gpu_layers: value })}
                            min={0}
                            max={100}
                            step={1}
                        />
                    )}
                </View>
            )}
            <SectionTitle>高级设置</SectionTitle>
            <ThemedSwitch
                label="在聊天时自动加载模型"
                value={autoloadLocal}
                onChangeValue={setAutoloadLocal}
            />
            <ThemedSwitch
                label="保存本地 KV"
                value={saveKV}
                onChangeValue={setSaveKV}
                description={
                    saveKV
                        ? ''
                        : '在生成过程中保存 KV 缓存，允许您在关闭应用后继续会话。必须使用相同的模型才能正常工作。保存 KV 缓存文件可能会非常大，并可能对电池寿命产生负面影响！'
                }
            />
            {saveKV && (
                <ThemedButton
                    buttonStyle={{ marginTop: 8 }}
                    label={'清除 KV 缓存 (' + readableFileSize(kvSize) + ')'}
                    onPress={handleDeleteKV}
                    variant={kvSize === 0 ? 'disabled' : 'critical'}
                />
            )}
        </Animated.ScrollView>
    )
}

export default ModelSettings
