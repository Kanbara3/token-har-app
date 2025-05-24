import React, { useState, useMemo, useRef } from 'react';
import CharacterFilterPanel from './CharacterFilterPanel';
import ColumnSelector from './ColumnSelector';
import CharacterTable from './CharacterTable';
import protectNames from './protectNames';

const FIELD_LABELS = {
    serial_id: '個体ID',
    sword_id: '刀帳番号',
    // symbol: '初1・極2',
    rarity: 'レア度',
    level: 'レベル',
    ranbu_level: '乱舞Lv',
    exp: '累積経験値',
    ranbu_exp: '習合数',
    // special_voice_status: '特別ボイス',
    // evol_num: '進化段階', /*初1・極0*/
    // hp: '生存',
    hp_max: '生存', /*最大生存*/
    atk: '打撃',
    def: '統率',
    mobile: '機動',
    back: '衝力',
    scout: '偵察',
    hide: '隠蔽',
    // hp_up: '生存強化',
    // atk_up: '打撃強化',
    // def_up: '統率強化',
    // mobile_up: '機動強化',
    // back_up: '衝力強化',
    // scout_up: '偵察強化',
    // hide_up: '隠蔽強化',
    loyalties: '必殺',
    fatigue: '気力',
    // equip_serial_id1: '刀装1',
    // equip_serial_id2: '刀装2',
    // equip_serial_id3: '刀装3',
    // equip_serial_id4: '刀装4',
    // horse_serial_id: '馬',
    // item_id: 'お守り',
    // artifact_serial_id1: '宝物1',
    // artifact_serial_id2: '宝物2',
    role_id: '番長',
    protect: '保護',
    // status: '状態',
    // recovered_at: '回復時刻',
    created_at: '顕現時刻',
    // burnout_status: '燃え尽き',
    // burnout_recovery_at: '燃え尽き回復',
    // is_get_artifact_usage_score: '宝物スコア取得',
};

const FIELDS = Object.keys(FIELD_LABELS);
const SORTABLE_FIELDS = [
    'serial_id', 'sword_id', 'rarity', 'level', 'ranbu_level', 'exp', 'ranbu_exp',
    'hp_max', 'atk', 'def', 'mobile', 'back', 'scout', 'hide',
    'loyalties', 'fatigue', 'role_id', 'protect', 'created_at'
];
const DISPLAY_FIELDS = [
    'serial_id', 'sword_id', 'name', 'rarity', 'level', 'ranbu_level', 'exp', 'ranbu_exp',
    'hp_max', 'atk', 'def', 'mobile', 'back', 'scout', 'hide',
    'loyalties', 'fatigue', 'role_id', 'protect', 'created_at'
];

const CharacterList = ({ characters, swordNames = {}, roleNames = {} }) => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [visibleFields, setVisibleFields] = useState(() => {
        const obj = {};
        DISPLAY_FIELDS.forEach(f => obj[f] = true);
        return obj;
    });
    // --- 絞り込み用 state ---
    const [rarityFilter, setRarityFilter] = useState([1, 2, 3, 4, 5, 6]);
    const [levelMin, setLevelMin] = useState(1);
    const [levelMax, setLevelMax] = useState(99);
    const [ranbuMin, setRanbuMin] = useState(1);
    const [ranbuMax, setRanbuMax] = useState(9);
    const [expMin, setExpMin] = useState(0);
    const [expMax, setExpMax] = useState('');
    const [ranbuExpMin, setRanbuExpMin] = useState(0);
    const [ranbuExpMax, setRanbuExpMax] = useState('');
    const [hpMaxMin, setHpMaxMin] = useState(0);
    const [hpMaxMax, setHpMaxMax] = useState('');
    const [atkMin, setAtkMin] = useState(0);
    const [atkMax, setAtkMax] = useState('');
    const [defMin, setDefMin] = useState(0);
    const [defMax, setDefMax] = useState('');
    const [mobileMin, setMobileMin] = useState(0);
    const [mobileMax, setMobileMax] = useState('');
    const [backMin, setBackMin] = useState(0);
    const [backMax, setBackMax] = useState('');
    const [scoutMin, setScoutMin] = useState(0);
    const [scoutMax, setScoutMax] = useState('');
    const [hideMin, setHideMin] = useState(0);
    const [hideMax, setHideMax] = useState('');
    const [loyaltiesMin, setLoyaltiesMin] = useState(0);
    const [loyaltiesMax, setLoyaltiesMax] = useState('');
    const [fatigueMin, setFatigueMin] = useState(0);
    const [fatigueMax, setFatigueMax] = useState(100);
    const [roleIdFilter, setRoleIdFilter] = useState('all'); // 'all', '0', 'other'
    const [protectFilter, setProtectFilter] = useState([0, 1, 2]);
    const [createdAtMin, setCreatedAtMin] = useState('');
    const [createdAtMax, setCreatedAtMax] = useState('');
    const [symbolFilter, setSymbolFilter] = useState('all');

    // --- フィルタリング ---
    const filteredChars = useMemo(() => {
        return characters.filter(char => {
            if (symbolFilter !== 'all') {
                if (String(char.symbol) !== symbolFilter) return false;
            }
            // レア度
            if (!rarityFilter.includes(Number(char.rarity))) return false;
            // レベル
            if (char.level == null || Number(char.level) < Number(levelMin) || Number(char.level) > Number(levelMax)) return false;
            // 乱舞Lv
            if (char.ranbu_level == null || Number(char.ranbu_level) < Number(ranbuMin) || Number(char.ranbu_level) > Number(ranbuMax)) return false;
            // 累積経験値
            if (char.exp == null || Number(char.exp) < Number(expMin) || (expMax !== '' && Number(char.exp) > Number(expMax))) return false;
            // 習合数
            if (char.ranbu_exp == null || Number(char.ranbu_exp) < Number(ranbuExpMin) || (ranbuExpMax !== '' && Number(char.ranbu_exp) > Number(ranbuExpMax))) return false;
            // 生存
            if (char.hp_max == null || Number(char.hp_max) < Number(hpMaxMin) || (hpMaxMax !== '' && Number(char.hp_max) > Number(hpMaxMax))) return false;
            // 打撃
            if (char.atk == null || Number(char.atk) < Number(atkMin) || (atkMax !== '' && Number(char.atk) > Number(atkMax))) return false;
            // 統率
            if (char.def == null || Number(char.def) < Number(defMin) || (defMax !== '' && Number(char.def) > Number(defMax))) return false;
            // 機動
            if (char.mobile == null || Number(char.mobile) < Number(mobileMin) || (mobileMax !== '' && Number(char.mobile) > Number(mobileMax))) return false;
            // 衝力
            if (char.back == null || Number(char.back) < Number(backMin) || (backMax !== '' && Number(char.back) > Number(backMax))) return false;
            // 偵察
            if (char.scout == null || Number(char.scout) < Number(scoutMin) || (scoutMax !== '' && Number(char.scout) > Number(scoutMax))) return false;
            // 隠蔽
            if (char.hide == null || Number(char.hide) < Number(hideMin) || (hideMax !== '' && Number(char.hide) > Number(hideMax))) return false;
            // 必殺
            if (char.loyalties == null || Number(char.loyalties) < Number(loyaltiesMin) || (loyaltiesMax !== '' && Number(char.loyalties) > Number(loyaltiesMax))) return false;
            // 気力
            if (char.fatigue == null || Number(char.fatigue) < Number(fatigueMin) || Number(char.fatigue) > Number(fatigueMax)) return false;
            // 番長
            if (roleIdFilter === '0' && String(char.role_id) !== '0') return false;
            if (roleIdFilter === 'other' && String(char.role_id) === '0') return false;
            // 保護
            if (!protectFilter.includes(Number(char.protect))) return false;
            // 顕現時刻
            if (createdAtMin && (!char.created_at || char.created_at < createdAtMin)) return false;
            if (createdAtMax && (!char.created_at || char.created_at > createdAtMax)) return false;
            return true;
        });
    }, [characters, symbolFilter, rarityFilter, levelMin, levelMax, ranbuMin, ranbuMax, expMin, expMax, ranbuExpMin, ranbuExpMax, hpMaxMin, hpMaxMax, atkMin, atkMax, defMin, defMax, mobileMin, mobileMax, backMin, backMax, scoutMin, scoutMax, hideMin, hideMax, loyaltiesMin, loyaltiesMax, fatigueMin, fatigueMax, roleIdFilter, protectFilter, createdAtMin, createdAtMax]);

    // --- ソート ---
    const sortedChars = useMemo(() => {
        if (!sortField) return filteredChars;
        const sorted = [...filteredChars].sort((a, b) => {
            let va = a[sortField];
            let vb = b[sortField];
            // null/undefinedは常に下
            if (va == null && vb == null) return 0;
            if (va == null) return 1;
            if (vb == null) return -1;
            // created_atは日付比較
            if (sortField === 'created_at') {
                va = new Date(va).getTime();
                vb = new Date(vb).getTime();
            } else if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
                va = Number(va);
                vb = Number(vb);
            } else {
                va = String(va);
                vb = String(vb);
            }
            if (va < vb) return sortOrder === 'asc' ? -1 : 1;
            if (va > vb) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredChars, sortField, sortOrder]);

    const handleSort = (field, order) => {
        setSortField(field);
        setSortOrder(order);
    };

    // チェックボックス変更時
    const handleFieldCheck = (field) => {
        setVisibleFields(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const csvDownload = () => {
        // 表示カラムのみ、順序も反映
        const columns = DISPLAY_FIELDS.filter(f => visibleFields[f]);
        if (columns.length === 0) return;
        const header = columns.map(f => f === 'name' ? '名前' : FIELD_LABELS[f]);
        const rows = sortedChars.map(char =>
            columns.map(f => {
                if (f === 'name') return swordNames[char.sword_id] || '';
                if (f === 'role_id') return roleNames[char.role_id] || '';
                if (f === 'ranbu_exp') return char[f] != null ? String(char[f]).replace(/00$/, '') : '';
                if (f === 'exp') return char[f] != null ? Number(char[f]).toLocaleString() : '';
                if (f === 'protect') return protectNames[char[f]] ?? '';
                return char[f] != null ? String(char[f]) : '';
            })
        );
        const csv = [header, ...rows].map(r => r.map(v => `"${v.replace(/"/g, '""')}"`).join(',')).join('\r\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'characters.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!characters || characters.length === 0) {
        return <div>キャラクター情報がありません</div>;
    }

    return (
        <div>
            <h2>キャラクター一覧</h2>
            <button onClick={csvDownload} style={{ marginBottom: 8 }}>表示中の表をCSVダウンロード</button>
            <CharacterFilterPanel
                symbolFilter={symbolFilter} setSymbolFilter={setSymbolFilter}
                rarityFilter={rarityFilter} setRarityFilter={setRarityFilter}
                levelMin={levelMin} setLevelMin={setLevelMin} levelMax={levelMax} setLevelMax={setLevelMax}
                ranbuMin={ranbuMin} setRanbuMin={setRanbuMin} ranbuMax={ranbuMax} setRanbuMax={setRanbuMax}
                expMin={expMin} setExpMin={setExpMin} expMax={expMax} setExpMax={setExpMax}
                ranbuExpMin={ranbuExpMin} setRanbuExpMin={setRanbuExpMin} ranbuExpMax={ranbuExpMax} setRanbuExpMax={setRanbuExpMax}
                hpMaxMin={hpMaxMin} setHpMaxMin={setHpMaxMin} hpMaxMax={hpMaxMax} setHpMaxMax={setHpMaxMax}
                atkMin={atkMin} setAtkMin={setAtkMin} atkMax={atkMax} setAtkMax={setAtkMax}
                defMin={defMin} setDefMin={setDefMin} defMax={defMax} setDefMax={setDefMax}
                mobileMin={mobileMin} setMobileMin={setMobileMin} mobileMax={mobileMax} setMobileMax={setMobileMax}
                backMin={backMin} setBackMin={setBackMin} backMax={backMax} setBackMax={setBackMax}
                scoutMin={scoutMin} setScoutMin={setScoutMin} scoutMax={scoutMax} setScoutMax={setRanbuExpMax}
                hideMin={hideMin} setHideMin={setHideMin} hideMax={hideMax} setHideMax={setHideMax}
                loyaltiesMin={loyaltiesMin} setLoyaltiesMin={setLoyaltiesMin} loyaltiesMax={loyaltiesMax} setLoyaltiesMax={setLoyaltiesMax}
                fatigueMin={fatigueMin} setFatigueMin={setFatigueMin} fatigueMax={fatigueMax} setFatigueMax={setFatigueMax}
                roleIdFilter={roleIdFilter} setRoleIdFilter={setRoleIdFilter}
                protectFilter={protectFilter} setProtectFilter={setProtectFilter}
                createdAtMin={createdAtMin} setCreatedAtMin={setCreatedAtMin} createdAtMax={createdAtMax} setCreatedAtMax={setCreatedAtMax}
            />
            <ColumnSelector
                DISPLAY_FIELDS={DISPLAY_FIELDS}
                visibleFields={visibleFields}
                handleFieldCheck={handleFieldCheck}
                FIELD_LABELS={FIELD_LABELS}
                setVisibleFields={setVisibleFields}
            />
            <CharacterTable
                sortedChars={sortedChars}
                DISPLAY_FIELDS={DISPLAY_FIELDS}
                visibleFields={visibleFields}
                FIELD_LABELS={FIELD_LABELS}
                SORTABLE_FIELDS={SORTABLE_FIELDS}
                handleSort={handleSort}
                swordNames={swordNames}
                roleNames={roleNames}
            />
        </div>
    );
};

export default CharacterList;
