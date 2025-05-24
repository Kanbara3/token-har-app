import React, { useRef, useState } from 'react';

// 抽出したいフィールド一覧
const FIELDS = [
    'serial_id', 'sword_id', 'symbol', 'rarity', 'level', 'ranbu_level', 'exp', 'ranbu_exp',
    'special_voice_status', 'evol_num', 'hp', 'hp_max', 'atk', 'def', 'mobile', 'back', 'scout', 'hide',
    'hp_up', 'atk_up', 'def_up', 'mobile_up', 'back_up', 'scout_up', 'hide_up', 'loyalties', 'fatigue',
    'equip_serial_id1', 'equip_serial_id2', 'equip_serial_id3', 'equip_serial_id4',
    'horse_serial_id', 'item_id', 'artifact_serial_id1', 'artifact_serial_id2', 'role_id', 'protect',
    'status', 'recovered_at', 'created_at', 'burnout_status', 'burnout_recovery_at', 'is_get_artifact_usage_score'
];

const HarUploader = ({ onCharactersExtracted }) => {
    const inputRef = useRef();
    const [message, setMessage] = useState('HARファイルを選択してください');

    // ファイル選択時の処理
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setMessage('ファイルを解析中...');
        let text = await file.text();
        if (!text.trim()) {
            setMessage('ファイルが空です');
            inputRef.current.value = '';
            return;
        }
        let json;
        // 1. ファイルをJSONとしてパース（失敗したらtextフィールドの中身を抜き出して再パース）
        try {
            json = JSON.parse(text);
        } catch {
            // text: "..." の部分を正規表現で抜き出す
            const match = text.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/);
            if (match) {
                // エスケープされたJSON文字列をデコード
                let jsonString = match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                try {
                    json = JSON.parse(jsonString);
                } catch {
                    setMessage('textフィールドの中身が正しいJSONではありません');
                    inputRef.current.value = '';
                    return;
                }
            } else {
                setMessage('ファイルが正しいJSON形式ではありません');
                inputRef.current.value = '';
                return;
            }
        }

        // 2. content.textの中にキャラクター情報が入っている場合はさらにパース
        let charRoot = json;
        if (json.content && typeof json.content.text === 'string') {
            try {
                charRoot = JSON.parse(json.content.text);
            } catch {
                setMessage('content.textの中身が正しいJSONではありません');
                inputRef.current.value = '';
                return;
            }
        }

        // 3. キャラクター情報の抽出
        // 例: charRoot.sword.sword のような構造を想定
        let charObjs = [];
        if (charRoot.sword && charRoot.sword.sword) {
            charObjs = Object.values(charRoot.sword.sword);
        } else if (charRoot.sword) {
            charObjs = Object.values(charRoot.sword);
        } else if (charRoot.sword_list) {
            charObjs = charRoot.sword_list;
        } else if (Array.isArray(charRoot)) {
            charObjs = charRoot;
        } else if (typeof charRoot === 'object') {
            charObjs = Object.values(charRoot);
        }

        // 4. 必要なフィールドだけ抽出
        const characters = charObjs.filter(obj => obj && typeof obj === 'object' && obj.sword_id !== undefined)
            .map(obj => {
                const filtered = {};
                FIELDS.forEach(f => filtered[f] = obj[f] ?? null);
                return filtered;
            });

        // 5. 結果を親に渡す
        onCharactersExtracted(characters);
        setMessage(characters.length > 0 ? 'ファイルの解析が完了しました' : 'キャラクター情報が見つかりませんでした');
        inputRef.current.value = '';
        setTimeout(() => setMessage('HARファイルを選択してください'), 2000);

        // HARファイル(log.entries)の場合は全entriesを走査してキャラクターデータを抽出
        let allCharObjs = [];
        if (json.log && Array.isArray(json.log.entries)) {
            for (const entry of json.log.entries) {
                // response.content.text のみ確認
                if (typeof entry?.response?.content?.text === 'string' && entry.response.content.text.trim()) {
                    const contentText = entry.response.content.text;
                    let entryJson;
                    try {
                        entryJson = JSON.parse(contentText);
                    } catch {
                        continue; // パースできない場合はスキップ
                    }
                    let charRoot = entryJson;
                    if (entryJson.content && typeof entryJson.content.text === 'string') {
                        try {
                            charRoot = JSON.parse(entryJson.content.text);
                        } catch {
                            continue;
                        }
                    }
                    let charObjs = [];
                    if (charRoot.sword && charRoot.sword.sword) {
                        charObjs = Object.values(charRoot.sword.sword);
                    } else if (charRoot.sword) {
                        charObjs = Object.values(charRoot.sword);
                    } else if (charRoot.sword_list) {
                        charObjs = charRoot.sword_list;
                    } else if (Array.isArray(charRoot)) {
                        charObjs = charRoot;
                    } else if (typeof charRoot === 'object') {
                        charObjs = Object.values(charRoot);
                    }
                    // 必要なフィールドだけ抽出
                    const filtered = charObjs.filter(obj => obj && typeof obj === 'object' && obj.sword_id !== undefined)
                        .map(obj => {
                            const filtered = {};
                            FIELDS.forEach(f => filtered[f] = obj[f] ?? null);
                            return filtered;
                        });
                    allCharObjs.push(...filtered);
                }
            }
            // 重複排除（serial_idでユニーク化）
            const unique = {};
            allCharObjs.forEach(obj => {
                if (obj.serial_id != null) unique[obj.serial_id] = obj;
            });
            const characters = Object.values(unique);
            onCharactersExtracted(characters);
            setMessage(characters.length > 0 ? 'ファイルの解析が完了しました' : 'キャラクター情報が見つかりませんでした');
            inputRef.current.value = '';
            setTimeout(() => setMessage('HARファイルを選択してください'), 2000);
            return;
        }
    };

    return (
        <div style={{ margin: '20px 0' }}>
            <input ref={inputRef} type="file" accept=".txt,.json,.har" onChange={handleFileChange} />
            <p>{message}</p>
        </div>
    );
};

export default HarUploader;
