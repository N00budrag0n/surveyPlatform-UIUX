import React from "react";

export default function TextSummary({ summary, variantName }) {
    if (!summary || !summary.summaries) return null;

    const { summaries, dominant_language } = summary;
    const dominantSummary = summaries[dominant_language];

    if (!dominantSummary) return null;

    return (
        <div className="text-summary mb-3">
            <h6>Summary of Reasons for {variantName}:</h6>
            <div className="p-3 border rounded bg-light">
                <p className="mb-0">{dominantSummary}</p>
            </div>

            {/* If there are multiple languages, show the other language summary too */}
            {Object.keys(summaries).length > 1 && dominant_language === 'en' && summaries['id'] && (
                <div className="mt-2">
                    <small className="text-muted">Indonesian summary:</small>
                    <p className="mb-0 small text-muted">{summaries['id']}</p>
                </div>
            )}

            {Object.keys(summaries).length > 1 && dominant_language === 'id' && summaries['en'] && (
                <div className="mt-2">
                    <small className="text-muted">English summary:</small>
                    <p className="mb-0 small text-muted">{summaries['en']}</p>
                </div>
            )}

            <div className="mt-2">
                <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Based on {summary.total_reasons} reasons.
                </small>
            </div>
        </div>
    );
}
