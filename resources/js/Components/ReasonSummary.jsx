import React, { useState } from "react";

export default function ReasonSummary({ summary, variantName }) {
    const [activeTab, setActiveTab] = useState("keywords");

    if (!summary) return null;

    const dominantLanguage = summary.dominant_language;
    const languageSummaries = summary.by_language;

    // Get the dominant language summary
    const dominantSummary = languageSummaries[dominantLanguage];
    if (!dominantSummary) return null;

    return (
        <div className="reason-summary">
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${
                            activeTab === "keywords" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("keywords")}
                    >
                        Keywords
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${
                            activeTab === "groups" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("groups")}
                    >
                        Reason Groups
                    </button>
                </li>
            </ul>

            <div className="tab-content">
                {activeTab === "keywords" && (
                    <div className="tab-pane active">
                        <h6>Top Keywords for {variantName}</h6>
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Keyword</th>
                                        <th>Count</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dominantSummary.keywords.map(
                                        (keyword, index) => (
                                            <tr key={index}>
                                                <td>{keyword.term}</td>
                                                <td>{keyword.count}</td>
                                                <td>{keyword.percentage}%</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "groups" && (
                    <div className="tab-pane active">
                        <h6>Reason Groups for {variantName}</h6>
                        {dominantSummary.groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="card mb-3">
                                <div className="card-header">
                                    <strong>Group {groupIndex + 1}</strong>:{" "}
                                    {group.keywords.join(", ")}
                                    <span className="badge bg-primary ms-2">
                                        {group.count} reasons
                                    </span>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group">
                                        {group.reasons
                                            .slice(0, 3)
                                            .map((reason, reasonIndex) => (
                                                <li
                                                    key={reasonIndex}
                                                    className="list-group-item"
                                                >
                                                    {reason}
                                                </li>
                                            ))}
                                        {group.reasons.length > 3 && (
                                            <li className="list-group-item text-center">
                                                <em>
                                                    + {group.reasons.length - 3}{" "}
                                                    more reasons
                                                </em>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {Object.keys(languageSummaries).length > 1 && (
                <div className="mt-3 text-muted">
                    <small>
                        <i className="fas fa-info-circle me-1"></i>
                        Analysis includes {summary.total_reasons} reasons in{" "}
                        {Object.keys(languageSummaries).length} languages.
                    </small>
                </div>
            )}
        </div>
    );
}
