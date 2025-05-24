import React from 'react';
import protectNames from './protectNames';

const CharacterFilterPanel = ({
    rarityFilter, setRarityFilter,
    levelMin, setLevelMin, levelMax, setLevelMax,
    ranbuMin, setRanbuMin, ranbuMax, setRanbuMax,
    expMin, setExpMin, expMax, setExpMax,
    ranbuExpMin, setRanbuExpMin, ranbuExpMax, setRanbuExpMax,
    hpMaxMin, setHpMaxMin, hpMaxMax, setHpMaxMax,
    atkMin, setAtkMin, atkMax, setAtkMax,
    defMin, setDefMin, defMax, setDefMax,
    mobileMin, setMobileMin, mobileMax, setMobileMax,
    backMin, setBackMin, backMax, setBackMax,
    scoutMin, setScoutMin, scoutMax, setScoutMax,
    hideMin, setHideMin, hideMax, setHideMax,
    loyaltiesMin, setLoyaltiesMin, loyaltiesMax, setLoyaltiesMax,
    fatigueMin, setFatigueMin, fatigueMax, setFatigueMax,
    roleIdFilter, setRoleIdFilter,
    protectFilter, setProtectFilter,
    createdAtMin, setCreatedAtMin, createdAtMax, setCreatedAtMax,
    symbolFilter, setSymbolFilter,
}) => (
    <div style={{ background: '#f7f7f7', padding: '8px 12px', marginBottom: 8, borderRadius: 6, textAlign: 'left', fontSize: 14 }}>
        <span style={{ marginRight: 16 }}>
            <b>種別</b>：
            <label><input type="radio" name="symbol" value="all" checked={symbolFilter === 'all'} onChange={() => setSymbolFilter('all')} />全て</label>
            <label><input type="radio" name="symbol" value="1" checked={symbolFilter === '1'} onChange={() => setSymbolFilter('1')} />初</label>
            <label><input type="radio" name="symbol" value="2" checked={symbolFilter === '2'} onChange={() => setSymbolFilter('2')} />極</label>
        </span>
        <span style={{ marginRight: 16 }}>
            <b>レア度</b>：
            {[1, 2, 3, 4, 5, 6].map(r => (
                <label key={r} style={{ marginRight: 4 }}>
                    <input type="checkbox" checked={rarityFilter.includes(r)} onChange={e => {
                        setRarityFilter(prev => e.target.checked ? [...prev, r] : prev.filter(x => x !== r));
                    }} />{r}
                </label>
            ))}
        </span>
        <span style={{ marginRight: 16 }}>
            <b>レベル</b>：
            <input type="number" min={1} max={99} value={levelMin} onChange={e => setLevelMin(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} style={{ width: 40 }} /> ～
            <input type="number" min={1} max={99} value={levelMax} onChange={e => setLevelMax(Math.max(1, Math.min(99, Number(e.target.value) || 99)))} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>乱舞Lv</b>：
            <input type="number" min={1} value={ranbuMin} onChange={e => setRanbuMin(Number(e.target.value) || 1)} style={{ width: 40 }} /> ～
            <input type="number" min={1} value={ranbuMax} onChange={e => setRanbuMax(Number(e.target.value) || 9)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>累積経験値</b>：
            <input type="number" min={0} value={expMin} onChange={e => setExpMin(Number(e.target.value) || 0)} style={{ width: 70 }} /> ～
            <input type="number" min={0} value={expMax} onChange={e => setExpMax(e.target.value)} style={{ width: 70 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>習合数</b>：
            <input type="number" min={0} value={ranbuExpMin} onChange={e => setRanbuExpMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={ranbuExpMax} onChange={e => setRanbuExpMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>生存</b>：
            <input type="number" min={0} value={hpMaxMin} onChange={e => setHpMaxMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={hpMaxMax} onChange={e => setHpMaxMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>打撃</b>：
            <input type="number" min={0} value={atkMin} onChange={e => setAtkMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={atkMax} onChange={e => setAtkMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>統率</b>：
            <input type="number" min={0} value={defMin} onChange={e => setDefMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={defMax} onChange={e => setDefMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>機動</b>：
            <input type="number" min={0} value={mobileMin} onChange={e => setMobileMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={mobileMax} onChange={e => setMobileMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>衝力</b>：
            <input type="number" min={0} value={backMin} onChange={e => setBackMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={backMax} onChange={e => setBackMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>偵察</b>：
            <input type="number" min={0} value={scoutMin} onChange={e => setScoutMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={scoutMax} onChange={e => setScoutMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>隠蔽</b>：
            <input type="number" min={0} value={hideMin} onChange={e => setHideMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={hideMax} onChange={e => setHideMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>必殺</b>：
            <input type="number" min={0} value={loyaltiesMin} onChange={e => setLoyaltiesMin(Number(e.target.value) || 0)} style={{ width: 40 }} /> ～
            <input type="number" min={0} value={loyaltiesMax} onChange={e => setLoyaltiesMax(e.target.value)} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>気力</b>：
            <input type="number" min={0} max={100} value={fatigueMin} onChange={e => setFatigueMin(Math.max(0, Math.min(100, Number(e.target.value) || 0)))} style={{ width: 40 }} /> ～
            <input type="number" min={0} max={100} value={fatigueMax} onChange={e => setFatigueMax(Math.max(0, Math.min(100, Number(e.target.value) || 100)))} style={{ width: 40 }} />
        </span>
        <span style={{ marginRight: 16 }}>
            <b>番長</b>：
            <label><input type="radio" name="role_id" value="all" checked={roleIdFilter === 'all'} onChange={() => setRoleIdFilter('all')} />全て</label>
            {/* <label><input type="radio" name="role_id" value="0" checked={roleIdFilter === '0'} onChange={() => setRoleIdFilter('0')} />0のみ</label> */}
            <label><input type="radio" name="role_id" value="other" checked={roleIdFilter === 'other'} onChange={() => setRoleIdFilter('other')} />番長</label>
        </span>
        <span style={{ marginRight: 16 }}>
            <b>保護</b>：
            {[0, 1, 2].map(p => (
                <label key={p} style={{ marginRight: 4 }}>
                    <input type="checkbox" checked={protectFilter.includes(p)} onChange={e => {
                        setProtectFilter(prev => e.target.checked ? [...prev, p] : prev.filter(x => x !== p));
                    }} />{protectNames[p] !== '' ? protectNames[p] : p}
                </label>
            ))}
        </span>
        <span style={{ marginRight: 16 }}>
            <b>顕現時刻</b>：
            <input type="date" value={createdAtMin} onChange={e => setCreatedAtMin(e.target.value)} /> ～
            <input type="date" value={createdAtMax} onChange={e => setCreatedAtMax(e.target.value)} />
        </span>
    </div>
);

export default CharacterFilterPanel;
