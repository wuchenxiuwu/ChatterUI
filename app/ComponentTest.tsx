import ThemedButton from '@components/buttons/ThemedButton'
import DropdownSheet from '@components/input/DropdownSheet'
import MultiDropdownSheet from '@components/input/MultiDropdownSheet'
import StringArrayEditor from '@components/input/StringArrayEditor'
import ThemedCheckbox from '@components/input/ThemedCheckbox'
import ThemedSlider from '@components/input/ThemedSlider'
import ThemedSwitch from '@components/input/ThemedSwitch'
import ThemedTextInput from '@components/input/ThemedTextInput'
import Accordion from '@components/views/Accordion'
import React, { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

const selectorData = [
    { label: '项目 0', value: '1' },
    { label: '项目 1', value: '1' },
    { label: '项目 2', value: '2' },
    { label: '项目 3', value: '3' },
    { label: '项目 4', value: '4' },
    { label: '项目 5', value: '5' },
    { label: '项目 6', value: '6' },
    { label: '项目 7', value: '7' },
    { label: '项目 8', value: '8' },
]

const buttonVariants = ['primary', 'secondary', 'tertiary', 'critical', 'disabled']

const ComponentTest = () => {
    const [selected, setSelected] = useState<(typeof selectorData)[0]>(selectorData[0])
    const [selectedM, setSelectedM] = useState<typeof selectorData>([])
    const [slider, setSlider] = useState(0)
    const [data, setData] = useState<string[]>([])
    const [textInputData, setTextInputData] = useState('')
    const [checkbox, setCheckbox] = useState(true)
    const [sw, setSw] = useState(true)

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ rowGap: 16, padding: 16 }}
            keyboardShouldPersistTaps="always">
            <View style={{ rowGap: 8 }}>
                {buttonVariants.map((item) => (
                    //@ts-ignore
                    <ThemedButton
                        variant={item}
                        key={item}
                        label={
                            item === 'primary'
                                ? '按钮样式：主要'
                                : item === 'secondary'
                                ? '按钮样式：次要'
                                : item === 'tertiary'
                                ? '按钮样式：辅助'
                                : item === 'critical'
                                ? '按钮样式：关键'
                                : '按钮样式：禁用'
                        }
                    />
                ))}
            </View>
            <Accordion label="测试手风琴">
                <Text style={{ color: 'yellow' }}>测试文本</Text>
            </Accordion>
            <StringArrayEditor title="测试输入标签" value={data} setValue={setData} />
            <ThemedCheckbox label="测试复选框" value={checkbox} onChangeValue={setCheckbox} />
            <ThemedSwitch label="测试开关" value={sw} onChangeValue={setSw} />
            <ThemedSlider
                value={slider}
                onValueChange={setSlider}
                min={0}
                max={10}
                step={1}
                label="测试滑块"
            />
            <ThemedTextInput
                label="测试文本"
                value={textInputData}
                onChangeText={setTextInputData}
            />
            <DropdownSheet
                data={selectorData}
                selected={selected}
                onChangeValue={setSelected}
                labelExtractor={(item) => item.label}
            />
            <MultiDropdownSheet
                data={selectorData}
                selected={selectedM}
                onChangeValue={setSelectedM}
                labelExtractor={(item) => item.label}
            />
        </ScrollView>
    )
}

export default ComponentTest
