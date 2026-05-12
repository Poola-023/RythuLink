import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../services/api"; 

const API_URL = "/api/crops";
const PROGRESS_URL = "/api/crop-plan-progress";

const TEXT = {
    en: {
        pageTitle: "Crop Follow-up Plan",
        subtitle: "Day-wise crop process from Day 1 to final harvest",
        myCrops: "My Crops",
        printGuide: "Print Plan",
        loading: "Loading crop follow-up plan...",
        cropNotFound: "Crop Not Found",
        backToMyCrops: "Back to My Crops",
        farmerIdMissing: "Farmer ID not found. Please login again.",
        cropMissing: "Crop not found.",
        loadFailed: "Unable to load crop plan.",
        heroSmall: "Farmer Follow-up Calendar",
        heroDesc:
            "This page gives a simple Day 1 to final day crop follow-up plan. Complete each activity and tick the checkbox. Your progress is saved in database.",
        totalTasks: "Total Tasks",
        completedTasks: "Completed",
        pendingTasks: "Pending",
        progress: "Progress",
        startToEndPlan: "Start-to-End Crop Plan",
        startToEndDesc:
            "Follow this plan week by week. Tick each activity after completing it in the field.",
        cropHealth: "Crop Health Checks",
        farmerChecklist: "Farmer Response",
        markDone: "Done",
        saved: "Saved",
        saving: "Saving...",
        planNote: "Important Farmer Note",
        advisory:
            "This is a general crop plan. Adjust based on your soil test, variety, irrigation, local weather, pest level and agriculture officer/KVK advice.",
        stage: "Stage",
        day: "Day",
        work: "Work",
        howToDo: "How to do",
        check: "Farmer check",
        crop: "Crop",
        location: "Location",
        farmer: "Farmer",
        notAdded: "Not added",
        languageButton: "తెలుగు",
    },

    te: {
        pageTitle: "పంట ఫాలో-అప్ ప్లాన్",
        subtitle: "Day 1 నుండి కోత వరకు రోజు వారీ పంట ప్రణాళిక",
        myCrops: "నా పంటలు",
        printGuide: "ప్లాన్ ప్రింట్ చేయండి",
        loading: "పంట ఫాలో-అప్ ప్లాన్ లోడ్ అవుతోంది...",
        cropNotFound: "పంట కనిపించలేదు",
        backToMyCrops: "నా పంటలకు వెళ్ళండి",
        farmerIdMissing: "రైతు ID కనిపించలేదు. దయచేసి మళ్లీ లాగిన్ అవ్వండి.",
        cropMissing: "పంట కనిపించలేదు.",
        loadFailed: "పంట ప్లాన్ లోడ్ చేయలేకపోయాం.",
        heroSmall: "రైతు ఫాలో-అప్ క్యాలెండర్",
        heroDesc:
            "ఈ పేజీ Day 1 నుండి చివరి రోజు వరకు సులభమైన పంట ఫాలో-అప్ ప్లాన్ చూపిస్తుంది. పని పూర్తయ్యాక checkbox టిక్ చేయండి. మీ progress database లో save అవుతుంది.",
        totalTasks: "మొత్తం పనులు",
        completedTasks: "పూర్తయినవి",
        pendingTasks: "మిగిలినవి",
        progress: "పురోగతి",
        startToEndPlan: "ప్రారంభం నుండి కోత వరకు పంట ప్లాన్",
        startToEndDesc:
            "ఈ ప్లాన్‌ను వారం వారీగా అనుసరించండి. పొలంలో పని పూర్తయ్యాక టిక్ చేయండి.",
        cropHealth: "పంట ఆరోగ్య పరిశీలన",
        farmerChecklist: "రైతు స్పందన",
        markDone: "పూర్తి",
        saved: "సేవ్ అయింది",
        saving: "సేవ్ అవుతోంది...",
        planNote: "ముఖ్యమైన రైతు గమనిక",
        advisory:
            "ఇది సాధారణ పంట ప్లాన్ మాత్రమే. మట్టి పరీక్ష, పంట రకం, నీటి లభ్యత, స్థానిక వాతావరణం, పురుగు స్థాయి మరియు వ్యవసాయ అధికారి/KVK సలహా ప్రకారం మార్చాలి.",
        stage: "దశ",
        day: "రోజు",
        work: "పని",
        howToDo: "ఎలా చేయాలి",
        check: "రైతు చెక్",
        crop: "పంట",
        location: "ప్రదేశం",
        farmer: "రైతు",
        notAdded: "జోడించలేదు",
        languageButton: "English",
    },
};

function CropDashboard() {
    const { cropId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const farmerId = localStorage.getItem("farmerId");

    const [lang, setLang] = useState(localStorage.getItem("appLang") || "en");
    const t = TEXT[lang];

    const [crop, setCrop] = useState(location.state?.crop || null);
    const [loading, setLoading] = useState(!location.state?.crop);
    const [error, setError] = useState("");
    const [completedMap, setCompletedMap] = useState({});
    const [savingTaskId, setSavingTaskId] = useState("");

    const cropName = crop?.cropName || "";

    const extracted = useMemo(() => {
        return extractCropDetails(crop?.description || "");
    }, [crop]);

    const plan = useMemo(() => {
        return getDayWisePlan(cropName, lang);
    }, [cropName, lang]);

    const flatTasks = useMemo(() => {
        return plan.flatMap((section) => section.tasks);
    }, [plan]);

    const completedCount = useMemo(() => {
        return flatTasks.filter((task) => completedMap[task.id]).length;
    }, [flatTasks, completedMap]);

    const totalTasks = flatTasks.length;
    const pendingCount = totalTasks - completedCount;
    const progressPercent =
        totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

    useEffect(() => {
        if (crop) return;
        fetchCrop();
    }, [cropId]);

    useEffect(() => {
        if (crop && farmerId) {
            fetchProgress();
        }
    }, [crop, farmerId]);

    const changeLanguage = () => {
        const nextLang = lang === "en" ? "te" : "en";
        setLang(nextLang);
        localStorage.setItem("appLang", nextLang);
    };

    const fetchCrop = async () => {
        try {
            setLoading(true);
            setError("");

            try {
                const response = await axios.get(`${API_URL}/${cropId}`);
                setCrop(response.data);
                return;
            } catch {
                if (!farmerId) {
                    throw new Error(t.farmerIdMissing);
                }

                const response = await axios.get(`${API_URL}/farmer/${farmerId}`);
                const list = Array.isArray(response.data) ? response.data : [];

                const selected = list.find(
                    (item) => String(item.cropId) === String(cropId)
                );

                if (!selected) {
                    throw new Error(t.cropMissing);
                }

                setCrop(selected);
            }
        } catch (err) {
            console.log("CROP DASHBOARD ERROR:", err);
            setError(err.message || t.loadFailed);
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        try {
            const response = await axios.get(
                `${PROGRESS_URL}/${encodeURIComponent(cropId)}/${encodeURIComponent(farmerId)}`
            );
            const list = Array.isArray(response.data) ? response.data : [];

            const map = {};
            list.forEach((item) => {
                map[item.taskId] = item.completed;
            });

            setCompletedMap(map);
        } catch (error) {
            console.log("FETCH PROGRESS ERROR:", error);
        }
    };

    const toggleTask = async (taskId) => {
        if (!farmerId) {
            alert(t.farmerIdMissing);
            return;
        }

        const nextValue = !completedMap[taskId];

        setCompletedMap((prev) => ({
            ...prev,
            [taskId]: nextValue,
        }));

        try {
            setSavingTaskId(taskId);

            await axios.post(`${PROGRESS_URL}/toggle`, {
                cropId: String(cropId),
                farmerId: String(farmerId),
                taskId,
                completed: nextValue,
            });
        } catch (error) {
            console.log("SAVE PROGRESS ERROR:", error);

            setCompletedMap((prev) => ({
                ...prev,
                [taskId]: !nextValue,
            }));

            alert("Progress save failed");
        } finally {
            setSavingTaskId("");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f4f8f5] flex items-center justify-center">
                <div className="text-center">
                    <div className="h-16 w-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <h1 className="text-3xl font-black text-green-700 mt-6">
                        {t.loading}
                    </h1>
                </div>
            </div>
        );
    }

    if (error || !crop) {
        return (
            <div className="min-h-screen bg-[#f4f8f5] flex items-center justify-center p-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-10 max-w-xl text-center">
                    <h1 className="text-4xl font-black text-slate-900">
                        {t.cropNotFound}
                    </h1>

                    <p className="text-slate-500 mt-4">{error}</p>

                    <button
                        onClick={() => navigate("/my-crops")}
                        className="bg-green-600 text-white px-8 py-4 rounded-2xl font-bold mt-8"
                    >
                        {t.backToMyCrops}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4f8f5] text-slate-900">
            <nav className="bg-white border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-[88px] flex items-center justify-between">
                    <div
                        className="flex items-center gap-4 cursor-pointer"
                        onClick={() => navigate("/my-crops")}
                    >
                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shadow-lg">
                            <span className="text-3xl">🌾</span>
                        </div>

                        <div>
                            <h1 className="text-3xl font-black tracking-tight">
                                {t.pageTitle}
                            </h1>
                            <p className="text-sm text-slate-500">{t.subtitle}</p>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-3">
                        <button
                            onClick={changeLanguage}
                            className="bg-orange-100 text-orange-700 px-5 py-3 rounded-xl font-bold"
                        >
                            {t.languageButton}
                        </button>

                        <button
                            onClick={() => navigate("/my-crops")}
                            className="bg-slate-100 text-slate-800 px-5 py-3 rounded-xl font-bold"
                        >
                            {t.myCrops}
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="bg-green-600 text-white px-5 py-3 rounded-xl font-bold"
                        >
                            {t.printGuide}
                        </button>
                    </div>
                </div>
            </nav>

            <section className="bg-gradient-to-br from-green-950 via-green-800 to-emerald-600 text-white">
                <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                    <div>
                        <p className="font-bold text-green-100 mb-4">{t.heroSmall}</p>

                        <h2 className="text-5xl lg:text-6xl font-black leading-tight">
                            {crop.cropName} — {t.startToEndPlan}
                        </h2>

                        <p className="text-green-50 text-lg leading-8 mt-6 max-w-3xl">
                            {t.heroDesc}
                        </p>

                        <div className="grid sm:grid-cols-3 gap-4 mt-8">
                            <HeroMetric title={t.crop} value={crop.cropName} />
                            <HeroMetric
                                title={t.location}
                                value={crop.location || t.notAdded}
                            />
                            <HeroMetric
                                title={t.farmer}
                                value={crop.farmerName || t.notAdded}
                            />
                        </div>
                    </div>

                    <div className="bg-white/15 backdrop-blur border border-white/20 rounded-[2rem] p-6">
                        <div className="bg-white text-slate-900 rounded-3xl p-6">
                            <p className="text-slate-500 font-bold">{t.progress}</p>
                            <h3 className="text-5xl font-black text-green-700 mt-2">
                                {progressPercent}%
                            </h3>

                            <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mt-5">
                                <div
                                    className="bg-green-600 h-full rounded-full"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-5">
                            <HeroMetric title={t.totalTasks} value={totalTasks} />
                            <HeroMetric title={t.completedTasks} value={completedCount} />
                            <HeroMetric title={t.pendingTasks} value={pendingCount} />
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <section className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 -mt-20 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div>
                            <h3 className="text-3xl font-black text-slate-900">
                                {t.startToEndPlan}
                            </h3>
                            <p className="text-slate-500 mt-2">{t.startToEndDesc}</p>
                        </div>

                        <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-3">
                            <p className="text-green-700 font-black">
                                {completedCount}/{totalTasks} {t.completedTasks}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-8 mt-8">
                    {plan.map((section, sectionIndex) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden"
                        >
                            <div className="bg-slate-900 text-white p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <p className="text-green-200 font-black">
                                            {lang === "te"
                                                ? `${sectionIndex + 1}వ దశ`
                                                : `Phase ${sectionIndex + 1}`}
                                        </p>
                                        <h3 className="text-3xl font-black mt-1">
                                            {section.title}
                                        </h3>
                                        <p className="text-slate-300 mt-2">{section.days}</p>
                                    </div>

                                    <span className="bg-white/10 px-5 py-3 rounded-2xl font-black">
                                        {section.tasks.filter((task) => completedMap[task.id]).length}
                                        /{section.tasks.length}
                                    </span>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {section.tasks.map((task) => {
                                    const done = Boolean(completedMap[task.id]);
                                    const saving = savingTaskId === task.id;

                                    return (
                                        <div
                                            key={task.id}
                                            className={`p-6 grid lg:grid-cols-[170px_1fr_180px] gap-5 items-start ${done ? "bg-green-50" : "bg-white"
                                                }`}
                                        >
                                            <div>
                                                <p className="text-sm text-slate-500 font-black">
                                                    {t.day}
                                                </p>
                                                <h4 className="text-2xl font-black text-green-700 mt-1">
                                                    {task.day}
                                                </h4>
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500 font-black">
                                                    {t.work}
                                                </p>
                                                <h4 className="text-xl font-black text-slate-900 mt-1">
                                                    {task.work}
                                                </h4>

                                                <p className="text-sm text-slate-500 font-black mt-4">
                                                    {t.howToDo}
                                                </p>
                                                <p className="text-slate-700 leading-7 mt-1">
                                                    {task.how}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => toggleTask(task.id)}
                                                className={`rounded-2xl px-5 py-4 font-black border transition ${done
                                                    ? "bg-green-600 text-white border-green-600"
                                                    : "bg-white text-slate-800 border-slate-200 hover:border-green-500"
                                                    }`}
                                            >
                                                <span className="mr-2">{done ? "✅" : "⬜"}</span>
                                                {saving ? t.saving : done ? t.saved : t.markDone}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </section>

                <section className="bg-amber-50 border border-amber-200 text-amber-900 rounded-[2rem] p-8 mt-8">
                    <h3 className="text-2xl font-black">{t.planNote}</h3>
                    <p className="leading-8 mt-3 font-semibold">{t.advisory}</p>
                </section>
            </main>
        </div>
    );
}

function getDayWisePlan(cropName, lang) {
    const crop = String(cropName || "").toLowerCase();
    const isTe = lang === "te";

    if (crop.includes("rice") || crop.includes("paddy")) {
        return isTe ? ricePlanTe() : ricePlanEn();
    }

    if (crop.includes("tomato")) {
        return isTe ? tomatoPlanTe() : tomatoPlanEn();
    }

    if (crop.includes("chilli")) {
        return isTe ? chilliPlanTe() : chilliPlanEn();
    }

    if (crop.includes("cotton")) {
        return isTe ? cottonPlanTe() : cottonPlanEn();
    }

    return isTe ? generalPlanTe() : generalPlanEn();
}

function ricePlanEn() {
    return [
        {
            id: "rice-phase-1",
            title: "Pre-Sowing & Foundation",
            days: "Day 1 – Day 15",
            tasks: [
                {
                    id: "rice-d1-7",
                    day: "Day 1–7",
                    work: "Land Preparation",
                    how:
                        "Plough the field, remove weeds, level the land and repair bunds. Keep water channels ready before sowing or transplanting.",
                },
                {
                    id: "rice-d8-13",
                    day: "Day 8–13",
                    work: "Seed Selection & Seed Treatment",
                    how:
                        "Choose healthy seed from a trusted source. Treat seed as advised locally to reduce seed-borne disease.",
                },
                {
                    id: "rice-d14",
                    day: "Day 14",
                    work: "Nursery / Field Readiness Check",
                    how:
                        "Check nursery seedlings, field water level and drainage. Do not transplant weak or diseased seedlings.",
                },
                {
                    id: "rice-d15",
                    day: "Day 15",
                    work: "Sowing / Transplanting",
                    how:
                        "Transplant healthy seedlings with proper spacing. Avoid very deep planting because it slows early growth.",
                },
            ],
        },
        {
            id: "rice-phase-2",
            title: "Early Crop Establishment",
            days: "Day 16 – Day 30",
            tasks: [
                {
                    id: "rice-d16-20",
                    day: "Day 16–20",
                    work: "Water Level Management",
                    how:
                        "Maintain shallow water. Do not allow field to dry completely during establishment.",
                },
                {
                    id: "rice-d21-25",
                    day: "Day 21–25",
                    work: "Gap Filling",
                    how:
                        "Replace missing hills with healthy seedlings. This helps maintain uniform crop stand.",
                },
                {
                    id: "rice-d26-30",
                    day: "Day 26–30",
                    work: "First Weed Check",
                    how:
                        "Remove weeds early. Weeds at this stage reduce tillering and final yield.",
                },
            ],
        },
        {
            id: "rice-phase-3",
            title: "Tillering & Growth",
            days: "Day 31 – Day 55",
            tasks: [
                {
                    id: "rice-d31-38",
                    day: "Day 31–38",
                    work: "Nutrient Split Application",
                    how:
                        "Apply fertilizer based on soil test and local recommendation. Do not apply all nitrogen at once.",
                },
                {
                    id: "rice-d39-45",
                    day: "Day 39–45",
                    work: "Stem Borer & Leaf Folder Check",
                    how:
                        "Check dead hearts and folded leaves. Use traps and spray only if pest level is high.",
                },
                {
                    id: "rice-d46-55",
                    day: "Day 46–55",
                    work: "Second Weed & Water Check",
                    how:
                        "Keep field clean and maintain proper water. Avoid excess stagnant water if crop is weak.",
                },
            ],
        },
        {
            id: "rice-phase-4",
            title: "Panicle Initiation & Flowering",
            days: "Day 56 – Day 85",
            tasks: [
                {
                    id: "rice-d56-65",
                    day: "Day 56–65",
                    work: "Panicle Initiation Monitoring",
                    how:
                        "Check crop color and growth. Give need-based nutrient support only if crop is weak.",
                },
                {
                    id: "rice-d66-75",
                    day: "Day 66–75",
                    work: "Disease Watch",
                    how:
                        "Watch for blast or brown spot after cloudy and humid weather. Improve aeration and avoid excess nitrogen.",
                },
                {
                    id: "rice-d76-85",
                    day: "Day 76–85",
                    work: "Flowering Protection",
                    how:
                        "Avoid water stress during flowering. Do not disturb the crop unnecessarily.",
                },
            ],
        },
        {
            id: "rice-phase-5",
            title: "Grain Filling & Harvest",
            days: "Day 86 – Day 120",
            tasks: [
                {
                    id: "rice-d86-100",
                    day: "Day 86–100",
                    work: "Grain Filling Care",
                    how:
                        "Maintain required moisture and avoid heavy nitrogen. Watch for pest and lodging symptoms.",
                },
                {
                    id: "rice-d101-110",
                    day: "Day 101–110",
                    work: "Harvest Readiness Check",
                    how:
                        "Check grain maturity. Most grains should turn hard and golden before harvest.",
                },
                {
                    id: "rice-d111-120",
                    day: "Day 111–120",
                    work: "Harvest, Drying & Storage",
                    how:
                        "Harvest at correct stage, dry properly, clean grains and store in dry bags.",
                },
            ],
        },
    ];
}

function ricePlanTe() {
    return [
        {
            id: "rice-phase-1",
            title: "విత్తే ముందు పునాది పనులు",
            days: "Day 1 – Day 15",
            tasks: [
                {
                    id: "rice-d1-7",
                    day: "Day 1–7",
                    work: "భూమి తయారీ",
                    how:
                        "పొలం దున్ని, కలుపు తొలగించి, భూమిని సమం చేయండి. గట్లు మరియు నీటి కాలువలు సరిచేయండి.",
                },
                {
                    id: "rice-d8-13",
                    day: "Day 8–13",
                    work: "విత్తన ఎంపిక & విత్తన శుద్ధి",
                    how:
                        "ఆరోగ్యకరమైన విత్తనం ఎంచుకోండి. స్థానిక సలహా ప్రకారం విత్తన శుద్ధి చేయండి.",
                },
                {
                    id: "rice-d14",
                    day: "Day 14",
                    work: "నర్సరీ / పొలం సిద్ధత చెక్",
                    how:
                        "నారు ఆరోగ్యంగా ఉందా, పొలం నీటి స్థాయి సరైనదా, డ్రైనేజ్ ఉందా చూడండి.",
                },
                {
                    id: "rice-d15",
                    day: "Day 15",
                    work: "విత్తడం / నాటడం",
                    how:
                        "ఆరోగ్యకరమైన నారును సరైన దూరంతో నాటండి. చాలా లోతుగా నాటవద్దు.",
                },
            ],
        },
        {
            id: "rice-phase-2",
            title: "ప్రారంభ పంట స్థిరీకరణ",
            days: "Day 16 – Day 30",
            tasks: [
                {
                    id: "rice-d16-20",
                    day: "Day 16–20",
                    work: "నీటి స్థాయి నిర్వహణ",
                    how:
                        "తక్కువ లోతు నీరు ఉంచండి. ప్రారంభ దశలో పొలం పూర్తిగా ఎండిపోకుండా చూడండి.",
                },
                {
                    id: "rice-d21-25",
                    day: "Day 21–25",
                    work: "గ్యాప్ ఫిల్లింగ్",
                    how:
                        "మిస్ అయిన చోట ఆరోగ్యకరమైన నారు మళ్లీ నాటండి.",
                },
                {
                    id: "rice-d26-30",
                    day: "Day 26–30",
                    work: "మొదటి కలుపు చెక్",
                    how:
                        "కలుపును త్వరగా తొలగించండి. ఈ దశలో కలుపు దిగుబడిని తగ్గిస్తుంది.",
                },
            ],
        },
        {
            id: "rice-phase-3",
            title: "టిల్లరింగ్ & ఎదుగుదల",
            days: "Day 31 – Day 55",
            tasks: [
                {
                    id: "rice-d31-38",
                    day: "Day 31–38",
                    work: "విడతల వారీగా పోషకాలు",
                    how:
                        "మట్టి పరీక్ష లేదా స్థానిక సిఫార్సు ప్రకారం ఎరువు వేయండి. నైట్రోజన్ మొత్తాన్ని ఒకేసారి వేయవద్దు.",
                },
                {
                    id: "rice-d39-45",
                    day: "Day 39–45",
                    work: "స్టెమ్ బోరర్ & లీఫ్ ఫోల్డర్ చెక్",
                    how:
                        "డెడ్ హార్ట్స్, ముడుచుకున్న ఆకులు ఉన్నాయా చూడండి. పురుగు ఎక్కువగా ఉంటేనే స్ప్రే చేయండి.",
                },
                {
                    id: "rice-d46-55",
                    day: "Day 46–55",
                    work: "రెండో కలుపు & నీటి చెక్",
                    how:
                        "పొలాన్ని శుభ్రంగా ఉంచండి. నీరు సరైన స్థాయిలో ఉండేలా చూడండి.",
                },
            ],
        },
        {
            id: "rice-phase-4",
            title: "పానికిల్ ప్రారంభం & పుష్పం",
            days: "Day 56 – Day 85",
            tasks: [
                {
                    id: "rice-d56-65",
                    day: "Day 56–65",
                    work: "పానికిల్ ప్రారంభం పరిశీలన",
                    how:
                        "పంట రంగు, ఎదుగుదల చూడండి. పంట బలహీనంగా ఉంటేనే పోషకాలు ఇవ్వండి.",
                },
                {
                    id: "rice-d66-75",
                    day: "Day 66–75",
                    work: "వ్యాధి పరిశీలన",
                    how:
                        "తేమ లేదా మేఘావృత వాతావరణం తర్వాత బ్లాస్ట్/బ్రౌన్ స్పాట్ చూడండి.",
                },
                {
                    id: "rice-d76-85",
                    day: "Day 76–85",
                    work: "పుష్ప దశ రక్షణ",
                    how:
                        "పుష్ప దశలో నీటి ఒత్తిడి రాకుండా చూడండి.",
                },
            ],
        },
        {
            id: "rice-phase-5",
            title: "గింజ నింపుదల & కోత",
            days: "Day 86 – Day 120",
            tasks: [
                {
                    id: "rice-d86-100",
                    day: "Day 86–100",
                    work: "గింజ నింపుదల సంరక్షణ",
                    how:
                        "అవసరమైన తేమ ఉంచండి. అధిక నైట్రోజన్ వద్దు. పురుగు/పంట పడిపోవడం గమనించండి.",
                },
                {
                    id: "rice-d101-110",
                    day: "Day 101–110",
                    work: "కోత సిద్ధత చెక్",
                    how:
                        "గింజలు గట్టిగా, బంగారు రంగులోకి వచ్చాయా చూడండి.",
                },
                {
                    id: "rice-d111-120",
                    day: "Day 111–120",
                    work: "కోత, ఆరబెట్టడం & నిల్వ",
                    how:
                        "సరైన దశలో కోత కోసి, బాగా ఆరబెట్టి, శుభ్రమైన సంచుల్లో నిల్వ చేయండి.",
                },
            ],
        },
    ];
}

function tomatoPlanEn() {
    return [
        {
            id: "tomato-phase-1",
            title: "Nursery & Field Preparation",
            days: "Day 1 – Day 20",
            tasks: [
                {
                    id: "tomato-d1-7",
                    day: "Day 1–7",
                    work: "Nursery Preparation",
                    how: "Prepare clean nursery bed or trays. Use healthy seed and avoid overcrowding.",
                },
                {
                    id: "tomato-d8-14",
                    day: "Day 8–14",
                    work: "Main Field Preparation",
                    how: "Prepare raised beds, add compost/FYM and ensure drainage.",
                },
                {
                    id: "tomato-d15-20",
                    day: "Day 15–20",
                    work: "Seedling Health Check",
                    how: "Check seedlings for yellowing, damping-off or weak growth. Keep only healthy seedlings.",
                },
            ],
        },
        {
            id: "tomato-phase-2",
            title: "Transplanting & Establishment",
            days: "Day 21 – Day 35",
            tasks: [
                {
                    id: "tomato-d21",
                    day: "Day 21",
                    work: "Transplanting",
                    how: "Transplant healthy seedlings in evening time with proper spacing.",
                },
                {
                    id: "tomato-d22-28",
                    day: "Day 22–28",
                    work: "Light Irrigation & Gap Filling",
                    how: "Give light irrigation and replace dead seedlings.",
                },
                {
                    id: "tomato-d29-35",
                    day: "Day 29–35",
                    work: "First Pest Check",
                    how: "Check whitefly, leaf curl and early blight symptoms.",
                },
            ],
        },
        {
            id: "tomato-phase-3",
            title: "Flowering & Fruiting",
            days: "Day 36 – Day 80",
            tasks: [
                {
                    id: "tomato-d36-45",
                    day: "Day 36–45",
                    work: "Staking & Weed Control",
                    how: "Give plant support and remove weeds around plants.",
                },
                {
                    id: "tomato-d46-60",
                    day: "Day 46–60",
                    work: "Flowering Care",
                    how: "Avoid water stress. Watch flower drop and sucking pests.",
                },
                {
                    id: "tomato-d61-80",
                    day: "Day 61–80",
                    work: "Fruit Borer Monitoring",
                    how: "Use pheromone traps and remove damaged fruits.",
                },
            ],
        },
        {
            id: "tomato-phase-4",
            title: "Harvest & Continuous Picking",
            days: "Day 81 – Day 110",
            tasks: [
                {
                    id: "tomato-d81-95",
                    day: "Day 81–95",
                    work: "First Harvest",
                    how: "Harvest market-ready fruits carefully. Grade fruits before selling.",
                },
                {
                    id: "tomato-d96-110",
                    day: "Day 96–110",
                    work: "Repeated Harvest & Field Hygiene",
                    how: "Pick fruits regularly and remove rotten or diseased fruits from field.",
                },
            ],
        },
    ];
}

function tomatoPlanTe() {
    return [
        {
            id: "tomato-phase-1",
            title: "నర్సరీ & పొలం తయారీ",
            days: "Day 1 – Day 20",
            tasks: [
                {
                    id: "tomato-d1-7",
                    day: "Day 1–7",
                    work: "నర్సరీ తయారీ",
                    how: "శుభ్రమైన నర్సరీ బెడ్ లేదా ట్రే సిద్ధం చేయండి. ఆరోగ్యకరమైన విత్తనం వాడండి.",
                },
                {
                    id: "tomato-d8-14",
                    day: "Day 8–14",
                    work: "ప్రధాన పొలం తయారీ",
                    how: "బెడ్స్ తయారు చేసి, FYM/కంపోస్ట్ వేసి, డ్రైనేజ్ ఏర్పాటు చేయండి.",
                },
                {
                    id: "tomato-d15-20",
                    day: "Day 15–20",
                    work: "నారు ఆరోగ్య చెక్",
                    how: "పసుపుదనం, బలహీన ఎదుగుదల లేదా వ్యాధి ఉందా చూడండి.",
                },
            ],
        },
        {
            id: "tomato-phase-2",
            title: "నాటడం & మొక్క స్థిరీకరణ",
            days: "Day 21 – Day 35",
            tasks: [
                {
                    id: "tomato-d21",
                    day: "Day 21",
                    work: "నాటడం",
                    how: "సాయంత్రం సమయంలో ఆరోగ్యకరమైన నారును సరైన దూరంలో నాటండి.",
                },
                {
                    id: "tomato-d22-28",
                    day: "Day 22–28",
                    work: "తేలికపాటి నీరు & గ్యాప్ ఫిల్లింగ్",
                    how: "తేలికగా నీరు పెట్టి, చనిపోయిన మొక్కల స్థానంలో కొత్త నారు నాటండి.",
                },
                {
                    id: "tomato-d29-35",
                    day: "Day 29–35",
                    work: "మొదటి పురుగు చెక్",
                    how: "వైట్‌ఫ్లై, ఆకు ముడత, ఎర్లీ బ్లైట్ లక్షణాలు చూడండి.",
                },
            ],
        },
        {
            id: "tomato-phase-3",
            title: "పుష్పం & పండ్ల దశ",
            days: "Day 36 – Day 80",
            tasks: [
                {
                    id: "tomato-d36-45",
                    day: "Day 36–45",
                    work: "స్టేకింగ్ & కలుపు నియంత్రణ",
                    how: "మొక్కలకు సపోర్ట్ ఇవ్వండి. మొక్కల చుట్టూ కలుపు తొలగించండి.",
                },
                {
                    id: "tomato-d46-60",
                    day: "Day 46–60",
                    work: "పుష్ప దశ సంరక్షణ",
                    how: "నీటి ఒత్తిడి రాకుండా చూడండి. పువ్వులు రాలుతున్నాయా గమనించండి.",
                },
                {
                    id: "tomato-d61-80",
                    day: "Day 61–80",
                    work: "ఫ్రూట్ బోరర్ చెక్",
                    how: "ఫెరోమోన్ ట్రాప్స్ వాడండి. దెబ్బతిన్న పండ్లు తొలగించండి.",
                },
            ],
        },
        {
            id: "tomato-phase-4",
            title: "కోత & పునరావృత పికింగ్",
            days: "Day 81 – Day 110",
            tasks: [
                {
                    id: "tomato-d81-95",
                    day: "Day 81–95",
                    work: "మొదటి కోత",
                    how: "మార్కెట్‌కు సిద్ధమైన పండ్లు జాగ్రత్తగా కోయండి. గ్రేడింగ్ చేయండి.",
                },
                {
                    id: "tomato-d96-110",
                    day: "Day 96–110",
                    work: "తరచూ కోత & పొలం శుభ్రత",
                    how: "తరచూ పండ్లు కోయండి. పాడైన పండ్లు పొలం నుంచి తొలగించండి.",
                },
            ],
        },
    ];
}

function chilliPlanEn() {
    return cropLikeVegetablePlanEn("chilli");
}

function chilliPlanTe() {
    return cropLikeVegetablePlanTe("మిర్చి");
}

function cottonPlanEn() {
    return [
        {
            id: "cotton-phase-1",
            title: "Sowing Foundation",
            days: "Day 1 – Day 20",
            tasks: [
                {
                    id: "cotton-d1-7",
                    day: "Day 1–7",
                    work: "Land Preparation",
                    how: "Prepare field with good drainage. Avoid waterlogging.",
                },
                {
                    id: "cotton-d8-14",
                    day: "Day 8–14",
                    work: "Seed Selection",
                    how: "Select suitable variety/hybrid based on local recommendation.",
                },
                {
                    id: "cotton-d15-20",
                    day: "Day 15–20",
                    work: "Sowing",
                    how: "Sow with proper spacing. Maintain uniform plant population.",
                },
            ],
        },
        {
            id: "cotton-phase-2",
            title: "Vegetative Growth",
            days: "Day 21 – Day 60",
            tasks: [
                {
                    id: "cotton-d21-35",
                    day: "Day 21–35",
                    work: "Gap Filling & Weed Control",
                    how: "Fill gaps and remove weeds early.",
                },
                {
                    id: "cotton-d36-50",
                    day: "Day 36–50",
                    work: "Sucking Pest Check",
                    how: "Check aphids, jassids and whitefly on leaf underside.",
                },
                {
                    id: "cotton-d51-60",
                    day: "Day 51–60",
                    work: "Nutrient & Irrigation Check",
                    how: "Apply need-based nutrients and avoid moisture stress.",
                },
            ],
        },
        {
            id: "cotton-phase-3",
            title: "Square, Flower & Boll Stage",
            days: "Day 61 – Day 150",
            tasks: [
                {
                    id: "cotton-d61-90",
                    day: "Day 61–90",
                    work: "Flowering Check",
                    how: "Check flower drop and pest activity weekly.",
                },
                {
                    id: "cotton-d91-120",
                    day: "Day 91–120",
                    work: "Pink Bollworm Monitoring",
                    how: "Use pheromone traps and inspect bolls.",
                },
                {
                    id: "cotton-d121-150",
                    day: "Day 121–150",
                    work: "Picking & Field Hygiene",
                    how: "Pick opened bolls cleanly and remove damaged bolls.",
                },
            ],
        },
    ];
}

function cottonPlanTe() {
    return [
        {
            id: "cotton-phase-1",
            title: "విత్తే ముందు పునాది",
            days: "Day 1 – Day 20",
            tasks: [
                {
                    id: "cotton-d1-7",
                    day: "Day 1–7",
                    work: "భూమి తయారీ",
                    how: "డ్రైనేజ్ ఉండేలా పొలం సిద్ధం చేయండి. నీరు నిల్వ ఉండనివ్వద్దు.",
                },
                {
                    id: "cotton-d8-14",
                    day: "Day 8–14",
                    work: "విత్తన ఎంపిక",
                    how: "స్థానిక సలహా ప్రకారం సరైన రకం/హైబ్రిడ్ ఎంచుకోండి.",
                },
                {
                    id: "cotton-d15-20",
                    day: "Day 15–20",
                    work: "విత్తడం",
                    how: "సరైన దూరంతో విత్తండి. మొక్కల సంఖ్య సమంగా ఉండేలా చూడండి.",
                },
            ],
        },
        {
            id: "cotton-phase-2",
            title: "మొక్క ఎదుగుదల",
            days: "Day 21 – Day 60",
            tasks: [
                {
                    id: "cotton-d21-35",
                    day: "Day 21–35",
                    work: "గ్యాప్ ఫిల్లింగ్ & కలుపు నియంత్రణ",
                    how: "మిస్ అయిన చోట భర్తీ చేసి, కలుపు తొలగించండి.",
                },
                {
                    id: "cotton-d36-50",
                    day: "Day 36–50",
                    work: "సక్కింగ్ పెస్ట్స్ చెక్",
                    how: "ఆకు కింద aphids, jassids, whitefly ఉన్నాయా చూడండి.",
                },
                {
                    id: "cotton-d51-60",
                    day: "Day 51–60",
                    work: "పోషకాలు & నీటి చెక్",
                    how: "అవసరాన్ని బట్టి పోషకాలు ఇవ్వండి. తేమ ఒత్తిడి రాకుండా చూడండి.",
                },
            ],
        },
        {
            id: "cotton-phase-3",
            title: "పుష్పం & బోల్ దశ",
            days: "Day 61 – Day 150",
            tasks: [
                {
                    id: "cotton-d61-90",
                    day: "Day 61–90",
                    work: "పుష్ప దశ చెక్",
                    how: "పువ్వులు రాలుతున్నాయా, పురుగు ఉందా వారానికి ఒకసారి చూడండి.",
                },
                {
                    id: "cotton-d91-120",
                    day: "Day 91–120",
                    work: "పింక్ బోల్‌వార్మ్ పరిశీలన",
                    how: "ఫెరోమోన్ ట్రాప్స్ వాడండి. బోల్స్ పరిశీలించండి.",
                },
                {
                    id: "cotton-d121-150",
                    day: "Day 121–150",
                    work: "పత్తి పికింగ్ & పొలం శుభ్రత",
                    how: "తెరిచిన బోల్స్ జాగ్రత్తగా తీసి, దెబ్బతిన్నవి తొలగించండి.",
                },
            ],
        },
    ];
}

function cropLikeVegetablePlanEn(name) {
    return [
        {
            id: `${name}-phase-1`,
            title: "Pre-Sowing & Field Preparation",
            days: "Day 1 – Day 20",
            tasks: [
                {
                    id: `${name}-d1-7`,
                    day: "Day 1–7",
                    work: "Land Preparation",
                    how: "Prepare well-drained field. Add organic matter and remove previous crop waste.",
                },
                {
                    id: `${name}-d8-14`,
                    day: "Day 8–14",
                    work: "Seed / Seedling Selection",
                    how: "Select healthy seed or seedlings. Avoid weak or diseased planting material.",
                },
                {
                    id: `${name}-d15-20`,
                    day: "Day 15–20",
                    work: "Sowing / Transplanting",
                    how: "Plant with correct spacing and give light irrigation.",
                },
            ],
        },
        {
            id: `${name}-phase-2`,
            title: "Growth & Pest Monitoring",
            days: "Day 21 – Day 60",
            tasks: [
                {
                    id: `${name}-d21-30`,
                    day: "Day 21–30",
                    work: "Gap Filling & Weed Control",
                    how: "Replace dead plants and remove weeds early.",
                },
                {
                    id: `${name}-d31-45`,
                    day: "Day 31–45",
                    work: "Nutrient and Irrigation Check",
                    how: "Check plant color, growth and soil moisture. Avoid overwatering.",
                },
                {
                    id: `${name}-d46-60`,
                    day: "Day 46–60",
                    work: "Pest and Disease Scouting",
                    how: "Check leaves, stem, flower and fruit. Spray only when symptoms are visible.",
                },
            ],
        },
        {
            id: `${name}-phase-3`,
            title: "Harvest Preparation",
            days: "Day 61 – Final Day",
            tasks: [
                {
                    id: `${name}-d61-80`,
                    day: "Day 61–80",
                    work: "Harvest Readiness",
                    how: "Check crop maturity and market quality.",
                },
                {
                    id: `${name}-d81-final`,
                    day: "Day 81–Final",
                    work: "Harvest, Sorting & Storage",
                    how: "Harvest carefully, sort produce and keep it clean before selling.",
                },
            ],
        },
    ];
}

function cropLikeVegetablePlanTe(name) {
    return [
        {
            id: `${name}-phase-1`,
            title: "విత్తే ముందు & పొలం తయారీ",
            days: "Day 1 – Day 20",
            tasks: [
                {
                    id: `${name}-d1-7`,
                    day: "Day 1–7",
                    work: "భూమి తయారీ",
                    how: "డ్రైనేజ్ ఉండేలా పొలం సిద్ధం చేయండి. సేంద్రియ ఎరువు వేసి పాత పంట అవశేషాలు తొలగించండి.",
                },
                {
                    id: `${name}-d8-14`,
                    day: "Day 8–14",
                    work: "విత్తనం / నారు ఎంపిక",
                    how: "ఆరోగ్యకరమైన విత్తనం లేదా నారు ఎంచుకోండి. బలహీనమైనవి వాడవద్దు.",
                },
                {
                    id: `${name}-d15-20`,
                    day: "Day 15–20",
                    work: "విత్తడం / నాటడం",
                    how: "సరైన దూరంతో నాటి, తేలికగా నీరు పెట్టండి.",
                },
            ],
        },
        {
            id: `${name}-phase-2`,
            title: "ఎదుగుదల & పురుగు పరిశీలన",
            days: "Day 21 – Day 60",
            tasks: [
                {
                    id: `${name}-d21-30`,
                    day: "Day 21–30",
                    work: "గ్యాప్ ఫిల్లింగ్ & కలుపు నియంత్రణ",
                    how: "చనిపోయిన మొక్కలు భర్తీ చేసి కలుపు తొలగించండి.",
                },
                {
                    id: `${name}-d31-45`,
                    day: "Day 31–45",
                    work: "పోషకాలు & నీటి చెక్",
                    how: "మొక్క రంగు, ఎదుగుదల, మట్టి తేమ చూడండి. అధిక నీరు వద్దు.",
                },
                {
                    id: `${name}-d46-60`,
                    day: "Day 46–60",
                    work: "పురుగు & వ్యాధి పరిశీలన",
                    how: "ఆకులు, కాండం, పువ్వులు, పండ్లు చెక్ చేయండి. లక్షణాలు ఉంటేనే స్ప్రే చేయండి.",
                },
            ],
        },
        {
            id: `${name}-phase-3`,
            title: "కోత సిద్ధత",
            days: "Day 61 – Final Day",
            tasks: [
                {
                    id: `${name}-d61-80`,
                    day: "Day 61–80",
                    work: "కోత సిద్ధత",
                    how: "పంట పక్వం మరియు మార్కెట్ నాణ్యత చెక్ చేయండి.",
                },
                {
                    id: `${name}-d81-final`,
                    day: "Day 81–Final",
                    work: "కోత, వర్గీకరణ & నిల్వ",
                    how: "జాగ్రత్తగా కోత కోసి, వర్గీకరణ చేసి శుభ్రంగా ఉంచండి.",
                },
            ],
        },
    ];
}

function generalPlanEn() {
    return cropLikeVegetablePlanEn("general");
}

function generalPlanTe() {
    return cropLikeVegetablePlanTe("సాధారణ పంట");
}

function extractCropDetails(description) {
    const getValue = (label) => {
        const regex = new RegExp(`${label}:\\s*([^\\n]+)`, "i");
        const match = String(description || "").match(regex);
        return match ? match[1].trim() : "";
    };

    return {
        landAcres: getValue("Land Area").replace(/acres/i, "").trim(),
        sowingDate: getValue("Sowing Date"),
        expectedHarvestDate: getValue("Expected Harvest Date"),
    };
}

function HeroMetric({ title, value }) {
    return (
        <div className="bg-white text-slate-900 rounded-3xl p-5">
            <p className="text-slate-500 font-bold">{title}</p>
            <h3 className="text-xl font-black text-green-700 mt-1">{value}</h3>
        </div>
    );
}

export default CropDashboard;