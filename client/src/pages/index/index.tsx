"use client"

import { useState } from "react"
import Taro from "@tarojs/taro"
import { View, Text, Button, Textarea } from "@tarojs/components"
import { AtTabs, AtTabsPane, AtIcon, AtToast } from "taro-ui"
import { useStore } from "../../store"
import "./index.scss"

export default function Index() {
  const { content, setContent, template, setTemplate, isCapturing, setIsCapturing } = useStore()
  const [currentTab, setCurrentTab] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [toastText, setToastText] = useState("")

  // Handle tab change
  const handleTabClick = (value) => {
    setCurrentTab(value)
  }

  // Capture text from clipboard
  const captureText = async () => {
    setIsCapturing(true)
    try {
      // Different platforms have different clipboard APIs
      if (process.env.TARO_ENV === "h5") {
        const text = await navigator.clipboard.readText()
        setContent(text)
      } else if (process.env.TARO_ENV === "weapp") {
        Taro.getClipboardData({
          success: (res) => {
            setContent(res.data)
          },
        })
      } else {
        // For other platforms
        Taro.getClipboardData({
          success: (res) => {
            setContent(res.data)
          },
        })
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err)
      showToastMessage("Failed to read clipboard")
    } finally {
      setIsCapturing(false)
    }
  }

  // Export as image
  const exportAsImage = async () => {
    try {
      if (process.env.TARO_ENV === "h5" || process.env.TARO_ENV === "weapp") {
        // For WeChat Mini Program and H5
        Taro.canvasToTempFilePath({
          canvasId: "content-canvas",
          success: (res) => {
            Taro.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                showToastMessage("Image saved to album")
              },
              fail: () => {
                showToastMessage("Failed to save image")
              },
            })
          },
          fail: () => {
            showToastMessage("Failed to create image")
          },
        })
      } else {
        // For other platforms
        showToastMessage("Export not supported on this platform")
      }
    } catch (err) {
      console.error("Failed to export as image:", err)
      showToastMessage("Failed to export as image")
    }
  }

  // Export as PDF (placeholder)
  const exportAsPdf = () => {
    showToastMessage("PDF export coming soon")
  }

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      Taro.setClipboardData({
        data: content,
        success: () => {
          showToastMessage("Copied to clipboard")
        },
      })
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
      showToastMessage("Failed to copy to clipboard")
    }
  }

  // Show toast message
  const showToastMessage = (text) => {
    setToastText(text)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 2000)
  }

  // Change template
  const changeTemplate = (newTemplate) => {
    setTemplate(newTemplate)
  }

  return (
    <View className="index-page">
      {/* Title bar */}
      <View className="title-bar">
        <View className="title-left">
          <AtIcon value="camera" size="16" color="#FFF" />
          <Text className="title-text">AISnap</Text>
        </View>
      </View>

      {/* Main content */}
      <View className="main-content">
        <View className="action-buttons mb-2">
          <Button className="action-button" onClick={captureText} disabled={isCapturing}>
            <AtIcon value="camera" size="16" color="#FFF" />
            <Text>{isCapturing ? "Capturing..." : "Capture Text"}</Text>
          </Button>

          <Button
            className="action-button secondary"
            onClick={() => changeTemplate(template === "default" ? "gradient" : "default")}
          >
            <AtIcon value="settings" size="16" color="#333" />
            <Text>Change Template</Text>
          </Button>
        </View>

        <AtTabs current={currentTab} tabList={[{ title: "Edit" }, { title: "Preview" }]} onClick={handleTabClick}>
          <AtTabsPane current={currentTab} index={0}>
            <Textarea
              className="content-textarea"
              value={content}
              onInput={(e) => setContent(e.detail.value)}
              placeholder="Paste or type AI-generated content here..."
            />
          </AtTabsPane>

          <AtTabsPane current={currentTab} index={1}>
            <View className={`content-preview ${template}`}>
              <View className="window-controls">
                <View className="control red"></View>
                <View className="control yellow"></View>
                <View className="control green"></View>
                <Text className="window-title">AISnap</Text>
              </View>
              <Text className="content-text">{content}</Text>
            </View>
          </AtTabsPane>
        </AtTabs>

        <View className="export-buttons">
          <Button className="action-button" onClick={exportAsImage} disabled={!content}>
            <AtIcon value="image" size="16" color="#FFF" />
            <Text>Export as Image</Text>
          </Button>

          <Button className="action-button" onClick={exportAsPdf} disabled={!content}>
            <AtIcon value="file-generic" size="16" color="#FFF" />
            <Text>Export as PDF</Text>
          </Button>

          <Button className="action-button secondary" onClick={copyToClipboard} disabled={!content}>
            <AtIcon value="clipboard" size="16" color="#333" />
            <Text>Copy</Text>
          </Button>
        </View>
      </View>

      {/* Toast */}
      <AtToast isOpened={showToast} text={toastText} status="success" duration={2000} />
    </View>
  )
}

