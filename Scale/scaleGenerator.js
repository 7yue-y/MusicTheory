// 音阶生成器
/* 更新日志 */
// V0.1 基于音符和音程的算法重新设计
// V0.2 增加五度圈和调式验证
// V0.3 增加民族调式功能
class ScaleGenerator {
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
        
        // 西洋音阶模式定义
        this.scalePatterns = {
            // 西洋大小调
            'major': [
                new this.Interval('maj', 2),
                new this.Interval('maj', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('maj', 6),
                new this.Interval('maj', 7),
                new this.Interval('per', 8)
            ],
            'naturalMinor': [
                new this.Interval('maj', 2),
                new this.Interval('min', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('min', 6),
                new this.Interval('min', 7),
                new this.Interval('per', 8)
            ],
            'harmonicMinor': [
                new this.Interval('maj', 2),
                new this.Interval('min', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('min', 6),
                new this.Interval('maj', 7),
                new this.Interval('per', 8)
            ],
            'melodicMinor': [
                new this.Interval('maj', 2),
                new this.Interval('min', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('maj', 6),
                new this.Interval('maj', 7),
                new this.Interval('per', 8)
            ],
            'harmonicMajor': [
                new this.Interval('maj', 2),
                new this.Interval('maj', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('min', 6),
                new this.Interval('maj', 7),
                new this.Interval('per', 8)
            ],
            'melodicMajor': [
                new this.Interval('maj', 2),
                new this.Interval('maj', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('maj', 6),
                new this.Interval('maj', 7),
                new this.Interval('per', 8)
            ],
            // 中古调式
            'ionian': [
                new this.Interval('maj', 2),
                new this.Interval('maj', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('maj', 6),
                new this.Interval('maj', 7),
                new this.Interval('per', 8)
            ],
            'dorian': [
                new this.Interval('maj', 2),
                new this.Interval('min', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('maj', 6),
                new this.Interval('min', 7),
                new this.Interval('per', 8)
            ],
            'phrygian': [
                new this.Interval('min', 2),
                new this.Interval('min', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('min', 6),
                new this.Interval('min', 7),
                new this.Interval('per', 8)
            ],
            'lydian': [
                new this.Interval('maj', 2),
                new this.Interval('maj', 3),
                new this.Interval('aug', 4),
                new this.Interval('per', 5),
                new this.Interval('maj', 6),
                new this.Interval('maj', 7),
                new this.Interval('per', 8)
            ],
            'mixolydian': [
                new this.Interval('maj', 2),
                new this.Interval('maj', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('maj', 6),
                new this.Interval('min', 7),
                new this.Interval('per', 8)
            ],
            'aeolian': [
                new this.Interval('maj', 2),
                new this.Interval('min', 3),
                new this.Interval('per', 4),
                new this.Interval('per', 5),
                new this.Interval('min', 6),
                new this.Interval('min', 7),
                new this.Interval('per', 8)
            ],
            'locrian': [
                new this.Interval('min', 2),
                new this.Interval('min', 3),
                new this.Interval('per', 4),
                new this.Interval('dim', 5),
                new this.Interval('min', 6),
                new this.Interval('min', 7),
                new this.Interval('per', 8)
            ]
        };

        // 民族调式基础定义
        this.folkScaleDefinitions = {
            // 五声调式基础音程（相对于宫音）
            'pentatonic_base': [
                new this.Interval('per', 1),  // 宫
                new this.Interval('maj', 2),  // 商
                new this.Interval('maj', 3),  // 角
                new this.Interval('per', 5),  // 徵
                new this.Interval('maj', 6)   // 羽
            ],
            
            // 偏音定义（相对于宫音）
            'bianyin': {
                'qingjiao': new this.Interval('per', 4),    // 清角 F
                'bianzhi': new this.Interval('aug', 4),     // 变徵 #F
                'biangong': new this.Interval('maj', 7),    // 变宫 B
                'run': new this.Interval('min', 7)          // 闰 bB
            }
        };

        // 民族调式模式定义（使用音程）
        this.folkScalePatterns = {
            // 五声调式
            'pentatonic_gong': [
                new this.Interval('maj', 2),  // 商
                new this.Interval('maj', 3),  // 角
                new this.Interval('per', 5),  // 徵
                new this.Interval('maj', 6),  // 羽
            ],
            'pentatonic_shang': [
                new this.Interval('maj', 2),  // 角
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('min', 6),  // 宫
            ],
            'pentatonic_jue': [
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('min', 6),  // 宫
                new this.Interval('maj', 7),  // 商
            ],
            'pentatonic_zhi': [
                new this.Interval('maj', 2),  // 羽
                new this.Interval('min', 4),  // 宫
                new this.Interval('maj', 5),  // 商
                new this.Interval('maj', 6),  // 角
            ],
            'pentatonic_yu': [
                new this.Interval('min', 3),  // 宫
                new this.Interval('maj', 4),  // 商
                new this.Interval('min', 6),  // 角
                new this.Interval('maj', 7),  // 徵
            ],
            
            // 六声调式 - 加清角
            'hexatonic_qingjiao_gong': [
                new this.Interval('maj', 2),  // 商
                new this.Interval('maj', 3),  // 角
                new this.Interval('per', 4),  // 清角
                new this.Interval('per', 5),  // 徵
                new this.Interval('maj', 6),  // 羽
                new this.Interval('per', 8)   // 宫(高八度)
            ],
            'hexatonic_qingjiao_shang': [
                new this.Interval('maj', 2),  // 角
                new this.Interval('per', 3),  // 清角
                new this.Interval('min', 4),  // 徵
                new this.Interval('maj', 5),  // 羽
                new this.Interval('min', 7),  // 宫
                new this.Interval('per', 8)   // 商(高八度)
            ],
            'hexatonic_qingjiao_jue': [
                new this.Interval('per', 2),  // 清角
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('min', 6),  // 宫
                new this.Interval('maj', 7),  // 商
                new this.Interval('per', 8)   // 角(高八度)
            ],
            'hexatonic_qingjiao_zhi': [
                new this.Interval('maj', 2),  // 羽
                new this.Interval('min', 4),  // 宫
                new this.Interval('maj', 5),  // 商
                new this.Interval('maj', 6),  // 角
                new this.Interval('min', 7),  // 清角
                new this.Interval('per', 8)   // 徵(高八度)
            ],
            'hexatonic_qingjiao_yu': [
                new this.Interval('min', 3),  // 宫
                new this.Interval('maj', 4),  // 商
                new this.Interval('maj', 5),  // 角
                new this.Interval('min', 6),  // 清角
                new this.Interval('maj', 7),  // 徵
                new this.Interval('per', 8)   // 羽(高八度)
            ],
            
            // 六声调式 - 加变宫
            'hexatonic_biangong_gong': [
                new this.Interval('maj', 2),  // 商
                new this.Interval('maj', 3),  // 角
                new this.Interval('per', 5),  // 徵
                new this.Interval('maj', 6),  // 羽
                new this.Interval('maj', 7),  // 变宫
                new this.Interval('per', 8)   // 宫(高八度)
            ],
            'hexatonic_biangong_shang': [
                new this.Interval('maj', 2),  // 角
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('maj', 5),  // 变宫
                new this.Interval('min', 7),  // 宫
                new this.Interval('per', 8)   // 商(高八度)
            ],
            'hexatonic_biangong_jue': [
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('maj', 5),  // 变宫
                new this.Interval('min', 6),  // 宫
                new this.Interval('maj', 7),  // 商
                new this.Interval('per', 8)   // 角(高八度)
            ],
            'hexatonic_biangong_zhi': [
                new this.Interval('maj', 2),  // 羽
                new this.Interval('maj', 3),  // 变宫
                new this.Interval('min', 4),  // 宫
                new this.Interval('maj', 5),  // 商
                new this.Interval('maj', 6),  // 角
                new this.Interval('per', 8)   // 徵(高八度)
            ],
            'hexatonic_biangong_yu': [
                new this.Interval('maj', 2),  // 变宫
                new this.Interval('min', 3),  // 宫
                new this.Interval('maj', 4),  // 商
                new this.Interval('min', 6),  // 角
                new this.Interval('maj', 7),  // 徵
                new this.Interval('per', 8)   // 羽(高八度)
            ],
            
            // 七声调式 - 清乐（五声+清角+变宫）
            'qingle_gong': [
                new this.Interval('maj', 2),  // 商
                new this.Interval('maj', 3),  // 角
                new this.Interval('per', 4),  // 清角
                new this.Interval('per', 5),  // 徵
                new this.Interval('maj', 6),  // 羽
                new this.Interval('maj', 7),  // 变宫
                new this.Interval('per', 8)   // 宫(高八度)
            ],
            'qingle_shang': [
                new this.Interval('maj', 2),  // 角
                new this.Interval('per', 3),  // 清角
                new this.Interval('min', 4),  // 徵
                new this.Interval('maj', 5),  // 羽
                new this.Interval('maj', 6),  // 变宫
                new this.Interval('min', 7),  // 宫
                new this.Interval('per', 8)   // 商(高八度)
            ],
            'qingle_jue': [
                new this.Interval('per', 2),  // 清角
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('maj', 5),  // 变宫
                new this.Interval('min', 6),  // 宫
                new this.Interval('maj', 7),  // 商
                new this.Interval('per', 8)   // 角(高八度)
            ],
            'qingle_zhi': [
                new this.Interval('maj', 2),  // 羽
                new this.Interval('maj', 3),  // 变宫
                new this.Interval('min', 4),  // 宫
                new this.Interval('maj', 5),  // 商
                new this.Interval('maj', 6),  // 角
                new this.Interval('min', 7),  // 清角
                new this.Interval('per', 8)   // 徵(高八度)
            ],
            'qingle_yu': [
                new this.Interval('maj', 2),  // 变宫
                new this.Interval('min', 3),  // 宫
                new this.Interval('maj', 4),  // 商
                new this.Interval('maj', 5),  // 角
                new this.Interval('min', 6),  // 清角
                new this.Interval('maj', 7),  // 徵
                new this.Interval('per', 8)   // 羽(高八度)
            ],
            
            // 七声调式 - 雅乐（五声+变徵+变宫）
            'yayue_gong': [
                new this.Interval('maj', 2),  // 商
                new this.Interval('maj', 3),  // 角
                new this.Interval('aug', 4),  // 变徵
                new this.Interval('per', 5),  // 徵
                new this.Interval('maj', 6),  // 羽
                new this.Interval('maj', 7),  // 变宫
                new this.Interval('per', 8)   // 宫(高八度)
            ],
            'yayue_shang': [
                new this.Interval('maj', 2),  // 角
                new this.Interval('aug', 3),  // 变徵
                new this.Interval('min', 4),  // 徵
                new this.Interval('maj', 5),  // 羽
                new this.Interval('maj', 6),  // 变宫
                new this.Interval('min', 7),  // 宫
                new this.Interval('per', 8)   // 商(高八度)
            ],
            'yayue_jue': [
                new this.Interval('aug', 2),  // 变徵
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('maj', 5),  // 变宫
                new this.Interval('min', 6),  // 宫
                new this.Interval('maj', 7),  // 商
                new this.Interval('per', 8)   // 角(高八度)
            ],
            'yayue_zhi': [
                new this.Interval('maj', 2),  // 羽
                new this.Interval('maj', 3),  // 变宫
                new this.Interval('min', 4),  // 宫
                new this.Interval('maj', 5),  // 商
                new this.Interval('aug', 6),  // 变徵
                new this.Interval('min', 7),  // 角
                new this.Interval('per', 8)   // 徵(高八度)
            ],
            'yayue_yu': [
                new this.Interval('maj', 2),  // 变宫
                new this.Interval('min', 3),  // 宫
                new this.Interval('maj', 4),  // 商
                new this.Interval('aug', 5),  // 变徵
                new this.Interval('min', 6),  // 角
                new this.Interval('maj', 7),  // 徵
                new this.Interval('per', 8)   // 羽(高八度)
            ],
            
            // 七声调式 - 燕乐（五声+清角+闰）
            'yanyue_gong': [
                new this.Interval('maj', 2),  // 商
                new this.Interval('maj', 3),  // 角
                new this.Interval('per', 4),  // 清角
                new this.Interval('per', 5),  // 徵
                new this.Interval('maj', 6),  // 羽
                new this.Interval('min', 7),  // 闰
                new this.Interval('per', 8)   // 宫(高八度)
            ],
            'yanyue_shang': [
                new this.Interval('maj', 2),  // 角
                new this.Interval('per', 3),  // 清角
                new this.Interval('min', 4),  // 徵
                new this.Interval('maj', 5),  // 羽
                new this.Interval('min', 6),  // 闰
                new this.Interval('min', 7),  // 宫
                new this.Interval('per', 8)   // 商(高八度)
            ],
            'yanyue_jue': [
                new this.Interval('per', 2),  // 清角
                new this.Interval('min', 3),  // 徵
                new this.Interval('maj', 4),  // 羽
                new this.Interval('min', 5),  // 闰
                new this.Interval('min', 6),  // 宫
                new this.Interval('maj', 7),  // 商
                new this.Interval('per', 8)   // 角(高八度)
            ],
            'yanyue_zhi': [
                new this.Interval('maj', 2),  // 羽
                new this.Interval('min', 3),  // 闰
                new this.Interval('min', 4),  // 宫
                new this.Interval('maj', 5),  // 商
                new this.Interval('maj', 6),  // 角
                new this.Interval('min', 7),  // 清角
                new this.Interval('per', 8)   // 徵(高八度)
            ],
            'yanyue_yu': [
                new this.Interval('min', 2),  // 闰
                new this.Interval('min', 3),  // 宫
                new this.Interval('maj', 4),  // 商
                new this.Interval('maj', 5),  // 角
                new this.Interval('min', 6),  // 清角
                new this.Interval('maj', 7),  // 徵
                new this.Interval('per', 8)   // 羽(高八度)
            ]
        };

        
        // 音阶名称映射
        this.scaleNames = {
            // 西洋大小调
            'major': '自然大调音阶',
            'naturalMinor': '自然小调音阶',
            'harmonicMinor': '和声小调音阶',
            'melodicMinor': '旋律小调音阶',
            'harmonicMajor': '和声大调音阶',
            'melodicMajor': '旋律大调音阶',
            // 中古调式
            'ionian': '伊奥尼亚调式',
            'dorian': '多利亚调式',
            'phrygian': '弗里几亚调式',
            'lydian': '利底亚调式',
            'mixolydian': '混合利底亚调式',
            'aeolian': '爱奥尼亚调式',
            'locrian': '洛克利亚调式',
// 民族调式
            'pentatonic_gong': '五声宫调式',
            'pentatonic_shang': '五声商调式',
            'pentatonic_jue': '五声角调式',
            'pentatonic_zhi': '五声徵调式',
            'pentatonic_yu': '五声羽调式',
            'hexatonic_qingjiao_gong': '六声宫调式（加清角）',
            'hexatonic_qingjiao_shang': '六声商调式（加清角）',
            'hexatonic_qingjiao_jue': '六声角调式（加清角）',
            'hexatonic_qingjiao_zhi': '六声徵调式（加清角）',
            'hexatonic_qingjiao_yu': '六声羽调式（加清角）',
            'hexatonic_biangong_gong': '六声宫调式（加变宫）',
            'hexatonic_biangong_shang': '六声商调式（加变宫）',
            'hexatonic_biangong_jue': '六声角调式（加变宫）',
            'hexatonic_biangong_zhi': '六声徵调式（加变宫）',
            'hexatonic_biangong_yu': '六声羽调式（加变宫）',
            'qingle_gong': '七声清乐宫调式',
            'qingle_shang': '七声清乐商调式',
            'qingle_jue': '七声清乐角调式',
            'qingle_zhi': '七声清乐徵调式',
            'qingle_yu': '七声清乐羽调式',
            'yayue_gong': '七声雅乐宫调式',
            'yayue_shang': '七声雅乐商调式',
            'yayue_jue': '七声雅乐角调式',
            'yayue_zhi': '七声雅乐徵调式',
            'yayue_yu': '七声雅乐羽调式',
            'yanyue_gong': '七声燕乐宫调式',
            'yanyue_shang': '七声燕乐商调式',
            'yanyue_jue': '七声燕乐角调式',
            'yanyue_zhi': '七声燕乐徵调式',
            'yanyue_yu': '七声燕乐羽调式'
        };
        
        // 音阶结构描述
        this.scaleDescriptions = {
            'major': '全音-全音-半音-全音-全音-全音-半音',
            'naturalMinor': '全音-半音-全音-全音-半音-全音-全音',
            'harmonicMinor': '全音-半音-全音-全音-半音-增二度-半音',
            'melodicMinor': '全音-半音-全音-全音-全音-全音-半音',
            'harmonicMajor': '全音-全音-半音-全音-半音-增二度-半音',
            'melodicMajor': '全音-全音-半音-全音-全音-全音-半音',
            'ionian': '全音-全音-半音-全音-全音-全音-半音',
            'dorian': '全音-半音-全音-全音-全音-半音-全音',
            'phrygian': '半音-全音-全音-全音-半音-全音-全音',
            'lydian': '全音-全音-全音-半音-全音-全音-半音',
            'mixolydian': '全音-全音-半音-全音-全音-半音-全音',
            'aeolian': '全音-半音-全音-全音-半音-全音-全音',
            'locrian': '半音-全音-全音-半音-全音-全音-全音'
        };

// 民族调式偏音描述
        this.folkScaleBianyin = {
            'hexatonic_qingjiao_gong': '偏音：清角（宫音上方纯四度）',
            'hexatonic_qingjiao_shang': '偏音：清角（宫音上方纯四度）',
            'hexatonic_qingjiao_jue': '偏音：清角（宫音上方纯四度）',
            'hexatonic_qingjiao_zhi': '偏音：清角（宫音上方纯四度）',
            'hexatonic_qingjiao_yu': '偏音：清角（宫音上方纯四度）',
            'hexatonic_biangong_gong': '偏音：变宫（宫音上方大七度）',
            'hexatonic_biangong_shang': '偏音：变宫（宫音上方大七度）',
            'hexatonic_biangong_jue': '偏音：变宫（宫音上方大七度）',
            'hexatonic_biangong_zhi': '偏音：变宫（宫音上方大七度）',
            'hexatonic_biangong_yu': '偏音：变宫（宫音上方大七度）',
            'qingle_gong': '偏音：清角（宫音上方纯四度）、变宫（宫音上方大七度）',
            'qingle_shang': '偏音：清角（宫音上方纯四度）、变宫（宫音上方大七度）',
            'qingle_jue': '偏音：清角（宫音上方纯四度）、变宫（宫音上方大七度）',
            'qingle_zhi': '偏音：清角（宫音上方纯四度）、变宫（宫音上方大七度）',
            'qingle_yu': '偏音：清角（宫音上方纯四度）、变宫（宫音上方大七度）',
            'yayue_gong': '偏音：变徵（宫音上方增四度）、变宫（宫音上方大七度）',
            'yayue_shang': '偏音：变徵（宫音上方增四度）、变宫（宫音上方大七度）',
            'yayue_jue': '偏音：变徵（宫音上方增四度）、变宫（宫音上方大七度）',
            'yayue_zhi': '偏音：变徵（宫音上方增四度）、变宫（宫音上方大七度）',
            'yayue_yu': '偏音：变徵（宫音上方增四度）、变宫（宫音上方大七度）',
            'yanyue_gong': '偏音：清角（宫音上方纯四度）、闰（宫音上方小七度）',
            'yanyue_shang': '偏音：清角（宫音上方纯四度）、闰（宫音上方小七度）',
            'yanyue_jue': '偏音：清角（宫音上方纯四度）、闰（宫音上方小七度）',
            'yanyue_zhi': '偏音：清角（宫音上方纯四度）、闰（宫音上方小七度）',
            'yanyue_yu': '偏音：清角（宫音上方纯四度）、闰（宫音上方小七度）'
        };
        
        // 音符字母顺序
        this.noteSteps = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        
        // 五度圈定义
        this.circleOfFifths = {
            'major': {
                'C': 0, 'G': 1, 'D': 2, 'A': 3, 'E': 4, 'B': 5, 'F#': 6, 'C#': 7,
                'F': -1, 'Bb': -2, 'Eb': -3, 'Ab': -4, 'Db': -5, 'Gb': -6, 'Cb': -7
            },
            'naturalMinor': {
                'A': 0, 'E': 1, 'B': 2, 'F#': 3, 'C#': 4, 'G#': 5, 'D#': 6, 'A#': 7,
                'D': -1, 'G': -2, 'C': -3, 'F': -4, 'Bb': -5, 'Eb': -6, 'Ab': -7
            }
        };
        
        // 有效调性验证
        this.validKeys = {
            'major': ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'],
            'naturalMinor': ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'D', 'G', 'C', 'F', 'Bb', 'Eb', 'Ab']
        };
    }
    
    // 生成音阶 - 增加民族调式支持
    generateScale(rootNoteStr, scaleType) {
        try {
            // 如果是民族调式，使用不同的生成方法
            if (scaleType.startsWith('pentatonic_') || 
                scaleType.startsWith('hexatonic_') || 
                scaleType.startsWith('qingle_') || 
                scaleType.startsWith('yayue_') || 
                scaleType.startsWith('yanyue_')) {
                return this.generateFolkScale(rootNoteStr, scaleType);
            }
            
            // 验证西洋调性是否存在
            if (!this.isValidKey(rootNoteStr, scaleType)) {
                const suggestion = this.getEnharmonicSuggestion(rootNoteStr, scaleType);
                return { 
                    error: `调性 ${rootNoteStr}${this.scaleNames[scaleType]} 不存在于传统调性系统中`,
                    suggestion: suggestion
                };
            }
            
            const rootNote = this.Note.fromString(rootNoteStr);
            const pattern = this.scalePatterns[scaleType];
            
            if (!pattern) {
                return { error: `无效的音阶类型: ${scaleType}` };
            }
            
            const notes = [rootNote];
            
            // 根据音程模式生成音符
            for (let i = 0; i < pattern.length; i++) {
                const interval = pattern[i];
                const newNote = this.addInterval(rootNote, interval);
                notes.push(newNote);
            }
            
            // 转换为字符串表示
            const noteStrings = notes.map(note => note.toString());
            
            return {
                name: `${rootNoteStr}${this.scaleNames[scaleType]}`,
                root: rootNoteStr,
                notes: noteStrings,
                type: scaleType,
                keySignature: this.getKeySignature(rootNoteStr, scaleType)
            };
        } catch (error) {
            return { error: `生成音阶时出错: ${error.message}` };
        }
    }

// 生成民族调式 - 使用音程度数算法
    generateFolkScale(rootNoteStr, scaleType) {
        try {
            const rootNote = this.Note.fromString(rootNoteStr);
            const pattern = this.folkScalePatterns[scaleType];
            
            if (!pattern) {
                return { error: `无效的民族调式类型: ${scaleType}` };
            }
            
            const notes = [rootNote];
            
            // 根据音程模式生成音符
            for (let i = 0; i < pattern.length; i++) {
                const interval = pattern[i];
                const newNote = this.addInterval(rootNote, interval);
                notes.push(newNote);
            }
            
            // 转换为字符串表示
            const noteStrings = notes.map(note => note.toString());
            
            return {
                name: `${rootNoteStr}${this.scaleNames[scaleType]}`,
                root: rootNoteStr,
                notes: noteStrings,
                type: scaleType,
                isFolkScale: true,
                bianyin: this.folkScaleBianyin[scaleType] || '无偏音'
            };
        } catch (error) {
            return { error: `生成民族调式时出错: ${error.message}` };
        }
    }

    // 添加半音到音符
    addSemitones(note, semitones) {
        const targetSemitones = (note.getSemitones() + semitones) % 12;
        return this.findNoteBySemitones('C', targetSemitones);
    }
    
    // 验证调性是否有效
    isValidKey(rootNote, scaleType) {
        // 中古调式和民族调式允许任何主音
        if (['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'].includes(scaleType) ||
            scaleType.startsWith('pentatonic_') || 
            scaleType.startsWith('hexatonic_') || 
            scaleType.startsWith('qingle_') || 
            scaleType.startsWith('yayue_') || 
            scaleType.startsWith('yanyue_')) {
            return true;
        }
        
        // 西洋大小调需要验证
        const keyType = scaleType.includes('minor') ? 'naturalMinor' : 'major';
        return this.validKeys[keyType].includes(rootNote);
    }
    
    // 获取等音建议
    getEnharmonicSuggestion(rootNote, scaleType) {
        const enharmonicMap = {
            'G#': 'Ab', 'Ab': 'G#',
            'D#': 'Eb', 'Eb': 'D#',
            'A#': 'Bb', 'Bb': 'A#',
            'E#': 'F', 'F': 'E#',
            'B#': 'C', 'C': 'B#'
        };
        
        const suggestion = enharmonicMap[rootNote];
        if (suggestion && this.isValidKey(suggestion, scaleType)) {
            
            return '不认真听课吧，TMD就没有这个调';
            return `建议使用 ${suggestion}${this.scaleNames[scaleType]}`;
        }
        
        return '请选择传统调性系统中的调性';
    }
    
    // 获取调号
    getKeySignature(rootNote, scaleType) {
        const keyType = scaleType.includes('minor') ? 'naturalMinor' : 'major';
        const sharpsOrFlats = this.circleOfFifths[keyType][rootNote];
        
        if (sharpsOrFlats > 0) {
            return `${sharpsOrFlats}个升号`;
        } else if (sharpsOrFlats < 0) {
            return `${Math.abs(sharpsOrFlats)}个降号`;
        } else {
            return '无升降号';
        }
    }
    
    // 添加音程到音符（改进版本）
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
    
    // 检查是否有等音
    hasEnharmonicEquivalent(noteStr) {
        const equivalents = {
            'C#': 'Db', 'Db': 'C#',
            'D#': 'Eb', 'Eb': 'D#',
            'F#': 'Gb', 'Gb': 'F#',
            'G#': 'Ab', 'Ab': 'G#',
            'A#': 'Bb', 'Bb': 'A#'
        };
        return equivalents.hasOwnProperty(noteStr);
    }
    
    // 获取等音
    getEnharmonicEquivalents(noteStr) {
        const equivalents = {
            'C#': 'Db', 'Db': 'C#',
            'D#': 'Eb', 'Eb': 'D#',
            'F#': 'Gb', 'Gb': 'F#',
            'G#': 'Ab', 'Ab': 'G#',
            'A#': 'Bb', 'Bb': 'A#'
        };
        
        if (this.hasEnharmonicEquivalent(noteStr)) {
            const equivalent = equivalents[noteStr];
            return [`${noteStr}调式`, `${equivalent}调式`];
        }
        return [`${noteStr}调式`];
    }
    
    // 解析查询并生成音阶 - 增加民族调式支持
    parseAndGenerate(query) {
        let rootNote = '';
        let scaleType = '';
        
        // 民族调式解析
        if (query.includes('宫调式') || query.includes('商调式') || query.includes('角调式') || 
            query.includes('徵调式') || query.includes('羽调式')) {
            
            // 提取主音
            rootNote = this.extractRootNote(query, '调式');
            
            // 确定调式类型
            if (query.includes('五声')) {
                if (query.includes('宫')) scaleType = 'pentatonic_gong';
                else if (query.includes('商')) scaleType = 'pentatonic_shang';
                else if (query.includes('角')) scaleType = 'pentatonic_jue';
                else if (query.includes('徵')) scaleType = 'pentatonic_zhi';
                else if (query.includes('羽')) scaleType = 'pentatonic_yu';
            }
            else if (query.includes('六声')) {
                if (query.includes('清角')) {
                    if (query.includes('宫')) scaleType = 'hexatonic_qingjiao_gong';
                    else if (query.includes('商')) scaleType = 'hexatonic_qingjiao_shang';
                    else if (query.includes('角')) scaleType = 'hexatonic_qingjiao_jue';
                    else if (query.includes('徵')) scaleType = 'hexatonic_qingjiao_zhi';
                    else if (query.includes('羽')) scaleType = 'hexatonic_qingjiao_yu';
                } else if (query.includes('变宫')) {
                    if (query.includes('宫')) scaleType = 'hexatonic_biangong_gong';
                    else if (query.includes('商')) scaleType = 'hexatonic_biangong_shang';
                    else if (query.includes('角')) scaleType = 'hexatonic_biangong_jue';
                    else if (query.includes('徵')) scaleType = 'hexatonic_biangong_zhi';
                    else if (query.includes('羽')) scaleType = 'hexatonic_biangong_yu';
                }
            }
            else if (query.includes('七声')) {
                if (query.includes('清乐')) {
                    if (query.includes('宫')) scaleType = 'qingle_gong';
                    else if (query.includes('商')) scaleType = 'qingle_shang';
                    else if (query.includes('角')) scaleType = 'qingle_jue';
                    else if (query.includes('徵')) scaleType = 'qingle_zhi';
                    else if (query.includes('羽')) scaleType = 'qingle_yu';
                } else if (query.includes('雅乐')) {
                    if (query.includes('宫')) scaleType = 'yayue_gong';
                    else if (query.includes('商')) scaleType = 'yayue_shang';
                    else if (query.includes('角')) scaleType = 'yayue_jue';
                    else if (query.includes('徵')) scaleType = 'yayue_zhi';
                    else if (query.includes('羽')) scaleType = 'yayue_yu';
                } else if (query.includes('燕乐')) {
                    if (query.includes('宫')) scaleType = 'yanyue_gong';
                    else if (query.includes('商')) scaleType = 'yanyue_shang';
                    else if (query.includes('角')) scaleType = 'yanyue_jue';
                    else if (query.includes('徵')) scaleType = 'yanyue_zhi';
                    else if (query.includes('羽')) scaleType = 'yanyue_yu';
                }
            }
            
            if (scaleType && rootNote) {
                return this.generateFolkScale(rootNote, scaleType);
            }
        }
        
        // 西洋调式解析（原有逻辑）
        if (query.includes('大调') && !query.includes('小调')) {
            if (query.includes('和声大调')) {
                scaleType = 'harmonicMajor';
                rootNote = this.extractRootNote(query, '和声大调');
            } else if (query.includes('旋律大调')) {
                scaleType = 'melodicMajor';
                rootNote = this.extractRootNote(query, '旋律大调');
            } else if (query.includes('伊奥尼亚')) {
                scaleType = 'ionian';
                rootNote = this.extractRootNote(query, '伊奥尼亚');
            } else {
                scaleType = 'major';
                rootNote = this.extractRootNote(query, '大调');
            }
        } else if (query.includes('小调')) {
            if (query.includes('和声小调')) {
                scaleType = 'harmonicMinor';
                rootNote = this.extractRootNote(query, '和声小调');
            } else if (query.includes('旋律小调')) {
                scaleType = 'melodicMinor';
                rootNote = this.extractRootNote(query, '旋律小调');
            } else if (query.includes('爱奥尼亚')) {
                scaleType = 'aeolian';
                rootNote = this.extractRootNote(query, '爱奥尼亚');
            } else {
                scaleType = 'naturalMinor';
                rootNote = this.extractRootNote(query, '小调');
            }
        } else if (query.includes('多利亚')) {
            scaleType = 'dorian';
            rootNote = this.extractRootNote(query, '多利亚');
        } else if (query.includes('弗里几亚')) {
            scaleType = 'phrygian';
            rootNote = this.extractRootNote(query, '弗里几亚');
        } else if (query.includes('利底亚')) {
            scaleType = 'lydian';
            rootNote = this.extractRootNote(query, '利底亚');
        } else if (query.includes('混合利底亚')) {
            scaleType = 'mixolydian';
            rootNote = this.extractRootNote(query, '混合利底亚');
        } else if (query.includes('洛克利亚')) {
            scaleType = 'locrian';
            rootNote = this.extractRootNote(query, '洛克利亚');
        } else if (query.includes('伊奥尼亚')) {
            scaleType = 'ionian';
            rootNote = this.extractRootNote(query, '伊奥尼亚');
        } else if (query.includes('爱奥尼亚')) {
            scaleType = 'aeolian';
            rootNote = this.extractRootNote(query, '爱奥尼亚');
        } else {
            return { error: "无法识别的音阶类型" };
        }
        
        if (!rootNote) {
            return { error: "未找到有效的主音" };
        }
        
        return this.generateScale(rootNote, scaleType);
    }
    
    // 提取主音
    extractRootNote(query, scaleTypeName) {
        const prefix = query.split(scaleTypeName)[0].trim();
        const rootMatch = prefix.match(/([A-G][#b]?)$/);
        return rootMatch ? rootMatch[1] : '';
    }
    

   // 通过音符序列分析音阶 - 改进版本
   /* 修复包含查找模式bug */
    analyzeScaleFromNotes(notesString) {
        try {
            const notes = notesString.split(/\s+/).filter(note => note.trim() !== '');
            if (notes.length < 3) {
                return { error: "至少需要三个音符来分析音阶" };
            }
            
            // 转换为Note对象
            const noteObjects = [];
            for (const noteStr of notes) {
                try {
                    noteObjects.push(this.Note.fromString(noteStr));
                } catch {
                    return { error: `无效的音符: ${noteStr}` };
                }
            }
            
            const firstNote = noteObjects[0];
            const noteIndices = noteObjects.map(note => note.getSemitones());
            const uniqueIndices = [...new Set(noteIndices)].sort((a, b) => a - b);
            
            // 尝试不同的音阶匹配，优先考虑第一个音符作为主音
            const possibleScales = [];
            
            // 西洋调式匹配
            for (const [type, pattern] of Object.entries(this.scalePatterns)) {
                // 生成以第一个音符为根音的音阶
                const rootNote = firstNote;
                const scaleNotes = [rootNote];
                
                for (let i = 0; i < pattern.length; i++) {
                    const newNote = this.addInterval(rootNote, pattern[i]);
                    scaleNotes.push(newNote);
                }
                
                const scaleIndices = scaleNotes.map(note => note.getSemitones());
                
                // 计算匹配度 - 改进算法
                const matchScore = this.calculateScaleMatchAdvanced(noteIndices, scaleIndices, notes.length);
                
                if (matchScore > 0.3) { // 降低匹配度阈值，因为可能是不完整音阶
                    const rootNoteStr = rootNote.toString();
                    const formattedNotes = scaleNotes.map(note => note.toString());
                    
                    possibleScales.push({
                        name: `${rootNoteStr}${this.scaleNames[type]}`,
                        root: rootNoteStr,
                        type: type,
                        notes: formattedNotes,
                        description: this.scaleDescriptions[type],
                        matchScore: matchScore,
                        isComplete: this.isCompleteScale(noteIndices, scaleIndices)
                    });
                }
            }
            
            // 民族调式匹配
            for (const [type, pattern] of Object.entries(this.folkScalePatterns)) {
                // 生成以第一个音符为根音的音阶
                const rootNote = firstNote;
                const scaleNotes = [rootNote];
                
                for (let i = 0; i < pattern.length; i++) {
                    const newNote = this.addInterval(rootNote, pattern[i]);
                    scaleNotes.push(newNote);
                }
                
                const scaleIndices = scaleNotes.map(note => note.getSemitones());
                
                // 计算匹配度
                const matchScore = this.calculateScaleMatchAdvanced(noteIndices, scaleIndices, notes.length);
                
                if (matchScore > 0.3) {
                    const rootNoteStr = rootNote.toString();
                    const formattedNotes = scaleNotes.map(note => note.toString());
                    
                    possibleScales.push({
                        name: `${rootNoteStr}${this.scaleNames[type]}`,
                        root: rootNoteStr,
                        type: type,
                        notes: formattedNotes,
                        description: '民族调式',
                        matchScore: matchScore,
                        isFolkScale: true,
                        isComplete: this.isCompleteScale(noteIndices, scaleIndices)
                    });
                }
            }
            
            // 如果第一个音符为主音没有找到匹配，尝试其他根音
            if (possibleScales.length === 0) {
                // 西洋调式其他根音匹配
                for (const [type, pattern] of Object.entries(this.scalePatterns)) {
                    for (let rootIndex = 0; rootIndex < 12; rootIndex++) {
                        if (rootIndex === firstNote.getSemitones()) continue; // 跳过已尝试的主音
                        
                        const rootNote = this.findNoteBySemitones('C', rootIndex);
                        const scaleNotes = [rootNote];
                        
                        for (let i = 0; i < pattern.length; i++) {
                            const newNote = this.addInterval(rootNote, pattern[i]);
                            scaleNotes.push(newNote);
                        }
                        
                        const scaleIndices = scaleNotes.map(note => note.getSemitones());
                        const matchScore = this.calculateScaleMatchAdvanced(noteIndices, scaleIndices, notes.length);
                        
                        if (matchScore > 0.5) {
                            const rootNoteStr = rootNote.toString();
                            const formattedNotes = scaleNotes.map(note => note.toString());
                            
                            possibleScales.push({
                                name: `${rootNoteStr}${this.scaleNames[type]}`,
                                root: rootNoteStr,
                                type: type,
                                notes: formattedNotes,
                                description: this.scaleDescriptions[type],
                                matchScore: matchScore,
                                isComplete: this.isCompleteScale(noteIndices, scaleIndices)
                            });
                        }
                    }
                }
                
                // 民族调式其他根音匹配
                for (const [type, pattern] of Object.entries(this.folkScalePatterns)) {
                    for (let rootIndex = 0; rootIndex < 12; rootIndex++) {
                        if (rootIndex === firstNote.getSemitones()) continue;
                        
                        const rootNote = this.findNoteBySemitones('C', rootIndex);
                        const scaleNotes = [rootNote];
                        
                        for (let i = 0; i < pattern.length; i++) {
                            const newNote = this.addInterval(rootNote, pattern[i]);
                            scaleNotes.push(newNote);
                        }
                        
                        const scaleIndices = scaleNotes.map(note => note.getSemitones());
                        const matchScore = this.calculateScaleMatchAdvanced(noteIndices, scaleIndices, notes.length);
                        
                        if (matchScore > 0.5) {
                            const rootNoteStr = rootNote.toString();
                            const formattedNotes = scaleNotes.map(note => note.toString());
                            
                            possibleScales.push({
                                name: `${rootNoteStr}${this.scaleNames[type]}`,
                                root: rootNoteStr,
                                type: type,
                                notes: formattedNotes,
                                description: '民族调式',
                                matchScore: matchScore,
                                isFolkScale: true,
                                isComplete: this.isCompleteScale(noteIndices, scaleIndices)
                            });
                        }
                    }
                }
            }
            
            // 按匹配度排序
            possibleScales.sort((a, b) => b.matchScore - a.matchScore);
            
            if (possibleScales.length === 0) {
                return { error: "无法识别此音符序列构成的音阶" };
            }
            
            return {
                inputNotes: notes,
                possibleScales: possibleScales.slice(0, 5)
            };
        } catch (error) {
            return { error: `分析音阶时出错: ${error.message}` };
        }
    }
    
    // 改进的音阶匹配度计算
    calculateScaleMatchAdvanced(inputIndices, scaleIndices, inputLength) {
        const intersection = inputIndices.filter(x => scaleIndices.includes(x));
        
        // 基础匹配度：交集音符数量与输入音符数量的比例
        let matchScore = intersection.length / inputLength;
        
        // 奖励第一个音符匹配（如果第一个输入音符是音阶主音）
        if (inputIndices[0] === scaleIndices[0]) {
            matchScore += 0.3; // 显著提高匹配度
        }
        
        // 惩罚缺失关键音符（如果输入音符很多但音阶缺少关键音符）
        if (inputLength > 5 && intersection.length < inputLength * 0.7) {
            matchScore *= 0.7;
        }
        
        // 确保匹配度不超过1
        return Math.min(matchScore, 1);
    }
    
    // 检查是否为完整音阶
    isCompleteScale(inputIndices, scaleIndices) {
        // 如果输入音符数量接近音阶音符数量，认为是完整音阶
        return inputIndices.length >= scaleIndices.length * 0.8;
    }
    
    




    // 生成音阶的详细描述
    generateScaleDescription(scale) {
        if (scale.error) {
            return scale.error;
        }
        
        let description = `🎵 ${scale.name}\n\n`;
        description += `🎼 音阶音符: ${scale.notes.join(' - ')}\n\n`;
        
        // 民族调式显示偏音信息
        if (scale.isFolkScale) {
            description += `🎶 调式类型: 民族调式\n\n`;
            if (scale.bianyin) {
                description += `🎹 偏音信息: ${scale.bianyin}\n\n`;
            }
        } else {
            // 西洋调式显示结构
            if (this.scaleDescriptions[scale.type]) {
                description += `📐 音阶结构: ${this.scaleDescriptions[scale.type]}\n\n`;
            }
            
            // 添加调号信息
            if (scale.keySignature) {
                description += `🎹 调号: ${scale.keySignature}\n\n`;
            }
        }
        
        // 添加音阶特点
        const characteristics = {
            'major': '明亮、欢快、稳定，是西方音乐中最常用的音阶',
            'naturalMinor': '悲伤、忧郁、柔和，常用于表达情感',
            'harmonicMinor': '东方色彩、神秘，第七级升高产生增二度',
            'melodicMinor': '爵士色彩、流畅，上行时第六、七级升高',
            'harmonicMajor': '独特、异国情调，降第六级产生增二度',
            'melodicMajor': '爵士、现代，上行与自然大调相同',
            'ionian': '明亮、欢快，与自然大调相同',
            'dorian': '小调但明亮、爵士，第六级升高',
            'phrygian': '西班牙、弗拉门戈，第二级降低',
            'lydian': '梦幻、太空感，第四级升高',
            'mixolydian': '布鲁斯、摇滚，第七级降低',
            'aeolian': '悲伤、忧郁，与自然小调相同',
            'locrian': '极度不稳定、紧张，第二、五级降低',
            // 民族调式特点
            'pentatonic_gong': '明亮、庄严，中国传统音乐的基础',
            'pentatonic_shang': '悲伤、抒情',
            'pentatonic_jue': '忧郁、柔和',
            'pentatonic_zhi': '欢快、明亮',
            'pentatonic_yu': '悲伤、优美'
        };
        
        description += `💡 音阶特点: ${characteristics[scale.type] || '无特殊描述'}`;
        
        return description;
    }
}

// 创建全局音阶生成器实例
const scaleGenerator = new ScaleGenerator();