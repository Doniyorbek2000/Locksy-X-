package com.example.locksy_x

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import android.widget.Toast
import android.content.Context

class WebsiteBlockerService : AccessibilityService() {

    private val blacklistedUrls = mutableListOf("terror", "ekstrem", "xalifalik", "betting", "1xbet", "scam")

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (event.eventType == AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED || 
            event.eventType == AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            
            val nodeInfo = event.source ?: return
            checkNodes(nodeInfo)
        }
    }

    private fun checkNodes(node: AccessibilityNodeInfo) {
        val text = node.text?.toString()?.lowercase()
        if (text != null) {
            for (url in blacklistedUrls) {
                if (text.contains(url)) {
                    blockSite()
                    return
                }
            }
        }

        for (i in 0 until node.childCount) {
            val child = node.getChild(i)
            if (child != null) {
                checkNodes(child)
            }
        }
    }

    private fun blockSite() {
        performGlobalAction(GLOBAL_ACTION_BACK)
        Toast.makeText(applicationContext, "Locksy X: Ushbu sayt taqiqlangan!", Toast.LENGTH_SHORT).show()
    }

    override fun onInterrupt() {}
}
