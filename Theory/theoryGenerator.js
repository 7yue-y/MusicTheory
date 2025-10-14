// theoryDatabase.js - 乐理知识数据库
class TheoryDatabase {
    constructor() {
        this.database = {
            // 调号系统
            keySignatures: {
                'C大调调号': {
                    title: 'C大调调号',
                    content: 'C大调没有升降号。这是最基础的调号，所有音符都是自然音。',
                    examples: 'C D E F G A B C'
                },
                'G大调调号': {
                    title: 'G大调调号',
                    content: 'G大调有一个升号（F♯）。升号顺序：F♯',
                    examples: 'G A B C D E F♯ G'
                },
                'D大调调号': {
                    title: 'D大调调号',
                    content: 'D大调有两个升号（F♯, C♯）。升号顺序：F♯ C♯',
                    examples: 'D E F♯ G A B C♯ D'
                },
                'A大调调号': {
                    title: 'A大调调号',
                    content: 'A大调有三个升号（F♯, C♯, G♯）。升号顺序：F♯ C♯ G♯',
                    examples: 'A B C♯ D E F♯ G♯ A'
                },
                'E大调调号': {
                    title: 'E大调调号',
                    content: 'E大调有四个升号（F♯, C♯, G♯, D♯）。升号顺序：F♯ C♯ G♯ D♯',
                    examples: 'E F♯ G♯ A B C♯ D♯ E'
                },
                'B大调调号': {
                    title: 'B大调调号',
                    content: 'B大调有五个升号（F♯, C♯, G♯, D♯, A♯）。升号顺序：F♯ C♯ G♯ D♯ A♯',
                    examples: 'B C♯ D♯ E F♯ G♯ A♯ B'
                },
                'F大调调号': {
                    title: 'F大调调号',
                    content: 'F大调有一个降号（B♭）。降号顺序：B♭',
                    examples: 'F G A B♭ C D E F'
                },
                '降B大调调号': {
                    title: '降B大调调号',
                    content: '降B大调有两个降号（B♭, E♭）。降号顺序：B♭ E♭',
                    examples: 'B♭ C D E♭ F G A B♭'
                },
                '降E大调调号': {
                    title: '降E大调调号',
                    content: '降E大调有三个降号（B♭, E♭, A♭）。降号顺序：B♭ E♭ A♭',
                    examples: 'E♭ F G A♭ B♭ C D E♭'
                },
                '降A大调调号': {
                    title: '降A大调调号',
                    content: '降A大调有四个降号（B♭, E♭, A♭, D♭）。降号顺序：B♭ E♭ A♭ D♭',
                    examples: 'A♭ B♭ C D♭ E♭ F G A♭'
                }
            },
            
            // 节奏与拍号
            rhythm: {
                '4/4拍含义': {
                    title: '4/4拍（普通拍子）',
                    content: '4/4拍表示每小节有4拍，以四分音符为一拍。这是最常见的拍号，也称为普通拍子。',
                    examples: '常用于流行音乐、摇滚、古典音乐等'
                },
                '3/4拍含义': {
                    title: '3/4拍（华尔兹拍子）',
                    content: '3/4拍表示每小节有3拍，以四分音符为一拍。常用于华尔兹舞曲。',
                    examples: '强-弱-弱的节奏模式'
                },
                '2/4拍含义': {
                    title: '2/4拍（进行曲拍子）',
                    content: '2/4拍表示每小节有2拍，以四分音符为一拍。常用于进行曲和波尔卡舞曲。',
                    examples: '强-弱的节奏模式'
                },
                '6/8拍含义': {
                    title: '6/8拍（复合拍子）',
                    content: '6/8拍表示每小节有6拍，以八分音符为一拍。实际上是两个三拍子的组合。',
                    examples: '强-弱-弱 | 次强-弱-弱的节奏模式'
                },
                '节奏类型': {
                    title: '常见节奏类型',
                    content: `
• 均分节奏：音符时值均匀
• 切分节奏：重音出现在非重拍位置
• 附点节奏：音符后加附点，延长原时值的一半
• 连音节奏：将拍子均分为非标准份数
                    `,
                    examples: ''
                }
            },
            
            // 音乐术语
            terminology: {
                '力度术语': {
                    title: '力度术语',
                    content: '力度术语表示音量的强弱变化',
                    examples: `
• 很弱 pp
• 弱 p
• 中弱 mp
• 中强 mf
• 强 f
• 很强 ff
• 渐强 cresc.
• 渐弱 dim.
• 特强 sf或sfz
• 突强 sf或sfz
• 强后即弱 fp
• 特强后弱 sfp
                    `
                },
                '速度术语': {
                    title: '速度术语',
                    content: '速度术语表示音乐的快慢变化',
                    examples: `
• 渐快 accel
• 渐慢 rit. 或 rall
• 渐快同时渐强 string.
• 原速 a tempo
• 一点点 poc
                    `
                },
                '速度类型': {
                    title: '速度类型与意大利语',
                    content: '各种速度标记及其对应的意大利语和速度范围',
                    examples: `
速度类型	意大利语	速度范围
庄板	    Grave	    40-44
广板	    Largo    	46-50
慢板	    Lento	    52-54
柔板	    Adagio   	56-58（稍慢）
小快板	    Allegretto	108-126
快板	    Allegro	    132-176（有点快）
小广板	    Langhetto	60-63（偏慢）
行板	    Andante  	66（中速）
小行板	    Andantino	69-84（中速）
中板	    Moderato 	88-100（中速）
急板	    Presto	    184-220
最急板	    Prestissimo	208（非常快）
                    `
                },
                '表情术语': {
                    title: '表情术语',
                    content: '表情术语表达音乐的情感和演奏风格',
                    examples: `
意大利语	          意义
affettuoso	         热情，富于感情
agitato	             充满激情
alla marcia	         进行曲风格
animato	             活泼，快速
brioso	             朝气蓬勃
cantabile	         如歌
con	                 用，用……感情
con spirito	         热烈，热情
comodo	             舒适，中等速度
dolce	             柔和，柔美
dolente	             哀怨，悲伤
espressivo	         富于表情
grandioso	         雄伟，壮丽
grazioso	         优美，优雅
legato	             连音
leggero	             轻快，轻巧
maestoso	         宏伟，庄重
scherzando	         欢乐，谐谑
semplice	         单纯，简单
sempre	             保持，一直用……奏法
spiritoso	         热烈，热情
staccato	         断奏，断音
tranquillo	         安静
vivace	             活泼，敏捷
vivo	             活泼，敏捷
                    `
                },
                'Allegro意思': {
                    title: 'Allegro - 快板',
                    content: 'Allegro表示快速、活泼的速度，大约132-176 BPM。常用于欢快、energetic的乐章。',
                    examples: '贝多芬《第五交响曲》第一乐章'
                },
                'Adagio意思': {
                    title: 'Adagio - 柔板',
                    content: 'Adagio表示缓慢、柔和的速度，大约56-58 BPM。常用于抒情、深情的乐章。',
                    examples: '阿尔比诺尼《G小调柔板》'
                },
                'Andante意思': {
                    title: 'Andante - 行板',
                    content: 'Andante表示行走的速度，中等慢速，大约66 BPM。平稳流动的感觉。',
                    examples: '莫扎特《小星星变奏曲》主题'
                },
                'Piano意思': {
                    title: 'Piano - 弱',
                    content: 'Piano（缩写p）表示弱奏，需要轻柔地演奏。',
                    examples: 'p（弱）、pp（很弱）、ppp（极弱）'
                },
                'Forte意思': {
                    title: 'Forte - 强',
                    content: 'Forte（缩写f）表示强奏，需要有力地演奏。',
                    examples: 'f（强）、ff（很强）、fff（极强）'
                },
                'Crescendo意思': {
                    title: 'Crescendo - 渐强',
                    content: 'Crescendo（缩写cresc.）表示音量逐渐增强。',
                    examples: '从弱到强的过渡'
                },
                'Diminuendo意思': {
                    title: 'Diminuendo - 渐弱',
                    content: 'Diminuendo（缩写dim.）表示音量逐渐减弱。',
                    examples: '从强到弱的过渡'
                },
                'Legato意思': {
                    title: 'Legato - 连奏',
                    content: 'Legato表示音符之间要连贯、平滑地连接，没有间断。',
                    examples: '常用于旋律线条'
                },
                'Staccato意思': {
                    title: 'Staccato - 断奏',
                    content: 'Staccato表示音符要短促、分离地演奏。',
                    examples: '音符上标有点号'
                }
            },
            
            // 调式分析
            modes: {
                '多利亚调式': {
                    title: '多利亚调式（Dorian Mode）',
                    content: '多利亚调式是小调性质的调式，但比自然小调更明亮。特点：升第六级音。',
                    structure: '全音-半音-全音-全音-全音-半音-全音',
                    formula: '1 - 2 - ♭3 - 4 - 5 - 6 - ♭7',
                    examples: 'D多利亚：D E F G A B C D'
                },
                '弗里几亚调式': {
                    title: '弗里几亚调式（Phrygian Mode）',
                    content: '弗里几亚调式具有西班牙、弗拉门戈风格。特点：降第二级音。',
                    structure: '半音-全音-全音-全音-半音-全音-全音',
                    formula: '1 - ♭2 - ♭3 - 4 - 5 - ♭6 - ♭7',
                    examples: 'E弗里几亚：E F G A B C D E'
                },
                '利底亚调式': {
                    title: '利底亚调式（Lydian Mode）',
                    content: '利底亚调式具有梦幻、太空感。特点：升第四级音。',
                    structure: '全音-全音-全音-半音-全音-全音-半音',
                    formula: '1 - 2 - 3 - ♯4 - 5 - 6 - 7',
                    examples: 'F利底亚：F G A B C D E F'
                },
                '混合利底亚调式': {
                    title: '混合利底亚调式（Mixolydian Mode）',
                    content: '混合利底亚调式具有布鲁斯、摇滚风格。特点：降第七级音。',
                    structure: '全音-全音-半音-全音-全音-半音-全音',
                    formula: '1 - 2 - 3 - 4 - 5 - 6 - ♭7',
                    examples: 'G混合利底亚：G A B C D E F G'
                },
                '洛克利亚调式': {
                    title: '洛克利亚调式（Locrian Mode）',
                    content: '洛克利亚调式极度不稳定、紧张。特点：降第二级和第五级音。',
                    structure: '半音-全音-全音-半音-全音-全音-全音',
                    formula: '1 - ♭2 - ♭3 - 4 - ♭5 - ♭6 - ♭7',
                    examples: 'B洛克利亚：B C D E F G A B'
                },
                '关系大小调': {
                    title: '关系大小调',
                    content: '关系大小调是指共享相同调号的大调和小调。例如C大调和A小调都无升降号。',
                    examples: `
C大调 - A小调
G大调 - E小调  
D大调 - B小调
A大调 - F♯小调
E大调 - C♯小调
B大调 - G♯小调
                    `
                },
                '五声音阶': {
                    title: '五声音阶',
                    content: '五声音阶由五个音符组成，没有半音关系，音响和谐。分为大调五声音阶和小调五声音阶。',
                    examples: `
大调五声音阶：1 - 2 - 3 - 5 - 6
小调五声音阶：1 - ♭3 - 4 - 5 - ♭7
C大调五声音阶：C D E G A
A小调五声音阶：A C D E G
                    `
                }
            },

            // 新增：泛音列
            harmonics: {
                '泛音列': {
                    title: '泛音列（Harmonic Series）',
                    content: '泛音列是基音振动时产生的自然泛音序列，是音乐声学的基础。每个音除了基频外，还会产生频率为基频整数倍的泛音。',
                    structure: '基音(1f) → 八度(2f) → 纯五度(3f) → 纯四度(4f) → 大三度(5f) → 小三度(6f)等',
                    formula: '频率 = 基频 × n (n=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16...)',
                    examples: `
以C2（65.41Hz）为基音的泛音列：
1. C2 (65.41Hz) - 基音
2. C3 (130.81Hz) - 八度
3. G3 (196.22Hz) - 纯五度
4. C4 (261.63Hz) - 八度
5. E4 (327.04Hz) - 大三度
6. G4 (392.44Hz) - 纯五度
7. B♭4 (457.85Hz) - 小七度（略低）
8. C5 (523.25Hz) - 八度
9. D5 (588.66Hz) - 大二度
10. E5 (654.07Hz) - 大三度
11. F♯5 (719.48Hz) - 增四度（略低）
12. G5 (784.89Hz) - 纯五度
13. A5 (850.30Hz) - 大六度（略低）
14. B♭5 (915.70Hz) - 小七度
15. B5 (981.11Hz) - 大七度（略低）
16. C6 (1046.50Hz) - 八度
                    `
                },
                '泛音列应用': {
                    title: '泛音列的应用',
                    content: '泛音列在音乐理论、乐器制造、和声学等方面有重要应用：',
                    examples: `
1. 和声学基础：三和弦、七和弦的构成
2. 音律体系：纯律、十二平均律的制定依据
3. 乐器音色：不同乐器的泛音结构决定其音色特点
4. 声学现象：解释共鸣、拍音等物理现象
5. 作曲技法：现代音乐中的频谱音乐等
                    `
                },
                '计算泛音列': {
                    title: '计算泛音列',
                    content: '输入基音，计算其泛音列。支持音符名称如C、D、E、F、G、A、B，可带升降号。',
                    examples: '请输入基音（如C、G、A#、Bb等）'
                }
            }
        };

        // 音符频率映射（A4 = 440Hz）
        this.noteFrequencies = {
            'C': 16.35, 'C#': 17.32, 'Db': 17.32, 'D': 18.35, 'D#': 19.45, 'Eb': 19.45,
            'E': 20.60, 'F': 21.83, 'F#': 23.12, 'Gb': 23.12, 'G': 24.50, 'G#': 25.96,
            'Ab': 25.96, 'A': 27.50, 'A#': 29.14, 'Bb': 29.14, 'B': 30.87
        };
    }

    // 搜索乐理知识
    searchTheory(query) {
        const lowerQuery = query.toLowerCase().trim();
        
        // 特殊处理泛音列计算
        if (lowerQuery.includes('泛音列') && this.isNoteName(query.replace('泛音列', '').trim())) {
            const noteName = query.replace('泛音列', '').trim();
            return this.calculateHarmonicSeries(noteName);
        }

        // 在所有分类中搜索匹配项
        for (const category in this.database) {
            for (const key in this.database[category]) {
                if (key.toLowerCase().includes(lowerQuery) || 
                    lowerQuery.includes(key.toLowerCase())) {
                    return {
                        category: category,
                        data: this.database[category][key],
                        matchType: 'exact'
                    };
                }
            }
        }

        // 模糊搜索
        const fuzzyResults = [];
        for (const category in this.database) {
            for (const key in this.database[category]) {
                const item = this.database[category][key];
                const searchText = (key + ' ' + item.content + ' ' + (item.examples || '')).toLowerCase();
                
                if (searchText.includes(lowerQuery)) {
                    fuzzyResults.push({
                        category: category,
                        data: item,
                        matchScore: this.calculateMatchScore(searchText, lowerQuery)
                    });
                }
            }
        }

        if (fuzzyResults.length > 0) {
            // 按匹配度排序
            fuzzyResults.sort((a, b) => b.matchScore - a.matchScore);
            return {
                category: fuzzyResults[0].category,
                data: fuzzyResults[0].data,
                matchType: 'fuzzy',
                allResults: fuzzyResults.slice(0, 3)
            };
        }

        return { error: `未找到与"${query}"相关的乐理知识` };
    }

    // 计算匹配度
    calculateMatchScore(text, query) {
        const words = query.split(' ');
        let score = 0;
        
        words.forEach(word => {
            if (text.includes(word)) {
                score += word.length;
            }
        });
        
        return score;
    }

    // 检查是否为有效音符名称
    isNoteName(text) {
        const notePattern = /^[A-G][#b]?$/;
        return notePattern.test(text);
    }

    // 计算泛音列
    calculateHarmonicSeries(noteName) {
        if (!this.isNoteName(noteName)) {
            return { error: `"${noteName}"不是有效的音符名称。请使用如C、D、E、F、G、A、B，可带#或b` };
        }

        const baseFreq = this.noteFrequencies[noteName];
        if (!baseFreq) {
            return { error: `无法找到音符"${noteName}"的基础频率` };
        }

        const harmonics = [];
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        // 计算前16个泛音
        for (let i = 1; i <= 16; i++) {
            const freq = baseFreq * i;
            const noteInfo = this.frequencyToNote(freq);
            
            harmonics.push({
                harmonic: i,
                frequency: freq.toFixed(2),
                note: noteInfo.note,
                octave: noteInfo.octave,
                interval: this.getIntervalName(i),
                cents: noteInfo.cents
            });
        }

        return {
            category: 'harmonics',
            data: {
                title: `${noteName}的泛音列`,
                content: `以${noteName}（${baseFreq.toFixed(2)}Hz）为基音的泛音列计算`,
                harmonics: harmonics,
                baseNote: noteName,
                baseFrequency: baseFreq.toFixed(2)
            },
            matchType: 'calculated'
        };
    }

    // 频率转换为音符
    frequencyToNote(freq) {
        // A4 = 440Hz 作为参考
        const A4 = 440;
        const semitonesFromA4 = 12 * Math.log2(freq / A4);
        const noteIndex = Math.round(semitonesFromA4) % 12;
        const octave = 4 + Math.floor((Math.round(semitonesFromA4) + 9) / 12);
        
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const cents = Math.round((semitonesFromA4 - Math.round(semitonesFromA4)) * 100);
        
        return {
            note: notes[(noteIndex + 12) % 12],
            octave: octave,
            cents: cents
        };
    }

    // 获取音程名称
    getIntervalName(harmonicNumber) {
        const intervals = {
            1: '基音',
            2: '八度',
            3: '纯五度',
            4: '八度',
            5: '大三度',
            6: '纯五度',
            7: '小七度（略低）',
            8: '八度',
            9: '大二度',
            10: '大三度',
            11: '增四度（略低）',
            12: '纯五度',
            13: '大六度（略低）',
            14: '小七度',
            15: '大七度（略低）',
            16: '八度'
        };
        
        return intervals[harmonicNumber] || `第${harmonicNumber}泛音`;
    }

    // 获取分类数据
    getCategoryData(category) {
        return this.database[category] || {};
    }

    // 获取所有分类
    getCategories() {
        return {
            'keySignatures': '调号系统',
            'rhythm': '节奏与拍号',
            'terminology': '音乐术语',
            'modes': '调式分析',
            'harmonics': '泛音列'
        };
    }
}

// 创建全局乐理数据库实例
const theoryDatabase = new TheoryDatabase();