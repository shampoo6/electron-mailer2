export default {
  eventHandlers: {} as { [key: string]: Function[] },
  sign(key: string, handler: (payload?: any) => void) {
    this.eventHandlers[key] = this.eventHandlers[key] || []
    this.eventHandlers[key].push(handler)
  },
  unSign(key: string, handler: (payload?: any) => void) {
    if (!this.eventHandlers[key]) return
    const i = this.eventHandlers[key].findIndex(h => h === handler)
    this.eventHandlers[key].splice(i, 1)
    if (this.eventHandlers[key].length === 0)
      delete this.eventHandlers[key]
  },
  notify(key: string, payload?: any) {
    const handlers = this.eventHandlers[key]
    if (handlers)
      handlers.forEach(handler => {
        handler(payload)
      })
  }
}

