import { View, Text } from "@tarojs/components"
import { useStore } from "../../store"
import "./index.scss"

interface ContentPreviewProps {
  showControls?: boolean
}

export default function ContentPreview({ showControls = true }: ContentPreviewProps) {
  const { content, template } = useStore()

  return (
    <View className={`content-preview ${template}`}>
      {showControls && (
        <View className="window-controls">
          <View className="control red"></View>
          <View className="control yellow"></View>
          <View className="control green"></View>
          <Text className="window-title">AISnap</Text>
        </View>
      )}
      <Text className="content-text">{content}</Text>
    </View>
  )
}

