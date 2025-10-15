// 和弦生成器
/* 更新日志 */
// V0.1 支持名称查询和音符分析
// V0.2 修复计算bug并重置ui界面
// V0.3 添加音级分析和弦方法，以根音为基础分析和弦
class ChordGenerator {
    constructor() {
        // 音符类
        this.Note = class {
            constructor(step, alter = 0) {
                this.step = step; // 'C','D','E','F','G','A','B'
                this.alter = alter; // -2: 重降, -1: 降, 0: 自然, 1: 升, 2: 重升
            }
            
            toString() {
                if (this.alter === 0) return this.step;
                if (this.alter === 1) return this.step + '#';
                if (this.alter === -1) return this.step + 'b';
                if (this.alter === 2) return this.step + '×'; // 重升
                if (this.alter === -2) return this.step + 'bb'; // 重降
                return this.step;
            }
            
            getSemitones() {
                const baseSemitones = {
                    'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
                };
                return (baseSemitones[this.step] + this.alter + 12) % 12;
            }
            
            static fromString(noteStr) {
                if (noteStr.endsWith('×')) {
                    return new this(noteStr[0], 2);
                } else if (noteStr.endsWith('bb')) {
                    return new this(noteStr[0], -2);
                } else if (noteStr.endsWith('#')) {
                    return new this(noteStr[0], 1);
                } else if (noteStr.endsWith('b')) {
                    return new this(noteStr[0], -1);
                } else {
                    return new this(noteStr, 0);
                }
            }
        };
        
        // 音程类
        this.Interval = class {
            constructor(intervalType, intervalNum) {
                this.intervalType = intervalType; // 'maj', 'min', 'per', 'aug', 'dim'
                this.intervalNum = intervalNum; // 1,2,3,4,5,6,7
            }
            
            getSemitones() {
                const baseSemitones = {
                    1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12
                };
                
                const typeAdjustment = {
                    'per': 0,
                    'min': -1,
                    'maj': 0,
                    'dim': -1,
                    'aug': 1
                };
                
                return baseSemitones[this.intervalNum] + typeAdjustment[this.intervalType];
            }
        };
        
        // 音符字母顺序
        this.noteSteps = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        
// 在 chordGenerator.js 中更新和弦定义
// 定义和弦结构（使用音程）- 修正版本
// chordGenerator.js - 完全重写音程计算逻辑
// 音程类 - 重新实现
this.Interval = class {
    constructor(intervalType, intervalNum) {
        this.intervalType = intervalType; // 'maj', 'min', 'per', 'aug', 'dim'
        this.intervalNum = intervalNum; // 1,2,3,4,5,6,7
    }
    
    getSemitones() {
        // 基础半音数（大音程/纯音程）
        const baseSemitones = {
            1: 0,   // 纯一度
            2: 2,   // 大二度
            3: 4,   // 大三度
            4: 5,   // 纯四度
            5: 7,   // 纯五度
            6: 9,   // 大六度
            7: 11,  // 大七度
            8: 12   // 纯八度
        };
        
        // 音程类型调整
        const adjustments = {
            'per': 0,   // 纯音程不变
            'maj': 0,   // 大音程不变
            'min': -1,  // 小音程减1个半音
            'aug': 1,   // 增音程加1个半音
            'dim': -1   // 减音程减1个半音
        };
        
        // 特殊处理减七度
        if (this.intervalNum === 7 && this.intervalType === 'dim') {
            return 9; // 减七度是9个半音（比小七度少1个半音）
        }
        
        // 特殊处理增四度/减五度
        if (this.intervalNum === 4 && this.intervalType === 'aug') {
            return 6; // 增四度是6个半音
        }
        if (this.intervalNum === 5 && this.intervalType === 'dim') {
            return 6; // 减五度是6个半音
        }
        
        return baseSemitones[this.intervalNum] + adjustments[this.intervalType];
    }
};

// 更新和弦定义，确保音程正确
this.chordPatterns = {
    // 三和弦
    'major': { 
        name: '大三和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('maj', 3),
            new this.Interval('per', 5)
        ], 
        aliases: ['', 'maj', 'M'],
        englishName: 'Major',
        symbol: ''
    },
    'minor': { 
        name: '小三和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('min', 3),
            new this.Interval('per', 5)
        ], 
        aliases: ['m', 'min', '-'],
        englishName: 'Minor',
        symbol: 'm'
    },
    'augmented': { 
        name: '增三和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('maj', 3),
            new this.Interval('aug', 5)
        ], 
        aliases: ['aug', '+', '+5'],
        englishName: 'Augmented',
        symbol: 'aug'
    },
    'diminished': { 
        name: '减三和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('min', 3),
            new this.Interval('dim', 5)
        ], 
        aliases: ['dim', '°'],
        englishName: 'Diminished',
        symbol: 'dim'
    },
    'sus2': { 
        name: '挂二和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('maj', 2),
            new this.Interval('per', 5)
        ], 
        aliases: ['sus2'],
        englishName: 'Suspended 2nd',
        symbol: 'sus2'
    },
    'sus4': { 
        name: '挂四和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('per', 4),
            new this.Interval('per', 5)
        ], 
        aliases: ['sus4'],
        englishName: 'Suspended 4th',
        symbol: 'sus4'
    },
    
    // 七和弦
    'major7': { 
        name: '大七和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('maj', 3),
            new this.Interval('per', 5),
            new this.Interval('maj', 7)  // 大七度
        ], 
        aliases: ['maj7', 'M7', '△7'],
        englishName: 'Major Seventh',
        symbol: 'maj7'
    },
    'dominant7': { 
        name: '属七和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('maj', 3),
            new this.Interval('per', 5),
            new this.Interval('min', 7)  // 小七度
        ], 
        aliases: ['7', 'dom7'],
        englishName: 'Dominant Seventh',
        symbol: '7'
    },
    'minor7': { 
        name: '小七和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('min', 3),
            new this.Interval('per', 5),
            new this.Interval('min', 7)  // 小七度
        ], 
        aliases: ['m7', 'min7', '-7'],
        englishName: 'Minor Seventh',
        symbol: 'm7'
    },
    'halfDiminished': { 
        name: '半减七和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('min', 3),
            new this.Interval('dim', 5),  // 减五度
            new this.Interval('min', 7)   // 小七度
        ], 
        aliases: ['m7b5', 'ø7'],
        englishName: 'Half Diminished',
        symbol: 'm7b5'
    },
    'fullyDiminished': { 
        name: '减七和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('min', 3),
            new this.Interval('dim', 5),  // 减五度
            new this.Interval('dim', 7)   // 减七度
        ], 
        aliases: ['dim7', '°7'],
        englishName: 'Fully Diminished',
        symbol: 'dim7'
    },
    'minorMajor7': { 
        name: '小大七和弦', 
        intervals: [
            new this.Interval('per', 1),
            new this.Interval('min', 3),
            new this.Interval('per', 5),
            new this.Interval('maj', 7)  // 大七度
        ], 
        aliases: ['mM7', 'm(maj7)'],
        englishName: 'Minor Major Seventh',
        symbol: 'mM7'
    }
};
// 更新音程类的getSemitones方法，确保减七度计算正确
this.Interval = class {
    constructor(intervalType, intervalNum) {
        this.intervalType = intervalType; // 'maj', 'min', 'per', 'aug', 'dim'
        this.intervalNum = intervalNum; // 1,2,3,4,5,6,7
    }
    
    getSemitones() {
        const baseSemitones = {
            1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11, 8: 12
        };
        
        const typeAdjustment = {
            'per': 0,
            'min': -1,
            'maj': 0,
            'dim': -1,
            'aug': 1
        };
        
        // 特殊处理减七度
        if (this.intervalNum === 7 && this.intervalType === 'dim') {
            return 9; // 减七度是9个半音
        }
        
        return baseSemitones[this.intervalNum] + typeAdjustment[this.intervalType];
    }
};        
        // 和弦性质描述
        this.chordCharacteristics = {
            'major': '明亮、稳定，是音乐中最基础的和弦',
            'minor': '柔和、悲伤，常用于表达情感',
            'augmented': '扩张、紧张，需要解决',
            'diminished': '极度紧张、不和谐，常用于过渡',
            'sus2': '悬空、开放，第二度替代第三度',
            'sus4': '悬空、开放，第四度替代第三度',
            'major7': '爵士、温暖，大七度带来丰富色彩',
            'dominant7': '布鲁斯、需要解决，包含三全音',
            'minor7': '爵士、柔和，小调色彩',
            'halfDiminished': '紧张、爵士，常用于II-V-I进行',
            'fullyDiminished': '极度紧张、对称，常用于转调',
            'minorMajor7': '神秘、电影配乐，小调与大七度的结合'
        };
        
        // 和弦用途
        this.chordUsages = {
            'major': '常用于主和弦、稳定和声进行',
            'minor': '常用于副和弦、情感表达',
            'augmented': '常用于过渡、增强张力',
            'diminished': '常用于过渡、转调',
            'sus2': '常用于前奏、过渡，创造悬空感',
            'sus4': '常用于前奏、过渡，创造悬空感',
            'major7': '常用于爵士、流行音乐的主和弦',
            'dominant7': '常用于属和弦，需要解决到主和弦',
            'minor7': '常用于小调音乐、爵士乐',
            'halfDiminished': '常用于小调的II级和弦',
            'fullyDiminished': '常用于转调、过渡',
            'minorMajor7': '常用于电影配乐、神秘氛围'
        };
    }
    
    // 通过和弦名称生成和弦
    generateChordByName(chordName) {
        try {
            // 将输入转换为小写以便比较
            const input = chordName.toLowerCase().trim();
            
            // 提取根音
            const rootMatch = input.match(/^([a-g][#b]?)/);
            if (!rootMatch) {
                return { error: "未找到有效的根音" };
            }
            
            const rootNoteStr = rootMatch[1].toUpperCase();
            const rootNote = this.Note.fromString(rootNoteStr);
            
            // 提取和弦类型部分
            const typePart = input.substring(rootMatch[0].length).trim();
            
            // 查找匹配的和弦类型
            let chordType = this.findChordType(typePart);
            
            if (!chordType) {
                return { error: `无法识别的和弦类型: ${typePart}` };
            }
            
            const chordInfo = this.chordPatterns[chordType];
            const notes = this.calculateChordNotes(rootNote, chordInfo.intervals);
            
            return {
                name: `${rootNoteStr}${chordInfo.name}`,
                root: rootNoteStr,
                type: chordType,
                notes: notes,
                intervals: chordInfo.intervals,
                chineseName: chordInfo.name,
                englishName: chordInfo.englishName,
                symbolName: chordInfo.symbol ? `${rootNoteStr}${chordInfo.symbol}` : rootNoteStr,
                characteristic: this.chordCharacteristics[chordType] || '无特殊描述',
                usage: this.chordUsages[chordType] || '通用'
            };
        } catch (error) {
            return { error: `生成和弦时出错: ${error.message}` };
        }
    }
    
    // 查找和弦类型
    findChordType(typePart) {
        // 如果是空字符串，默认为大三和弦
        if (!typePart) {
            return 'major';
        }
        
        // 首先尝试精确匹配别名
        for (const [type, info] of Object.entries(this.chordPatterns)) {
            // 检查别名
            for (const alias of info.aliases) {
                if (typePart === alias.toLowerCase()) {
                    return type;
                }
            }
            
            // 检查中文名称
            if (typePart === info.name.toLowerCase()) {
                return type;
            }
            
            // 检查英文名称
            if (typePart === info.englishName.toLowerCase()) {
                return type;
            }
        }
        
        // 特殊处理常见中文输入
        const specialCases = {
            '大': 'major',
            '小': 'minor',
            '增': 'augmented',
            '减': 'diminished',
            '属': 'dominant7',
            '七': 'dominant7',
            '挂二': 'sus2',
            '挂四': 'sus4',
            '半减': 'halfDiminished'
        };
        
        for (const [key, value] of Object.entries(specialCases)) {
            if (typePart.includes(key)) {
                return value;
            }
        }
        
        return null;
    }
    
    // 通过音符序列分析可能的和弦
    analyzeChordFromNotes(notesString) {
        try {
            // 解析音符字符串
            const notes = notesString.split(/\s+/).filter(note => note.trim() !== '');
            if (notes.length < 2) {
                return { error: "至少需要两个音符来分析和弦" };
            }
            
            // 转换为Note对象
            const noteObjects = [];
            for (const note of notes) {
                try {
                    noteObjects.push(this.Note.fromString(note));
                } catch {
                    return { error: `无效的音符: ${note}` };
                }
            }
            
            // 转换为半音索引
            const noteIndices = noteObjects.map(note => note.getSemitones());
            const uniqueIndices = [...new Set(noteIndices)].sort((a, b) => a - b);
            
            // 尝试不同的根音假设
            const possibleChords = [];
            
            for (let i = 0; i < uniqueIndices.length; i++) {
                const rootIndex = uniqueIndices[i];
                const rootNote = this.findNoteBySemitones('C', rootIndex);
                
                // 计算相对于假设根音的音程
                const intervals = uniqueIndices.map(idx => {
                    let interval = idx - rootIndex;
                    if (interval < 0) interval += 12;
                    return interval;
                }).sort((a, b) => a - b);
                
                // 查找匹配的和弦类型
                for (const [type, info] of Object.entries(this.chordPatterns)) {
                    const chordIntervals = info.intervals.map(interval => interval.getSemitones());
                    if (this.isSubset(intervals, chordIntervals)) {
                        const rootNoteStr = rootNote.toString();
                        const chordNotes = this.calculateChordNotes(rootNote, info.intervals);
                        
                        possibleChords.push({
                            name: `${rootNoteStr}${info.name}`,
                            root: rootNoteStr,
                            type: type,
                            notes: chordNotes,
                            chineseName: info.name,
                            englishName: info.englishName,
                            symbolName: info.symbol ? `${rootNoteStr}${info.symbol}` : rootNoteStr,
                            characteristic: this.chordCharacteristics[type] || '无特殊描述',
                            usage: this.chordUsages[type] || '通用',
                            matchScore: this.calculateMatchScore(intervals, chordIntervals)
                        });
                    }
                }
            }
            
            // 按匹配度排序
            possibleChords.sort((a, b) => b.matchScore - a.matchScore);
            
            if (possibleChords.length === 0) {
                return { error: "无法识别此音符序列构成的和弦" };
            }
            
            return {
                inputNotes: notes,
                possibleChords: possibleChords
            };
        } catch (error) {
            return { error: `分析和弦时出错: ${error.message}` };
        }
    }
    
    // 通过音级音符分析和弦（以根音为基础）
analyzeChordByNoteDegrees(rootNoteStr, thirdNoteStr, fifthNoteStr, seventhNoteStr) {
    try {
        // 验证输入
        if (!rootNoteStr || !thirdNoteStr || !fifthNoteStr) {
            return { error: "请至少输入根音、三音和五音" };
        }

        // 转换音符为Note对象
        const rootNote = this.Note.fromString(rootNoteStr);
        const thirdNote = this.Note.fromString(thirdNoteStr);
        const fifthNote = this.Note.fromString(fifthNoteStr);
        const seventhNote = seventhNoteStr ? this.Note.fromString(seventhNoteStr) : null;

        // 计算相对于根音的音程
        const intervals = [0]; // 根音自身
        
        // 计算三音相对于根音的音程（半音数）
        let thirdInterval = thirdNote.getSemitones() - rootNote.getSemitones();
        if (thirdInterval < 0) thirdInterval += 12;
        intervals.push(thirdInterval);
        
        // 计算五音相对于根音的音程
        let fifthInterval = fifthNote.getSemitones() - rootNote.getSemitones();
        if (fifthInterval < 0) fifthInterval += 12;
        intervals.push(fifthInterval);
        
        // 如果有七音，计算七音相对于根音的音程
        if (seventhNote) {
            let seventhInterval = seventhNote.getSemitones() - rootNote.getSemitones();
            if (seventhInterval < 0) seventhInterval += 12;
            intervals.push(seventhInterval);
        }
        
        // 排序音程以便比较
        intervals.sort((a, b) => a - b);
        
        console.log("计算得到的音程:", intervals);
        
        // 查找匹配的和弦类型
        const possibleChords = [];
        
        for (const [type, info] of Object.entries(this.chordPatterns)) {
            const chordIntervals = info.intervals.map(interval => {
                const semitones = interval.getSemitones();
                console.log(`和弦 ${type} 的音程 ${interval.intervalType} ${interval.intervalNum}: ${semitones} 半音`);
                return semitones;
            }).sort((a, b) => a - b);
            
            console.log(`和弦 ${type} 的音程组合:`, chordIntervals);
            
            // 检查音程是否匹配
            if (this.arraysEqual(intervals, chordIntervals)) {
                const rootNoteStr = rootNote.toString();
                const chordNotes = this.calculateChordNotes(rootNote, info.intervals);
                
                possibleChords.push({
                    name: `${rootNoteStr}${info.name}`,
                    root: rootNoteStr,
                    type: type,
                    notes: chordNotes,
                    chineseName: info.name,
                    englishName: info.englishName,
                    symbolName: info.symbol ? `${rootNoteStr}${info.symbol}` : rootNoteStr,
                    characteristic: this.chordCharacteristics[type] || '无特殊描述',
                    usage: this.chordUsages[type] || '通用',
                    matchScore: 100 // 完全匹配
                });
                
                console.log(`匹配到和弦: ${type}`);
            }
        }
        
        if (possibleChords.length === 0) {
            return { error: "无法识别此音符序列构成的和弦" };
        }
        
        return {
            inputNotes: [rootNoteStr, thirdNoteStr, fifthNoteStr, seventhNoteStr].filter(Boolean),
            possibleChords: possibleChords
        };
    } catch (error) {
        return { error: `分析和弦时出错: ${error.message}` };
    }
}    
    // 辅助方法：比较两个数组是否相等
    arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }
    
    // 辅助方法：计算和弦音符
    calculateChordNotes(rootNote, intervals) {
        const notes = [rootNote];
        
        for (let i = 1; i < intervals.length; i++) {
            const newNote = this.addInterval(rootNote, intervals[i]);
            notes.push(newNote);
        }
        
        return notes.map(note => note.toString());
    }
    
    // 辅助方法：添加音程到音符
    addInterval(note, interval) {
        const targetSemitones = (note.getSemitones() + interval.getSemitones()) % 12;
        const targetStepIndex = (this.noteSteps.indexOf(note.step) + interval.intervalNum - 1) % 7;
        const targetStep = this.noteSteps[targetStepIndex];
        
        // 找到正确的升降号
        return this.findNoteBySemitones(targetStep, targetSemitones);
    }
    
    // 根据音名和半音数找到正确的音符
    findNoteBySemitones(step, targetSemitones) {
        const baseSemitones = {
            'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
        };
        
        const baseSemi = baseSemitones[step];
        let alter = targetSemitones - baseSemi;
        
        // 处理跨八度的情况
        if (alter < -2) alter += 12;
        if (alter > 2) alter -= 12;
        
        return new this.Note(step, alter);
    }
    
    // 辅助方法：检查是否是子集
    isSubset(subset, superset) {
        return subset.every(val => superset.includes(val));
    }
    
    // 辅助方法：计算匹配度
    calculateMatchScore(inputIntervals, chordIntervals) {
        const intersection = inputIntervals.filter(x => chordIntervals.includes(x));
        return intersection.length / chordIntervals.length;
    }
    
    // 生成和弦描述
    generateChordDescription(chord) {
        if (chord.error) {
            return chord.error;
        }
        
        let description = `🎶 ${chord.name}\n\n`;
        description += `🎼 和弦音符: ${chord.notes.join(' - ')}\n\n`;
        description += `🇨🇳 中文名称: ${chord.chineseName}\n\n`;
        description += `🔤 英文名称: ${chord.englishName}\n\n`;
        description += `🎹 符号表示: ${chord.symbolName}\n\n`;
        description += `💡 和弦性质: ${chord.characteristic}\n\n`;
        description += `🎵 常见用途: ${chord.usage}`;
        
        return description;
    }
    
    // 生成音符分析描述
    generateNotesAnalysisDescription(analysis) {
        if (analysis.error) {
            return analysis.error;
        }
        
        let description = `🎵 输入音符: ${analysis.inputNotes.join(' ')}\n\n`;
        description += `🔍 分析结果:\n\n`;
        
        analysis.possibleChords.forEach((chord, index) => {
            const matchPercent = Math.round(chord.matchScore * 100);
            description += `${index + 1}. ${chord.name} (匹配度: ${matchPercent}%)\n`;
            description += `   音符: ${chord.notes.join(' - ')}\n`;
            description += `   中文: ${chord.chineseName}\n`;
            description += `   英文: ${chord.englishName}\n`;
            description += `   符号: ${chord.symbolName}\n`;
            
            if (index < analysis.possibleChords.length - 1) {
                description += '\n';
            }
        });
        
        return description;
    }
    
    // 生成音级分析描述
    generateNoteDegreesAnalysisDescription(analysis) {
        if (analysis.error) {
            return analysis.error;
        }
        
        let description = `🎵 输入音符: ${analysis.inputNotes.join(' ')}\n\n`;
        description += `🔍 分析结果:\n\n`;
        
        analysis.possibleChords.forEach((chord, index) => {
            description += `${index + 1}. ${chord.name}\n`;
            description += `   音符: ${chord.notes.join(' - ')}\n`;
            description += `   中文: ${chord.chineseName}\n`;
            description += `   英文: ${chord.englishName}\n`;
            description += `   符号: ${chord.symbolName}\n`;
            
            if (index < analysis.possibleChords.length - 1) {
                description += '\n';
            }
        });
        
        return description;
    }
}

// 创建全局和弦生成器实例
const chordGenerator = new ChordGenerator();