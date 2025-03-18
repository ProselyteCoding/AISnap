"use client"

import { View, Text } from "@tarojs/components"
import { AtIcon } from "taro-ui"
import "./index.scss"

interface ActionButtonProps {
  text: string
  icon?: string
  type?: "primary" | "secondary"
  disabled?: boolean
  onClick?: () => void
}

export default function ActionButton({ text, icon, type = "primary", disabled = false, onClick }: ActionButtonProps) {
  return (
    <View className={`action-button ${type} ${disabled ? "disabled" : ""}`} onClick={disabled ? undefined : onClick}>
      {icon && <AtIcon value={icon} size="16" color={type === "primary" ? "#FFF" : "#333"} />}
      <Text>{text}</Text>
    </View>
  )
}

