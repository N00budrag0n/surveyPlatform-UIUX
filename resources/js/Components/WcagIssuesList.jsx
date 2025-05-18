import React, { useState } from "react";

export default function WcagIssuesList({ issues, title, description }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterImpact, setFilterImpact] = useState("");

    const filteredIssues = issues.filter((issue) => {
        // Filter by search term
        const searchMatch =
            !searchTerm ||
            issue.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            issue.element.toLowerCase().includes(searchTerm.toLowerCase()) ||
            issue.wcag_criterion
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        // Filter by impact level
        const impactMatch = !filterImpact || issue.impact === filterImpact;

        return searchMatch && impactMatch;
    });

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                    {title} ({issues.length})
                </h5>
                <div className="d-flex">
                    <div
                        className="input-group me-2"
                        style={{ width: "300px" }}
                    >
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search issues..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setSearchTerm("")}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    <select
                        className="form-select"
                        value={filterImpact}
                        onChange={(e) => setFilterImpact(e.target.value)}
                        style={{ width: "150px" }}
                    >
                        <option value="">All Impacts</option>
                        <option value="critical">Critical</option>
                        <option value="serious">Serious</option>
                        <option value="moderate">Moderate</option>
                        <option value="minor">Minor</option>
                    </select>
                </div>
            </div>
            <div className="card-body">
                {description && <p className="card-text">{description}</p>}

                {filteredIssues.length === 0 ? (
                    <div className="alert alert-info">No issues found.</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th style={{ width: "5%" }}>Impact</th>
                                    <th style={{ width: "10%" }}>WCAG Level</th>
                                    <th style={{ width: "30%" }}>
                                        Description
                                    </th>
                                    <th style={{ width: "10%" }}>Criterion</th>
                                    <th style={{ width: "25%" }}>Element</th>
                                    <th style={{ width: "20%" }}>Solution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssues.map((issue, index) => (
                                    <tr key={index}>
                                        <td>
                                            <span
                                                className={`badge bg-${getImpactColor(
                                                    issue.impact
                                                )}`}
                                            >
                                                {issue.impact}
                                            </span>
                                        </td>
                                        <td>
                                            {issue.conformance_level || "A"}
                                        </td>
                                        <td>{issue.description}</td>
                                        <td>{issue.wcag_criterion}</td>
                                        <td>
                                            <code className="small">
                                                {truncateText(
                                                    issue.element,
                                                    100
                                                )}
                                            </code>
                                            <div className="small text-muted mt-1">
                                                {truncateText(
                                                    issue.location,
                                                    50
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {issue.solution && (
                                                <button
                                                    className="btn btn-sm btn-outline-info"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#solutionModal-${index}`}
                                                >
                                                    View Solution
                                                </button>
                                            )}

                                            {/* Solution Modal */}
                                            <div
                                                className="modal fade"
                                                id={`solutionModal-${index}`}
                                                tabIndex="-1"
                                                aria-hidden="true"
                                            >
                                                <div className="modal-dialog modal-lg">
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5 className="modal-title">
                                                                {issue.solution
                                                                    ?.title ||
                                                                    "Solution"}
                                                            </h5>
                                                            <button
                                                                type="button"
                                                                className="btn-close"
                                                                data-bs-dismiss="modal"
                                                                aria-label="Close"
                                                            ></button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <p>
                                                                {
                                                                    issue
                                                                        .solution
                                                                        ?.description
                                                                }
                                                            </p>

                                                            {issue.solution
                                                                ?.example && (
                                                                <div className="mt-3">
                                                                    <h6>
                                                                        Example:
                                                                    </h6>
                                                                    <div className="p-3 bg-light">
                                                                        <code>
                                                                            {
                                                                                issue
                                                                                    .solution
                                                                                    .example
                                                                            }
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {issue.solution
                                                                ?.resources &&
                                                                Object.keys(
                                                                    issue
                                                                        .solution
                                                                        .resources
                                                                ).length >
                                                                    0 && (
                                                                    <div className="mt-3">
                                                                        <h6>
                                                                            Resources:
                                                                        </h6>
                                                                        <ul>
                                                                            {Object.entries(
                                                                                issue
                                                                                    .solution
                                                                                    .resources
                                                                            ).map(
                                                                                (
                                                                                    [
                                                                                        name,
                                                                                        url,
                                                                                    ],
                                                                                    idx
                                                                                ) => (
                                                                                    <li
                                                                                        key={
                                                                                            idx
                                                                                        }
                                                                                    >
                                                                                        <a
                                                                                            href={
                                                                                                url
                                                                                            }
                                                                                            target="_blank"
                                                                                            rel="noopener noreferrer"
                                                                                        >
                                                                                            {
                                                                                                name
                                                                                            }
                                                                                        </a>
                                                                                    </li>
                                                                                )
                                                                            )}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                data-bs-dismiss="modal"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper functions
function getImpactColor(impact) {
    switch (impact) {
        case "critical":
            return "danger";
        case "serious":
            return "warning";
        case "moderate":
            return "primary";
        case "minor":
            return "info";
        default:
            return "secondary";
    }
}

function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
}
