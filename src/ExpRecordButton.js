import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'expRecords';

const ExpRecordPanel = ({ sortedChars, swordNames }) => {
    // キャラ名リスト（sword_id順）
    const charNames = sortedChars.map(c => swordNames[c.sword_id] || String(c.sword_id));
    const [records, setRecords] = useState([]);
    // 日付state（初期値: 今日）
    const todayStr = (() => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    })();
    const [dateStr, setDateStr] = useState(todayStr);

    // localStorageから履歴を取得
    const loadRecords = () => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            return JSON.parse(data);
        } catch {
            return [];
        }
    };

    // localStorageに履歴を保存
    const saveRecords = (records) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    };

    // 初回マウント時に履歴をロード
    useEffect(() => {
        setRecords(loadRecords());
    }, []);

    // 記録ボタン押下時
    const handleRecord = () => {
        if (!sortedChars || sortedChars.length === 0) return;
        if (!dateStr) return;
        const expRow = sortedChars.map(c => {
            if (c.exp == null || c.exp === '') return '';
            const n = Number(String(c.exp).replace(/,/g, ''));
            return isNaN(n) ? '' : n;
        });
        let newRecords = loadRecords();
        const idx = newRecords.findIndex(r => r.date === dateStr);
        if (idx >= 0) {
            newRecords[idx] = { date: dateStr, exp: expRow };
        } else {
            newRecords.push({ date: dateStr, exp: expRow });
        }
        saveRecords(newRecords);
        setRecords(newRecords);
    };

    // ダウンロードボタン押下時
    const handleDownload = () => {
        if (!records || records.length === 0) return;
        const header = ['日付', ...charNames];
        const csvRows = [header.join(',')];
        records.forEach(r => {
            csvRows.push([r.date, ...r.exp].join(','));
        });
        const csv = csvRows.join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exp_record.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // 1行削除
    const handleDelete = (date) => {
        let newRecords = loadRecords().filter(r => r.date !== date);
        saveRecords(newRecords);
        setRecords(newRecords);
    };

    // 履歴テーブル
    const renderTable = () => {
        if (!records || records.length === 0) return <div style={{ marginTop: 8 }}>記録はありません</div>;
        return (
            <table style={{ marginTop: 16, borderCollapse: 'collapse', fontSize: '0.95em' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ccc', padding: '2px 6px' }}>操作</th>
                        <th style={{ border: '1px solid #ccc', padding: '2px 6px' }}>日付</th>
                        {charNames.map((name, i) => (
                            <th key={i} style={{ border: '1px solid #ccc', padding: '2px 6px' }}>{name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {records.map((r, i) => (
                        <tr key={i}>
                            <td style={{ border: '1px solid #ccc', padding: '2px 6px' }}>
                                <button onClick={() => handleDelete(r.date)} style={{ color: 'red', fontSize: '0.9em' }}>削除</button>
                            </td>
                            <td style={{ border: '1px solid #ccc', padding: '2px 6px' }}>{r.date}</td>
                            {r.exp.map((v, j) => (
                                <td key={j} style={{ border: '1px solid #ccc', padding: '2px 6px', textAlign: 'right' }}>{v}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div style={{ margin: '16px 0' }}>
            <div style={{ marginBottom: 8 }}>
                <label>
                    日付：
                    <input
                        type="date"
                        value={dateStr}
                        onChange={e => setDateStr(e.target.value)}
                        style={{ marginLeft: 8, marginRight: 16 }}
                    />
                </label>
            </div>
            <button onClick={handleRecord} style={{ marginBottom: 8, marginRight: 8 }}>
                記録
            </button>
            <button onClick={handleDownload} style={{ marginBottom: 8 }}>
                記録ダウンロード（CSV）
            </button>
            {renderTable()}
        </div>
    );
};

export default ExpRecordPanel;
