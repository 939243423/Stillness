import Taro from '@tarojs/taro';

const SOUND_SOURCES: Record<string, string> = {
  // 建议将音频下载到 src/assets/audio/ 并使用本地路径以获得最佳稳定性
  rain: 'https://cdn.pixabay.com/audio/2026/03/31/audio_c7cade9fe4.mp3',
  white_noise: 'https://cdn.pixabay.com/audio/2025/06/28/audio_08a82f21bf.mp3',
  forest: 'https://cdn.pixabay.com/audio/2022/02/12/audio_8ca49a7f20.mp3',
};

class AudioService {
  private static instance: AudioService;
  private ctx: Taro.InnerAudioContext | null = null;
  private currentType: string | null = null;

  private constructor() {
    if (process.env.TARO_ENV !== 'h5') {
       this.ctx = Taro.createInnerAudioContext();
       this.ctx.loop = true;
       this.ctx.volume = 0.5;
       
       this.ctx.onError((res) => {
         console.error('[AudioService] Error:', res);
         Taro.showToast({ title: '氛围音加载失败，请检查网络或路径', icon: 'none' });
         this.currentType = null;
       });
    }
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public play(type: string) {
    if (!this.ctx || !SOUND_SOURCES[type]) return;
    
    if (this.currentType === type && !this.ctx.paused) return;

    try {
      this.ctx.stop();
      this.ctx.src = SOUND_SOURCES[type];
      this.ctx.play();
      this.currentType = type;
      console.log(`[AudioService] Attempting to play: ${type}`);
    } catch (e) {
      console.error('[AudioService] Play exception:', e);
    }
  }

  public stop() {
    if (this.ctx) {
      this.ctx.stop();
      this.currentType = null;
      console.log(`[AudioService] Stopped`);
    }
  }

  public setVolume(val: number) {
    if (this.ctx) {
      this.ctx.volume = val;
    }
  }
}

export default AudioService.getInstance();
