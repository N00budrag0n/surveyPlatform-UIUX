import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import WcagIssuesList from "../../../Components/WcagIssuesList";
import WcagHistoricalChart from "../../../Components/WcagHistoricalChart";
import WcagComplianceScore from "../../../Components/WcagComplianceScore";
import WcagConformanceLevels from "../../../Components/WcagConformanceLevels";
import Swal from "sweetalert2";
import hasAnyPermission from "../../../Utils/Permissions";

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

    // Export modal states
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);

    const handleSurveyChange = (event) => {
        const surveyId = event.target.value;
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
        setShowExportModal(true);
    };

    const handleSurveySelection = (surveyId) => {
        setSelectedSurveys((prev) => {
            if (prev.includes(surveyId)) {
                return prev.filter((id) => id !== surveyId);
            } else {
                return [...prev, surveyId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedSurveys.length === surveyTitles.length) {
            setSelectedSurveys([]);
        } else {
            setSelectedSurveys(surveyTitles.map((survey) => survey.id));
        }
    };

    const handleConfirmExport = async () => {
        if (selectedSurveys.length === 0) {
            alert("Select at least one survey to export");
            return;
        }

        setExportLoading(true);
        try {
            const surveyIds = selectedSurveys.join(",");
            window.location.href = `/account/responses/wcag_test/export?surveys=${surveyIds}`;
            setShowExportModal(false);
            setSelectedSurveys([]);
        } catch (error) {
            alert("An error occurred while exporting data");
        } finally {
            setExportLoading(false);
        }
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
                                {wcagResults.success &&
                                    hasAnyPermission(["wcag_test.export"]) && (
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
                                                        wcagResults.level
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
                        <WcagConformanceLevels
                            issuesByLevel={issuesByLevel}
                            conformanceLevel={wcagResults.level}
                        />
                    )}

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

                {/* Export Modal */}
                {showExportModal && (
                    <div
                        className="modal fade show"
                        style={{ display: "block" }}
                        tabIndex="-1"
                    >
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-download me-2"></i>
                                        Export WCAG Test Reports
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setShowExportModal(false);
                                            setSelectedSurveys([]);
                                        }}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <p className="text-muted">
                                            Select surveys to export to Excel:
                                        </p>
                                    </div>

                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="selectAll"
                                                checked={
                                                    selectedSurveys.length ===
                                                    surveyTitles.length
                                                }
                                                onChange={handleSelectAll}
                                            />
                                            <label
                                                className="form-check-label fw-bold"
                                                htmlFor="selectAll"
                                            >
                                                Select All
                                            </label>
                                        </div>
                                        <hr />
                                    </div>

                                    <div
                                        className="survey-list"
                                        style={{
                                            maxHeight: "300px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {surveyTitles.map((surveyItem) => (
                                            <div
                                                key={surveyItem.id}
                                                className="form-check mb-2"
                                            >
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`survey-${surveyItem.id}`}
                                                    checked={selectedSurveys.includes(
                                                        surveyItem.id
                                                    )}
                                                    onChange={() =>
                                                        handleSurveySelection(
                                                            surveyItem.id
                                                        )
                                                    }
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor={`survey-${surveyItem.id}`}
                                                >
                                                    {surveyItem.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedSurveys.length > 0 && (
                                        <div className="mt-3 p-3 bg-light rounded">
                                            <small className="text-muted">
                                                <i className="fas fa-info-circle me-1"></i>
                                                {selectedSurveys.length}{" "}
                                                survey(s) selected for export
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowExportModal(false);
                                            setSelectedSurveys([]);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleConfirmExport}
                                        disabled={
                                            selectedSurveys.length === 0 ||
                                            exportLoading
                                        }
                                    >
                                        {exportLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Exporting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-download me-2"></i>
                                                Export ({selectedSurveys.length}
                                                )
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showExportModal && (
                    <div className="modal-backdrop fade show"></div>
                )}
            </LayoutAccount>
        </>
    );
}

// Helper functions
function getScoreClass(score) {
    if (score >= 90) return "excellent";
    if (score >= 70) return "good";
    if (score >= 50) return "fair";
    return "poor";
}

function getLevelColor(level) {
    switch (level) {
        case "AAA":
            return "success";
        case "AA":
            return "primary";
        case "A":
            return "warning";
        default:
            return "danger";
    }
}

function getScoreMessage(level) {
    switch (level) {
        case "AAA":
            return "Excellent accessibility compliance";
        case "AA":
            return "Good accessibility compliance";
        case "A":
            return "Basic accessibility compliance";
        default:
            return "Accessibility issues need attention";
    }
}

function getCategoryIcon(category) {
    switch (category) {
        case "Perceivable":
            return "fas fa-eye me-2";
        case "Operable":
            return "fas fa-hand-pointer me-2";
        case "Understandable":
            return "fas fa-brain me-2";
        case "Robust":
            return "fas fa-shield-alt me-2";
        default:
            return "fas fa-exclamation-triangle me-2";
    }
}

function getCategoryDescription(category) {
    switch (category) {
        case "Perceivable":
            return "Information and user interface components must be presentable to users in ways they can perceive.";
        case "Operable":
            return "User interface components and navigation must be operable.";
        case "Understandable":
            return "Information and the operation of user interface must be understandable.";
        case "Robust":
            return "Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.";
        default:
            return "Other accessibility issues that need attention.";
    }
}
