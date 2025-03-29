import React from "react";

export default function WcagConformanceLevels({ issuesByLevel }) {
    const getLevelDescription = (level) => {
        switch (level) {
            case 'A':
                return 'Level A is the minimum level of conformance. This addresses the most basic accessibility features and the most serious barriers for users with disabilities.';
            case 'AA':
                return 'Level AA addresses the major, common barriers for users with disabilities. Most organizations aim for AA compliance as it provides good accessibility while being reasonably achievable.';
            case 'AAA':
                return 'Level AAA is the highest level of conformance, addressing more nuanced accessibility issues. It\'s often not possible to satisfy all AAA criteria for some content.';
            default:
                return '';
        }
    };

    const getLevelStatus = (level, issues) => {
        if (!issues || issues.length === 0) {
            return {
                status: 'Compliant',
                color: 'success',
                icon: 'check-circle'
            };
        }

        // For Level A, any issues mean non-compliance
        if (level === 'A') {
            return {
                status: 'Non-compliant',
                color: 'danger',
                icon: 'times-circle'
            };
        }

        // For AA and AAA, determine based on number and severity of issues
        const criticalIssues = issues.filter(i => i.impact === 'critical').length;
        const seriousIssues = issues.filter(i => i.impact === 'serious').length;

        if (criticalIssues > 0) {
            return {
                status: 'Non-compliant',
                color: 'danger',
                icon: 'times-circle'
            };
        }

        if (seriousIssues > 0) {
            return {
                status: 'Partially compliant',
                color: 'warning',
                icon: 'exclamation-circle'
            };
        }

        return {
            status: 'Mostly compliant',
            color: 'info',
            icon: 'info-circle'
        };
    };

    return (
        <div className="row">
            {Object.entries(issuesByLevel).map(([level, issues]) => {
                const status = getLevelStatus(level, issues);

                return (
                    <div className="col-md-4 mb-4" key={level}>
                        <div className="card h-100">
                            <div className={`card-header bg-${status.color} text-white`}>
                                <h5 className="mb-0">
                                    <i className={`fas fa-${status.icon} me-2`}></i>
                                    WCAG 2.1 Level {level}
                                </h5>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{getLevelDescription(level)}</p>

                                <div className={`alert alert-${status.color}`}>
                                    <strong>Status: {status.status}</strong>
                                    <p className="mb-0">
                                        {issues.length === 0
                                            ? 'No issues found at this level.'
                                            : `Found ${issues.length} issues at this level.`}
                                    </p>
                                </div>

                                {issues.length > 0 && (
                                    <div>
                                        <h6>Top issues to fix:</h6>
                                        <ul className="list-group">
                                            {issues.slice(0, 3).map((issue, index) => (
                                                <li key={index} className="list-group-item">
                                                    <span className={`badge bg-${getImpactColor(issue.impact)} me-2`}>
                                                        {issue.impact}
                                                    </span>
                                                    {issue.description}
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
                );
            })}
        </div>
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
