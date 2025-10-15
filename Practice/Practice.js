// 初始化音频上下文和合成器
let synth;
let recorder;
let isRecording = false;
let recordedNotes = [];
let currentMIDIPlayer;
let audioContext;
let analyser;
let microphone;
let currentTempo = 80;
let editorNotes = [];
let currentPreset = 'C自然大调';

// 初始化钢琴键盘（两个八度，包含C5）
function createPiano(containerId, octaves = 2) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const blackKeys = ['C#', 'D#', '', 'F#', 'G#', 'A#', ''];
    
    for (let octave = 3; octave < 3 + octaves; octave++) {
        for (let i = 0; i < whiteKeys.length; i++) {
            const whiteKey = document.createElement('div');
            whiteKey.className = 'key white';
            whiteKey.dataset.note = whiteKeys[i] + octave;
            whiteKey.textContent = whiteKeys[i] + octave;
            container.appendChild(whiteKey);
            
            // 添加黑键（除了E和B之间没有黑键）
            if (blackKeys[i]) {
                const blackKey = document.createElement('div');
                blackKey.className = 'key black';
                blackKey.dataset.note = blackKeys[i] + octave;
                blackKey.textContent = blackKeys[i] + octave;
                container.appendChild(blackKey);
            }
        }
    }
    
    // 添加最后一个C5键（第三个八度的第一个键）
    const lastCKey = document.createElement('div');
    lastCKey.className = 'key white';
    lastCKey.dataset.note = 'C5';
    lastCKey.textContent = 'C5';
    container.appendChild(lastCKey);
    
    // 添加键盘事件监听
    const keys = container.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('mousedown', () => {
            key.classList.add('active');
            playNote(key.dataset.note);
            
            // 添加到编辑器（只添加C4-C5范围内的音符）
            const noteOctave = parseInt(key.dataset.note.slice(-1));
            const noteName = key.dataset.note.slice(0, -1);
            
            if (noteOctave === 4 || (noteOctave === 5 && noteName === 'C')) {
                addNoteToEditor(key.dataset.note);
            }
        });
        
        key.addEventListener('mouseup', () => {
            key.classList.remove('active');
        });
        
        key.addEventListener('mouseleave', () => {
            key.classList.remove('active');
        });
    });
}

// 初始化MIDI编辑器
function createMIDIEditor() {
    const editorGrid = document.getElementById('editorGrid');
    const noteLabels = document.getElementById('noteLabels');
    editorGrid.innerHTML = '';
    noteLabels.innerHTML = '';
    
    // 创建音高标签 (从A3到C5，共15个音符，从低到高)
    const notes = [
        'A3', 'A#3', 'B3',
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'
    ];
    
    // 创建时间轴 (6小节 * 4拍 = 24个时间单位)
    const timeUnits = 24;
    
    // 添加音高标签（从低到高，所以A3在最下面，C5在最上面）
    notes.forEach(note => {
        const label = document.createElement('div');
        label.className = 'note-label';
        label.textContent = note;
        label.dataset.note = note;
        noteLabels.appendChild(label);
    });
    
    // 添加网格单元格（从低到高排列）
    // 使用grid-template-rows: repeat(16, 1fr)来创建16行
    // 每行对应一个音符，从A3到C5
    for (let i = 0; i < notes.length; i++) {
        for (let j = 0; j < timeUnits; j++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            // 设置网格位置
            cell.style.gridRow = `${notes.length - i} / ${notes.length - i + 1}`;
            cell.style.gridColumn = `${j + 1} / ${j + 2}`;
            
            cell.dataset.note = notes[i];
            cell.dataset.time = j;
            
            cell.addEventListener('click', () => {
                cell.classList.toggle('active');
                
                // 更新编辑器音符数组
                const note = cell.dataset.note;
                const time = parseInt(cell.dataset.time);
                
                if (cell.classList.contains('active')) {
                    editorNotes.push({note, time});
                } else {
                    editorNotes = editorNotes.filter(n => !(n.note === note && n.time === time));
                }
            });
            
            editorGrid.appendChild(cell);
        }
    }
}

// 添加音符到编辑器
function addNoteToEditor(note) {
    // 找到当前时间位置（简单实现：添加到下一个可用位置）
    let time = 0;
    if (editorNotes.length > 0) {
        time = Math.max(...editorNotes.map(n => n.time)) + 1;
        if (time >= 24) time = 0; // 循环
    }
    
    // 添加到编辑器
    const cells = document.querySelectorAll('.grid-cell');
    const targetCell = Array.from(cells).find(cell => 
        cell.dataset.note === note && parseInt(cell.dataset.time) === time
    );
    
    if (targetCell) {
        targetCell.classList.add('active');
        editorNotes.push({note, time});
    }
}

// 初始化钢琴音源
function initPianoSound() {
    // 使用更真实的钢琴音色
    synth = new Tone.Sampler({
        urls: {
            "C4": "C4.mp3",
            "D#4": "Ds4.mp3", 
            "F#4": "Fs4.mp3",
            "A4": "A4.mp3",
        },
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => {
            console.log("钢琴音源加载完成");
        }
    }).toDestination();
}

// 播放音符
function playNote(note) {
    if (!synth) {
        initPianoSound();
    }
    
    // 将音符转换为频率
    const frequency = Tone.Frequency(note).toFrequency();
    synth.triggerAttackRelease(note, "8n");
    
    // 更新显示
    const noteDisplay = document.getElementById('currentNote');
    noteDisplay.textContent = note;
}

// 播放编辑器中的音符序列
function playEditorNotes() {
    if (editorNotes.length === 0) {
        document.getElementById('status').textContent = '编辑器为空，请添加音符';
        return;
    }
    
    document.getElementById('status').textContent = '正在播放...';
    
    // 排序音符按时间顺序
    const sortedNotes = [...editorNotes].sort((a, b) => a.time - b.time);
    
    // 计算每个音符的播放时间
    const noteDuration = 0.5; // 每个音符的持续时间（秒）
    const timeUnitDuration = (60 / currentTempo) / 4; // 每个时间单位的持续时间
    
    // 播放每个音符
    sortedNotes.forEach((noteData, index) => {
        const playTime = noteData.time * timeUnitDuration;
        
        setTimeout(() => {
            playNote(noteData.note);
            
            // 高亮对应的钢琴键
            const keys = document.querySelectorAll('#piano .key');
            keys.forEach(key => {
                if (key.dataset.note === noteData.note) {
                    key.classList.add('active');
                    setTimeout(() => {
                        key.classList.remove('active');
                    }, 300);
                }
            });
            
            // 更新进度条
            const progress = (noteData.time / 24) * 100;
            document.getElementById('progress').style.width = progress + '%';
            
            // 如果是最后一个音符，更新状态
            if (index === sortedNotes.length - 1) {
                setTimeout(() => {
                    document.getElementById('status').textContent = '播放完成';
                }, 500);
            }
        }, playTime * 1000);
    });
}

// 初始化音高检测
function initPitchDetection() {
    // 创建音频上下文
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    
    // 请求麦克风权限
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            
            // 开始分析音高
            analyzePitch();
        })
        .catch(function(err) {
            console.error('无法获取麦克风权限:', err);
            document.getElementById('status').textContent = '无法访问麦克风，请检查权限设置';
        });
}

// 分析音高
function analyzePitch() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function detectPitch() {
        analyser.getByteFrequencyData(dataArray);
        
        // 简单的音高检测算法
        let maxValue = 0;
        let maxIndex = 0;
        
        for (let i = 0; i < bufferLength; i++) {
            if (dataArray[i] > maxValue) {
                maxValue = dataArray[i];
                maxIndex = i;
            }
        }
        
        // 计算频率
        const frequency = maxIndex * audioContext.sampleRate / analyser.fftSize;
        
        // 更新显示
        const pitchDisplay = document.getElementById('pitchDisplay');
        if (frequency > 50 && frequency < 2000) { // 合理的频率范围
            pitchDisplay.textContent = frequency.toFixed(1) + ' Hz';
            
            // 转换为音符
            const note = frequencyToNote(frequency);
            const customNoteDisplay = document.getElementById('customNote');
            customNoteDisplay.textContent = note;
        }
        
        // 更新可视化
        updateVisualizer(dataArray, bufferLength);
        
        // 继续分析
        if (isRecording) {
            requestAnimationFrame(detectPitch);
        }
    }
    
    detectPitch();
}

// 频率转换为音符
function frequencyToNote(frequency) {
    const A4 = 440;
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // 计算半音距离
    const semitones = Math.round(12 * Math.log2(frequency / A4));
    const noteIndex = (semitones + 9) % 12; // A4是第9个音符
    const octave = Math.floor((semitones + 9) / 12) + 4;
    
    return notes[noteIndex] + octave;
}

// 更新可视化
function updateVisualizer(dataArray, bufferLength) {
    const visualizer = document.getElementById('visualizer');
    visualizer.innerHTML = '';
    
    const barCount = 32;
    for (let i = 0; i < barCount; i++) {
        const bar = document.createElement('div');
        const value = dataArray[Math.floor(i * bufferLength / barCount)];
        const height = (value / 255) * 100;
        
        bar.style.position = 'absolute';
        bar.style.bottom = '0';
        bar.style.left = `${i * (100 / barCount)}%`;
        bar.style.width = `${90 / barCount}%`;
        bar.style.height = `${height}%`;
        bar.style.background = `linear-gradient(to top, #8bb4c4, #5d8aa8)`;
        visualizer.appendChild(bar);
    }
}

// 保存预设
function savePreset() {
    const presetName = document.getElementById('presetName').value || `预设${Date.now()}`;
    
    if (editorNotes.length === 0) {
        document.getElementById('status').textContent = '编辑器为空，无法保存预设';
        return;
    }
    
    // 在实际应用中，这里会将预设保存到本地存储或服务器
    const presetList = document.getElementById('presetList');
    const presetItem = document.createElement('div');
    presetItem.className = 'preset-item';
    presetItem.textContent = presetName;
    presetItem.addEventListener('click', () => {
        document.querySelectorAll('.preset-item').forEach(item => {
            item.classList.remove('active');
        });
        presetItem.classList.add('active');
        currentPreset = presetName;
        document.getElementById('status').textContent = `已选择: ${presetName}`;
    });
    
    presetList.appendChild(presetItem);
    document.getElementById('status').textContent = `预设 "${presetName}" 已保存`;
    document.getElementById('presetName').value = '';
}

// 加载预设
function loadPreset() {
    // 在实际应用中，这里会从本地存储或服务器加载预设数据
    document.getElementById('status').textContent = `加载预设: ${currentPreset}`;
    
    // 清空当前编辑器
    clearEditor();
    
    // 模拟加载预设数据
    let presetNotes = [];
    if (currentPreset === 'C自然大调') {
        presetNotes = [
            {note: 'C4', time: 0}, {note: 'D4', time: 1}, {note: 'E4', time: 2}, 
            {note: 'F4', time: 3}, {note: 'G4', time: 4}, {note: 'A4', time: 5}, 
            {note: 'B4', time: 6}, {note: 'C5', time: 7}
        ];
    } else if (currentPreset === 'C和声大调') {
        presetNotes = [
            {note: 'C4', time: 0}, {note: 'D4', time: 1}, {note: 'E4', time: 2}, 
            {note: 'F4', time: 3}, {note: 'G4', time: 4}, {note: 'A4', time: 5}, 
            {note: 'A#4', time: 6}, {note: 'C5', time: 7}
        ];
    } else if (currentPreset === 'C旋律大调(上行)') {
        presetNotes = [
            {note: 'C4', time: 0}, {note: 'D4', time: 1}, {note: 'E4', time: 2}, 
            {note: 'F4', time: 3}, {note: 'G4', time: 4}, {note: 'A4', time: 5}, 
            {note: 'B4', time: 6}, {note: 'C5', time: 7},
            {note: 'D5', time: 8}, {note: 'E5', time: 9}, {note: 'F#4', time: 10}, 
            {note: 'G#4', time: 11}, {note: 'A5', time: 12}, {note: 'B5', time: 13}, 
            {note: 'C6', time: 14}
        ];
    } else if (currentPreset === 'C旋律大调(下行)') {
        presetNotes = [
            {note: 'C6', time: 0}, {note: 'B5', time: 1}, {note: 'A5', time: 2}, 
            {note: 'G4', time: 3}, {note: 'F4', time: 4}, {note: 'E5', time: 5}, 
            {note: 'D5', time: 6}, {note: 'C5', time: 7},
            {note: 'B4', time: 8}, {note: 'A4', time: 9}, {note: 'G4', time: 10}, 
            {note: 'F4', time: 11}, {note: 'E4', time: 12}, {note: 'D4', time: 13}, 
            {note: 'C4', time: 14}
        ];
    } else if (currentPreset === 'a自然小调') {
        presetNotes = [
            {note: 'A3', time: 0}, {note: 'B3', time: 1}, {note: 'C4', time: 2}, 
            {note: 'D4', time: 3}, {note: 'E4', time: 4}, {note: 'F4', time: 5}, 
            {note: 'G4', time: 6}, {note: 'A4', time: 7},
            {note: 'B4', time: 8}, {note: 'C5', time: 9}, {note: 'D5', time: 10}, 
            {note: 'E5', time: 11}, {note: 'F5', time: 12}, {note: 'G5', time: 13}, 
            {note: 'A5', time: 14}
        ];
    } else if (currentPreset === 'a和声小调') {
        presetNotes = [
            {note: 'A3', time: 0}, {note: 'B3', time: 1}, {note: 'C4', time: 2}, 
            {note: 'D4', time: 3}, {note: 'E4', time: 4}, {note: 'F4', time: 5}, 
            {note: 'G#4', time: 6}, {note: 'A4', time: 7},
            {note: 'B4', time: 8}, {note: 'C5', time: 9}, {note: 'D5', time: 10}, 
            {note: 'E5', time: 11}, {note: 'F5', time: 12}, {note: 'G#5', time: 13}, 
            {note: 'A5', time: 14}
        ];
    } else if (currentPreset === 'a旋律小调(上行)') {
        presetNotes = [
            {note: 'A3', time: 0}, {note: 'B3', time: 1}, {note: 'C4', time: 2}, 
            {note: 'D4', time: 3}, {note: 'E4', time: 4}, {note: 'F#4', time: 5}, 
            {note: 'G#4', time: 6}, {note: 'A4', time: 7},
            {note: 'B4', time: 8}, {note: 'C5', time: 9}, {note: 'D5', time: 10}, 
            {note: 'E5', time: 11}, {note: 'F#5', time: 12}, {note: 'G#5', time: 13}, 
            {note: 'A5', time: 14}
        ];
    } else if (currentPreset === 'a旋律小调(下行)') {
        presetNotes = [
            {note: 'A5', time: 0}, {note: 'G5', time: 1}, {note: 'F5', time: 2}, 
            {note: 'E5', time: 3}, {note: 'D5', time: 4}, {note: 'C5', time: 5}, 
            {note: 'B4', time: 6}, {note: 'A4', time: 7},
            {note: 'G4', time: 8}, {note: 'F4', time: 9}, {note: 'E4', time: 10}, 
            {note: 'D4', time: 11}, {note: 'C4', time: 12}, {note: 'B3', time: 13}, 
            {note: 'A3', time: 14}
        ];
    }
    
    // 在编辑器中显示预设音符
    presetNotes.forEach(noteData => {
        const cells = document.querySelectorAll('.grid-cell');
        const targetCell = Array.from(cells).find(cell => 
            cell.dataset.note === noteData.note && parseInt(cell.dataset.time) === noteData.time
        );
        
        if (targetCell) {
            targetCell.classList.add('active');
            editorNotes.push({note: noteData.note, time: noteData.time});
        }
    });
    
    document.getElementById('status').textContent = `预设 "${currentPreset}" 已加载`;
}

// 清空编辑器
function clearEditor() {
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach(cell => {
        cell.classList.remove('active');
    });
    editorNotes = [];
    document.getElementById('status').textContent = '编辑器已清空';
}

// 导航栏激活状态处理
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'Practice.html';
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        // 精确匹配逻辑，处理各种路径情况
        if (linkPage === currentPage || 
            (currentPage === 'Practice.html' && linkPage.endsWith('Practice.html')) ||
            (currentPage === '' && linkPage === '../index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // 汉堡菜单导航切换功能（适用于所有设备）
    const navToggle = document.getElementById('navToggle');
    const navList = document.getElementById('navList');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navList.classList.toggle('nav-active');
            
            // 汉堡菜单动画
            const hamburgerLines = this.querySelectorAll('.hamburger-line');
            hamburgerLines.forEach(line => {
                line.classList.toggle('active');
            });
        });
        
        // 点击链接后关闭菜单（移动端和桌面端都适用）
        const navLinks = document.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navList.classList.remove('nav-active');
                const hamburgerLines = navToggle.querySelectorAll('.hamburger-line');
                hamburgerLines.forEach(line => {
                    line.classList.remove('active');
                });
            });
        });
        
        // 点击其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navList.contains(e.target)) {
                navList.classList.remove('nav-active');
                const hamburgerLines = navToggle.querySelectorAll('.hamburger-line');
                hamburgerLines.forEach(line => {
                    line.classList.remove('active');
                });
            }
        });
    }
    
    // 窗口大小变化时重置导航状态
    window.addEventListener('resize', function() {
        // 在窗口大小变化时确保导航菜单关闭
        if (navList) {
            navList.classList.remove('nav-active');
            const hamburgerLines = navToggle?.querySelectorAll('.hamburger-line');
            hamburgerLines?.forEach(line => {
                line.classList.remove('active');
            });
        }
    });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    // 初始化导航栏
    initializeNavigation();
    
    // 创建钢琴键盘
    createPiano('piano', 2);
    
    // 创建MIDI编辑器
    createMIDIEditor();
    
    // 初始化音高检测
    initPitchDetection();
    
    // 预设列表折叠/展开功能
    const presetToggle = document.getElementById('presetToggle');
    const presetList = document.getElementById('presetList');
    
    presetToggle.addEventListener('click', () => {
        const isExpanded = presetList.classList.contains('expanded');
        
        if (isExpanded) {
            presetList.classList.remove('expanded');
            presetToggle.textContent = '▼ 显示预设';
        } else {
            presetList.classList.add('expanded');
            presetToggle.textContent = '▲ 隐藏预设';
        }
    });
    
    // 按钮事件监听
    document.getElementById('playBtn').addEventListener('click', () => {
        playEditorNotes();
    });
    
    document.getElementById('stopBtn').addEventListener('click', () => {
        document.getElementById('status').textContent = '已停止播放';
        document.getElementById('progress').style.width = '0%';
        if (currentMIDIPlayer) {
            currentMIDIPlayer.stop();
        }
    });
    
    document.getElementById('recordBtn').addEventListener('click', function() {
        if (this.textContent === '开始录音') {
            this.textContent = '停止录音';
            isRecording = true;
            document.getElementById('status').textContent = '正在录音，请对着麦克风唱出你听到的音';
            analyzePitch();
        } else {
            this.textContent = '开始录音';
            isRecording = false;
            document.getElementById('status').textContent = '录音已停止';
        }
    });
    
    document.getElementById('recordCustomBtn').addEventListener('click', function() {
        if (this.textContent === '录制演唱') {
            this.textContent = '停止录制';
            isRecording = true;
            recordedNotes = [];
            document.getElementById('customNote').textContent = '正在录制...';
        } else {
            this.textContent = '录制演唱';
            isRecording = false;
            document.getElementById('customNote').textContent = '录制完成，共录制 ' + recordedNotes.length + ' 个音符';
        }
    });
    
    document.getElementById('playCustomBtn').addEventListener('click', () => {
        if (recordedNotes.length === 0) {
            document.getElementById('customNote').textContent = '没有录制任何音符';
            return;
        }
        
        document.getElementById('customNote').textContent = '播放录音...';
        
        // 播放录制的音符
        recordedNotes.forEach((noteData, index) => {
            setTimeout(() => {
                playNote(noteData.note);
                document.getElementById('customNote').textContent = noteData.note;
                
                // 高亮对应的钢琴键
                const keys = document.querySelectorAll('#piano .key');
                keys.forEach(key => {
                    if (key.dataset.note === noteData.note) {
                        key.classList.add('active');
                        setTimeout(() => {
                            key.classList.remove('active');
                        }, 500);
                    }
                });
            }, index * 500);
        });
    });
    
    document.getElementById('clearCustomBtn').addEventListener('click', () => {
        recordedNotes = [];
        document.getElementById('customNote').textContent = '已清除录音';
    });
    
    document.getElementById('savePresetBtn').addEventListener('click', () => {
        savePreset();
    });
    
    document.getElementById('loadPresetBtn').addEventListener('click', () => {
        loadPreset();
    });
    
    document.getElementById('clearEditorBtn').addEventListener('click', () => {
        clearEditor();
    });
    
    document.getElementById('deletePresetBtn').addEventListener('click', () => {
        const activePreset = document.querySelector('.preset-item.active');
        if (activePreset && activePreset.textContent !== 'C自然大调') {
            activePreset.remove();
            document.getElementById('status').textContent = '预设已删除';
        } else {
            document.getElementById('status').textContent = '无法删除默认预设';
        }
    });
    
    // 预设列表项点击事件
    const presetItems = document.querySelectorAll('.preset-item');
    presetItems.forEach(item => {
        item.addEventListener('click', () => {
            presetItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            currentPreset = item.textContent;
            document.getElementById('status').textContent = `已选择: ${item.textContent}`;
        });
    });
    
    // 节拍选择事件
    document.getElementById('tempoSelect').addEventListener('change', function() {
        currentTempo = parseInt(this.value);
        document.getElementById('status').textContent = `节拍设置为: ${currentTempo} BPM`;
    });
});
