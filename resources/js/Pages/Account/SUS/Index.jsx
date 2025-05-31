import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import ReactMarkdown from 'react-markdown';
import hasAnyPermission from "../../../Utils/Permissions";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import AccordionLayout from "../../../Layouts/Accordion";
import PieChart from "../../../Components/PieChart";
import InfoCard from "../../../Components/CardInfo";
import SUSTableResponses from "../../../Components/SUSTableResponses";

export default function Dashboard() {
    const {
        auth,
        survey,
        surveyTitles,
        respondentCount,
        averageSUS,
        classifySUSGrade,
        currentSurveyTitle,
        demographicRespondents,
        getSUSChartData,
        susSurveyResults,
        susQuestions,
        resumeDescription,
        averageAnswer,
        aiRecommendation,
    } = usePage().props;

    const [aiResult, setAiResult] = useState(aiRecommendation?.ai_recommendation || '');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [lastGenerated, setLastGenerated] = useState(aiRecommendation?.generated_at || null);

    const name = `${auth.user.first_name} ${auth.user.surname}`;

    const formatAnswers = (averageAnswer) => {
        return averageAnswer.map((answer, index) => {
            return `Rata-rata (${index + 1}) : ${answer}`;
        });
    };

    const handleGenerateAI = async () => {
        if (!resumeDescription) {
            setAiError('Tida ada data untuk dianalisis');
            return;
        }

        setAiLoading(true);
        setAiError('');

        try {
            const response = await fetch(`/account/sus/${survey.id}/ai-recommendation`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setAiResult(data.recommendation);
                setLastGenerated(data.generated_at);
                setAiError('');
            } else {
                setAiError(data.error || 'Gagal menghasilkan rekomendasi AI');
            }
        } catch (error) {
            setAiError('Terjadi kesalahan saat menghubungi server');
        } finally {
            setAiLoading(false);
        }
    };

    let idSusCounter = 0;
    const data = JSON.parse(susQuestions[0].questions_data);

    const parsedSusQuestions = data.sus
        ? Object.entries(data.sus).map(([key, value]) => ({
              id: `${idSusCounter++}`,
              question: value,
          }))
        : [];

    const getDemographicData = (data, category) => {
        const labels = Object.keys(data);
        const counts = Object.values(data);

        return {
            labels,
            datasets: [
                {
                    label: category,
                    data: counts,
                },
            ],
        };
    };

    const getChartData = (data) => {
        const labels = [
            "Sangat Tidak Setuju",
            "Tidak Setuju",
            "Netral",
            "Setuju",
            "Sangat Setuju",
        ];
        const counts = [0, 0, 0, 0, 0];

        data.forEach((value) => {
            counts[value - 1]++;
        });

        return {
            labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: [
                        "#FFA600", // Sangat Tidak Setuju
                        "#FF6361", // Tidak Setuju
                        "#BC5090", // Netral
                        "#58508D", // Setuju
                        "#003F5C", // Sangat Setuju
                    ],
                },
            ],
        };
    };

    const susData = Object.keys(getSUSChartData.original).map((question) => ({
        question,
        data: getChartData(getSUSChartData.original[question]),
    }));

    const demographicsData = demographicRespondents
        ? Object.keys(demographicRespondents).map((category) => ({
              category,
              data: getDemographicData(
                  demographicRespondents[category],
                  category
              ),
          }))
        : [];

    const handleExport = () => {
        window.location.href = `/account/responses/sus/${survey.id}/export`;
    };

    return (
        <>
            <Head>
                <title>SUS Result - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="m-3">
                    <div className="row card-body border-0 shadow-sm mb-2">
                        <div className="col-md-6">
                            Selamat Datang, <strong>{name}</strong> <br />
                            {currentSurveyTitle ? (
                                <span>
                                    Hasil :{" "}
                                    <strong>{currentSurveyTitle}</strong>
                                </span>
                            ) : (
                                <strong>Pilih survei terlebih dahulu.</strong>
                            )}
                        </div>
                        <div className="col-md-6 text-end">
                            <div className="mb-2">
                                <div className="dropdown">
                                    <button
                                        className="btn select-btn dropdown-toggle"
                                        type="button"
                                        id="dropdownMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        style={{ width: "100%" }}
                                    >
                                        Pilih Survey
                                    </button>
                                    <ul
                                        className="dropdown-menu dropdown-menu-end"
                                        aria-labelledby="dropdownMenuButton"
                                        style={{
                                            maxHeight: "200px",
                                            width: "100%",
                                            overflowY: "scroll",
                                        }}
                                    >
                                        {surveyTitles.map((survey) => (
                                            <li key={survey.id}>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(event) => {
                                                        event.preventDefault();
                                                        Inertia.get(
                                                            `/account/sus/${survey.id}`
                                                        );
                                                    }}
                                                >
                                                    {survey.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    {hasAnyPermission(["sus.statistics"]) && (
                        <>
                            <div className="row mt-2">
                                <InfoCard
                                    icon="fa-users "
                                    background="success"
                                    value={respondentCount}
                                    title="Jumlah Responden"
                                />
                                <InfoCard
                                    icon="fa-chart-pie"
                                    background="primary"
                                    value={`${averageSUS} dari 100`}
                                    title="Skor SUS Total"
                                />
                                <InfoCard
                                    icon="fa-star"
                                    background="#FFD700"
                                    value={classifySUSGrade}
                                    title="Kategori Nilai SUS"
                                />
                            </div>
                            {resumeDescription !== null ? (
                                <CardContent title="Kesimpulan">
                                    <div className="text-center">
                                        {resumeDescription}
                                    </div>
                                    <hr />
                                    <div className="row justify-content-center">
                                        {formatAnswers(averageAnswer).map(
                                            (item, index) => (
                                                <div
                                                    className="text-center col-lg-4 col-md-6 mb-4 mx-auto"
                                                    key={index}
                                                >
                                                    {item}
                                                </div>
                                            )
                                        )}
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-lg-3 col-md-12 mb-4">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <p>
                                                    Positif jika rata-rata{" "}
                                                    {">= 3.5"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12 mb-4">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <p>
                                                    Netral jika rata-rata{" "}
                                                    {"> 2.5 & < 3.5"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-12 mb-4">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <p>
                                                    Negatif jika rata-rata{" "}
                                                    {"<= 2.5"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            ) : null}

                            {/* AI Recommendation Section */}
                            <CardContent title="Rekomendasi AI">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">
                                        Solusi dan Saran Berbasis AI
                                    </h6>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleGenerateAI}
                                        disabled={
                                            aiLoading || !resumeDescription
                                        }
                                    >
                                        {aiLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Menghasilkan...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-robot me-2"></i>
                                                {aiResult
                                                    ? "Regenerate AI"
                                                    : "Generate AI"}
                                            </>
                                        )}
                                    </button>
                                </div>

                                {aiError && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        <i className="fas fa-exclamation-triangle me-2"></i>
                                        {aiError}
                                    </div>
                                )}

                                {aiResult ? (
                                    <div>
                                        {lastGenerated && (
                                            <small className="text-muted mb-3 d-block">
                                                <i className="fas fa-clock me-1"></i>
                                                Terakhir dihasilkan:{" "}
                                                {new Date(
                                                    lastGenerated
                                                ).toLocaleString("id-ID")}
                                            </small>
                                        )}
                                        <div
                                            className="ai-recommendation-content"
                                            style={{
                                                backgroundColor: "#f8f9fa",
                                                padding: "20px",
                                                borderRadius: "8px",
                                                border: "1px solid #dee2e6",
                                                whiteSpace: "pre-wrap",
                                                lineHeight: "1.6",
                                            }}
                                        >
                                            <ReactMarkdown>
                                                {aiResult}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-4">
                                        <i className="fas fa-robot fa-3x text-muted mb-3"></i>
                                        <p className="text-muted">
                                            Klik tombol "Generate AI" untuk
                                            mendapatkan rekomendasi dan solusi
                                            berbasis AI berdasarkan hasil
                                            analisis SUS.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </>
                    )}

                    <AccordionLayout
                        title="Demografi Responden"
                        defaultOpen={true}
                    >
                        {demographicsData.length > 0 ? (
                            <div className="row justify-content-center">
                                {demographicsData.map((item, index) => (
                                    <div
                                        className="col-lg-4 col-md-6 mb-4 mx-auto"
                                        key={index}
                                    >
                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="card-title text-center">
                                                    {item.category
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        item.category
                                                            .slice(1)
                                                            .replace(
                                                                /_/g,
                                                                " "
                                                            )}{" "}
                                                </h6>
                                                <PieChart data={item.data} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center">Tidak ada data</div>
                        )}
                    </AccordionLayout>

                    {hasAnyPermission(["sus.charts"]) && (
                        <AccordionLayout
                            title="Grafik Hasil Dari Setiap Pertanyaan"
                            defaultOpen={true}
                        >
                            {susData.length > 0 ? (
                                <div className="row">
                                    {parsedSusQuestions.map((item, index) => (
                                        <div
                                            className="col-lg-4 col-md-6 mb-4 mx-auto"
                                            key={index}
                                        >
                                            <div className="card">
                                                <div className="card-body">
                                                    <h6
                                                        className="card-title"
                                                        style={{
                                                            minHeight: "50px",
                                                        }}
                                                    >
                                                        {index + 1}.{" "}
                                                        {item.question}
                                                    </h6>
                                                    <PieChart
                                                        data={
                                                            susData[index].data
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    Tidak ada data
                                </div>
                            )}
                        </AccordionLayout>
                    )}

                    {hasAnyPermission(["sus.responses"]) && (
                        <AccordionLayout
                            title="Tabel Hasil"
                            defaultOpen={false}
                        >
                            {susSurveyResults.length > 0 ? (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4>Hasil Respon SUS</h4>
                                        {hasAnyPermission(["sus.export"]) && (
                                            <button
                                                className="btn btn-style"
                                                onClick={handleExport}
                                            >
                                                Export to Excel
                                            </button>
                                        )}
                                    </div>
                                    <SUSTableResponses
                                        data={susSurveyResults}
                                    />
                                </div>
                            ) : (
                                <div className="text-center">
                                    Tidak ada data
                                </div>
                            )}
                        </AccordionLayout>
                    )}
                </div>
            </LayoutAccount>
        </>
    );
}
