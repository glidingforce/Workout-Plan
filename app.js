// GEM Workout Tracker - app.js
// No Babel required - uses htm (tagged template literal JSX alternative)

const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);

const C = {
    bg: '#121212',
    card: '#1E1F22',
    secondary: '#2B2C30',
    yellow: '#E6FD1E',
    orange: '#FF4A1C',
    white: '#FFFFFF',
    gray: '#8E8E93',
    teal: '#76C4CD',
};

// ─── Default workouts from Workout_plan_by_Sonet.xlsx ───────────────────────
const DEFAULT_WORKOUTS = [
    {
        id: 'warmup',
        name: 'Warm-Up',
        icon: '🔥',
        exercises: [
            { id: 1, name: 'Stair Machine / Bike',  sets: 1, reps: '5–7 min',   weight: 0,  rest: 0,  image: null, notes: 'Light cardio — mild sweat only. Stair machine ideal. Bike if knees sore.' },
            { id: 2, name: 'Band Pull-Aparts',       sets: 2, reps: '15',        weight: 0,  rest: 30, image: null, notes: 'Arms straight, pull band to T at shoulder height. Wakes up rear delts.' },
            { id: 3, name: 'Dead Hang',              sets: 2, reps: '20–30 sec', weight: 0,  rest: 30, image: null, notes: 'Hang from pull-up bar — decompresses spine, activates grip & lats.' },
            { id: 4, name: 'Dynamic Stretches',      sets: 1, reps: '3 min',     weight: 0,  rest: 0,  image: null, notes: 'Leg swings, hip circles, torso twists. Move slowly, no bouncing.' },
        ]
    },
    {
        id: 'push_a',
        name: 'Push (A)',
        icon: '💪',
        exercises: [
            { id: 1, name: 'DB Bench Press',           sets: 4, reps: '8–10',   weight: 20, rest: 90, image: null, notes: 'Flat bench. Retract shoulder blades before every set. 3-sec descent.' },
            { id: 2, name: 'Incline DB Press',         sets: 3, reps: '10–12',  weight: 14, rest: 75, image: null, notes: '30–45° incline. Upper chest focus. Feel the pec, not the shoulder.' },
            { id: 3, name: 'DB Shoulder Press',        sets: 3, reps: '8–10',   weight: 12, rest: 75, image: null, notes: 'Seated 90°. Exhale on press. Elbows at ear level at bottom.' },
            { id: 4, name: 'DB Lateral Raise',         sets: 3, reps: '12–15',  weight: 6,  rest: 45, image: null, notes: 'Slight hip hinge 15°. Lead with elbows. 2-sec hold at top, 3-sec lower.' },
            { id: 5, name: 'Cable Tricep Pushdown',    sets: 3, reps: '12–15',  weight: 13, rest: 45, image: null, notes: 'Upper arms fixed at sides. Fully extend and squeeze. Rope attachment preferred.' },
            { id: 6, name: 'Overhead DB Tricep Ext.',  sets: 2, reps: '12–15',  weight: 10, rest: 45, image: null, notes: 'Seated. Both hands grip one DB overhead. Hits tricep long head.' },
        ]
    },
    {
        id: 'pull_b',
        name: 'Pull (B)',
        icon: '🔙',
        exercises: [
            { id: 1, name: 'Single-Arm DB Row',     sets: 4, reps: '8–10',   weight: 20, rest: 90, image: null, notes: 'Brace core, pull elbow to hip. 1-sec pause at top.' },
            { id: 2, name: 'Seated Cable Row',      sets: 3, reps: '10–12',  weight: 35, rest: 75, image: null, notes: 'Neutral grip. Pull to lower chest, squeeze shoulder blades 2 sec.' },
            { id: 3, name: 'Face Pulls (Cable)',    sets: 3, reps: '15',     weight: 5,  rest: 45, image: null, notes: 'Pull to forehead, elbows flared high. Never skip — rotator cuff health.' },
            { id: 4, name: 'DB Rear Delt Fly',      sets: 3, reps: '12–15',  weight: 6,  rest: 45, image: null, notes: 'Hinge 45° forward. Lead with elbows, squeeze blades at top.' },
            { id: 5, name: 'DB Pullover',           sets: 3, reps: '12–15',  weight: 14, rest: 45, image: null, notes: 'Lie on bench. Arc DB behind head. Slight elbow bend. Good lat stretch.' },
            { id: 6, name: 'DB Bicep Curl',         sets: 3, reps: '10–12',  weight: 12, rest: 45, image: null, notes: 'Supinate wrist at top. Full extension at bottom. No swinging.' },
            { id: 7, name: 'Hanging Knee Raise',    sets: 3, reps: '10–15',  weight: 0,  rest: 45, image: null, notes: 'Slow and controlled. Draw knees to chest, lower 3 sec.' },
        ]
    },
    {
        id: 'legs',
        name: 'Legs',
        icon: '🦵',
        exercises: [
            { id: 1, name: 'Leg Press (Machine)',       sets: 4, reps: '10–12', weight: 100, rest: 90, image: null, notes: 'Feet shoulder-width, mid-plate. Safe, no lower back stress.' },
            { id: 2, name: 'Bulgarian Split Squat',     sets: 3, reps: '10/leg', weight: 16, rest: 75, image: null, notes: 'Rear foot on bench. 3-sec descent. Upright = quad, slight lean = glute.' },
            { id: 3, name: 'Goblet Squat',              sets: 3, reps: '10–12', weight: 14, rest: 60, image: null, notes: 'Hold DB at chest. Heels flat, chest up. Knees track over toes.' },
            { id: 4, name: 'Lying Leg Curl (Machine)',  sets: 3, reps: '12',    weight: 40, rest: 60, image: null, notes: 'Full range of motion, slow lowering. Hamstring isolation.' },
            { id: 5, name: 'Standing Calf Raise',       sets: 3, reps: '15–20', weight: 0,  rest: 45, image: null, notes: '2-sec up, 2-sec pause, 3-sec down.' },
        ]
    },
    {
        id: 'core',
        name: 'Core Finisher',
        icon: '🔥',
        exercises: [
            { id: 1, name: 'Plank',             sets: 3, reps: '30–45 sec', weight: 0, rest: 45, image: null, notes: 'Elbows under shoulders, hips level. Squeeze glutes AND abs.' },
            { id: 2, name: 'Weighted Sit-Up',   sets: 3, reps: '12–15',    weight: 5, rest: 45, image: null, notes: 'DB or plate on chest. 2-sec up, 3-sec down. Don\'t yank neck.' },
            { id: 3, name: 'Cable/DB Woodchop', sets: 3, reps: '12/side',  weight: 5, rest: 45, image: null, notes: 'Diagonal pull high-to-low. Oblique focus. Can do with one DB at home.' },
            { id: 4, name: 'Reverse Crunch',    sets: 3, reps: '12–15',    weight: 0, rest: 45, image: null, notes: 'Lie flat, draw knees to chest lifting hips. Lower abs emphasis.' },
        ]
    },
    {
        id: 'home',
        name: 'Home Evening',
        icon: '🏠',
        exercises: [
            { id: 1, name: 'Glute Bridge',          sets: 2, reps: '15',     weight: 0,  rest: 30, image: null, notes: 'Lie on floor, feet flat, push hips up, squeeze 2 sec at top.' },
            { id: 2, name: 'Bulgarian Split Squat', sets: 3, reps: '10/leg', weight: 16, rest: 60, image: null, notes: 'Rear foot on sofa. 3-sec descent.' },
            { id: 3, name: 'DB Sumo Squat',         sets: 3, reps: '12',     weight: 18, rest: 45, image: null, notes: 'Wide stance, toes out 45°. Hold one heavy DB vertically.' },
            { id: 4, name: 'DB Goblet Squat',       sets: 3, reps: '12',     weight: 14, rest: 45, image: null, notes: 'Hold DB at chest. Heels flat.' },
            { id: 5, name: 'Standing Calf Raise',   sets: 2, reps: '20',     weight: 16, rest: 30, image: null, notes: 'DBs at sides. Rise onto toes, 2-sec hold, 3-sec lower.' },
        ]
    },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function loadWorkouts() {
    try {
        const s = localStorage.getItem('gemWorkouts_v3');
        if (s) return JSON.parse(s);
    } catch {}
    return DEFAULT_WORKOUTS.map(w => ({ ...w, exercises: w.exercises.map(e => ({ ...e })) }));
}

function saveWorkouts(w) {
    localStorage.setItem('gemWorkouts_v3', JSON.stringify(w));
}

function loadHistory() {
    try {
        const s = localStorage.getItem('gemHistory');
        if (s) return JSON.parse(s);
    } catch {}
    return [];
}

function saveHistory(h) {
    localStorage.setItem('gemHistory', JSON.stringify(h));
}

// Image stored as base64 in localStorage keyed by "img_<workoutId>_<exerciseId>"
function loadImage(workoutId, exerciseId) {
    return localStorage.getItem(`img_${workoutId}_${exerciseId}`) || null;
}

function saveImage(workoutId, exerciseId, dataUrl) {
    if (dataUrl) localStorage.setItem(`img_${workoutId}_${exerciseId}`, dataUrl);
    else localStorage.removeItem(`img_${workoutId}_${exerciseId}`);
}

function readFileAsDataUrl(file) {
    return new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = rej;
        r.readAsDataURL(file);
    });
}

function fmt(s) {
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function HomeScreen({ workouts, history, onStart, onEdit, onAddGroup }) {
    return html`
        <div class="screen">
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h1 style=${{ fontSize: '28px', fontWeight: '600', color: C.yellow }}>GEM Workout</h1>
            </div>
            <p style=${{ color: C.gray, fontSize: '14px', marginBottom: '24px' }}>Flexible training tracker</p>

            ${history.length > 0 && html`
                <div style=${{ marginBottom: '28px' }}>
                    <p style=${{ color: C.gray, fontSize: '11px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent</p>
                    <div style=${{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                        ${history.slice(0, 6).map((h, i) => html`
                            <div key=${i} style=${{
                                background: C.card, border: `1px solid ${C.secondary}`,
                                padding: '6px 10px', borderRadius: '8px', fontSize: '11px',
                                whiteSpace: 'nowrap', color: C.gray
                            }}>
                                ${workouts.find(w => w.id === h.id)?.icon || '🏋️'} ${h.date}
                            </div>
                        `)}
                    </div>
                </div>
            `}

            <div style=${{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                ${workouts.map(w => html`
                    <div key=${w.id} style=${{
                        background: C.card, border: `1px solid ${C.secondary}`,
                        borderRadius: '12px', padding: '16px'
                    }}>
                        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <h2 style=${{ fontSize: '16px', fontWeight: '600', margin: 0 }}>
                                ${w.icon} ${w.name}
                            </h2>
                        </div>
                        <p style=${{ fontSize: '12px', color: C.gray, margin: '0 0 12px 0' }}>
                            ${w.exercises.length} exercise${w.exercises.length !== 1 ? 's' : ''}
                        </p>
                        <div style=${{ display: 'flex', gap: '8px' }}>
                            <button onClick=${() => onStart(w.id)} style=${{
                                flex: 1, background: C.yellow, color: C.bg,
                                padding: '10px', borderRadius: '8px', border: 'none',
                                fontSize: '14px', fontWeight: '600'
                            }}>▶ Start</button>
                            <button onClick=${() => onEdit(w.id)} style=${{
                                flex: 1, background: 'transparent', color: C.gray,
                                padding: '10px', borderRadius: '8px',
                                border: `1px solid ${C.secondary}`, fontSize: '14px'
                            }}>✏️ Edit</button>
                        </div>
                    </div>
                `)}
            </div>

            <button onClick=${onAddGroup} style=${{
                width: '100%', background: 'transparent', color: C.teal,
                padding: '12px', borderRadius: '12px',
                border: `1px dashed ${C.teal}`, fontSize: '14px', fontWeight: '500'
            }}>+ Add Workout Group</button>
        </div>
    `;
}

// ─── Edit Screen ─────────────────────────────────────────────────────────────

function EditScreen({ workout, onSave, onBack, onDelete }) {
    const [local, setLocal] = useState(() => JSON.parse(JSON.stringify(workout)));
    const [images, setImages] = useState(() => {
        const imgs = {};
        workout.exercises.forEach(e => {
            const img = loadImage(workout.id, e.id);
            if (img) imgs[e.id] = img;
        });
        return imgs;
    });

    function updateEx(idx, field, val) {
        const n = JSON.parse(JSON.stringify(local));
        n.exercises[idx][field] = val;
        setLocal(n);
    }

    function addEx() {
        const n = JSON.parse(JSON.stringify(local));
        const newId = (Math.max(...n.exercises.map(e => e.id), 0)) + 1;
        n.exercises.push({ id: newId, name: 'New Exercise', sets: 3, reps: '10–12', weight: 10, rest: 60, image: null, notes: '' });
        setLocal(n);
    }

    function deleteEx(idx) {
        const n = JSON.parse(JSON.stringify(local));
        n.exercises.splice(idx, 1);
        setLocal(n);
    }

    async function handleImageUpload(exerciseId, file) {
        if (!file) return;
        const dataUrl = await readFileAsDataUrl(file);
        saveImage(workout.id, exerciseId, dataUrl);
        setImages(prev => ({ ...prev, [exerciseId]: dataUrl }));
    }

    function removeImage(exerciseId) {
        saveImage(workout.id, exerciseId, null);
        setImages(prev => { const n = { ...prev }; delete n[exerciseId]; return n; });
    }

    function handleSave() {
        onSave(local);
    }

    const inputStyle = {
        background: C.secondary, border: 'none', color: C.white,
        padding: '6px 8px', borderRadius: '6px', fontSize: '12px'
    };

    return html`
        <div class="screen">
            <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h1 style=${{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                    ${local.icon} ${local.name}
                </h1>
                <button onClick=${onBack} style=${{ background: 'transparent', color: C.gray, border: 'none', fontSize: '22px' }}>✕</button>
            </div>

            <!-- Group name & icon row -->
            <div style=${{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input type="text" value=${local.icon}
                    onInput=${e => setLocal(p => ({ ...p, icon: e.target.value }))}
                    style=${{ ...inputStyle, width: '52px', textAlign: 'center', fontSize: '20px' }}
                    placeholder="🏋️" />
                <input type="text" value=${local.name}
                    onInput=${e => setLocal(p => ({ ...p, name: e.target.value }))}
                    style=${{ ...inputStyle, flex: 1, fontSize: '14px' }}
                    placeholder="Group name" />
            </div>

            <div style=${{ display: 'grid', gap: '12px', marginBottom: '16px' }}>
                ${local.exercises.map((ex, idx) => html`
                    <div key=${ex.id} style=${{
                        background: C.card, border: `1px solid ${C.secondary}`,
                        borderRadius: '12px', padding: '12px'
                    }}>
                        <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style=${{ fontSize: '13px', fontWeight: '600', color: C.teal }}>#${idx + 1}</span>
                            <button onClick=${() => deleteEx(idx)}
                                style=${{ background: 'transparent', color: C.orange, border: 'none', fontSize: '16px' }}>🗑</button>
                        </div>

                        <!-- Exercise name -->
                        <input type="text" value=${ex.name}
                            onInput=${e => updateEx(idx, 'name', e.target.value)}
                            style=${{ ...inputStyle, width: '100%', marginBottom: '8px', fontSize: '13px' }}
                            placeholder="Exercise name" />

                        <!-- sets / reps / weight / rest row -->
                        <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                            ${[
                                { label: 'Sets', field: 'sets', type: 'number' },
                                { label: 'Reps', field: 'reps', type: 'text' },
                                { label: 'kg', field: 'weight', type: 'number' },
                                { label: 'Rest s', field: 'rest', type: 'number' },
                            ].map(col => html`
                                <div key=${col.field}>
                                    <p style=${{ fontSize: '10px', color: C.gray, margin: '0 0 2px 0' }}>${col.label}</p>
                                    <input type=${col.type} value=${ex[col.field]}
                                        onInput=${e => updateEx(idx, col.field, col.type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value)}
                                        style=${{ ...inputStyle, width: '100%' }} />
                                </div>
                            `)}
                        </div>

                        <!-- Notes -->
                        <textarea
                            value=${ex.notes || ''}
                            onInput=${e => updateEx(idx, 'notes', e.target.value)}
                            placeholder="Form tips / notes..."
                            rows="2"
                            style=${{
                                ...inputStyle, width: '100%', resize: 'none',
                                lineHeight: '1.4', marginBottom: '8px'
                            }}
                        ></textarea>

                        <!-- Image upload -->
                        ${images[ex.id]
                            ? html`
                                <div style=${{ position: 'relative' }}>
                                    <img src=${images[ex.id]} class="img-thumb" />
                                    <button onClick=${() => removeImage(ex.id)}
                                        style=${{
                                            position: 'absolute', top: '8px', right: '4px',
                                            background: 'rgba(0,0,0,0.7)', color: C.orange,
                                            border: 'none', borderRadius: '50%',
                                            width: '22px', height: '22px', fontSize: '11px'
                                        }}>✕</button>
                                </div>
                            `
                            : html`
                                <label class="img-upload-btn">
                                    📷 Upload image
                                    <input type="file" accept="image/*" style=${{ display: 'none' }}
                                        onChange=${e => handleImageUpload(ex.id, e.target.files[0])} />
                                </label>
                            `
                        }
                    </div>
                `)}
            </div>

            <button onClick=${addEx} style=${{
                width: '100%', background: C.secondary, color: C.teal,
                padding: '12px', borderRadius: '12px',
                border: `1px dashed ${C.teal}`, fontSize: '14px',
                marginBottom: '10px'
            }}>+ Add Exercise</button>

            <button onClick=${handleSave} style=${{
                width: '100%', background: C.yellow, color: C.bg,
                padding: '13px', borderRadius: '12px', border: 'none',
                fontSize: '15px', fontWeight: '700', marginBottom: '10px'
            }}>✓ Save</button>

            <button onClick=${onDelete} style=${{
                width: '100%', background: 'transparent', color: C.orange,
                padding: '10px', borderRadius: '12px',
                border: `1px solid ${C.orange}`, fontSize: '13px'
            }}>🗑 Delete this group</button>
        </div>
    `;
}

// ─── Add Group Modal ──────────────────────────────────────────────────────────

function AddGroupScreen({ onConfirm, onBack }) {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState('🏋️');

    return html`
        <div class="screen" style=${{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style=${{ fontSize: '22px', fontWeight: '600', marginBottom: '24px', color: C.yellow }}>New Workout Group</h2>

            <div style=${{ marginBottom: '16px' }}>
                <p style=${{ color: C.gray, fontSize: '12px', marginBottom: '6px' }}>Icon (emoji)</p>
                <input type="text" value=${icon} onInput=${e => setIcon(e.target.value)}
                    style=${{
                        background: C.secondary, border: 'none', color: C.white,
                        padding: '10px', borderRadius: '8px', fontSize: '24px',
                        width: '70px', textAlign: 'center'
                    }} />
            </div>

            <div style=${{ marginBottom: '24px' }}>
                <p style=${{ color: C.gray, fontSize: '12px', marginBottom: '6px' }}>Group Name</p>
                <input type="text" value=${name} onInput=${e => setName(e.target.value)}
                    placeholder="e.g. Push (A)"
                    style=${{
                        background: C.secondary, border: 'none', color: C.white,
                        padding: '12px', borderRadius: '8px', fontSize: '15px',
                        width: '100%'
                    }} />
            </div>

            <button onClick=${() => name.trim() && onConfirm(icon, name.trim())}
                style=${{
                    width: '100%', background: name.trim() ? C.yellow : C.secondary,
                    color: name.trim() ? C.bg : C.gray,
                    padding: '13px', borderRadius: '12px', border: 'none',
                    fontSize: '15px', fontWeight: '700', marginBottom: '10px'
                }}>Create Group</button>

            <button onClick=${onBack} style=${{
                width: '100%', background: 'transparent', color: C.gray,
                padding: '12px', borderRadius: '12px',
                border: `1px solid ${C.secondary}`, fontSize: '14px'
            }}>Cancel</button>
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

    const ex = workout.exercises[exIdx];
    const totalEx = workout.exercises.length;
    const isLastSet = setNum === ex.sets;
    const isLastExercise = exIdx === totalEx - 1;
    const [cachedImage, setCachedImage] = useState(null);

    // Load image for current exercise
    useEffect(() => {
        const img = loadImage(workout.id, ex.id);
        setCachedImage(img);
    }, [exIdx, workout.id, ex.id]);

    // Rest timer
    useEffect(() => {
        if (!restActive || restTime === null || restTime <= 0) {
            if (restTime === 0) setRestActive(false);
            return;
        }
        const t = setTimeout(() => setRestTime(v => v - 1), 1000);
        return () => clearTimeout(t);
    }, [restActive, restTime]);

    function handleSetDone() {
        if (!isLastSet) {
            setSetNum(s => s + 1);
            if (ex.rest > 0) {
                setRestTime(ex.rest);
                setTotalRest(ex.rest);
                setRestActive(true);
            }
        } else if (!isLastExercise) {
            setExIdx(i => i + 1);
            setSetNum(1);
            setRestActive(false);
            setRestTime(null);
        } else {
            onFinish();
        }
    }

    const restPct = totalRest ? ((restTime / totalRest) * 100) : 0;

    return html`
        <div class="screen" style=${{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <!-- Header -->
            <div style=${{ marginBottom: '14px' }}>
                <div style=${{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style=${{ color: C.gray, fontSize: '12px', margin: 0 }}>
                        ${workout.icon} ${workout.name}  ·  Exercise ${exIdx + 1}/${totalEx}
                    </p>
                    <!-- Progress dots -->
                    <div style=${{ display: 'flex', gap: '4px' }}>
                        ${workout.exercises.map((_, i) => html`
                            <div key=${i} style=${{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: i < exIdx ? C.yellow : i === exIdx ? C.teal : C.secondary
                            }}></div>
                        `)}
                    </div>
                </div>
                <h2 style=${{ fontSize: '22px', fontWeight: '700', margin: '8px 0 0 0', color: C.yellow }}>
                    ${ex.name}
                </h2>
            </div>

            <!-- Exercise image -->
            ${cachedImage
                ? html`<img src=${cachedImage} class="exercise-image" />`
                : html`<div style=${{ height: '8px' }}></div>`
            }

            <!-- Set card -->
            <div style=${{
                background: C.card, border: `1px solid ${C.secondary}`,
                borderRadius: '14px', padding: '20px 16px',
                marginBottom: '16px', textAlign: 'center'
            }}>
                <p style=${{ color: C.gray, fontSize: '11px', margin: '0 0 4px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Set</p>
                <p style=${{ fontSize: '52px', fontWeight: '700', color: C.yellow, margin: '0 0 12px 0', lineHeight: 1 }}>
                    ${setNum}/${ex.sets}
                </p>

                <!-- Set bubbles -->
                <div style=${{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                    ${Array.from({ length: ex.sets }, (_, i) => html`
                        <div key=${i} style=${{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: i < setNum - 1 ? C.yellow : i === setNum - 1 ? C.teal : C.secondary,
                            border: i === setNum - 1 ? `2px solid ${C.teal}` : 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: '700',
                            color: i < setNum - 1 ? C.bg : i === setNum - 1 ? C.bg : C.gray
                        }}>${i + 1}</div>
                    `)}
                </div>

                <div style=${{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style=${{ background: C.secondary, borderRadius: '10px', padding: '10px' }}>
                        <p style=${{ color: C.gray, fontSize: '10px', margin: '0 0 4px 0' }}>REPS</p>
                        <p style=${{ fontSize: '20px', fontWeight: '700', color: C.teal, margin: 0 }}>${ex.reps}</p>
                    </div>
                    <div style=${{ background: C.secondary, borderRadius: '10px', padding: '10px' }}>
                        <p style=${{ color: C.gray, fontSize: '10px', margin: '0 0 4px 0' }}>WEIGHT</p>
                        <p style=${{ fontSize: '20px', fontWeight: '700', color: C.teal, margin: 0 }}>${ex.weight > 0 ? ex.weight + ' kg' : 'BW'}</p>
                    </div>
                </div>
            </div>

            <!-- Notes -->
            ${ex.notes && html`
                <div style=${{
                    background: C.card, border: `1px solid ${C.secondary}`,
                    borderRadius: '10px', padding: '10px 12px',
                    marginBottom: '14px', fontSize: '12px', color: C.gray, lineHeight: '1.5'
                }}>
                    💡 ${ex.notes}
                </div>
            `}

            <!-- REST COUNTDOWN (yellow palette) -->
            ${restActive && restTime !== null
                ? html`
                    <div class="rest-screen" style=${{ flex: 1 }}>
                        <p class="rest-label">⏱ Rest</p>
                        <p class="rest-time">${fmt(restTime)}</p>
                        <div class="rest-bar-bg">
                            <div class="rest-bar-fill" style=${{ width: `${restPct}%` }}></div>
                        </div>
                        <button onClick=${() => setRestActive(false)}
                            style=${{
                                background: 'transparent', border: `1px solid rgba(230,253,30,0.4)`,
                                color: 'rgba(230,253,30,0.7)', padding: '8px 20px',
                                borderRadius: '8px', fontSize: '12px', marginTop: '16px'
                            }}>Skip rest →</button>
                    </div>
                `
                : html`
                    <div style=${{ flex: 1 }}></div>
                    <button onClick=${handleSetDone} style=${{
                        width: '100%', padding: '16px',
                        background: (isLastSet && isLastExercise) ? C.orange : C.yellow,
                        color: C.bg, borderRadius: '14px', border: 'none',
                        fontSize: '16px', fontWeight: '700', marginBottom: '10px',
                        letterSpacing: '0.5px'
                    }}>
                        ${isLastSet && isLastExercise
                            ? '🏁 Complete Workout'
                            : isLastSet
                                ? '✓ Complete Set  →  Next Exercise'
                                : setNum === 1
                                    ? '▶ Start'
                                    : '✓ Complete Set'
                        }
                    </button>
                `
            }

            <button onClick=${onExit} style=${{
                background: 'transparent', border: `1px solid ${C.secondary}`,
                color: C.gray, padding: '11px', borderRadius: '10px',
                fontSize: '13px', width: '100%', marginBottom: '8px'
            }}>Exit workout</button>
        </div>
    `;
}

// ─── Finish Screen ────────────────────────────────────────────────────────────

function FinishScreen({ workout, onHome }) {
    return html`
        <div class="screen" style=${{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            textAlign: 'center', minHeight: '100vh'
        }}>
            <div style=${{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
            <h1 style=${{ fontSize: '30px', fontWeight: '700', color: C.yellow, marginBottom: '10px' }}>Done!</h1>
            <p style=${{ color: C.gray, fontSize: '15px', marginBottom: '10px' }}>
                ${workout.icon} ${workout.name}
            </p>
            <p style=${{ color: C.gray, fontSize: '13px', marginBottom: '40px' }}>
                ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <button onClick=${onHome} style=${{
                background: C.yellow, color: C.bg,
                padding: '14px 36px', borderRadius: '12px',
                border: 'none', fontSize: '16px', fontWeight: '700'
            }}>← Back to home</button>
        </div>
    `;
}

// ─── Main App ─────────────────────────────────────────────────────────────────

function App() {
    const [workouts, setWorkouts] = useState(loadWorkouts);
    const [history, setHistory] = useState(loadHistory);
    const [screen, setScreen] = useState('home');
    const [activeId, setActiveId] = useState(null);

    useEffect(() => saveWorkouts(workouts), [workouts]);
    useEffect(() => saveHistory(history), [history]);

    const activeWorkout = workouts.find(w => w.id === activeId);

    function handleStart(id) {
        setActiveId(id);
        setScreen('workout');
    }

    function handleEdit(id) {
        setActiveId(id);
        setScreen('edit');
    }

    function handleSaveEdit(updated) {
        setWorkouts(ws => ws.map(w => w.id === updated.id ? updated : w));
        setScreen('home');
    }

    function handleDeleteGroup(id) {
        if (!confirm('Delete this workout group?')) return;
        setWorkouts(ws => ws.filter(w => w.id !== id));
        setScreen('home');
    }

    function handleFinish() {
        const entry = {
            id: activeId,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            ts: Date.now()
        };
        setHistory(h => [entry, ...h]);
        setScreen('finish');
    }

    function handleAddGroup(icon, name) {
        const newId = 'custom_' + Date.now();
        setWorkouts(ws => [...ws, {
            id: newId, name, icon,
            exercises: []
        }]);
        setActiveId(newId);
        setScreen('edit');
    }

    if (screen === 'home') return html`
        <${HomeScreen}
            workouts=${workouts}
            history=${history}
            onStart=${handleStart}
            onEdit=${handleEdit}
            onAddGroup=${() => setScreen('addgroup')}
        />
    `;

    if (screen === 'addgroup') return html`
        <${AddGroupScreen}
            onConfirm=${handleAddGroup}
            onBack=${() => setScreen('home')}
        />
    `;

    if (screen === 'edit' && activeWorkout) return html`
        <${EditScreen}
            workout=${activeWorkout}
            onSave=${handleSaveEdit}
            onBack=${() => setScreen('home')}
            onDelete=${() => handleDeleteGroup(activeId)}
        />
    `;

    if (screen === 'workout' && activeWorkout) return html`
        <${WorkoutScreen}
            workout=${activeWorkout}
            onFinish=${handleFinish}
            onExit=${() => setScreen('home')}
        />
    `;

    if (screen === 'finish' && activeWorkout) return html`
        <${FinishScreen}
            workout=${activeWorkout}
            onHome=${() => setScreen('home')}
        />
    `;

    return null;
}

ReactDOM.render(html`<${App} />`, document.getElementById('root'));
