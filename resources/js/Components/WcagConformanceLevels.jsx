import React from "react";

export default function WcagConformanceLevels({ issuesByLevel, conformanceLevel }) {
    const getLevelDescription = (level) => {
        switch (level) {
            case 'A':
                return 'Level A is the minimum level of conformance. These are the most basic accessibility features that must be met for any WCAG conformance. Multiple identical violation recognized as one violation*.';
            case 'AA':
                return 'Level AA addresses major barriers for users with disabilities. This is the recommended standard for most websites and is required by many accessibility laws. Multiple identical violation recognized as one violation*.';
            case 'AAA':
                return 'Level AAA is the highest level of conformance. It addresses the most comprehensive accessibility requirements but may not be achievable for all content. Multiple identical violation recognized as one violation*.';
            default:
                return '';
        }
    };

    const getLevelStatus = (level, issues, currentConformance) => {
        const hasIssues = issues && issues.length > 0;

        if (!hasIssues) {
            return {
                status: 'Compliant',
                color: 'success',
                icon: 'check-circle'
            };
        }

        // Critical issues always mean non-compliance
        const criticalIssues = issues.filter(i => i.impact === 'critical').length;
        if (criticalIssues > 0) {
            return {
                status: 'Non-compliant',
                color: 'danger',
                icon: 'times-circle'
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

        // For AA and AAA, determine based on severity
        const seriousIssues = issues.filter(i => i.impact === 'serious').length;
        if (seriousIssues > 0) {
            return {
                status: 'Non-compliant',
                color: 'danger',
                icon: 'times-circle'
            };
        }

        return {
            status: 'Minor issues',
            color: 'warning',
            icon: 'exclamation-circle'
        };
    };

    const getOverallConformanceMessage = () => {
        switch (conformanceLevel) {
            case 'Non-conformant':
                return {
                    message: 'Website does not meet WCAG conformance requirements',
                    color: 'danger',
                    icon: 'times-circle'
                };
            case 'A':
                return {
                    message: 'Website meets WCAG Level A conformance',
                    color: 'info',
                    icon: 'check-circle'
                };
            case 'AA':
                return {
                    message: 'Website meets WCAG Level AA conformance',
                    color: 'warning',
                    icon: 'check-circle'
                };
            case 'AAA':
                return {
                    message: 'Website meets WCAG Level AAA conformance',
                    color: 'success',
                    icon: 'check-circle'
                };
            default:
                return {
                    message: 'Conformance level unknown',
                    color: 'secondary',
                    icon: 'question-circle'
                };
        }
    };

    const overallStatus = getOverallConformanceMessage();

    return (
        <div>
            {/* Overall Conformance Status */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className={`alert alert-${overallStatus.color}`}>
                        <h5 className="alert-heading">
                            <i className={`fas fa-${overallStatus.icon} me-2`}></i>
                            Overall WCAG Conformance: {conformanceLevel}
                        </h5>
                        <p className="mb-0">{overallStatus.message}</p>
                        {conformanceLevel === 'Non-conformant' && (
                            <hr className="my-2" />
                        )}
                        {conformanceLevel === 'Non-conformant' && (
                            <small>
                                <strong>Important:</strong> WCAG conformance is hierarchical.
                                Level A requirements must be met before claiming any level of conformance.
                            </small>
                        )}
                    </div>
                </div>
            </div>

            {/* Individual Level Status */}
            <div className="row">
                {Object.entries(issuesByLevel).map(([level, issues]) => {
                    const status = getLevelStatus(level, issues, conformanceLevel);

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
                                            <h6>Issues to fix:</h6>
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
                                                        <small className="text-muted">
                                                            +{issues.length - 3} more issues
                                                        </small>
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
