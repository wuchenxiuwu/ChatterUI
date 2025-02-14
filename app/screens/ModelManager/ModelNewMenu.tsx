import PopupMenu, { MenuRef } from '@components/views/PopupMenu'
import { Model } from '@lib/engine/Local/Model'
import { useState } from 'react'
import { View } from 'react-native'

type ModelNewMenuProps = {
    modelImporting: boolean
    setModelImporting: (b: boolean) => void
}

const ModelNewMenu: React.FC<ModelNewMenuProps> = ({ modelImporting, setModelImporting }) => {
    const [showDownload, setShowDownload] = useState(false)

    // const handleDownloadModel = (text: string) => {}

    const handleSetExternal = async (menuRef: MenuRef) => {
        menuRef.current?.close()
        if (modelImporting) return
        setModelImporting(true)
        await Model.linkModelExternal()
        setModelImporting(false)
    }

    const handleImportModel = async (menuRef: MenuRef) => {
        menuRef.current?.close()
        if (modelImporting) return
        setModelImporting(true)
        await Model.importModel()
        setModelImporting(false)
    }

    return (
        <View>
            <PopupMenu
                placement="bottom"
                icon="addfile"
                disabled={modelImporting}
                options={[
                    {
                        label: '将模型复制到 ChatterUI',
                        icon: 'download',
                        onPress: handleImportModel,
                    },
                    {
                        label: '使用外部模型',
                        icon: 'link',
                        onPress: handleSetExternal,
                    },
                ]}
            />
        </View>
    )
}

export default ModelNewMenu
