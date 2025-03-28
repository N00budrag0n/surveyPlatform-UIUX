import React from "react";

export default function WcagComplianceScore({ score }) {
    // Determine color based on score
    const getScoreColor = () => {
        if (score >= 90) return 'success';
        if (score >= 70) return 'warning';
        return 'danger';
    };

    // Determine message based on score
    const getScoreMessage = () => {
        if (score >= 90) return 'Excellent';
        if (score >= 80) return 'Good';
        if (score >= 70) return 'Fair';
        if (score >= 50) return 'Poor';
        return 'Critical';
    };

    return (
        <div className="card h-100">
            <div className="card-body text-center">
                <h5 className="card-title">Compliance Score</h5>
                <div className="my-4">
                    <div className={`display-1 text-${getScoreColor()}`}>
                        {score}%
                    </div>
                    <h4 className={`text-${getScoreColor()} mt-2`}>
                        {getScoreMessage()}
                    </h4>
                </div>
                <p className="card-text">
                    {score >= 90 ? (
                        "Your website has excellent accessibility. Keep up the good work!"
                    ) : score >= 70 ? (
                        "Your website has good accessibility but there's room for improvement."
                    ) : score >= 50 ? (
                        "Your website has significant accessibility issues that should be addressed."
                    ) : (
                        "Your website has critical accessibility issues that need immediate attention."
                    )}
                </p>
            </div>
        </div>
    );
}
