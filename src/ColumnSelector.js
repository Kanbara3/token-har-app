import React from 'react';

const ColumnSelector = ({ DISPLAY_FIELDS, visibleFields, handleFieldCheck, FIELD_LABELS, setVisibleFields }) => (
    <div style={{ margin: '8px 0', textAlign: 'left' }}>
        <button onClick={() => {
            const obj = {};
            DISPLAY_FIELDS.forEach(f => obj[f] = false);
            setVisibleFields(obj);
        }} style={{ marginRight: 8 }}>全て非表示</button>
        <button onClick={() => {
            const obj = {};
            DISPLAY_FIELDS.forEach(f => obj[f] = true);
            setVisibleFields(obj);
        }} style={{ marginRight: 16 }}>全て表示</button>
        {DISPLAY_FIELDS.map(f => (
            <label key={f} style={{ marginRight: 12 }}>
                <input
                    type="checkbox"
                    checked={visibleFields[f]}
                    onChange={() => handleFieldCheck(f)}
                />
                {f === 'name' ? '名前' : FIELD_LABELS[f]}
            </label>
        ))}
    </div>
);

export default ColumnSelector;
