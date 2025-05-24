import React from 'react';
import protectNames from './protectNames';

const CharacterTable = ({
    sortedChars,
    DISPLAY_FIELDS,
    visibleFields,
    FIELD_LABELS,
    SORTABLE_FIELDS,
    handleSort,
    swordNames,
    roleNames
}) => (
    <div style={{ overflowX: 'auto' }}>
        <table border="1" cellPadding="6" style={{ margin: '16px 0', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
                <tr>
                    {visibleFields['serial_id'] && (
                        <th>
                            {FIELD_LABELS.serial_id}
                            {SORTABLE_FIELDS.includes('serial_id') && (
                                <span style={{ marginLeft: 4 }}>
                                    <button onClick={() => handleSort('serial_id', 'asc')} style={{ padding: 0 }}>▲</button>
                                    <button onClick={() => handleSort('serial_id', 'desc')} style={{ padding: 0 }}>▼</button>
                                </span>
                            )}
                        </th>
                    )}
                    {visibleFields['sword_id'] && (
                        <th>
                            {FIELD_LABELS.sword_id}
                            {SORTABLE_FIELDS.includes('sword_id') && (
                                <span style={{ marginLeft: 4 }}>
                                    <button onClick={() => handleSort('sword_id', 'asc')} style={{ padding: 0 }}>▲</button>
                                    <button onClick={() => handleSort('sword_id', 'desc')} style={{ padding: 0 }}>▼</button>
                                </span>
                            )}
                        </th>
                    )}
                    {visibleFields['name'] && <th>名前</th>}
                    {DISPLAY_FIELDS.filter(f => !['serial_id', 'sword_id', 'name'].includes(f) && visibleFields[f]).map(f =>
                        <th key={f}>
                            {FIELD_LABELS[f]}
                            {SORTABLE_FIELDS.includes(f) && (
                                <span style={{ marginLeft: 4 }}>
                                    <button onClick={() => handleSort(f, 'asc')} style={{ padding: 0 }}>▲</button>
                                    <button onClick={() => handleSort(f, 'desc')} style={{ padding: 0 }}>▼</button>
                                </span>
                            )}
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {sortedChars.map((char, idx) => (
                    <tr key={char.serial_id || idx}>
                        {visibleFields['serial_id'] && <td>{char.serial_id != null ? String(char.serial_id) : ''}</td>}
                        {visibleFields['sword_id'] && <td>{char.sword_id != null ? String(char.sword_id) : ''}</td>}
                        {visibleFields['name'] && <td>{swordNames[char.sword_id] || ''}</td>}
                        {DISPLAY_FIELDS.filter(f => !['serial_id', 'sword_id', 'name'].includes(f) && visibleFields[f]).map(f =>
                            f === 'role_id'
                                ? <td key={f}>{roleNames[char.role_id] || ''}</td>
                                : f === 'ranbu_exp'
                                    ? <td key={f}>{char[f] != null ? String(char[f]).replace(/00$/, '') : ''}</td>
                                    : f === 'exp'
                                        ? <td key={f}>{char[f] != null ? Number(char[f]).toLocaleString() : ''}</td>
                                        : f === 'protect'
                                            ? <td key={f}>{protectNames[char[f]] ?? ''}</td>
                                            : <td key={f}>{char[f] != null ? String(char[f]) : ''}</td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default CharacterTable;
