import React from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import WcagIssuesList from "../../../Components/WcagIssuesList";
import WcagHistoricalChart from "../../../Components/WcagHistoricalChart";
import Swal from "sweetalert2";

export default function WcagTestIndex() {
    const {
        surveyTitles,
        survey,
        wcagResults,
        complianceScore,
        issuesByCategory,
        issuesByLevel,
        chartData,
        canRetest,
        lastTestedAt,
    } = usePage().props;

    const handleSurveyChange = (event) => {
        const surveyId = event.target.value;
        // Inertia.get(route("account.wcag_test.id", surveyId));
        Inertia.get(`/account/wcag_test/${surveyId}`);
    };

    const handleRetest = () => {
        Swal.fire({
            title: "Run Accessibility Test?",
            text: "This will analyze the website and generate a new test report.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, run test",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Testing in progress...",
                    text: "This may take a minute or two.",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    },
                });

                Inertia.post(
                    `/account/wcag_test/${survey.id}/retest`,
                    {},
                    {
                        onSuccess: () => {
                            Swal.fire(
                                "Testing Complete!",
                                "The accessibility test has been completed successfully.",
                                "success"
                            );
                        },
                        onError: (errors) => {
                            Swal.fire(
                                "Testing Failed!",
                                errors[1] ||
                                    "An error occurred during testing.",
                                "error"
                            );
                        },
                    }
                );
            }
        });
    };

    const handleExport = () => {
        window.location.href = `/account/responses/wcag_test/${survey.id}/export`;
    };

    return (
        <>
            <Head>
                <title>WCAG Accessibility Testing - Survey Platform</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6 col-12 mb-2">
                                <select
                                    className="form-select"
                                    value={survey.id}
                                    onChange={handleSurveyChange}
                                >
                                    {surveyTitles.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 col-12 text-md-end mb-2">
                                {canRetest && (
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={handleRetest}
                                    >
                                        <i className="fa fa-sync-alt me-2"></i>
                                        Run Test Again
                                    </button>
                                )}
                                {wcagResults.success && (
                                    <button
                                        className="btn btn-success"
                                        onClick={handleExport}
                                    >
                                        <i className="fa fa-file-excel me-2"></i>
                                        Export Report
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <CardContent
                    title="WCAG Accessibility Test Results"
                    icon="fas fa-universal-access"
                >
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <div className="card h-100">
                                <div className="card-header">
                                    <h5 className="mb-0">Test Information</h5>
                                </div>
                                <div className="card-body">
                                    <p>
                                        <strong>URL Tested:</strong>{" "}
                                        {wcagResults.url || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Test Date:</strong>{" "}
                                        {lastTestedAt
                                            ? `${new Date(
                                                  wcagResults.timestamp
                                              ).toLocaleString()} (${lastTestedAt})`
                                            : "Not tested yet"}
                                    </p>
                                    <p>
                                        <strong>Compliance Standard:</strong>{" "}
                                        {wcagResults.standard || "WCAG 2.1"}
                                    </p>

                                    {!wcagResults.success && (
                                        <div className="alert alert-warning">
                                            <i className="fas fa-exclamation-triangle me-2"></i>
                                            {wcagResults.error ||
                                                "No test results available."}
                                            {/* {!survey.url_website && (
                                                <div className="mt-2">
                                                    <Link
                                                        href={route(
                                                            `account.surveys.edit`,
                                                            survey.id
                                                        )}
                                                        className="btn btn-sm btn-primary"
                                                    >
                                                        Add Website URL
                                                    </Link>
                                                </div>
                                            )} */}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            {wcagResults.success && (
                                <div className="card h-100">
                                    <div className="card-header">
                                        <h5 className="mb-0">
                                            Compliance Score
                                        </h5>
                                    </div>
                                    <div className="card-body text-center">
                                        <div className="compliance-score-container">
                                            <div
                                                className={`compliance-score ${getScoreClass(
                                                    complianceScore
                                                )}`}
                                            >
                                                {complianceScore}%
                                            </div>
                                            <div className="conformance-level mt-2">
                                                <span
                                                    className={`badge bg-${getLevelColor(
                                                        wcagResults.level
                                                    )}`}
                                                >
                                                    WCAG {wcagResults.level}
                                                </span>
                                            </div>
                                            <div className="mt-3">
                                                <p className="mb-0">
                                                    {getScoreMessage(
                                                        complianceScore
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {wcagResults.success && (
                        <>
                            <WcagHistoricalChart chartData={chartData} />

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <h5 className="mb-0">
                                                Issues by Category
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="list-group">
                                                {Object.entries(
                                                    issuesByCategory
                                                ).map(([category, issues]) => (
                                                    <div
                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                        key={category}
                                                    >
                                                        <span>
                                                            <i
                                                                className={getCategoryIcon(
                                                                    category
                                                                )}
                                                                // className="me-2"
                                                            ></i>
                                                            {category}
                                                        </span>
                                                        <span className="badge bg-primary rounded-pill">
                                                            {issues.length}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <h5 className="mb-0">
                                                Issues by WCAG Level
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="list-group">
                                                {Object.entries(
                                                    issuesByLevel
                                                ).map(([level, issues]) => (
                                                    <div
                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                        key={level}
                                                    >
                                                        <span>
                                                            Level {level}
                                                        </span>
                                                        <span
                                                            className={`badge bg-${getLevelColor(
                                                                level
                                                            )} rounded-pill`}
                                                        >
                                                            {issues.length}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {Object.entries(issuesByCategory).map(
                                ([category, issues]) => (
                                    <WcagIssuesList
                                        key={category}
                                        issues={issues}
                                        title={`${category} Issues`}
                                        description={getCategoryDescription(
                                            category
                                        )}
                                    />
                                )
                            )}
                        </>
                    )}
                </CardContent>
            </LayoutAccount>
        </>
    );
}

// Helper functions
function getScoreClass(score) {
    if (score >= 90) return "excellent";
    if (score >= 80) return "good";
    if (score >= 70) return "acceptable";
    if (score >= 60) return "poor";
    return "critical";
}

function getLevelColor(level) {
    switch (level) {
        case "A":
            return "danger";
        case "AA":
            return "warning";
        case "AAA":
            return "success";
        case "Non-conformant":
            return "secondary";
        default:
            return "primary";
    }
}

function getScoreMessage(score) {
    if (score >= 90)
        return "Excellent! Your website demonstrates strong accessibility compliance.";
    if (score >= 80)
        return "Good job! Your website has good accessibility, with some room for improvement.";
    if (score >= 70)
        return "Acceptable. Your website meets basic accessibility requirements but needs work.";
    if (score >= 60)
        return "Poor. Your website has significant accessibility issues that need addressing.";
    return "Critical. Your website has serious accessibility problems that require immediate attention.";
}

function getCategoryIcon(category) {
    switch (category) {
        case "Perceivable":
            return "fas fa-eye";
        case "Operable":
            return "fas fa-hand-pointer";
        case "Understandable":
            return "fas fa-brain";
        case "Robust":
            return "fas fa-cogs";
        default:
            return "fas fa-check-circle";
    }
}

function getCategoryDescription(category) {
    switch (category) {
        case "Perceivable":
            return "Information and user interface components must be presentable to users in ways they can perceive. This means users must be able to perceive the information being presented.";
        case "Operable":
            return "User interface components and navigation must be operable. This means users must be able to operate the interface and not be prevented from interacting with the page.";
        case "Understandable":
            return "Information and the operation of user interface must be understandable. This means users must be able to understand the information and the operation of the user interface.";
        case "Robust":
            return "Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies. This means users must be able to access the content as technologies advance.";
        default:
            return "";
    }
}
