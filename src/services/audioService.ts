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
      this.ctx.autoplay = false; // 显式关闭自动播放，由代码控制
      this.ctx.obeyMuteSwitch = false;

      Taro.setInnerAudioOption({
        obeyMuteSwitch: false,
        mixWithOther: true,
      });

      this.ctx.onError((res) => {
        console.error('[AudioService] Error:', res);
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
    if (!this.ctx || !SOUND_SOURCES[type]) {
      console.warn(`[AudioService] Invalid type or ctx missing: ${type}`);
      return;
    }

    // 如果已经在播放同类型，则不重复操作
    if (this.currentType === type && !this.ctx.paused) {
      console.log(`[AudioService] Already playing: ${type}`);
      return;
    }

    try {
      this.ctx.stop();
      this.ctx.src = SOUND_SOURCES[type];

      // 在 iOS 上，直接调用 play() 可能会因为还没加载完而失效
      // 监听 canplay 事件确保资源就绪
      const onCanplay = () => {
        this.ctx?.play();
        this.ctx?.offCanplay(onCanplay);
      };

      this.ctx.onCanplay(onCanplay);

      // 同时显式调用一次 play 以触发缓冲（部分版本需要）
      this.ctx.play();

      this.currentType = type;
      console.log(`[AudioService] Loading and attempting to play: ${type}`);
    } catch (e) {
      console.error('[AudioService] Play exception:', e);
    }
  }

  public stop() {
    if (this.ctx) {
      this.ctx.stop();
      this.ctx.src = ''; // 清除 src 释放资源
      this.currentType = null;
      console.log(`[AudioService] Stopped and cleared src`);
    }
  }

  public setVolume(val: number) {
    if (this.ctx) {
      this.ctx.volume = val;
    }
  }
}

export default AudioService.getInstance();
