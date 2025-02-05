import Accordion from '@components/views/Accordion'
import { Style } from '@lib/theme/Style'
import { Theme } from '@lib/theme/ThemeManager'
import { Platform, StyleSheet, Text } from 'react-native'
import { MarkdownIt } from 'react-native-markdown-display'

import doubleQuotePlugin from './MarkdownQuotePlugin'
import thinkPlugin from './MarkdownThinkPlugin'

export namespace MarkdownStyle {
    export const Rules = MarkdownIt({ typographer: true }).use(thinkPlugin).use(doubleQuotePlugin)

    export const RenderRules = {
        double_quote: (node: any, children: any, parent: any, styles: any) => {
            return (
                <Text key={node.key} style={styles.double_quote}>
                    "{children}"
                </Text>
            )
        },
        think: (node: any, children: any, parent: any, styles: any) => {
            return (
                <Accordion
                    key={node.key}
                    label="Thinking..."
                    //TODO: Figure out better fix for width
                    style={{ flex: 1, paddingVertical: 2, width: 5000 }}>
                    {children}
                </Accordion>
            )
        },
    }

    export const useMarkdownStyle = () => {
        const { color, spacing, borderWidth, borderRadius } = Theme.useTheme()

        return StyleSheet.create({
            double_quote: { color: color.quote },
            // The main container
            body: {},

            // Headings
            heading1: {
                flexDirection: 'row',
                fontSize: 32,
                color: color.text._100,
            },
            heading2: {
                flexDirection: 'row',
                fontSize: 24,
                color: color.text._100,
            },
            heading3: {
                flexDirection: 'row',
                fontSize: 18,
                color: color.text._100,
            },
            heading4: {
                flexDirection: 'row',
                fontSize: 16,
                color: color.text._100,
            },
            heading5: {
                flexDirection: 'row',
                fontSize: 13,
                color: color.text._100,
            },
            heading6: {
                flexDirection: 'row',
                fontSize: 11,
                color: color.text._100,
            },

            // Horizontal Rule
            hr: {
                backgroundColor: color.primary._500,
                height: 1,
                marginTop: spacing.m,
            },

            // Emphasis
            strong: {
                fontWeight: 'bold',
                color: color.text._100,
            },
            em: {
                fontStyle: 'italic',
                color: color.text._400,
            },
            s: {
                textDecorationLine: 'line-through',
                color: color.text._400,
            },

            // Blockquotes
            blockquote: {
                backgroundColor: color.neutral._200,
                borderColor: color.primary._500,
                borderLeftWidth: 4,
                marginLeft: spacing.sm,
                paddingHorizontal: spacing.sm,
                color: color.text._400,
            },

            // Lists
            bullet_list: {
                marginVertical: spacing.sm,
            },
            ordered_list: {
                marginVertical: spacing.sm,
            },
            list_item: {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                color: color.text._100,
            },
            // @pseudo class, does not have a unique render rule
            bullet_list_icon: {
                color: color.text._400,
                marginLeft: spacing.m,
                marginRight: spacing.m,
            },
            // @pseudo class, does not have a unique render rule
            bullet_list_content: {
                flex: 1,
            },
            // @pseudo class, does not have a unique render rule
            ordered_list_icon: {
                color: color.text._400,
                marginLeft: spacing.m,
                marginRight: spacing.m,
            },
            // @pseudo class, does not have a unique render rule
            ordered_list_content: {
                flex: 1,
            },

            // Code
            code_inline: {
                borderWidth: 1,
                borderColor: color.neutral._100,
                backgroundColor: color.neutral._200,
                padding: spacing.m,
                borderRadius: 4,
                ...Platform.select({
                    ios: {
                        fontFamily: 'Courier',
                    },
                    android: {
                        fontFamily: 'monospace',
                    },
                }),
            },
            code_block: {
                color: color.text._400,
                borderWidth: 1,
                borderColor: color.neutral._100,
                backgroundColor: color.neutral._200,
                padding: 4,
                borderRadius: 8,
                ...Platform.select({
                    ios: {
                        fontFamily: 'Courier',
                    },
                    android: {
                        fontFamily: 'monospace',
                    },
                }),
            },
            fence: {
                color: color.text._400,
                borderWidth: 1,
                borderColor: color.neutral._100,
                backgroundColor: color.neutral._200,
                borderRadius: 4,
                ...Platform.select({
                    ios: {
                        fontFamily: 'Courier',
                    },
                    android: {
                        fontFamily: 'monospace',
                    },
                }),
                marginVertical: 4,
            },

            // Tables
            table: {
                borderWidth: 1,
                borderColor: color.primary._500,
                borderRadius: 4,
                marginBottom: 8,
            },
            thead: {
                backgroundColor: color.neutral._100,
            },
            tbody: {
                backgroundColor: color.neutral._200,
            },
            th: {
                flex: 1,
                padding: 8,
            },
            tr: {
                borderBottomWidth: 1,
                borderColor: color.neutral._300,
                flexDirection: 'row',
            },
            td: {
                flex: 1,
                padding: 8,
            },

            // Links
            link: {
                textDecorationLine: 'underline',
            },
            blocklink: {
                flex: 1,
                borderColor: '#000000',
                borderBottomWidth: 1,
            },

            // Images
            image: {
                flex: 1,
            },

            // Text Output
            text: {},
            textgroup: {
                color: color.text._100,
            },
            paragraph: {
                marginTop: 8,
                marginBottom: 8,
                flexWrap: 'wrap',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: '100%',
                color: color.text._100,
            },
            hardbreak: {
                width: '100%',
                height: 1,
                color: color.text._100,
            },
            softbreak: {},

            // Believe these are never used but retained for completeness
            pre: {},
            inline: {},
            span: {},
        })
    }
}
