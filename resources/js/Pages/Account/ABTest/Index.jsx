import React from "react";
import { Head, usePage } from "@inertiajs/inertia-react";
import LayoutAccount from "../../../Layouts/Account";
import ABTestingResults from "../../../Components/ABTestingResults";
import ABTestingRespondents from "../../../Components/ABTestingRespondents";
import { Link } from "@inertiajs/inertia-react";

export default function ABTestIndex() {
    const { 
        surveyTitles, 
        survey, 
        respondentCount, 
        demographicRespondents, 
        abTestResults, 
        abTestSurveyResults, 
        abTestQuestions 
    } = usePage().props;

    // Make sure survey exists before accessing its properties
    const surveyTitle = survey ? survey.title : "A/B Testing Results";

    return (
        <>
            <Head title={surveyTitle} />
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <select 
                                    className="form-select" 
                                    onChange={(e) => window.location.href = `/account/ab_test/${e.target.value}`}
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
                                        href={`/account/responses/ab_test/${survey.id}/export`} 
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
                            <i className="fas fa-balance-scale me-2"></i>
                            A/B Testing Results {survey && `- ${survey.title}`}
                        </h5>
                    </div>
                    <div className="card-body">
                        {respondentCount === 0 ? (
                            <div className="alert alert-warning">
                                No responses yet for this survey.
                            </div>
                        ) : (
                            <div>
                                <div className="alert alert-info">
                                    <strong>Total Respondents:</strong> {respondentCount}
                                </div>
                                
                                <ul className="nav nav-tabs" id="abTestTabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className="nav-link active" 
                                            id="results-tab" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#results" 
                                            type="button" 
                                            role="tab"
                                        >
                                            Results Analysis
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button 
                                            className="nav-link" 
                                            id="respondents-tab" 
                                            data-bs-toggle="tab" 
                                            data-bs-target="#respondents" 
                                            type="button" 
                                            role="tab"
                                        >
                                            Individual Responses
                                        </button>
                                    </li>
                                </ul>
                                
                                <div className="tab-content mt-4" id="abTestTabsContent">
                                    <div 
                                        className="tab-pane fade show active" 
                                        id="results" 
                                        role="tabpanel"
                                    >
                                        <ABTestingResults 
                                            abTestResults={abTestResults} 
                                            abTestQuestions={abTestQuestions}
                                            demographicRespondents={demographicRespondents}
                                        />
                                    </div>
                                    <div 
                                        className="tab-pane fade" 
                                        id="respondents" 
                                        role="tabpanel"
                                    >
                                        <ABTestingRespondents 
                                            abTestSurveyResults={abTestSurveyResults}
                                            abTestQuestions={abTestQuestions}
                                        />
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