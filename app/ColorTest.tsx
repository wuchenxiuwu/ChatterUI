import { Theme } from '@lib/theme/ThemeManager';
import React from 'react';
import { Text, View } from 'react-native';

// 定义一个映射表，将英文颜色分类翻译成中文
const colorCategoryMap = new Map<string, string>();
colorCategoryMap.set('primary', '主要');
colorCategoryMap.set('secondary', '次要');
colorCategoryMap.set('neutral', '中性');
colorCategoryMap.set('error', '错误');
colorCategoryMap.set('warning', '警告');
colorCategoryMap.set('text', '文本');
colorCategoryMap.set('background', '背景');

// 定义一个映射表，将英文颜色值翻译成中文（如果需要）
const colorDetailMap = new Map<string, string>();
colorDetailMap.set('_100', '100 级');
colorDetailMap.set('_200', '200 级');
colorDetailMap.set('_300', '300 级');
// 根据需要添加更多映射

const ColorTest = () => {
    const { color, spacing } = Theme.useTheme();

    return (
        <View>
            <View style={{ padding: spacing.xl2, backgroundColor: color?.neutral?.['_200'] }}>
                <Text style={{ color: color?.text?.['_100'] }}>颜色测试</Text>
            </View>
            {Object.keys(color).map((item, index) => {
                if (item === 'name') return null; // 如果是 'name' 键，直接返回空
                return (
                    <View key={item} style={{ width: '100%' }}>
                        <Text style={{ color: color?.text?.['_100'] }}>
                            {/* 替换颜色分类的显示内容 */}
                            {colorCategoryMap.get(item) || item}
                        </Text>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            {Object.keys(color?.[item] ?? {}).map((item2) => {
                                return (
                                    <View
                                        key={item2}
                                        style={{
                                            flex: 1,
                                            paddingVertical: 24,
                                            // 使用翻译后的颜色值（如果需要）
                                            backgroundColor: color?.[item]?.[item2],
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

export default ColorTest;
