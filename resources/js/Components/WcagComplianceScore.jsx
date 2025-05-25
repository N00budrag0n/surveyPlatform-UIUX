import React from "react";

export default function WcagComplianceScore({ score, conformanceLevel }) {
    // Determine color based on score
    const getScoreColor = () => {
        if (conformanceLevel === 'Non-conformant') return 'danger';
        if (conformanceLevel === 'AAA') return 'success';
        if (conformanceLevel === 'AA') return 'warning';
        if (conformanceLevel === 'A') return 'info';
        return 'secondary';
    };

    // Determine message based on score
    const getScoreMessage = () => {
        if (conformanceLevel === 'Non-conformant') {
            return 'Non-conformant - Level A requirements not met';
        }
        if (conformanceLevel === 'AAA') {
            return 'Excellent - Meets highest accessibility standards';
        }
        if (conformanceLevel === 'AA') {
            return 'Good - Meets recommended accessibility standards';
        }
        if (conformanceLevel === 'A') {
            return 'Basic - Meets minimum accessibility standards';
        }
        return 'Unknown conformance level';
    };

    // Determine WCAG conformance level based on score
    const getConformanceLevel = () => {
        switch (conformanceLevel) {
            case 'AAA': return 'success';
            case 'AA': return 'warning';
            case 'A': return 'info';
            case 'Non-conformant': return 'danger';
            default: return 'secondary';
        }
    };

    const conformance = getConformanceLevel();

     return (
        <div className="card h-100">
            <div className="card-body text-center">
                <h5 className="card-title">WCAG Compliance</h5>
                <div className="my-4">
                    <div className={`display-1 text-${getScoreColor()}`}>
                        {score}%
                    </div>
                    <div className="mt-3">
                        <span className={`badge bg-${getScoreColor()} fs-6 p-2`}>
                            WCAG 2.1 {conformanceLevel}
                        </span>
                    </div>
                    <h4 className={`text-${getScoreColor()} mt-3`}>
                        {getScoreMessage()}
                    </h4>
                </div>
                <div className="mt-3">
                    <small className="text-muted">
                        {conformanceLevel === 'Non-conformant' ? (
                            <>
                                <i className="fas fa-exclamation-triangle me-1"></i>
                                Level A failures prevent any WCAG conformance
                            </>
                        ) : (
                            <>
                                <i className="fas fa-info-circle me-1"></i>
                                Conformance requires meeting all lower level criteria
                            </>
                        )}
                    </small>
                </div>
            </div>
        </div>
    );
}
