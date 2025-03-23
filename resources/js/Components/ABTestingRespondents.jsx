import React, { useState } from "react";

export default function ABTestingRespondents({ abTestSurveyResults, abTestQuestions }) {
    const [expandedRespondent, setExpandedRespondent] = useState(null);
    
    // Parse the questions data to get comparison details
    const getComparisonDetails = () => {
        if (!abTestQuestions || abTestQuestions.length === 0) {
            return {};
        }
        
        const questionsData = JSON.parse(abTestQuestions[0].questions_data);
        if (!questionsData.ab_testing) {
            return {};
        }
        
        const details = {};
        
        questionsData.ab_testing.forEach(group => {
            details[group.name] = {
                name: group.name,
                description: group.description,
                comparisons: {}
            };
            
            group.comparisons.forEach(comparison => {
                details[group.name].comparisons[comparison.id] = {
                    id: comparison.id,
                    title: comparison.title,
                    variant_a: comparison.variant_a,
                    variant_b: comparison.variant_b
                };
            });
        });
        
        return details;
    };
    
    const comparisonDetails = getComparisonDetails();
    
    const toggleRespondent = (id) => {
        if (expandedRespondent === id) {
            setExpandedRespondent(null);
        } else {
            setExpandedRespondent(id);
        }
    };
    
    if (!abTestSurveyResults || abTestSurveyResults.length === 0) {
        return <div className="alert alert-warning">No respondent data available</div>;
    }
    
    return (
        <div>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Respondent Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {abTestSurveyResults.map((respondent) => (
                            <React.Fragment key={respondent.id}>
                                <tr>
                                    <td>{respondent.id}</td>
                                    <td>{respondent.respondentName}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-primary"
                                            onClick={() => toggleRespondent(respondent.id)}
                                        >
                                            {expandedRespondent === respondent.id ? 'Hide Details' : 'View Details'}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRespondent === respondent.id && (
                                    <tr>
                                        <td colSpan="3">
                                            <div className="p-3">
                                                <h5>A/B Testing Responses</h5>
                                                {respondent.answerData.map((group, groupIndex) => (
                                                    <div key={groupIndex} className="card mb-3">
                                                        <div className="card-header">
                                                            <h6>{group.name}</h6>
                                                            {comparisonDetails[group.name]?.description && (
                                                                <p className="text-muted mb-0">{comparisonDetails[group.name].description}</p>
                                                            )}
                                                        </div>
                                                        <div className="card-body">
                                                            {group.responses && group.responses.map((response, responseIndex) => {
                                                                const comparisonDetail = comparisonDetails[group.name]?.comparisons[response.id];
                                                                if (!comparisonDetail) return null;
                                                                
                                                                const selectedVariant = response.selected === 'a' 
                                                                    ? comparisonDetail.variant_a 
                                                                    : comparisonDetail.variant_b;
                                                                
                                                                return (
                                                                    <div key={responseIndex} className="mb-3 pb-3 border-bottom">
                                                                        <h6>{comparisonDetail.title}</h6>
                                                                        <p>
                                                                            <strong>Selected:</strong> {selectedVariant.title}
                                                                        </p>
                                                                        {response.reason && (
                                                                            <p>
                                                                                <strong>Reason:</strong> {response.reason}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}