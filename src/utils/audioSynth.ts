class AmbientDrone {
  private audioCtx: AudioContext | null = null
  private osc1: OscillatorNode | null = null
  private osc2: OscillatorNode | null = null
  private gainNode: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null

  start() {
    if (this.audioCtx) return // Already running
    
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
      this.audioCtx = new AudioCtxClass()
      
      this.osc1 = this.audioCtx.createOscillator()
      this.osc2 = this.audioCtx.createOscillator()
      
      // Use triangle waves for a very soft, woodwind-like texture
      this.osc1.type = 'triangle'
      this.osc2.type = 'triangle'
      
      // A deep, atmospheric perfect fifth chord: C2 (65.41 Hz) & G2 (98.00 Hz)
      this.osc1.frequency.setValueAtTime(65.41, this.audioCtx.currentTime)
      this.osc2.frequency.setValueAtTime(98.00, this.audioCtx.currentTime)
      
      // Biquad lowpass filter to remove high frequencies and create a dark, sub-bass pad
      this.filterNode = this.audioCtx.createBiquadFilter()
      this.filterNode.type = 'lowpass'
      this.filterNode.frequency.setValueAtTime(130, this.audioCtx.currentTime) // warm cutoff

      // Gain controls with smooth volume envelope (Fade In / Out)
      this.gainNode = this.audioCtx.createGain()
      this.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime)
      // Smoothly ramp volume to an unobtrusive level over 2.0s
      this.gainNode.gain.linearRampToValueAtTime(0.18, this.audioCtx.currentTime + 2.0)

      // Connect nodes
      this.osc1.connect(this.filterNode)
      this.osc2.connect(this.filterNode)
      this.filterNode.connect(this.gainNode)
      this.gainNode.connect(this.audioCtx.destination)

      this.osc1.start()
      this.osc2.start()
    } catch (e) {
      console.warn('Web Audio API not supported or blocked by browser gesture settings', e)
    }
  }

  stop() {
    if (!this.audioCtx) return
    
    const ctx = this.audioCtx
    const gn = this.gainNode
    const o1 = this.osc1
    const o2 = this.osc2

    try {
      if (gn && ctx) {
        // Cancel scheduling and fade out volume smoothly over 1.0s
        gn.gain.cancelScheduledValues(ctx.currentTime)
        gn.gain.setValueAtTime(gn.gain.value, ctx.currentTime)
        gn.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.0)
        
        setTimeout(() => {
          try {
            if (o1) o1.stop()
            if (o2) o2.stop()
            ctx.close()
          } catch (e) {}
        }, 1100)
      } else {
        ctx.close()
      }
    } catch (e) {
      if (ctx) ctx.close()
    }

    this.audioCtx = null
    this.osc1 = null
    this.osc2 = null
    this.gainNode = null
    this.filterNode = null
  }
}

export const ambientDrone = new AmbientDrone()
