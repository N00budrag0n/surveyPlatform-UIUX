import React from "react";

export default function ThemeComparison({ themeAnalysis, variantAName, variantBName }) {
    if (!themeAnalysis) return null;

    // Handle single variant analysis
    if (themeAnalysis.single_variant) {
        const variant = themeAnalysis.analyzed_variant === 'a' ? 'variant_a' : 'variant_b';
        const variantName = themeAnalysis.analyzed_variant === 'a' ? variantAName : variantBName;
        const summary = themeAnalysis[variant];

        if (!summary) return null;

        return (
            <div className="theme-analysis mt-4 p-3 border rounded bg-light">
                <h6 className="mb-3">Theme Analysis for {variantName} (Most Voted):</h6>

                {summary.by_language && Object.keys(summary.by_language).map(lang => {
                    const langSummary = summary.by_language[lang];
                    if (!langSummary || !langSummary.keywords || langSummary.keywords.length === 0) return null;

                    return (
                        <div key={lang} className="mb-3">
                            <h6 className="text-primary">Top Themes:</h6>
                            <div className="table-responsive">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Theme</th>
                                            <th>Count</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {langSummary.keywords.slice(0, 5).map((keyword, index) => (
                                            <tr key={index}>
                                                <td>{keyword.term}</td>
                                                <td>{keyword.count}</td>
                                                <td>{keyword.percentage}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {langSummary.groups && langSummary.groups.length > 0 && (
                                <div className="mt-3">
                                    <h6 className="text-primary">Key Reason Groups:</h6>
                                    <div className="accordion" id={`accordion-${lang}`}>
                                        {langSummary.groups.slice(0, 3).map((group, groupIndex) => (
                                            <div key={groupIndex} className="accordion-item">
                                                <h2 className="accordion-header">
                                                    <button
                                                        className="accordion-button collapsed"
                                                        type="button"
                                                        data-bs-toggle="collapse"
                                                        data-bs-target={`#collapse-${lang}-${groupIndex}`}
                                                    >
                                                        {group.keywords.join(', ')}
                                                        <span className="badge bg-primary ms-2">{group.count} reasons</span>
                                                    </button>
                                                </h2>
                                                <div
                                                    id={`collapse-${lang}-${groupIndex}`}
                                                    className="accordion-collapse collapse"
                                                >
                                                    <div className="accordion-body">
                                                        <ul className="list-group">
                                                            {group.reasons.slice(0, 3).map((reason, reasonIndex) => (
                                                                <li key={reasonIndex} className="list-group-item">{reason}</li>
                                                            ))}
                                                            {group.reasons.length > 3 && (
                                                                <li className="list-group-item text-center text-muted">
                                                                    <em>+ {group.reasons.length - 3} more similar reasons</em>
                                                                </li>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {summary.total_reasons && (
                    <div className="mt-3 text-muted">
                        <small>
                            <i className="fas fa-info-circle me-1"></i>
                            Analysis based on {summary.total_reasons} reasons.
                        </small>
                    </div>
                )}
            </div>
        );
    }

    // Handle comparative analysis (tie case)
    const { comparison } = themeAnalysis;
    if (!comparison) return null;

    return (
        <div className="theme-comparison mt-4 p-3 border rounded bg-light">
            <h6 className="mb-3">Theme Comparison Between Variants (Tie Result):</h6>

            {comparison.common && comparison.common.length > 0 && (
                <div className="mb-4">
                    <h6 className="text-primary">Common Themes:</h6>
                    <div className="table-responsive">
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Theme</th>
                                    <th>{variantAName}</th>
                                    <th>{variantBName}</th>
                                    <th>Difference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.common.slice(0, 5).map((theme, index) => (
                                    <tr key={index}>
                                        <td>{theme.term}</td>
                                        <td>{theme.variant_a.percentage}%</td>
                                        <td>{theme.variant_b.percentage}%</td>
                                        <td className={theme.difference > 0 ? 'text-success' : 'text-danger'}>
                                            {theme.difference > 0 ? '+' : ''}{theme.difference}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="row">
                {comparison.unique_to_a && comparison.unique_to_a.length > 0 && (
                    <div className="col-md-6">
                        <h6 className="text-success">Unique to {variantAName}:</h6>
                        <ul className="list-group">
                            {comparison.unique_to_a.slice(0, 5).map((theme, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {theme.term}
                                    <span className="badge bg-success rounded-pill">{theme.percentage}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {comparison.unique_to_b && comparison.unique_to_b.length > 0 && (
                    <div className="col-md-6">
                        <h6 className="text-danger">Unique to {variantBName}:</h6>
                        <ul className="list-group">
                            {comparison.unique_to_b.slice(0, 5).map((theme, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {theme.term}
                                    <span className="badge bg-danger rounded-pill">{theme.percentage}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {themeAnalysis.counts && (
                <div className="mt-3 text-muted">
                    <small>
                        <i className="fas fa-info-circle me-1"></i>
                        Analysis based on {themeAnalysis.counts.variant_a} reasons for {variantAName} and {themeAnalysis.counts.variant_b} reasons for {variantBName}.
                    </small>
                </div>
            )}
        </div>
    );
}
