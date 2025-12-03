import { useState, useEffect, useRef } from "react";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import "./SlotMachine.css";

// Techno BGM 音乐引擎（移植自 laba.html，只保留 BGM，不影响现有 SFX）
function useTechnoBgm() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bgmIntervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);
  const [isBgmOn, setIsBgmOn] = useState(false);

  const initAudio = () => {
    if (audioCtxRef.current) return;
    const AC =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AC) return;
    audioCtxRef.current = new AC();
  };

  const playKick = (t: number) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.5);
    g.gain.setValueAtTime(0.8, t);
    g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    osc.start(t);
    osc.stop(t + 0.5);
  };

  const playHiHat = (t: number) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.05;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 8000;
    const g = audioCtx.createGain();
    g.gain.value = 0.3;

    noise.connect(filter);
    filter.connect(g);
    g.connect(audioCtx.destination);
    noise.start(t);
  };

  const playBass = (t: number, f: number) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sawtooth";
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, t);
    filter.frequency.linearRampToValueAtTime(800, t + 0.1);

    osc.connect(filter);
    filter.connect(g);
    g.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0.4, t);
    g.gain.linearRampToValueAtTime(0, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);
  };

  const playSequencer = (step: number) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    const t = audioCtx.currentTime;

    if (step % 4 === 0) playKick(t);
    if (step % 2 !== 0) playHiHat(t);
    if (step % 2 === 0) playBass(t, step < 8 ? 50 : 60);
  };

  const startBgm = () => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;
    if (bgmIntervalRef.current) {
      window.clearInterval(bgmIntervalRef.current);
    }
    const tempo = 130;
    const noteTime = 60 / tempo / 4;
    bgmIntervalRef.current = window.setInterval(() => {
      playSequencer(stepRef.current);
      stepRef.current = (stepRef.current + 1) % 16;
    }, noteTime * 1000);
  };

  const stopBgm = () => {
    if (bgmIntervalRef.current) {
      window.clearInterval(bgmIntervalRef.current);
      bgmIntervalRef.current = null;
    }
  };

  const toggleBgm = () => {
    initAudio();
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    if (!isBgmOn) {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
      }
      setIsBgmOn(true);
      startBgm();
    } else {
      setIsBgmOn(false);
      stopBgm();
    }
  };

  useEffect(() => {
    return () => {
      stopBgm();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { isBgmOn, toggleBgm };
}

// 通用老虎机音效 Hook：开始抽奖时播放澎湃旋转音效、转轴持续音效（Web Audio 合成），中奖时播放高潮音效
function useSlotSounds() {
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  // 使用 Web Audio API 合成转轴循环音效
  const reelAudioCtxRef = useRef<AudioContext | null>(null);
  const reelGainRef = useRef<GainNode | null>(null);
  const reelOscRef = useRef<OscillatorNode | null>(null);
  const reelNoiseRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // 建议将音频文件放在 public/sounds/ 目录下
    spinSoundRef.current = new Audio("/sounds/slot_spin.mp3");
    if (spinSoundRef.current) {
      spinSoundRef.current.volume = 0.7;
    }

    winSoundRef.current = new Audio("/sounds/slot_win.mp3");
    if (winSoundRef.current) {
      winSoundRef.current.volume = 0.9;
    }
  }, []);

  const playSpinSound = () => {
    const audio = spinSoundRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play();
    } catch {
      // 浏览器未允许自动播放时忽略错误
    }
  };

  const playWinSound = () => {
    const audio = winSoundRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      audio.play();
    } catch {
      // 浏览器未允许自动播放时忽略错误
    }
  };

  const startReelLoop = () => {
    if (!reelAudioCtxRef.current) {
      const AC =
        (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return;
      reelAudioCtxRef.current = new AC();
    }
    const audioCtx = reelAudioCtxRef.current;
    if (!audioCtx) return;

    // 已经在播放时不重复创建
    if (reelOscRef.current && reelGainRef.current && reelNoiseRef.current)
      return;

    const now = audioCtx.currentTime;

    // 主电机声：锯齿波，模拟电机持续低频滚动
    const motorOsc = audioCtx.createOscillator();
    motorOsc.type = "sawtooth";
    motorOsc.frequency.setValueAtTime(90, now); // 更低频，更像滚轮

    // 噪声：机械摩擦 / 滚轮刷刷声（白噪声 + 带通 + 轻微抖动）
    const bufferSize = audioCtx.sampleRate * 0.3;
    const noiseBuffer = audioCtx.createBuffer(
      1,
      bufferSize,
      audioCtx.sampleRate
    );
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.6;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = "bandpass";
    // 机械滚轮的中低频摩擦感：集中在 800~1500Hz 附近
    bandpass.frequency.value = 1100;
    bandpass.Q.value = 1.5;

    // 让滤波中心频率做轻微抖动，模拟滚轮不规则摩擦
    const lfo = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 3; // 3Hz 轻微颤动
    lfoGain.gain.value = 120; // ±120Hz 抖动
    lfo.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.26, now + 0.06);

    motorOsc.connect(gain);
    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(audioCtx.destination);

    motorOsc.start(now);
    noise.start(now);
    lfo.start(now);

    reelOscRef.current = motorOsc;
    reelNoiseRef.current = noise;
    reelGainRef.current = gain;
  };

  const stopReelLoop = () => {
    const audioCtx = reelAudioCtxRef.current;
    const osc = reelOscRef.current;
    const noise = reelNoiseRef.current;
    const gain = reelGainRef.current;
    if (!audioCtx || !osc || !gain || !noise) return;

    const now = audioCtx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.16);
    osc.stop(now + 0.18);
    noise.stop(now + 0.18);

    reelNoiseRef.current = null;
    reelOscRef.current = null;
    reelGainRef.current = null;
  };

  return { playSpinSound, playWinSound, startReelLoop, stopReelLoop };
}

// ========================= 豪华赌场 / 拉斯维加斯风老虎机 =========================
function VegasSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [prize, setPrize] = useState<string | null>(null);
  const [showJackpot, setShowJackpot] = useState(false);
  const reelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { playSpinSound, playWinSound, startReelLoop, stopReelLoop } =
    useSlotSounds();

  const symbols = ["7", "💰", "⭐", "🍒", "💎", "BAR"];
  const itemHeight = 200;

  // 初始化转轮位置
  useEffect(() => {
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const initialIndex = results[index] + symbols.length;
        reel.style.transition = "none";
        reel.style.transform = `translateY(-${initialIndex * itemHeight}px)`;
      }
    });
  }, []);

  // 结果变化后复位到中间那组，保证下一次从正确位置开始
  useEffect(() => {
    if (!spinning) {
      reelsRef.current.forEach((reel, index) => {
        if (reel) {
          const finalIndex = results[index] + symbols.length;
          reel.style.transition = "none";
          reel.style.transform = `translateY(-${finalIndex * itemHeight}px)`;
        }
      });
    }
  }, [results, spinning, symbols.length, itemHeight]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);
    setShowJackpot(false);
    playSpinSound();
    startReelLoop();

    const finalResults = [
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
    ];

    const spinDurations: number[] = [];

    reelsRef.current.forEach((reel, index) => {
      if (!reel) return;
      const currentIndex = results[index];
      const targetIndex = finalResults[index];
      const baseSpins = 28 + Math.floor(Math.random() * 10); // 转更久，更像赌场
      const spinDuration = 3200 + Math.random() * 1300;
      spinDurations.push(spinDuration);

      const totalItems = symbols.length * 6;
      const finalPosition =
        symbols.length + baseSpins * symbols.length + targetIndex;
      const safeFinalPosition = finalPosition % totalItems;
      const adjustedPosition =
        safeFinalPosition < symbols.length
          ? safeFinalPosition + symbols.length
          : safeFinalPosition;
      const finalY = adjustedPosition * itemHeight;

      reel.style.transition = "none";
      const startY = (currentIndex + symbols.length) * itemHeight;
      reel.style.transform = `translateY(-${startY}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (reel) {
            reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.18, 0.8, 0.12, 0.99)`;
            reel.style.transform = `translateY(-${finalY}px)`;
          }
        });
      });
    });

    const maxDuration = Math.max(...spinDurations) + 400;

    setTimeout(() => {
      stopReelLoop();
      setResults(finalResults);
      setSpinning(false);

      // 全中 7 或 💰 触发 JACKPOT，其它三连触发大中奖
      if (
        finalResults[0] === finalResults[1] &&
        finalResults[1] === finalResults[2]
      ) {
        playWinSound();
        const sym = symbols[finalResults[0]];
        if (sym === "7" || sym === "💰") {
          setShowJackpot(true);
          setPrize("🎰 JACKPOT! 豪华头奖！");
        } else {
          setPrize("✨ 大奖！三连符号！");
        }
      } else if (
        finalResults[0] === finalResults[1] ||
        finalResults[1] === finalResults[2] ||
        finalResults[0] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎉 小奖！两连符号！");
      }
    }, maxDuration);
  };

  return (
    <div className="slot-machine-container vegas-container">
      <div
        className={`slot-machine vegas-slot ${
          spinning ? "vegas-spinning" : ""
        } ${showJackpot ? "vegas-jackpot-mode" : ""}`}
      >
        <div className="vegas-top-glow" />
        <div className="slot-reels vegas-reels">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`slot-reel-wrapper vegas-reel-wrapper ${
                spinning ? "reel-shake" : ""
              }`}
            >
              <div
                ref={(el) => {
                  reelsRef.current[index] = el;
                }}
                className="slot-reel vegas-reel"
              >
                {[
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                ].map((symbol, i) => (
                  <div key={i} className="slot-item vegas-item">
                    {symbol}
                  </div>
                ))}
              </div>
              <div className="slot-window vegas-window"></div>
            </div>
          ))}
        </div>
        <button
          className={`spin-button vegas-button ${spinning ? "spinning" : ""}`}
          onClick={spin}
          disabled={spinning}
        >
          <span className="vegas-button-main">SPIN</span>
          <span className="vegas-button-sub">HIGH ROLLER DRAW</span>
        </button>
        {prize && <div className="prize-message vegas-prize">{prize}</div>}
        {showJackpot && (
          <div className="vegas-jackpot-banner">
            <span className="vegas-jackpot-word">JACKPOT</span>
          </div>
        )}
        <div className="vegas-coins-layer vegas-coins-left" />
        <div className="vegas-coins-layer vegas-coins-right" />
      </div>
    </div>
  );
}

// ========================= 科幻未来风老虎机 =========================
function SciFiSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [prize, setPrize] = useState<string | null>(null);
  const reelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { playSpinSound, playWinSound, startReelLoop, stopReelLoop } =
    useSlotSounds();

  const symbols = ["🪐", "🚀", "⚛️", "🤖", "🌌", "💫"];
  const itemHeight = 200;

  // 初始化转轮位置
  useEffect(() => {
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const initialIndex = results[index] + symbols.length;
        reel.style.transition = "none";
        reel.style.transform = `translateY(-${initialIndex * itemHeight}px)`;
      }
    });
  }, []);

  // 结果变化后复位
  useEffect(() => {
    if (!spinning) {
      reelsRef.current.forEach((reel, index) => {
        if (reel) {
          const finalIndex = results[index] + symbols.length;
          reel.style.transition = "none";
          reel.style.transform = `translateY(-${finalIndex * itemHeight}px)`;
        }
      });
    }
  }, [results, spinning, symbols.length, itemHeight]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setPrize(null);
    playSpinSound();
    startReelLoop();

    const finalResults = [
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
    ];

    const spinDurations: number[] = [];

    reelsRef.current.forEach((reel, index) => {
      if (!reel) return;
      const currentIndex = results[index];
      const targetIndex = finalResults[index];
      const baseSpins = 26 + Math.floor(Math.random() * 12);
      const spinDuration = 3000 + Math.random() * 1300;
      spinDurations.push(spinDuration);

      const totalItems = symbols.length * 6;
      const finalPosition =
        symbols.length + baseSpins * symbols.length + targetIndex;
      const safeFinalPosition = finalPosition % totalItems;
      const adjustedPosition =
        safeFinalPosition < symbols.length
          ? safeFinalPosition + symbols.length
          : safeFinalPosition;
      const finalY = adjustedPosition * itemHeight;

      reel.style.transition = "none";
      const startY = (currentIndex + symbols.length) * itemHeight;
      reel.style.transform = `translateY(-${startY}px)`;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (reel) {
            reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.18, 0.8, 0.12, 0.99)`;
            reel.style.transform = `translateY(-${finalY}px)`;
          }
        });
      });
    });

    const maxDuration = Math.max(...spinDurations) + 400;

    setTimeout(() => {
      stopReelLoop();
      setResults(finalResults);
      setSpinning(false);

      if (
        finalResults[0] === finalResults[1] &&
        finalResults[1] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🚀 星际大奖！三连符号！");
      } else if (
        finalResults[0] === finalResults[1] ||
        finalResults[1] === finalResults[2] ||
        finalResults[0] === finalResults[2]
      ) {
        playWinSound();
        setPrize("✨ 银河小奖！两连符号！");
      }
    }, maxDuration);
  };

  return (
    <div className="slot-machine-container scifi-container">
      <div
        className={`slot-machine scifi-slot ${
          spinning ? "scifi-spinning" : ""
        }`}
      >
        <div className="scifi-grid" />
        <div className="slot-reels scifi-reels">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`slot-reel-wrapper scifi-reel-wrapper ${
                spinning ? "reel-shake" : ""
              }`}
            >
              <div
                ref={(el) => {
                  reelsRef.current[index] = el;
                }}
                className="slot-reel scifi-reel"
              >
                {[
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                ].map((symbol, i) => (
                  <div key={i} className="slot-item scifi-item">
                    {symbol}
                  </div>
                ))}
              </div>
              <div className="slot-window scifi-window"></div>
            </div>
          ))}
        </div>
        <button
          className={`spin-button scifi-button ${spinning ? "spinning" : ""}`}
          onClick={spin}
          disabled={spinning}
        >
          <span className="scifi-button-main">LAUNCH</span>
          <span className="scifi-button-sub">QUANTUM DRAW</span>
        </button>
        {prize && <div className="prize-message scifi-prize">{prize}</div>}
      </div>
    </div>
  );
}

// 案例1：经典数字老虎机
function ClassicSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [prize, setPrize] = useState<string | null>(null);
  const reelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimatingRef = useRef(false); // 用于跟踪动画状态
  const { playSpinSound, playWinSound, startReelLoop, stopReelLoop } =
    useSlotSounds();

  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const itemHeight = 200; // 每个项目的高度（px）

  // 初始化转轮位置
  useEffect(() => {
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        // 初始状态：显示第一个数字（index 0），位置在第二组数组中（index 10）
        const initialIndex = results[index] + numbers.length;
        reel.style.transition = "none";
        reel.style.transform = `translateY(-${initialIndex * itemHeight}px)`;
      }
    });
  }, []);

  // 更新转轮位置（结果变化时，仅在动画结束后）
  // 注意：这个 useEffect 只在动画完全结束后才执行，用于重置位置到第二组数组
  useEffect(() => {
    // 只在动画结束后（spinning 为 false）且不在动画中时重置位置
    if (!spinning && !isAnimatingRef.current) {
      // 使用稍长的延迟，确保所有动画和状态更新都已完成
      const timer = setTimeout(() => {
        reelsRef.current.forEach((reel, index) => {
          if (reel) {
            // 动画结束后，重置到最终结果位置（第二组数组中）
            // 这样可以确保下次动画从正确位置开始
            const finalIndex = results[index] + numbers.length;
            reel.style.transition = "none";
            reel.style.transform = `translateY(-${finalIndex * itemHeight}px)`;
          }
        });
      }, 200); // 延迟确保动画完全结束
      return () => clearTimeout(timer);
    }
  }, [results, spinning, numbers.length, itemHeight]);

  const spin = () => {
    if (spinning || isAnimatingRef.current) return;

    setSpinning(true);
    playSpinSound();
    startReelLoop();
    isAnimatingRef.current = true; // 标记动画开始
    setPrize(null);

    const finalResults = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ];

    // 先计算所有转轮的动画时间，用于确定总等待时间
    const spinDurations: number[] = [];

    // 为每个转轮设置动画
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const currentIndex = results[index];
        const targetIndex = finalResults[index];
        const baseSpins = 26 + Math.floor(Math.random() * 10); // 滚动更多圈
        const spinDuration = 2800 + Math.random() * 1200; // 约 2.8 - 4 秒
        spinDurations.push(spinDuration);

        // 计算最终位置：从第二组数组开始，滚动多圈后到达目标位置
        // 转轮现在有6组相同的数字（60个项目），每个项目200px，总高度12000px
        // 这样可以支持更大的滚动距离，同时确保内容始终可见
        const totalItems = numbers.length * 6; // 60个项目

        // 计算最终位置：第二组起始位置 + 滚动圈数 * 每圈项目数 + 目标索引
        // 由于有6组内容，可以安全地滚动到更大的位置
        const finalPosition =
          numbers.length + baseSpins * numbers.length + targetIndex;
        // 确保位置在转轮范围内（0-59）
        const safeFinalPosition = finalPosition % totalItems;
        // 如果位置在第一组（0-9），调整到第二组或第三组
        const adjustedPosition =
          safeFinalPosition < numbers.length
            ? safeFinalPosition + numbers.length
            : safeFinalPosition;

        const finalY = adjustedPosition * itemHeight;

        // 先重置到当前位置（无过渡），确保从正确位置开始
        reel.style.transition = "none";
        const startY = (currentIndex + numbers.length) * itemHeight;
        reel.style.transform = `translateY(-${startY}px)`;

        // 使用 requestAnimationFrame 确保重置完成后再开始动画
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (reel) {
              // 强烈 ease-in：一开始慢，后段越来越快直到结束
              reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.7, 0, 1, 0.5)`;
              reel.style.transform = `translateY(-${finalY}px)`;
            }
          });
        });
      }
    });

    // 等待动画完成后设置结果
    // 使用最长的动画时间 + 足够的缓冲时间确保动画完全结束
    const maxDuration = Math.max(...spinDurations) + 500;

    setTimeout(() => {
      // 动画完全结束后，先停止转轴循环音效，再标记动画结束，然后更新状态
      stopReelLoop();
      isAnimatingRef.current = false;

      // 同时更新结果和状态
      setResults(finalResults);
      setSpinning(false);

      // 检查中奖
      if (
        finalResults[0] === finalResults[1] &&
        finalResults[1] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎉 恭喜！三个数字相同！");
      } else if (
        finalResults[0] === finalResults[1] ||
        finalResults[1] === finalResults[2] ||
        finalResults[0] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎊 两个数字相同！");
      }
    }, maxDuration);
  };

  return (
    <div className="slot-machine-container">
      {/* <h2 className="slot-title">经典数字老虎机</h2> */}
      <div className={`slot-machine ${spinning ? "slot-spinning" : ""}`}>
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`slot-reel-wrapper ${spinning ? "reel-shake" : ""}`}
            >
              <div
                ref={(el) => {
                  reelsRef.current[index] = el;
                }}
                className="slot-reel"
              >
                {[
                  ...numbers,
                  ...numbers,
                  ...numbers,
                  ...numbers,
                  ...numbers,
                  ...numbers,
                ].map((num, i) => (
                  <div key={i} className="slot-item">
                    {num}
                  </div>
                ))}
              </div>
              <div className="slot-window"></div>
            </div>
          ))}
        </div>
        <button
          className={`spin-button ${spinning ? "spinning" : ""}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? "转动中..." : "开始抽奖"}
        </button>
        {prize && <div className="prize-message">{prize}</div>}
      </div>
    </div>
  );
}

// 案例2：图标老虎机（水果、星星等）
function IconSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [prize, setPrize] = useState<string | null>(null);
  const reelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { playSpinSound, playWinSound, startReelLoop, stopReelLoop } =
    useSlotSounds();

  const icons = ["🍎", "🍊", "🍋", "🍇", "🍓", "⭐", "💎", "🎁"];
  const itemHeight = 200;

  // 初始化转轮位置
  useEffect(() => {
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const initialIndex = results[index] + icons.length;
        reel.style.transition = "none";
        reel.style.transform = `translateY(-${initialIndex * itemHeight}px)`;
      }
    });
  }, []);

  // 更新转轮位置（结果变化时）
  useEffect(() => {
    if (!spinning) {
      reelsRef.current.forEach((reel, index) => {
        if (reel) {
          const finalIndex = results[index] + icons.length;
          reel.style.transition = "none";
          reel.style.transform = `translateY(-${finalIndex * itemHeight}px)`;
        }
      });
    }
  }, [results, spinning, icons.length, itemHeight]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    playSpinSound();
    startReelLoop();
    setPrize(null);

    const finalResults = [
      Math.floor(Math.random() * icons.length),
      Math.floor(Math.random() * icons.length),
      Math.floor(Math.random() * icons.length),
    ];

    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const currentIndex = results[index];
        const targetIndex = finalResults[index];
        const baseSpins = 22 + Math.floor(Math.random() * 10);
        const spinDuration = 2700 + Math.random() * 1200;

        // 转轮现在有6组内容，支持更大的滚动距离
        const totalItems = icons.length * 6;
        const finalPosition =
          icons.length + baseSpins * icons.length + targetIndex;
        const safeFinalPosition = finalPosition % totalItems;
        const adjustedPosition =
          safeFinalPosition < icons.length
            ? safeFinalPosition + icons.length
            : safeFinalPosition;
        const finalY = adjustedPosition * itemHeight;

        reel.style.transition = "none";
        const startY = (currentIndex + icons.length) * itemHeight;
        reel.style.transform = `translateY(-${startY}px)`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (reel) {
              reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.7, 0, 1, 0.5)`;
              reel.style.transform = `translateY(-${finalY}px)`;
            }
          });
        });
      }
    });

    const maxDuration = 3500;
    setTimeout(() => {
      setResults(finalResults);
      setSpinning(false);
      stopReelLoop();

      if (
        finalResults[0] === finalResults[1] &&
        finalResults[1] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎉 超级大奖！三个图标相同！");
      } else if (
        finalResults[0] === finalResults[1] ||
        finalResults[1] === finalResults[2] ||
        finalResults[0] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎊 小奖！两个图标相同！");
      }
    }, maxDuration);
  };

  return (
    <div className="slot-machine-container">
      {/* <h2 className="slot-title">图标老虎机</h2> */}
      <div
        className={`slot-machine icon-slot ${spinning ? "slot-spinning" : ""}`}
      >
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`slot-reel-wrapper ${spinning ? "reel-shake" : ""}`}
            >
              <div
                ref={(el) => {
                  reelsRef.current[index] = el;
                }}
                className="slot-reel"
              >
                {[
                  ...icons,
                  ...icons,
                  ...icons,
                  ...icons,
                  ...icons,
                  ...icons,
                ].map((icon, i) => (
                  <div key={i} className="slot-item icon-item">
                    {icon}
                  </div>
                ))}
              </div>
              <div className="slot-window"></div>
            </div>
          ))}
        </div>
        <button
          className={`spin-button icon-button ${spinning ? "spinning" : ""}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? "转动中..." : "开始抽奖"}
        </button>
        {prize && <div className="prize-message">{prize}</div>}
      </div>
    </div>
  );
}

// 案例3：3D旋转效果老虎机
function SlotMachine3D() {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [prize, setPrize] = useState<string | null>(null);
  const reelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { playSpinSound, playWinSound, startReelLoop, stopReelLoop } =
    useSlotSounds();

  const symbols = ["7", "BAR", "🍒", "💎", "⭐", "🎰"];
  const itemHeight = 200;

  // 初始化转轮位置
  useEffect(() => {
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const initialIndex = results[index] + symbols.length;
        reel.style.transition = "none";
        reel.style.transform = `translateY(-${
          initialIndex * itemHeight
        }px) rotateX(0deg)`;
      }
    });
  }, []);

  // 更新转轮位置（结果变化时）
  useEffect(() => {
    if (!spinning) {
      reelsRef.current.forEach((reel, index) => {
        if (reel) {
          const finalIndex = results[index] + symbols.length;
          reel.style.transition = "none";
          reel.style.transform = `translateY(-${
            finalIndex * itemHeight
          }px) rotateX(0deg)`;
        }
      });
    }
  }, [results, spinning, symbols.length, itemHeight]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    playSpinSound();
    startReelLoop();
    setPrize(null);

    const finalResults = [
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
      Math.floor(Math.random() * symbols.length),
    ];

    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const currentIndex = results[index];
        const targetIndex = finalResults[index];
        const baseSpins = 26 + Math.floor(Math.random() * 15);
        const spinDuration = 3200 + Math.random() * 1300;

        // 转轮现在有6组内容，支持更大的滚动距离
        const totalItems = symbols.length * 6;
        const finalPosition =
          symbols.length + baseSpins * symbols.length + targetIndex;
        const safeFinalPosition = finalPosition % totalItems;
        const adjustedPosition =
          safeFinalPosition < symbols.length
            ? safeFinalPosition + symbols.length
            : safeFinalPosition;
        const finalY = adjustedPosition * itemHeight;

        reel.style.transition = "none";
        const startY = (currentIndex + symbols.length) * itemHeight;
        reel.style.transform = `translateY(-${startY}px) rotateX(0deg)`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (reel) {
              reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.7, 0, 1, 0.5)`;
              reel.style.transform = `translateY(-${finalY}px) rotateX(360deg)`;
            }
          });
        });
      }
    });

    const maxDuration = 4000;
    setTimeout(() => {
      setResults(finalResults);
      setSpinning(false);
      stopReelLoop();

      if (
        finalResults[0] === finalResults[1] &&
        finalResults[1] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎉 超级大奖！三个符号相同！");
      } else if (
        finalResults[0] === finalResults[1] ||
        finalResults[1] === finalResults[2] ||
        finalResults[0] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎊 小奖！两个符号相同！");
      }
    }, maxDuration);
  };

  return (
    <div className="slot-machine-container">
      {/* <h2 className="slot-title">3D旋转老虎机</h2> */}
      <div
        className={`slot-machine slot-3d ${spinning ? "slot-spinning" : ""}`}
      >
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`slot-reel-wrapper reel-3d ${
                spinning ? "reel-shake" : ""
              }`}
            >
              <div
                ref={(el) => {
                  reelsRef.current[index] = el;
                }}
                className="slot-reel reel-3d-inner"
              >
                {[
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                  ...symbols,
                ].map((symbol, i) => (
                  <div key={i} className="slot-item symbol-item">
                    {symbol}
                  </div>
                ))}
              </div>
              <div className="slot-window"></div>
            </div>
          ))}
        </div>
        <button
          className={`spin-button button-3d ${spinning ? "spinning" : ""}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? "转动中..." : "开始抽奖"}
        </button>
        {prize && <div className="prize-message">{prize}</div>}
      </div>
    </div>
  );
}

// 案例4：霓虹灯风格老虎机
function NeonSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [prize, setPrize] = useState<string | null>(null);
  const reelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { playSpinSound, playWinSound, startReelLoop, stopReelLoop } =
    useSlotSounds();

  const neonSymbols = ["🔥", "⚡", "💫", "🌟", "✨", "🎆", "💥", "⭐"];
  const itemHeight = 200;

  // 初始化转轮位置
  useEffect(() => {
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const initialIndex = results[index] + neonSymbols.length;
        reel.style.transition = "none";
        reel.style.transform = `translateY(-${initialIndex * itemHeight}px)`;
      }
    });
  }, []);

  // 更新转轮位置（结果变化时）
  useEffect(() => {
    if (!spinning) {
      reelsRef.current.forEach((reel, index) => {
        if (reel) {
          const finalIndex = results[index] + neonSymbols.length;
          reel.style.transition = "none";
          reel.style.transform = `translateY(-${finalIndex * itemHeight}px)`;
        }
      });
    }
  }, [results, spinning, neonSymbols.length, itemHeight]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    playSpinSound();
    startReelLoop();
    setPrize(null);

    const finalResults = [
      Math.floor(Math.random() * neonSymbols.length),
      Math.floor(Math.random() * neonSymbols.length),
      Math.floor(Math.random() * neonSymbols.length),
    ];

    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const currentIndex = results[index];
        const targetIndex = finalResults[index];
        const baseSpins = 24 + Math.floor(Math.random() * 12);
        const spinDuration = 2800 + Math.random() * 1100;

        // 转轮现在有6组内容，支持更大的滚动距离
        const totalItems = neonSymbols.length * 6;
        const finalPosition =
          neonSymbols.length + baseSpins * neonSymbols.length + targetIndex;
        const safeFinalPosition = finalPosition % totalItems;
        const adjustedPosition =
          safeFinalPosition < neonSymbols.length
            ? safeFinalPosition + neonSymbols.length
            : safeFinalPosition;
        const finalY = adjustedPosition * itemHeight;

        reel.style.transition = "none";
        const startY = (currentIndex + neonSymbols.length) * itemHeight;
        reel.style.transform = `translateY(-${startY}px)`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (reel) {
              reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
              reel.style.transform = `translateY(-${finalY}px)`;
            }
          });
        });
      }
    });

    const maxDuration = 3500;
    setTimeout(() => {
      setResults(finalResults);
      setSpinning(false);
      stopReelLoop();

      if (
        finalResults[0] === finalResults[1] &&
        finalResults[1] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎉 超级大奖！三个符号相同！");
      } else if (
        finalResults[0] === finalResults[1] ||
        finalResults[1] === finalResults[2] ||
        finalResults[0] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎊 小奖！两个符号相同！");
      }
    }, maxDuration);
  };

  return (
    <div className="slot-machine-container">
      {/* <h2 className="slot-title neon-title">霓虹灯老虎机</h2> */}
      <div
        className={`slot-machine neon-slot ${spinning ? "slot-spinning" : ""}`}
      >
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`slot-reel-wrapper neon-reel ${
                spinning ? "reel-shake" : ""
              }`}
            >
              <div
                ref={(el) => {
                  reelsRef.current[index] = el;
                }}
                className="slot-reel neon-reel-inner"
              >
                {[
                  ...neonSymbols,
                  ...neonSymbols,
                  ...neonSymbols,
                  ...neonSymbols,
                  ...neonSymbols,
                  ...neonSymbols,
                ].map((symbol, i) => (
                  <div key={i} className="slot-item neon-item">
                    {symbol}
                  </div>
                ))}
              </div>
              <div className="slot-window neon-window"></div>
            </div>
          ))}
        </div>
        <button
          className={`spin-button neon-button ${spinning ? "spinning" : ""}`}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? "转动中..." : "开始抽奖"}
        </button>
        {prize && <div className="prize-message neon-prize">{prize}</div>}
      </div>
    </div>
  );
}

// 案例5：赛博朋克风格老虎机
function CyberpunkSlotMachine() {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [prize, setPrize] = useState<string | null>(null);
  const reelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimatingRef = useRef(false);
  const { playSpinSound, playWinSound, startReelLoop, stopReelLoop } =
    useSlotSounds();

  const cyberSymbols = ["⚡", "💎", "🔥", "🌟", "💫", "🎯", "🚀", "⭐"];
  const itemHeight = 200;

  // 初始化转轮位置
  useEffect(() => {
    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const initialIndex = results[index] + cyberSymbols.length;
        reel.style.transition = "none";
        reel.style.transform = `translateY(-${initialIndex * itemHeight}px)`;
      }
    });
  }, []);

  // 更新转轮位置（结果变化时）
  useEffect(() => {
    if (!spinning && !isAnimatingRef.current) {
      const timer = setTimeout(() => {
        reelsRef.current.forEach((reel, index) => {
          if (reel) {
            const finalIndex = results[index] + cyberSymbols.length;
            reel.style.transition = "none";
            reel.style.transform = `translateY(-${finalIndex * itemHeight}px)`;
          }
        });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [results, spinning, cyberSymbols.length, itemHeight]);

  const spin = () => {
    if (spinning || isAnimatingRef.current) return;

    setSpinning(true);
    playSpinSound();
    startReelLoop();
    isAnimatingRef.current = true;
    setPrize(null);

    const finalResults = [
      Math.floor(Math.random() * cyberSymbols.length),
      Math.floor(Math.random() * cyberSymbols.length),
      Math.floor(Math.random() * cyberSymbols.length),
    ];

    const spinDurations: number[] = [];

    reelsRef.current.forEach((reel, index) => {
      if (reel) {
        const currentIndex = results[index];
        const targetIndex = finalResults[index];
        const baseSpins = 26 + Math.floor(Math.random() * 10);
        const spinDuration = 2800 + Math.random() * 1200;
        spinDurations.push(spinDuration);

        const totalItems = cyberSymbols.length * 6;
        const finalPosition =
          cyberSymbols.length + baseSpins * cyberSymbols.length + targetIndex;
        const safeFinalPosition = finalPosition % totalItems;
        const adjustedPosition =
          safeFinalPosition < cyberSymbols.length
            ? safeFinalPosition + cyberSymbols.length
            : safeFinalPosition;

        const finalY = adjustedPosition * itemHeight;

        reel.style.transition = "none";
        const startY = (currentIndex + cyberSymbols.length) * itemHeight;
        reel.style.transform = `translateY(-${startY}px)`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (reel) {
              reel.style.transition = `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
              reel.style.transform = `translateY(-${finalY}px)`;
            }
          });
        });
      }
    });

    const maxDuration = Math.max(...spinDurations) + 500;

    setTimeout(() => {
      isAnimatingRef.current = false;
      setResults(finalResults);
      setSpinning(false);
      stopReelLoop();

      if (
        finalResults[0] === finalResults[1] &&
        finalResults[1] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎉 赛博大奖！三个符号相同！");
      } else if (
        finalResults[0] === finalResults[1] ||
        finalResults[1] === finalResults[2] ||
        finalResults[0] === finalResults[2]
      ) {
        playWinSound();
        setPrize("🎊 赛博小奖！两个符号相同！");
      }
    }, maxDuration);
  };

  return (
    <div className="slot-machine-container cyberpunk-container">
      <div className="cyberpunk-grid"></div>
      {/* <h2 className="slot-title cyberpunk-title">
        <span className="cyberpunk-text" data-text="赛博朋克老虎机">赛博朋克老虎机</span>
      </h2> */}
      <div
        className={`slot-machine cyberpunk-slot ${
          spinning ? "slot-spinning" : ""
        }`}
      >
        <div className="cyberpunk-scanline"></div>
        <div className="slot-reels">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`slot-reel-wrapper cyberpunk-reel ${
                spinning ? "reel-shake" : ""
              }`}
            >
              <div className="cyberpunk-glow"></div>
              <div
                ref={(el) => {
                  reelsRef.current[index] = el;
                }}
                className="slot-reel cyberpunk-reel-inner"
              >
                {[
                  ...cyberSymbols,
                  ...cyberSymbols,
                  ...cyberSymbols,
                  ...cyberSymbols,
                  ...cyberSymbols,
                  ...cyberSymbols,
                ].map((symbol, i) => (
                  <div key={i} className="slot-item cyberpunk-item">
                    {symbol}
                  </div>
                ))}
              </div>
              <div className="slot-window cyberpunk-window"></div>
            </div>
          ))}
        </div>
        <button
          className={`spin-button cyberpunk-button ${
            spinning ? "spinning" : ""
          }`}
          onClick={spin}
          disabled={spinning}
        >
          <span className="cyberpunk-button-text">
            {spinning ? "转动中..." : "开始抽奖"}
          </span>
          <span className="cyberpunk-button-glow"></span>
        </button>
        {prize && (
          <div
            className={`prize-message cyberpunk-prize ${
              spinning ? "" : "cyberpunk-glitch"
            }`}
          >
            {prize}
          </div>
        )}
      </div>
    </div>
  );
}

// 主组件
function SlotMachine() {
  const [activeCase, setActiveCase] = useState(0);
  useKeyboardNavigation();
  const { isBgmOn, toggleBgm } = useTechnoBgm();

  const cases = [
    { name: "经典数字", component: <ClassicSlotMachine /> },
    { name: "图标老虎机", component: <IconSlotMachine /> },
    { name: "3D旋转", component: <SlotMachine3D /> },
    { name: "霓虹灯风格", component: <NeonSlotMachine /> },
    { name: "赛博朋克", component: <CyberpunkSlotMachine /> },
    { name: "科幻未来", component: <SciFiSlotMachine /> },
    { name: "豪华赌场", component: <VegasSlotMachine /> },
  ];

  return (
    <div className="slot-machine-page">
      <div className="slot-machine-header">
        {/* <h1 className="main-title">🎰 老虎机抽奖系统</h1> */}
        <div className="case-selector">
          {cases.map((caseItem, index) => (
            <button
              key={index}
              className={`case-button ${activeCase === index ? "active" : ""}`}
              onClick={() => setActiveCase(index)}
            >
              {caseItem.name}
            </button>
          ))}
          <button
            className={`case-button bgm-toggle ${isBgmOn ? "active" : ""}`}
            onClick={toggleBgm}
          >
            {isBgmOn ? "BGM ON" : "BGM OFF"}
          </button>
        </div>
      </div>
      <div className="slot-machine-content">{cases[activeCase].component}</div>
    </div>
  );
}

export default SlotMachine;
