// NextUp Workout Tracker — app.js
// No Babel. Uses htm (tagged template literal JSX) + React UMD + SheetJS (XLSX)

const { useState, useEffect, useRef, useCallback } = React;
const html = htm.bind(React.createElement);

const C = {
    bg: '#121212', card: '#1E1F22', secondary: '#2B2C30',
    yellow: '#E6FD1E', orange: '#FF4A1C', white: '#FFFFFF',
    gray: '#8E8E93', teal: '#76C4CD', red: '#FF3B30',
};

// ─── Default workout data ────────────────────────────────────────────────────
const DEFAULT_WORKOUTS = [
    {
        id: 'warmup', name: 'Warm-Up', icon: '🔥',
        exercises: [
            { id:1, name:'Stair Machine / Bike',  sets:1, reps:'5–7 min',   weight:0,  rest:0,  notes:'Light cardio — mild sweat only.' },
            { id:2, name:'Band Pull-Aparts',       sets:2, reps:'15',        weight:0,  rest:30, notes:'Arms straight, pull to T. Wakes up rear delts.' },
            { id:3, name:'Dead Hang',              sets:2, reps:'20–30 sec', weight:0,  rest:30, notes:'Decompresses spine, activates grip & lats.' },
            { id:4, name:'Dynamic Stretches',      sets:1, reps:'3 min',     weight:0,  rest:0,  notes:'Leg swings, hip circles, torso twists.' },
        ]
    },
    {
        id: 'push_a', name: 'Push (A)', icon: '💪',
        exercises: [
            { id:1, name:'DB Bench Press',          sets:4, reps:'8–10',  weight:20, rest:90, notes:'Retract shoulder blades. 3-sec descent.' },
            { id:2, name:'Incline DB Press',        sets:3, reps:'10–12', weight:14, rest:75, notes:'30–45° incline. Feel upper pec, not shoulder.' },
            { id:3, name:'DB Shoulder Press',       sets:3, reps:'8–10',  weight:12, rest:75, notes:'Seated 90°. Elbows at ear level at bottom.' },
            { id:4, name:'DB Lateral Raise',        sets:3, reps:'12–15', weight:6,  rest:45, notes:'15° hip hinge. Lead elbows. 2-sec hold at top.' },
            { id:5, name:'Cable Tricep Pushdown',   sets:3, reps:'12–15', weight:13, rest:45, notes:'Arms fixed. Fully extend and squeeze.' },
            { id:6, name:'Overhead DB Tricep Ext.', sets:2, reps:'12–15', weight:10, rest:45, notes:'Both hands grip one DB. Hits long head.' },
        ]
    },
    {
        id: 'pull_b', name: 'Pull (B)', icon: '🔙',
        exercises: [
            { id:1, name:'Single-Arm DB Row',    sets:4, reps:'8–10',  weight:20, rest:90, notes:'Pull elbow to hip. 1-sec pause at top.' },
            { id:2, name:'Seated Cable Row',     sets:3, reps:'10–12', weight:35, rest:75, notes:'Neutral grip. Squeeze blades 2 sec.' },
            { id:3, name:'Face Pulls (Cable)',   sets:3, reps:'15',    weight:5,  rest:45, notes:'Pull to forehead, elbows flared high.' },
            { id:4, name:'DB Rear Delt Fly',     sets:3, reps:'12–15', weight:6,  rest:45, notes:'Hinge 45°. Lead with elbows.' },
            { id:5, name:'DB Pullover',          sets:3, reps:'12–15', weight:14, rest:45, notes:'Arc DB behind head. Slight elbow bend.' },
            { id:6, name:'DB Bicep Curl',        sets:3, reps:'10–12', weight:12, rest:45, notes:'Supinate wrist at top. No swinging.' },
            { id:7, name:'Hanging Knee Raise',   sets:3, reps:'10–15', weight:0,  rest:45, notes:'Slow. Draw knees to chest, lower 3 sec.' },
        ]
    },
    {
        id: 'legs', name: 'Legs', icon: '🦵',
        exercises: [
            { id:1, name:'Leg Press (Machine)',      sets:4, reps:'10–12', weight:100, rest:90, notes:'Feet shoulder-width, mid-plate.' },
            { id:2, name:'Bulgarian Split Squat',    sets:3, reps:'10/leg', weight:16, rest:75, notes:'3-sec descent. Upright = quad, lean = glute.' },
            { id:3, name:'Goblet Squat',             sets:3, reps:'10–12', weight:14, rest:60, notes:'DB at chest. Heels flat, chest up.' },
            { id:4, name:'Lying Leg Curl (Machine)', sets:3, reps:'12',    weight:40, rest:60, notes:'Full ROM, slow lowering.' },
            { id:5, name:'Standing Calf Raise',      sets:3, reps:'15–20', weight:0,  rest:45, notes:'2-sec up, 2-sec pause, 3-sec down.' },
        ]
    },
    {
        id: 'core', name: 'Core Finisher', icon: '⚡',
        exercises: [
            { id:1, name:'Plank',             sets:3, reps:'30–45 sec', weight:0, rest:45, notes:'Squeeze glutes AND abs simultaneously.' },
            { id:2, name:'Weighted Sit-Up',   sets:3, reps:'12–15',    weight:5, rest:45, notes:'2-sec up, 3-sec down. Don\'t yank neck.' },
            { id:3, name:'Cable/DB Woodchop', sets:3, reps:'12/side',  weight:5, rest:45, notes:'High-to-low diagonal. Oblique focus.' },
            { id:4, name:'Reverse Crunch',    sets:3, reps:'12–15',    weight:0, rest:45, notes:'Lift hips off floor. Lower abs emphasis.' },
        ]
    },
    {
        id: 'home', name: 'Home Evening', icon: '🏠',
        exercises: [
            { id:1, name:'Glute Bridge',          sets:2, reps:'15',     weight:0,  rest:30, notes:'Squeeze 2 sec at top.' },
            { id:2, name:'Bulgarian Split Squat', sets:3, reps:'10/leg', weight:16, rest:60, notes:'Rear foot on sofa. 3-sec descent.' },
            { id:3, name:'DB Sumo Squat',         sets:3, reps:'12',     weight:18, rest:45, notes:'Wide stance, toes 45°. Hold DB vertically.' },
            { id:4, name:'DB Goblet Squat',       sets:3, reps:'12',     weight:14, rest:45, notes:'Hold DB at chest. Heels flat.' },
            { id:5, name:'Standing Calf Raise',   sets:2, reps:'20',     weight:16, rest:30, notes:'2-sec hold at top, 3-sec lower.' },
        ]
    },
];

// ─── Storage helpers ─────────────────────────────────────────────────────────
const LS = {
    get: (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    img: (wid, eid) => localStorage.getItem(`img_${wid}_${eid}`) || null,
    setImg: (wid, eid, url) => url ? localStorage.setItem(`img_${wid}_${eid}`, url) : localStorage.removeItem(`img_${wid}_${eid}`),
};

function loadWorkouts() {
    return LS.get('nextup_workouts_v1', DEFAULT_WORKOUTS.map(w => ({ ...w, exercises: w.exercises.map(e => ({ ...e })) })));
}

function fmt(s) { return `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`; }

function readFile(file) {
    return new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });
}

// ─── Excel template download ─────────────────────────────────────────────────
function downloadTemplate(workouts) {
    const wb = XLSX.utils.book_new();

    // Instructions sheet
    const instrData = [
        ['NextUp Workout Tracker — Import Template'],
        [''],
        ['HOW TO USE:'],
        ['1. Edit the "Workouts" sheet below with your exercises'],
        ['2. Do NOT change the column headers (row 1)'],
        ['3. Group: the workout group name (e.g. Push (A))'],
        ['4. GroupIcon: an emoji for the group (e.g. 💪)'],
        ['5. GroupID: a short unique ID, no spaces (e.g. push_a) — keep existing ones to preserve images'],
        ['6. Exercise: exercise name'],
        ['7. Sets: number (e.g. 3)'],
        ['8. Reps: text (e.g. 8-10 or 30 sec)'],
        ['9. Weight_kg: number (0 = bodyweight)'],
        ['10. Rest_sec: rest seconds after each set (0 = no rest)'],
        ['11. Notes: optional form tips'],
        [''],
        ['Save as .xlsx and upload in the app → Import / Export → Upload Excel'],
    ];
    const instrSheet = XLSX.utils.aoa_to_sheet(instrData);
    instrSheet['!cols'] = [{ wch: 70 }];
    XLSX.utils.book_append_sheet(wb, instrSheet, 'Instructions');

    // Workouts sheet — flatten current workouts
    const headers = ['GroupID','GroupIcon','Group','#','Exercise','Sets','Reps','Weight_kg','Rest_sec','Notes'];
    const rows = [headers];
    workouts.forEach(w => {
        w.exercises.forEach((ex, i) => {
            rows.push([
                w.id, w.icon, w.name,
                i+1, ex.name, ex.sets, ex.reps, ex.weight, ex.rest, ex.notes||''
            ]);
        });
    });
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [12,6,14,4,28,6,10,10,8,40].map(wch=>({wch}));
    // Style header row (just bold via cell comment — SheetJS lite doesn't do rich styling without pro)
    XLSX.utils.book_append_sheet(wb, ws, 'Workouts');

    XLSX.writeFile(wb, 'NextUp_Template.xlsx');
}

// ─── Excel import parser ─────────────────────────────────────────────────────
function parseImportedXlsx(arrayBuffer) {
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    const ws = wb.Sheets['Workouts'];
    if (!ws) throw new Error('Sheet "Workouts" not found');
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

    const groupMap = {};
    const groupOrder = [];

    rows.forEach((row, i) => {
        const gid   = String(row['GroupID']   || '').trim() || `group_${i}`;
        const gicon = String(row['GroupIcon'] || '🏋️').trim();
        const gname = String(row['Group']     || 'Unnamed').trim();
        const exName = String(row['Exercise'] || '').trim();
        if (!exName) return;

        if (!groupMap[gid]) {
            groupMap[gid] = { id: gid, icon: gicon, name: gname, exercises: [] };
            groupOrder.push(gid);
        }

        const newId = groupMap[gid].exercises.length + 1;
        groupMap[gid].exercises.push({
            id: newId,
            name: exName,
            sets:   parseInt(row['Sets'])      || 3,
            reps:   String(row['Reps']         || '10–12').trim(),
            weight: parseFloat(row['Weight_kg'])|| 0,
            rest:   parseInt(row['Rest_sec'])   || 60,
            notes:  String(row['Notes']        || '').trim(),
        });
    });

    if (groupOrder.length === 0) throw new Error('No exercise rows found in the Workouts sheet');
    return groupOrder.map(id => groupMap[id]);
}

// ─── Confirm DELETE modal ────────────────────────────────────────────────────
function DeleteGroupModal({ groupName, onConfirm, onCancel }) {
    const [typed, setTyped] = useState('');
    const ok = typed === 'DELETE';
    return html`
        <div class="modal-overlay" onClick=${onCancel}>
            <div class="modal-box" onClick=${e => e.stopPropagation()}>
                <h3 style=${{ color: C.red, fontSize:'18px', marginBottom:'10px' }}>Delete Group</h3>
                <p style=${{ color: C.gray, fontSize:'13px', marginBottom:'16px', lineHeight:'1.5' }}>
                    This will permanently delete <strong style=${{ color:C.white }}>${groupName}</strong> and all its exercises.<br/>
                    Type <strong style=${{ color:C.red }}>DELETE</strong> to confirm.
                </p>
                <input type="text" value=${typed}
                    onInput=${e => setTyped(e.target.value)}
                    placeholder="Type DELETE"
                    style=${{
                        width:'100%', background: C.secondary, border:`1px solid ${ok ? C.red : C.secondary}`,
                        color: C.white, padding:'10px', borderRadius:'8px',
                        fontSize:'15px', marginBottom:'16px', letterSpacing:'1px'
                    }} />
                <div style=${{ display:'flex', gap:'10px' }}>
                    <button onClick=${onCancel} style=${{
                        flex:1, background:'transparent', color:C.gray,
                        border:`1px solid ${C.secondary}`, padding:'11px',
                        borderRadius:'8px', fontSize:'14px'
                    }}>Cancel</button>
                    <button onClick=${ok ? onConfirm : undefined}
                        style=${{
                            flex:1, background: ok ? C.red : C.secondary,
                            color: ok ? C.white : C.gray,
                            border:'none', padding:'11px', borderRadius:'8px',
                            fontSize:'14px', fontWeight:'700',
                            cursor: ok ? 'pointer' : 'not-allowed', opacity: ok ? 1 : 0.6
                        }}>Delete</button>
                </div>
            </div>
        </div>
    `;
}

// ─── Confirm exercise delete modal ───────────────────────────────────────────
function ConfirmModal({ message, onConfirm, onCancel }) {
    return html`
        <div class="modal-overlay" onClick=${onCancel}>
            <div class="modal-box" onClick=${e => e.stopPropagation()}>
                <p style=${{ color: C.white, fontSize:'15px', marginBottom:'20px', lineHeight:'1.5' }}>${message}</p>
                <div style=${{ display:'flex', gap:'10px' }}>
                    <button onClick=${onCancel} style=${{
                        flex:1, background:'transparent', color:C.gray,
                        border:`1px solid ${C.secondary}`, padding:'11px',
                        borderRadius:'8px', fontSize:'14px'
                    }}>Cancel</button>
                    <button onClick=${onConfirm} style=${{
                        flex:1, background: C.orange, color: C.white,
                        border:'none', padding:'11px', borderRadius:'8px',
                        fontSize:'14px', fontWeight:'700'
                    }}>Delete</button>
                </div>
            </div>
        </div>
    `;
}

// ─── Home Screen ─────────────────────────────────────────────────────────────
function HomeScreen({ workouts, history, onStart, onEdit, onAddGroup, onImport }) {
    return html`
        <div class="screen">
            <!-- Header -->
            <div style=${{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
                <img src="images/icon.png" style=${{ width:'42px', height:'42px', borderRadius:'10px' }} />
                <h1 style=${{ fontSize:'26px', fontWeight:'700', color:C.yellow }}>NextUp</h1>
            </div>
            <p style=${{ color:C.gray, fontSize:'13px', marginBottom:'22px' }}>Flexible training tracker</p>

            <!-- Recent history chips -->
            ${history.length > 0 && html`
                <div style=${{ marginBottom:'22px' }}>
                    <p style=${{ color:C.gray, fontSize:'10px', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>Recent</p>
                    <div style=${{ display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px' }}>
                        ${history.slice(0,6).map((h,i) => {
                            const w = workouts.find(w => w.id === h.id);
                            return html`
                                <div key=${i} style=${{
                                    background:C.card, border:`1px solid ${C.secondary}`,
                                    padding:'5px 10px', borderRadius:'20px', fontSize:'11px',
                                    whiteSpace:'nowrap', color:C.gray, flexShrink:0
                                }}>${w?.icon||'🏋️'} ${h.date}</div>`;
                        })}
                    </div>
                </div>
            `}

            <!-- Workout cards -->
            <div style=${{ display:'grid', gap:'10px', marginBottom:'14px' }}>
                ${workouts.map(w => html`
                    <div key=${w.id} style=${{
                        background:C.card, border:`1px solid ${C.secondary}`,
                        borderRadius:'12px', padding:'14px 16px'
                    }}>
                        <div style=${{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'3px' }}>
                            <span style=${{ fontSize:'18px' }}>${w.icon}</span>
                            <h2 style=${{ fontSize:'15px', fontWeight:'700', margin:0 }}>${w.name}</h2>
                        </div>
                        <p style=${{ fontSize:'11px', color:C.gray, margin:'0 0 10px 0' }}>
                            ${w.exercises.length} exercise${w.exercises.length!==1?'s':''}
                        </p>
                        <div style=${{ display:'flex', gap:'8px' }}>
                            <button onClick=${() => onStart(w.id)} style=${{
                                flex:4, background:C.yellow, color:C.bg,
                                padding:'10px', borderRadius:'8px', border:'none',
                                fontSize:'14px', fontWeight:'700'
                            }}>▶ Start</button>
                            <button onClick=${() => onEdit(w.id)} style=${{
                                flex:1, background:'transparent', color:C.gray,
                                padding:'10px', borderRadius:'8px',
                                border:`1px solid ${C.secondary}`, fontSize:'13px'
                            }}>✏️</button>
                        </div>
                    </div>
                `)}
            </div>

            <!-- Bottom actions -->
            <div style=${{ display:'flex', gap:'8px' }}>
                <button onClick=${onAddGroup} style=${{
                    flex:1, background:'transparent', color:C.teal,
                    padding:'11px', borderRadius:'10px',
                    border:`1px dashed ${C.teal}`, fontSize:'13px', fontWeight:'500'
                }}>+ Add Group</button>
                <button onClick=${onImport} style=${{
                    flex:1, background:'transparent', color:C.gray,
                    padding:'11px', borderRadius:'10px',
                    border:`1px solid ${C.secondary}`, fontSize:'13px'
                }}>📥 Import / Export</button>
            </div>
        </div>
    `;
}

// ─── Edit Screen ─────────────────────────────────────────────────────────────
function EditScreen({ workout, onSave, onBack, onDeleteGroup }) {
    const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(workout)));
    const [images, setImages] = useState(() => {
        const imgs = {};
        workout.exercises.forEach(e => { const img = LS.img(workout.id, e.id); if (img) imgs[e.id] = img; });
        return imgs;
    });
    const [confirmDelete, setConfirmDelete] = useState(null); // idx of exercise to delete
    const [showDeleteGroup, setShowDeleteGroup] = useState(false);

    function updateEx(idx, field, val) {
        setLocal(l => {
            const n = JSON.parse(JSON.stringify(l));
            n.exercises[idx][field] = val;
            return n;
        });
    }

    function addEx() {
        setLocal(l => {
            const n = JSON.parse(JSON.stringify(l));
            const newId = (Math.max(...n.exercises.map(e=>e.id), 0)) + 1;
            n.exercises.push({ id:newId, name:'New Exercise', sets:3, reps:'10–12', weight:10, rest:60, notes:'' });
            return n;
        });
    }

    function deleteEx(idx) {
        setLocal(l => {
            const n = JSON.parse(JSON.stringify(l));
            n.exercises.splice(idx, 1);
            return n;
        });
        setConfirmDelete(null);
    }

    async function handleImgUpload(exId, file) {
        if (!file) return;
        const url = await readFile(file);
        LS.setImg(workout.id, exId, url);
        setImages(p => ({ ...p, [exId]: url }));
    }

    function removeImg(exId) {
        LS.setImg(workout.id, exId, null);
        setImages(p => { const n={...p}; delete n[exId]; return n; });
    }

    const inp = { background:C.secondary, border:'none', color:C.white, padding:'6px 8px', borderRadius:'6px', fontSize:'12px' };

    return html`
        <div class="screen">
            ${confirmDelete !== null && html`
                <${ConfirmModal}
                    message="Delete \"${local.exercises[confirmDelete]?.name}\"?"
                    onConfirm=${() => deleteEx(confirmDelete)}
                    onCancel=${() => setConfirmDelete(null)}
                />
            `}
            ${showDeleteGroup && html`
                <${DeleteGroupModal}
                    groupName=${local.name}
                    onConfirm=${() => { setShowDeleteGroup(false); onDeleteGroup(); }}
                    onCancel=${() => setShowDeleteGroup(false)}
                />
            `}

            <div style=${{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h1 style=${{ fontSize:'19px', fontWeight:'700', margin:0 }}>${local.icon} ${local.name}</h1>
                <button onClick=${onBack} style=${{ background:'transparent', color:C.gray, border:'none', fontSize:'22px' }}>✕</button>
            </div>

            <!-- Group icon + name -->
            <div style=${{ display:'flex', gap:'8px', marginBottom:'14px' }}>
                <input type="text" value=${local.icon}
                    onInput=${e => setLocal(p => ({...p, icon:e.target.value}))}
                    style=${{ ...inp, width:'50px', textAlign:'center', fontSize:'20px' }} />
                <input type="text" value=${local.name}
                    onInput=${e => setLocal(p => ({...p, name:e.target.value}))}
                    style=${{ ...inp, flex:1, fontSize:'14px' }}
                    placeholder="Group name" />
            </div>

            <!-- Exercises -->
            <div style=${{ display:'grid', gap:'10px', marginBottom:'12px' }}>
                ${local.exercises.map((ex, idx) => html`
                    <div key=${ex.id} style=${{
                        background:C.card, border:`1px solid ${C.secondary}`,
                        borderRadius:'12px', padding:'12px'
                    }}>
                        <div style=${{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                            <span style=${{ fontSize:'12px', fontWeight:'600', color:C.teal }}>#${idx+1}</span>
                            <button onClick=${() => setConfirmDelete(idx)}
                                style=${{ background:'transparent', color:C.orange, border:'none', fontSize:'16px', padding:'2px 6px' }}>🗑</button>
                        </div>

                        <input type="text" value=${ex.name}
                            onInput=${e => updateEx(idx,'name',e.target.value)}
                            style=${{ ...inp, width:'100%', marginBottom:'8px', fontSize:'13px' }}
                            placeholder="Exercise name" />

                        <div style=${{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:'6px', marginBottom:'8px' }}>
                            ${[
                                {label:'Sets', field:'sets', type:'number'},
                                {label:'Reps', field:'reps', type:'text'},
                                {label:'kg',   field:'weight', type:'number'},
                                {label:'Rest s', field:'rest', type:'number'},
                            ].map(col => html`
                                <div key=${col.field}>
                                    <p style=${{ fontSize:'9px', color:C.gray, margin:'0 0 2px 0', textTransform:'uppercase' }}>${col.label}</p>
                                    <input type=${col.type} value=${ex[col.field]}
                                        onInput=${e => updateEx(idx, col.field, col.type==='number' ? (parseFloat(e.target.value)||0) : e.target.value)}
                                        style=${{ ...inp, width:'100%' }} />
                                </div>
                            `)}
                        </div>

                        <textarea value=${ex.notes||''} rows="2"
                            onInput=${e => updateEx(idx,'notes',e.target.value)}
                            placeholder="Form tips / notes..."
                            style=${{ ...inp, width:'100%', resize:'none', lineHeight:'1.4', marginBottom:'8px' }}
                        ></textarea>

                        ${images[ex.id]
                            ? html`
                                <div style=${{ position:'relative' }}>
                                    <img src=${images[ex.id]} class="img-thumb" />
                                    <button onClick=${() => removeImg(ex.id)} style=${{
                                        position:'absolute', top:'8px', right:'4px',
                                        background:'rgba(0,0,0,0.75)', color:C.orange,
                                        border:'none', borderRadius:'50%',
                                        width:'22px', height:'22px', fontSize:'11px'
                                    }}>✕</button>
                                </div>`
                            : html`
                                <label class="img-upload-btn">
                                    📷 Upload image
                                    <input type="file" accept="image/*" style=${{ display:'none' }}
                                        onChange=${e => handleImgUpload(ex.id, e.target.files[0])} />
                                </label>`
                        }
                    </div>
                `)}
            </div>

            <button onClick=${addEx} style=${{
                width:'100%', background:C.secondary, color:C.teal,
                padding:'11px', borderRadius:'10px',
                border:`1px dashed ${C.teal}`, fontSize:'13px', marginBottom:'10px'
            }}>+ Add Exercise</button>

            <button onClick=${() => onSave(local)} style=${{
                width:'100%', background:C.yellow, color:C.bg,
                padding:'13px', borderRadius:'10px', border:'none',
                fontSize:'15px', fontWeight:'700', marginBottom:'10px'
            }}>✓ Save</button>

            <button onClick=${() => setShowDeleteGroup(true)} style=${{
                width:'100%', background:'transparent', color:C.red,
                padding:'10px', borderRadius:'10px',
                border:`1px solid ${C.red}`, fontSize:'13px'
            }}>🗑 Delete Group</button>
        </div>
    `;
}

// ─── Add Group Screen ─────────────────────────────────────────────────────────
function AddGroupScreen({ onConfirm, onBack }) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🏋️');
    const ok = name.trim().length > 0;
    return html`
        <div class="screen" style=${{ display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <h2 style=${{ fontSize:'22px', fontWeight:'700', marginBottom:'24px', color:C.yellow }}>New Workout Group</h2>
            <div style=${{ marginBottom:'14px' }}>
                <p style=${{ color:C.gray, fontSize:'12px', marginBottom:'6px' }}>Icon (emoji)</p>
                <input type="text" value=${icon} onInput=${e => setIcon(e.target.value)}
                    style=${{ background:C.secondary, border:'none', color:C.white, padding:'10px', borderRadius:'8px', fontSize:'22px', width:'64px', textAlign:'center' }} />
            </div>
            <div style=${{ marginBottom:'24px' }}>
                <p style=${{ color:C.gray, fontSize:'12px', marginBottom:'6px' }}>Group Name</p>
                <input type="text" value=${name} onInput=${e => setName(e.target.value)}
                    placeholder="e.g. Push (A)"
                    style=${{ background:C.secondary, border:'none', color:C.white, padding:'12px', borderRadius:'8px', fontSize:'15px', width:'100%' }} />
            </div>
            <button onClick=${() => ok && onConfirm(icon, name.trim())} style=${{
                width:'100%', background: ok ? C.yellow : C.secondary,
                color: ok ? C.bg : C.gray, padding:'13px', borderRadius:'10px',
                border:'none', fontSize:'15px', fontWeight:'700', marginBottom:'10px',
                cursor: ok ? 'pointer' : 'not-allowed'
            }}>Create Group</button>
            <button onClick=${onBack} style=${{
                width:'100%', background:'transparent', color:C.gray,
                padding:'12px', borderRadius:'10px',
                border:`1px solid ${C.secondary}`, fontSize:'14px'
            }}>Cancel</button>
        </div>
    `;
}

// ─── Import / Export Screen ───────────────────────────────────────────────────
function ImportScreen({ workouts, onImported, onBack }) {
    const [status, setStatus] = useState(null); // null | 'success' | 'error'
    const [msg, setMsg] = useState('');
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef();

    async function handleFile(file) {
        if (!file) return;
        if (!file.name.match(/\.xlsx$/i)) { setStatus('error'); setMsg('Please upload an .xlsx file'); return; }
        try {
            const buf = await file.arrayBuffer();
            const imported = parseImportedXlsx(buf);
            onImported(imported);
            setStatus('success');
            setMsg(`Imported ${imported.length} group${imported.length!==1?'s':''} with ${imported.reduce((a,w)=>a+w.exercises.length,0)} exercises.`);
        } catch(e) {
            setStatus('error');
            setMsg(e.message || 'Failed to parse file');
        }
    }

    function onDrop(e) {
        e.preventDefault(); setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    }

    return html`
        <div class="screen">
            <div style=${{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
                <h1 style=${{ fontSize:'20px', fontWeight:'700', margin:0, color:C.yellow }}>📥 Import / Export</h1>
                <button onClick=${onBack} style=${{ background:'transparent', color:C.gray, border:'none', fontSize:'22px' }}>✕</button>
            </div>

            <!-- Download template -->
            <div style=${{
                background:C.card, border:`1px solid ${C.secondary}`,
                borderRadius:'12px', padding:'16px', marginBottom:'16px'
            }}>
                <p style=${{ fontSize:'14px', fontWeight:'600', marginBottom:'6px' }}>1. Download Template</p>
                <p style=${{ fontSize:'12px', color:C.gray, marginBottom:'12px', lineHeight:'1.5' }}>
                    Get an Excel file pre-filled with your current workout. Edit it, then upload below.
                </p>
                <button onClick=${() => downloadTemplate(workouts)} style=${{
                    width:'100%', background:C.teal, color:C.bg,
                    padding:'11px', borderRadius:'8px', border:'none',
                    fontSize:'14px', fontWeight:'600'
                }}>⬇ Download NextUp_Template.xlsx</button>
            </div>

            <!-- Upload / import -->
            <div style=${{
                background:C.card, border:`1px solid ${C.secondary}`,
                borderRadius:'12px', padding:'16px', marginBottom:'16px'
            }}>
                <p style=${{ fontSize:'14px', fontWeight:'600', marginBottom:'6px' }}>2. Upload Filled Template</p>
                <p style=${{ fontSize:'12px', color:C.gray, marginBottom:'12px', lineHeight:'1.5' }}>
                    Upload the edited .xlsx to replace your current workout plan.<br/>
                    <strong style=${{ color:C.orange }}>⚠ This replaces all groups (exercise images are kept if GroupID is unchanged).</strong>
                </p>

                <div
                    class=${`import-zone${dragging?' drag-over':''}`}
                    onDragOver=${e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave=${() => setDragging(false)}
                    onDrop=${onDrop}
                    onClick=${() => fileRef.current.click()}
                >
                    <div style=${{ fontSize:'32px', marginBottom:'8px' }}>📂</div>
                    <p style=${{ color:C.gray, fontSize:'13px' }}>Tap to choose or drag & drop</p>
                    <p style=${{ color:C.gray, fontSize:'11px', marginTop:'4px' }}>.xlsx files only</p>
                    <input ref=${fileRef} type="file" accept=".xlsx"
                        style=${{ display:'none' }}
                        onChange=${e => handleFile(e.target.files[0])} />
                </div>

                ${status === 'success' && html`
                    <div style=${{
                        marginTop:'12px', background:'#0d1f0d',
                        border:`1px solid #2d6a2d`, borderRadius:'8px', padding:'10px 12px',
                        color:'#66bb66', fontSize:'13px'
                    }}>✅ ${msg}</div>
                `}
                ${status === 'error' && html`
                    <div style=${{
                        marginTop:'12px', background:'#1f0d0d',
                        border:`1px solid ${C.red}`, borderRadius:'8px', padding:'10px 12px',
                        color:C.red, fontSize:'13px'
                    }}>❌ ${msg}</div>
                `}
            </div>

            <button onClick=${onBack} style=${{
                width:'100%', background:C.yellow, color:C.bg,
                padding:'12px', borderRadius:'10px', border:'none',
                fontSize:'14px', fontWeight:'700'
            }}>← Back</button>
        </div>
    `;
}

// ─── Skip Exercise confirmation ───────────────────────────────────────────────
function SkipModal({ exerciseName, onSkip, onCancel }) {
    return html`
        <div class="modal-overlay" onClick=${onCancel}>
            <div class="modal-box" onClick=${e => e.stopPropagation()}>
                <p style=${{ color:C.white, fontSize:'15px', marginBottom:'6px', fontWeight:'600' }}>Skip Exercise?</p>
                <p style=${{ color:C.gray, fontSize:'13px', marginBottom:'20px' }}>${exerciseName}</p>
                <div style=${{ display:'flex', gap:'10px' }}>
                    <button onClick=${onCancel} style=${{
                        flex:1, background:'transparent', color:C.gray,
                        border:`1px solid ${C.secondary}`, padding:'11px',
                        borderRadius:'8px', fontSize:'14px'
                    }}>Continue</button>
                    <button onClick=${onSkip} style=${{
                        flex:1, background:C.orange, color:C.white,
                        border:'none', padding:'11px', borderRadius:'8px',
                        fontSize:'14px', fontWeight:'700'
                    }}>Skip ⏭</button>
                </div>
            </div>
        </div>
    `;
}

// ─── Workout (active) Screen ──────────────────────────────────────────────────
function WorkoutScreen({ workout, onFinish, onExit }) {
    const [exIdx, setExIdx] = useState(0);
    const [setNum, setSetNum] = useState(1);
    const [restActive, setRestActive] = useState(false);
    const [restTime, setRestTime] = useState(null);
    const [totalRest, setTotalRest] = useState(null);
    const [cachedImage, setCachedImage] = useState(null);
    const [showSkip, setShowSkip] = useState(false);

    const ex = workout.exercises[exIdx];
    const totalEx = workout.exercises.length;
    const isLastSet = setNum === ex.sets;
    const isLastExercise = exIdx === totalEx - 1;

    useEffect(() => {
        setCachedImage(LS.img(workout.id, ex.id));
    }, [exIdx]);

    useEffect(() => {
        if (!restActive || restTime === null || restTime <= 0) {
            if (restTime === 0) setRestActive(false);
            return;
        }
        const t = setTimeout(() => setRestTime(v => v-1), 1000);
        return () => clearTimeout(t);
    }, [restActive, restTime]);

    function goNextExercise() {
        setExIdx(i => i+1);
        setSetNum(1);
        setRestActive(false);
        setRestTime(null);
    }

    function handleSetDone() {
        if (!isLastSet) {
            setSetNum(s => s+1);
            if (ex.rest > 0) { setRestTime(ex.rest); setTotalRest(ex.rest); setRestActive(true); }
        } else if (!isLastExercise) {
            goNextExercise();
        } else {
            onFinish();
        }
    }

    function handleSkip() {
        setShowSkip(false);
        if (!isLastExercise) goNextExercise();
        else onFinish();
    }

    const restPct = totalRest ? (restTime / totalRest) * 100 : 0;

    // Button label logic
    const btnLabel = (isLastSet && isLastExercise)
        ? '🏁 Complete Workout'
        : isLastSet
            ? '✓ Complete Set  →  Next'
            : setNum === 1
                ? '▶ Start'
                : '✓ Complete Set';

    return html`
        <div class="screen" style=${{ display:'flex', flexDirection:'column', minHeight:'100vh' }}>
            ${showSkip && html`
                <${SkipModal}
                    exerciseName=${ex.name}
                    onSkip=${handleSkip}
                    onCancel=${() => setShowSkip(false)}
                />
            `}

            <!-- Header -->
            <div style=${{ marginBottom:'12px' }}>
                <div style=${{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <p style=${{ color:C.gray, fontSize:'11px', margin:0 }}>
                        ${workout.icon} ${workout.name} · ${exIdx+1}/${totalEx}
                    </p>
                    <!-- Progress dots -->
                    <div style=${{ display:'flex', gap:'4px' }}>
                        ${workout.exercises.map((_,i) => html`
                            <div key=${i} style=${{
                                width:'6px', height:'6px', borderRadius:'50%',
                                background: i < exIdx ? C.yellow : i===exIdx ? C.teal : C.secondary
                            }}></div>
                        `)}
                    </div>
                </div>
                <h2 style=${{ fontSize:'21px', fontWeight:'700', margin:'7px 0 0 0', color:C.yellow }}>
                    ${ex.name}
                </h2>
            </div>

            <!-- Exercise image -->
            ${cachedImage
                ? html`<img src=${cachedImage} class="exercise-image" />`
                : html`<div style=${{ height:'6px' }}></div>`
            }

            <!-- Set card -->
            <div style=${{
                background:C.card, border:`1px solid ${C.secondary}`,
                borderRadius:'14px', padding:'18px 14px',
                marginBottom:'12px', textAlign:'center'
            }}>
                <p style=${{ color:C.gray, fontSize:'10px', margin:'0 0 2px 0', textTransform:'uppercase', letterSpacing:'1px' }}>Set</p>
                <p style=${{ fontSize:'50px', fontWeight:'700', color:C.yellow, margin:'0 0 10px 0', lineHeight:1 }}>
                    ${setNum}/${ex.sets}
                </p>

                <!-- Set bubbles -->
                <div style=${{ display:'flex', justifyContent:'center', gap:'7px', marginBottom:'14px' }}>
                    ${Array.from({length:ex.sets},(_,i) => html`
                        <div key=${i} style=${{
                            width:'26px', height:'26px', borderRadius:'50%',
                            background: i < setNum-1 ? C.yellow : i===setNum-1 ? C.teal : C.secondary,
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'11px', fontWeight:'700',
                            color: i < setNum-1 ? C.bg : i===setNum-1 ? C.bg : C.gray
                        }}>${i+1}</div>
                    `)}
                </div>

                <div style=${{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                    <div style=${{ background:C.secondary, borderRadius:'10px', padding:'9px' }}>
                        <p style=${{ color:C.gray, fontSize:'9px', margin:'0 0 3px 0' }}>REPS</p>
                        <p style=${{ fontSize:'19px', fontWeight:'700', color:C.teal, margin:0 }}>${ex.reps}</p>
                    </div>
                    <div style=${{ background:C.secondary, borderRadius:'10px', padding:'9px' }}>
                        <p style=${{ color:C.gray, fontSize:'9px', margin:'0 0 3px 0' }}>WEIGHT</p>
                        <p style=${{ fontSize:'19px', fontWeight:'700', color:C.teal, margin:0 }}>${ex.weight > 0 ? ex.weight+' kg' : 'BW'}</p>
                    </div>
                </div>
            </div>

            <!-- Notes -->
            ${ex.notes && html`
                <div style=${{
                    background:C.card, border:`1px solid ${C.secondary}`,
                    borderRadius:'10px', padding:'9px 12px',
                    marginBottom:'12px', fontSize:'12px', color:C.gray, lineHeight:'1.5'
                }}>💡 ${ex.notes}</div>
            `}

            <!-- Rest countdown -->
            ${restActive && restTime !== null
                ? html`
                    <div class="rest-screen">
                        <p class="rest-label">⏱ Rest</p>
                        <p class="rest-time">${fmt(restTime)}</p>
                        <div class="rest-bar-bg">
                            <div class="rest-bar-fill" style=${{ width:`${restPct}%` }}></div>
                        </div>
                        <button onClick=${() => setRestActive(false)} style=${{
                            background:'transparent', border:`1px solid rgba(230,253,30,0.3)`,
                            color:'rgba(230,253,30,0.65)', padding:'8px 20px',
                            borderRadius:'8px', fontSize:'12px', marginTop:'14px'
                        }}>Skip rest →</button>
                    </div>`
                : html`
                    <div style=${{ flex:1 }}></div>
                    <button onClick=${handleSetDone} style=${{
                        width:'100%', padding:'15px',
                        background: (isLastSet && isLastExercise) ? C.orange : C.yellow,
                        color:C.bg, borderRadius:'12px', border:'none',
                        fontSize:'15px', fontWeight:'700', marginBottom:'8px'
                    }}>${btnLabel}</button>
                `
            }

            <!-- Bottom row: Skip + Exit -->
            <div style=${{ display:'flex', gap:'8px', marginBottom:'6px' }}>
                <button onClick=${() => setShowSkip(true)} style=${{
                    flex:1, background:'transparent',
                    border:`1px solid ${C.secondary}`, color:C.gray,
                    padding:'10px', borderRadius:'10px', fontSize:'12px'
                }}>⏭ Skip exercise</button>
                <button onClick=${onExit} style=${{
                    flex:1, background:'transparent',
                    border:`1px solid ${C.secondary}`, color:C.gray,
                    padding:'10px', borderRadius:'10px', fontSize:'12px'
                }}>✕ Exit</button>
            </div>
        </div>
    `;
}

// ─── Finish Screen ────────────────────────────────────────────────────────────
function FinishScreen({ workout, onHome }) {
    return html`
        <div class="screen" style=${{
            display:'flex', flexDirection:'column', justifyContent:'center',
            alignItems:'center', textAlign:'center', minHeight:'100vh'
        }}>
            <img src="images/icon.png" style=${{ width:'80px', height:'80px', borderRadius:'18px', marginBottom:'20px' }} />
            <h1 style=${{ fontSize:'32px', fontWeight:'700', color:C.yellow, marginBottom:'8px' }}>Done!</h1>
            <p style=${{ color:C.gray, fontSize:'15px', marginBottom:'8px' }}>${workout.icon} ${workout.name}</p>
            <p style=${{ color:C.gray, fontSize:'12px', marginBottom:'40px' }}>
                ${new Date().toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long' })}
            </p>
            <button onClick=${onHome} style=${{
                background:C.yellow, color:C.bg,
                padding:'14px 40px', borderRadius:'12px',
                border:'none', fontSize:'16px', fontWeight:'700'
            }}>← Home</button>
        </div>
    `;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function App() {
    const [workouts, setWorkouts] = useState(loadWorkouts);
    const [history, setHistory] = useState(() => LS.get('nextup_history', []));
    const [screen, setScreen] = useState('home');
    const [activeId, setActiveId] = useState(null);

    useEffect(() => LS.set('nextup_workouts_v1', workouts), [workouts]);
    useEffect(() => LS.set('nextup_history', history), [history]);

    const activeWorkout = workouts.find(w => w.id === activeId);

    function go(screen, id=null) { setActiveId(id); setScreen(screen); }

    function handleSaveEdit(updated) {
        setWorkouts(ws => ws.map(w => w.id === updated.id ? updated : w));
        go('home');
    }

    function handleDeleteGroup(id) {
        setWorkouts(ws => ws.filter(w => w.id !== id));
        go('home');
    }

    function handleFinish() {
        setHistory(h => [{
            id: activeId,
            date: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short' }),
            ts: Date.now()
        }, ...h]);
        setScreen('finish');
    }

    function handleAddGroup(icon, name) {
        const newId = 'custom_' + Date.now();
        setWorkouts(ws => [...ws, { id:newId, name, icon, exercises:[] }]);
        go('edit', newId);
    }

    function handleImported(imported) {
        // Merge: keep GroupIDs that exist, add new ones
        setWorkouts(imported);
    }

    if (screen === 'home') return html`
        <${HomeScreen} workouts=${workouts} history=${history}
            onStart=${id => go('workout',id)}
            onEdit=${id => go('edit',id)}
            onAddGroup=${() => go('addgroup')}
            onImport=${() => go('import')}
        />`;

    if (screen === 'addgroup') return html`
        <${AddGroupScreen} onConfirm=${handleAddGroup} onBack=${() => go('home')} />`;

    if (screen === 'import') return html`
        <${ImportScreen} workouts=${workouts}
            onImported=${imported => { handleImported(imported); }}
            onBack=${() => go('home')}
        />`;

    if (screen === 'edit' && activeWorkout) return html`
        <${EditScreen}
            workout=${activeWorkout}
            onSave=${handleSaveEdit}
            onBack=${() => go('home')}
            onDeleteGroup=${() => handleDeleteGroup(activeId)}
        />`;

    if (screen === 'workout' && activeWorkout) return html`
        <${WorkoutScreen}
            workout=${activeWorkout}
            onFinish=${handleFinish}
            onExit=${() => go('home')}
        />`;

    if (screen === 'finish' && activeWorkout) return html`
        <${FinishScreen} workout=${activeWorkout} onHome=${() => go('home')} />`;

    return null;
}

ReactDOM.render(html`<${App} />`, document.getElementById('root'));
