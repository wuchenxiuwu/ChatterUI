import Alert from '@components/views/Alert'
import TextBoxModal from '@components/views/TextBoxModal'
import { AntDesign } from '@expo/vector-icons'
import { GGMLNameMap } from '@lib/engine/Local'
import { Llama } from '@lib/engine/Local/LlamaLocal'
import { Model } from '@lib/engine/Local/Model'
import { Theme } from '@lib/theme/ThemeManager'
import { readableFileSize } from '@lib/utils/File'
import { ModelDataType } from 'db/schema'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { Easing, SlideInLeft } from 'react-native-reanimated'

type ModelItemProps = {
    item: ModelDataType
    index: number
    modelLoading: boolean
    setModelLoading: (b: boolean) => void
    modelImporting: boolean
}

const ModelItem: React.FC<ModelItemProps> = ({
    item,
    modelImporting,
    modelLoading,
    setModelLoading,
    index,
}) => {
    const styles = useStyles()
    const { color } = Theme.useTheme()

    const { loadModel, unloadModel, modelId } = Llama.useLlama((state) => ({
        loadModel: state.load,
        unloadModel: state.unload,
        modelId: state.model?.id,
    }))

    const [showEdit, setShowEdit] = useState(false)
    //@ts-ignore
    const quant: string = item.quantization && GGMLNameMap[item.quantization]
    const disableDelete = modelId === item.id || modelLoading
    const isInvalid = Model.isInitialEntry(item)

    const handleDeleteModel = () => {
        Alert.alert({
            title: '删除模型',
            description:
                `您确定要删除 "${item.name}" 吗?\n\n此操作无法撤销!` +
                (!isInvalid
                    ? !item.file_path.startsWith('content')
                        ? `\n\n此操作将释放 ${readableFileSize(item.file_size)} 空间`
                        : '\n\n(这不会删除外部模型文件，仅删除此条目)'
                    : ''),
            buttons: [
                { label: '取消' },
                {
                    label: '删除模型',
                    onPress: async () => {
                        if (modelId === item.id) {
                            await unloadModel()
                        }
                        await Model.deleteModelById(item.id)
                    },
                    type: 'warning',
                },
            ],
        })
    }

    const disable = modelLoading || modelImporting || modelId !== undefined || isInvalid
    const disableEdit = modelId === item.id || modelLoading || isInvalid

    return (
        <Animated.View
            style={styles.modelContainer}
            entering={SlideInLeft.easing(Easing.inOut(Easing.cubic))}>
            <TextBoxModal
                booleans={[showEdit, setShowEdit]}
                onConfirm={async (name) => {
                    await Model.updateName(name, item.id)
                }}
                title="重命名模型"
                defaultValue={item.name}
            />

            <Text style={styles.title}>{item.name}</Text>
            {!isInvalid && (
                <View style={styles.tagContainer}>
                    <Text style={styles.tag}>
                        {item.params === 'N/A' ? '无参数大小' : item.params}
                    </Text>
                    <Text style={styles.tag}>{quant}</Text>
                    <Text style={styles.tag}>{readableFileSize(item.file_size)}</Text>
                    <Text style={{ ...styles.tag, textTransform: 'capitalize' }}>
                        {item.architecture}
                    </Text>
                    <Text style={styles.tag}>
                        {item.file_path.startsWith('content') ? '外部' : '内部'}
                    </Text>
                </View>
            )}
            {isInvalid && (
                <View style={styles.tagContainer}>
                    <Text style={styles.tag}>模型无效</Text>
                </View>
            )}
            {!isInvalid && (
                <Text style={styles.subtitle}>上下文长度: {item.context_length}</Text>
            )}
            <Text style={styles.subtitle}>文件: {item.file.replace('.gguf', '')}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    disabled={disableEdit}
                    onPress={() => {
                        setShowEdit(true)
                    }}>
                    <AntDesign
                        name="edit"
                        style={styles.button}
                        size={24}
                        color={disableEdit ? color.text._600 : color.text._300}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={disableDelete}
                    onPress={() => {
                        handleDeleteModel()
                    }}>
                    <AntDesign
                        name="delete"
                        style={styles.button}
                        size={24}
                        color={disableDelete ? color.text._600 : color.error._500}
                    />
                </TouchableOpacity>
                {modelId !== item.id && (
                    <TouchableOpacity
                        disabled={disable}
                        onPress={async () => {
                            setModelLoading(true)
                            await loadModel(item)
                            setModelLoading(false)
                        }}>
                        <AntDesign
                            name="playcircleo"
                            style={styles.button}
                            size={24}
                            color={disable ? color.text._600 : color.text._300}
                        />
                    </TouchableOpacity>
                )}
                {modelId === item.id && (
                    <TouchableOpacity
                        disabled={modelLoading || modelImporting}
                        onPress={async () => {
                            await unloadModel()
                        }}>
                        <AntDesign
                            name="closecircleo"
                            style={styles.button}
                            size={24}
                            color={color.text._100}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    )
}

export default ModelItem

const useStyles = () => {
    const { color, spacing, borderRadius, fontSize } = Theme.useTheme()

    return StyleSheet.create({
        modelContainer: {
            borderRadius: spacing.l,
            paddingVertical: spacing.l,
            paddingHorizontal: spacing.xl2,
            backgroundColor: color.neutral._200,
            marginBottom: spacing.l,
        },

        tagContainer: {
            columnGap: 4,
            rowGap: 4,
            paddingTop: spacing.m,
            paddingBottom: spacing.m,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
        },

        tag: {
            borderRadius: borderRadius.m,
            borderColor: color.primary._300,
            borderWidth: 1,
            paddingHorizontal: spacing.m,
            paddingVertical: spacing.s,
            color: color.text._300,
        },
        title: {
            fontSize: fontSize.l,
            color: color.text._100,
        },

        subtitle: {
            color: color.text._400,
        },

        buttonContainer: {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'space-between',
            marginTop: spacing.l,
            borderColor: color.neutral._300,
        },

        button: {
            flex: 1,
            paddingVertical: spacing.m,
            paddingHorizontal: spacing.xl3,
        },
    })
}
