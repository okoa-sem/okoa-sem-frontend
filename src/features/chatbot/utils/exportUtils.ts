'use client'

export const exportToText = (content: string, filename: string = 'export.txt') => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const exportToMarkdown = (content: string, filename: string = 'export.md') => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:text/markdown;charset=utf-8,' + encodeURIComponent(content)
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const exportChatToJSON = (messages: any[], filename: string = 'chat-export.json') => {
  const json = JSON.stringify(messages, null, 2)
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' + encodeURIComponent(json)
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

export const downloadAsFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:${mimeType};charset=utf-8,` + encodeURIComponent(content)
  )
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}
