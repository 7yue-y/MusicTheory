// --- 可复用的音频系统 ---

const AudioSystem = (function() {
    let sampler;
    let isLoaded = false;

    // 初始化钢琴音源
    function initialize() {
        if (sampler) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            sampler = new Tone.Sampler({
                urls: {
                    "C4": "C4.mp3",
                    "D#4": "Ds4.mp3",
                    "F#4": "Fs4.mp3",
                    "A4": "A4.mp3",
                },
                baseUrl: "https://tonejs.github.io/audio/salamander/",
                onload: () => {
                    console.log("真实钢琴音源加载完成");
                    isLoaded = true;
                    resolve();
                },
                onerror: (error) => {
                    console.error("加载钢琴音源失败:", error);
                    reject(error);
                }
            }).toDestination();
        });
    }

    // 播放单个音符
    function playNote(note, duration = '8n', time) {
        if (!isLoaded) {
            console.warn("音源尚未加载，请先调用 initialize()");
            return;
        }
        sampler.triggerAttackRelease(note, duration, time);
    }

    // 播放和弦或音程
    function playChord(notes, duration = '1n') {
        if (!isLoaded) {
            console.warn("音源尚未加载，请先调用 initialize()");
            return;
        }
        sampler.triggerAttackRelease(notes, duration);
    }
    
    // 播放旋律
    function playMelody(notes, noteDuration = '8n', interval = 0.5) {
        if (!isLoaded) {
            console.warn("音源尚未加载，请先调用 initialize()");
            return;
        }
        const now = Tone.now();
        notes.forEach((note, index) => {
            sampler.triggerAttackRelease(note, noteDuration, now + index * interval);
        });
    }

    return {
        initialize,
        playNote,
        playChord,
        playMelody
    };
})();

// 页面加载时自动初始化音源
document.addEventListener('DOMContentLoaded', () => {
    AudioSystem.initialize().catch(error => {
        // 可以在这里向用户显示错误信息
    });
});
