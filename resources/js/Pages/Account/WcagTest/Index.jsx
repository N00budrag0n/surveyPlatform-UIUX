import React from "react";
import { Head, usePage } from "@inertiajs/inertia-react";
import LayoutAccount from "../../../Layouts/Account";
import WcagComplianceScore from "../../../Components/WcagComplianceScore";
import WcagIssuesList from "../../../Components/WcagIssuesList";

export default function WcagTestIndex() {
    const {
        surveyTitles,
        survey,
        wcagResults,
        complianceScore,
        issuesByCategory
    } = usePage().props;

    // Make sure survey exists before accessing its properties
    const surveyTitle = survey ? survey.title : "WCAG Testing Results";

    return (
        <>
            <Head title={`WCAG Testing - ${surveyTitle}`} />
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <select
                                    className="form-select"
                                    onChange={(e) => window.location.href = `/account/wcag_test/${e.target.value}`}
                                    value={survey ? survey.id : ""}
                                >
                                    <option value="" disabled>Select a survey</option>
                                    {surveyTitles && surveyTitles.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {survey && (
                                <div className="col-md-6 mb-2 text-end">
                                    <a
                                        href={`/account/responses/wcag_test/${survey.id}/export`}
                                        className="btn btn-success"
                                    >
                                        <i className="fas fa-file-excel me-2"></i>
                                        Export to Excel
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="card mt-3">
                    <div className="card-header bg-white">
                        <h5 className="card-title mb-0">
                            <i className="fas fa-universal-access me-2"></i>
                            WCAG Compliance Testing {survey && `- ${survey.title}`}
                        </h5>
                    </div>
                    <div className="card-body">
                        {!wcagResults || !wcagResults.success ? (
                            <div className="alert alert-danger">
                                {wcagResults?.error || "Failed to analyze website. Please check the URL and try again."}
                            </div>
                        ) : (
                            <div>
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <h6 className="card-subtitle mb-2 text-muted">Website URL</h6>
                                                <p className="card-text">
                                                    <a href={wcagResults.url} target="_blank" rel="noopener noreferrer">
                                                        {wcagResults.url}
                                                    </a>
                                                </p>
                                                <h6 className="card-subtitle mb-2 text-muted">Test Standard</h6>
                                                <p className="card-text">{wcagResults.standard} Level {wcagResults.level}</p>
                                                <h6 className="card-subtitle mb-2 text-muted">Test Date</h6>
                                                <p className="card-text">
                                                    {new Date(wcagResults.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <WcagComplianceScore score={complianceScore} />
                                    </div>
                                </div>

                                <ul className="nav nav-tabs" id="wcagTabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className="nav-link active"
                                            id="summary-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#summary"
                                            type="button"
                                            role="tab"
                                        >
                                            Summary
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className="nav-link"
                                            id="issues-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#issues"
                                            type="button"
                                            role="tab"
                                        >
                                            All Issues
                                        </button>
                                    </li>
                                </ul>

                                <div className="tab-content mt-4" id="wcagTabsContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="summary"
                                        role="tabpanel"
                                    >
                                        <div className="row">
                                            {Object.entries(issuesByCategory).map(([category, issues]) => (
                                                <div className="col-md-6 mb-4" key={category}>
                                                    <div className="card h-100">
                                                        <div className="card-header">
                                                            <h5 className="mb-0">{category}</h5>
                                                        </div>
                                                        <div className="card-body">
                                                            {issues.length === 0 ? (
                                                                <div className="alert alert-success">
                                                                    No issues found in this category.
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p>Found {issues.length} issue types in this category:</p>
                                                                    <ul className="list-group">
                                                                        {issues.slice(0, 3).map((issue, index) => (
                                                                            <li key={index} className="list-group-item">
                                                                                <span className={`badge bg-${getImpactColor(issue.impact)} me-2`}>
                                                                                    {issue.impact}
                                                                                </span>
                                                                                {issue.description} ({issue.count} occurrences)
                                                                            </li>
                                                                        ))}
                                                                        {issues.length > 3 && (
                                                                            <li className="list-group-item text-center">
                                                                                <button
                                                                                    className="btn btn-sm btn-link"
                                                                                    onClick={() => document.getElementById('issues-tab').click()}
                                                                                >
                                                                                    View {issues.length - 3} more issues
                                                                                </button>
                                                                            </li>
                                                                        )}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div
                                        className="tab-pane fade"
                                        id="issues"
                                        role="tabpanel"
                                    >
                                        <WcagIssuesList issues={wcagResults.issues} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </LayoutAccount>
        </>
    );
}

function getImpactColor(impact) {
    switch (impact) {
        case 'critical':
            return 'danger';
        case 'serious':
            return 'warning';
        case 'moderate':
            return 'info';
        case 'minor':
            return 'secondary';
        default:
            return 'primary';
    }
}

