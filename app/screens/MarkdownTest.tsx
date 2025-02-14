import HeaderTitle from '@components/views/HeaderTitle'
import { MarkdownStyle } from '@lib/markdown/Markdown'
import { Theme } from '@lib/theme/ThemeManager'
import React from 'react'
import { StyleSheet, Platform, ScrollView } from 'react-native'
import Markdown from 'react-native-markdown-display'

const markdownData = `
# 标题 1
## 标题 2
### 标题 3
#### 标题 4
##### 标题 5
###### 标题 6
这里是一些普通文本

---

一个加粗文本示例。

一个斜体文本示例。

一个删除线文本示例。

> 这是一个引用块。
> > 这是一个嵌套引用块。
> 
> 退出
> > 再次！

- 项目 1
- 项目 2
- 项目 3

1. 项目 1
2. 项目 2
3. 项目 3

一个列表中的列表：

- 项目 1
  - 子项目 1
  - 子项目 2

内联代码示例。

\`\`\`
这是一个代码块
\`\`\`

| 第一行   | 第二行 | 第三行     |
|----------|--------|------------|
| 项目 1   | 项目   | 项目       |
| 项目 2   | 项目   | 项目       |
| 项目 3   | 项目   | 项目       |
| 项目 4   | 项目   | 项目       |


`

const MarkdownTest = () => {
    const markdownStyle = MarkdownStyle.useMarkdownStyle()
    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
            <HeaderTitle title="Markdown 测试" />
            <Markdown
                mergeStyle={false}
                markdownit={MarkdownStyle.Rules}
                rules={MarkdownStyle.RenderRules}
                style={markdownStyle}>
                {markdownData}
            </Markdown>
        </ScrollView>
    )
}

export default MarkdownTest
