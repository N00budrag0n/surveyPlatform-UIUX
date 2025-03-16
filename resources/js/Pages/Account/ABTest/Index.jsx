import React from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import hasAnyPermission from "../../../Utils/Permissions";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import AccordionLayout from "../../../Layouts/Accordion";
import InfoCard from "../../../Components/CardInfo";
import PieChart from "../../../Components/PieChart";

export default function ABTestIndex() {
    const {
        auth,
        survey,
        surveyTitles,
        respondentCount,
        currentSurveyTitle,
        demographicRespondents,
        abTestResults,
        abTestSurveyResults,
        abTestQuestions
    } = usePage().props;

    const name = `${auth.user.first_name} ${auth.user.surname}`;

    // Parse the questions data
    const questionsData = abTestQuestions && abTestQuestions.length > 0
        ? JSON.parse(abTestQuestions[0].questions_data).ab_testing || []
        : [];

    // Function to get comparison details by ID
    const getComparisonById = (groupName, comparisonId) => {
        const group = questionsData.find(g => g.name === groupName);
        if (!group) return null;

        return group.comparisons.find(c => c.id === comparisonId);
    };

    // Function to create chart data for a comparison
    const getChartData = (groupName, comparisonId, data) => {
        const comparison = getComparisonById(groupName, comparisonId);
        if (!comparison) return null;

        return {
            labels: [comparison.variant_a.title, comparison.variant_b.title],
            datasets: [
                {
                    data: [data.a, data.b],
                    backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                    borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                    borderWidth: 1,
                },
            ],
        };
    };

    return (
        <>
            <Head>
                <title>A/B Testing Results - {currentSurveyTitle}</title>
            </Head>
            <LayoutAccount>
                <div className="container-fluid">
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">
                            A/B Testing Results
                        </h1>
                        <div>
                            <Link
                                href={route("account.ab_test.export", survey.id)}
                                className="btn btn-primary"
                            >
                                <i className="fas fa-file-export me-1"></i> Export
                            </Link>
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5>Survey</h5>
                                            <select
                                                className="form-select"
                                                value={survey.id}
                                                onChange={(e) => {
                                                    Inertia.get(
                                                        route(
                                                            "account.ab_test.id",
                                                            e.target.value
                                                        )
                                                    );
                                                }}
                                            >
                                                {surveyTitles.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.title}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <h5>Total Respondents</h5>
                                            <h2>{respondentCount}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Demographics Section */}
                    <div className="row mb-4">
                        <div className="col-md-12">
                            <CardContent title="Demographics">
                                {demographicRespondents ? (
                                    <div className="row">
                                        <div className="col-md-3">
                                            <h6 className="text-center">Gender</h6>
                                            <PieChart
                                                data={{
                                                    labels: Object.keys(
                                                        demographicRespondents.gender
                                                    ),
                                                    datasets: [
                                                        {
                                                            data: Object.values(
                                                                demographicRespondents.gender
                                                            ),
                                                            backgroundColor: [
                                                                "#4e73df",
                                                                "#1cc88a",
                                                                "#36b9cc",
                                                                "#f6c23e",
                                                                "#e74a3b",
                                                            ],
                                                        },
                                                    ],
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <h6 className="text-center">Age</h6>
                                            <PieChart
                                                data={{
                                                    labels: Object.keys(
                                                        demographicRespondents.age
                                                    ),
                                                    datasets: [
                                                        {
                                                            data: Object.values(
                                                                demographicRespondents.age
                                                            ),
                                                            backgroundColor: [
                                                                "#4e73df",
                                                                "#1cc88a",
                                                                "#36b9cc",
                                                                "#f6c23e",
                                                                "#e74a3b",
                                                                "#fd7e14",
                                                                "#6f42c1",
                                                            ],
                                                        },
                                                    ],
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <h6 className="text-center">Profession</h6>
                                            <PieChart
                                                data={{
                                                    labels: Object.keys(
                                                        demographicRespondents.profession
                                                    ),
                                                    datasets: [
                                                        {
                                                            data: Object.values(
                                                                demographicRespondents.profession
                                                            ),
                                                            backgroundColor: [
                                                                "#4e73df",
                                                                "#1cc88a",
                                                                "#36b9cc",
                                                                "#f6c23e",
                                                                "#e74a3b",
                                                                "#fd7e14",
                                                                "#6f42c1",
                                                            ],
                                                        },
                                                    ],
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <h6 className="text-center">Education</h6>
                                            <PieChart
                                                data={{
                                                    labels: Object.keys(
                                                        demographicRespondents.educational_background
                                                    ),
                                                    datasets: [
                                                        {
                                                            data: Object.values(
                                                                demographicRespondents.educational_background
                                                            ),
                                                            backgroundColor: [
                                                                "#4e73df",
                                                                "#1cc88a",
                                                                "#36b9cc",
                                                                "#f6c23e",
                                                                "#e74a3b",
                                                                "#fd7e14",
                                                                "#6f42c1",
                                                            ],
                                                        },
                                                    ],
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-5">
                                        <p>No demographic data available.</p>
                                    </div>
                                )}
                            </CardContent>
                        </div>
                    </div>

                    {/* A/B Testing Results */}
                    <div className="row">
                        <div className="col-md-12">
                            <CardContent title="A/B Testing Results">
                                {abTestResults && Object.keys(abTestResults).length > 0 ? (
                                    Object.entries(abTestResults).map(([groupName, comparisons]) => (
                                        <AccordionLayout
                                            key={groupName}
                                            title={groupName}
                                            defaultOpen={true}
                                        >
                                            {Object.entries(comparisons).map(([comparisonId, data]) => {
                                                const comparison = getComparisonById(groupName, comparisonId);
                                                if (!comparison) return null;

                                                const chartData = getChartData(groupName, comparisonId, data);

                                                return (
                                                    <div key={comparisonId} className="mb-4 p-3 border rounded">
                                                        <h5 className="mb-3">{comparison.title}</h5>

                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <div style={{ maxWidth: '300px', margin: '0 auto' }}>
                                                                    <PieChart data={chartData} />
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="mb-3">
                                                                    <div className="d-flex justify-content-between mb-1">
                                                                        <span>{comparison.variant_a.title}</span>
                                                                        <span>{data.a_percentage}% ({data.a} votes)</span>
                                                                    </div>
                                                                    <div className="progress mb-2">
                                                                        <div
                                                                            className="progress-bar bg-primary"
                                                                            role="progressbar"
                                                                            style={{ width: `${data.a_percentage}%` }}
                                                                            aria-valuenow={data.a_percentage}
                                                                            aria-valuemin="0"
                                                                            aria-valuemax="100"
                                                                        ></div>
                                                                    </div>

                                                                    <div className="d-flex justify-content-between mb-1">
                                                                        <span>{comparison.variant_b.title}</span>
                                                                        <span>{data.b_percentage}% ({data.b} votes)</span>
                                                                    </div>
                                                                    <div className="progress">
                                                                        <div
                                                                            className="progress-bar bg-danger"
                                                                            role="progressbar"
                                                                            style={{ width: `${data.b_percentage}%` }}
                                                                            aria-valuenow={data.b_percentage}
                                                                            aria-valuemin="0"
                                                                            aria-valuemax="100"
                                                                        ></div>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3">
                                                                    <p>
                                                                        <strong>Total responses:</strong> {data.total}
                                                                    </p>
                                                                    <p>
                                                                        <strong>Winner:</strong>{' '}
                                                                        {data.a > data.b ? (
                                                                            <span className="badge bg-primary">{comparison.variant_a.title}</span>
                                                                        ) : data.b > data.a ? (
                                                                            <span className="badge bg-danger">{comparison.variant_b.title}</span>
                                                                        ) : (
                                                                            <span className="badge bg-secondary">Tie</span>
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Respondent Reasons */}
                                                        <AccordionLayout
                                                            title={`Respondent Reasons (${(data.reasons_a?.length || 0) + (data.reasons_b?.length || 0)})`}
                                                            defaultOpen={false}
                                                        >
                                                            {data.reasons_a && data.reasons_a.length > 0 && (
                                                                <div className="mb-3">
                                                                    <h6>{comparison.variant_a.title} Reasons:</h6>
                                                                    <ul className="list-group">
                                                                        {data.reasons_a.map((reason, idx) => (
                                                                            <li key={idx} className="list-group-item">
                                                                                {reason}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {data.reasons_b && data.reasons_b.length > 0 && (
                                                                <div>
                                                                    <h6>{comparison.variant_b.title} Reasons:</h6>
                                                                    <ul className="list-group">
                                                                        {data.reasons_b.map((reason, idx) => (
                                                                            <li key={idx} className="list-group-item">
                                                                                {reason}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {(!data.reasons_a || data.reasons_a.length === 0) &&
                                                             (!data.reasons_b || data.reasons_b.length === 0) && (
                                                                <p className="text-muted">No reasons provided by respondents.</p>
                                                            )}
                                                        </AccordionLayout>
                                                    </div>
                                                );
                                            })}
                                        </AccordionLayout>
                                    ))
                                ) : (
                                    <div className="text-center py-5">
                                        <p>No A/B testing results available yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </div>
                    </div>
                </div>
            </LayoutAccount>
        </>
    );
}
