import { Theme } from '@lib/theme/ThemeManager'
import React from 'react'
import { Switch, Text, View } from 'react-native'

interface ThemedSwitchProps {
    description?: string
    label?: string
    value: boolean | undefined
    onValueChange: (b: boolean) => void
}

const ThemedSwitch: React.FC<ThemedSwitchProps> = ({
    description,
    label,
    value,
    onValueChange,
}) => {
    const { color, spacing } = Theme.useTheme()
    return (
        <View>
            <View style={{ flexDirection: 'row', paddingVertical: spacing.l }}>
                <Switch
                    trackColor={{
                        false: color.neutral._200,
                        true: color.neutral._400,
                    }}
                    thumbColor={value ? color.primary._500 : color.primary._200}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={onValueChange}
                    value={value}
                />
                {label && (
                    <Text
                        style={{
                            marginLeft: spacing.xl,
                            color: value ? color.text._100 : color.text._400,
                        }}>
                        {label}
                    </Text>
                )}
            </View>
            {description && (
                <Text
                    style={{
                        color: color.text._600,
                        paddingBottom: spacing.xs,
                        marginBottom: spacing.m,
                    }}>
                    {description}
                </Text>
            )}
        </View>
    )
}

export default ThemedSwitch
