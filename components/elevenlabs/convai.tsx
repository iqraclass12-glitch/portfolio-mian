'use client'

import { useEffect } from 'react'

export default function ElevenLabsConvai() {
  useEffect(() => {
    // Load the ElevenLabs ConvAI widget script
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed'
    script.async = true
    script.type = 'text/javascript'
    document.body.appendChild(script)

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="elevenlabs-convai-container">
      <elevenlabs-convai agent-id="agent_9001kmg7q186eq1v7e67bwhcm059"></elevenlabs-convai>
    </div>
  )
}
