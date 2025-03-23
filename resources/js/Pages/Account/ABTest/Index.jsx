import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import ABTestingResults from "../../../Components/ABTestingResults";
import ABTestingRespondents from "../../../Components/ABTestingRespondents";

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
    
    const [activeTab, setActiveTab] = useState('results');
    
    const handleExport = () => {
        window.location.href = `/account/ab_test/${survey.id}/export`;
    };
    
    return (
        <>
            <Head>
                <title>A/B Testing Results - {survey.title}</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6 col-12 mb-2">
                                <select 
                                    className="form-select"
                                    value={survey.id}
                                    onChange={(e) => {
                                        Inertia.get(`/account/ab_test/${e.target.value}`);
                                    }}
                                >
                                    {surveyTitles.map((title) => (
                                        <option key={title.id} value={title.id}>
                                            {title.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6 col-12 mb-2 text-end">
                                <ButtonCRUD
                                    type="button"
                                    label="Export to Excel"
                                    color="btn-success"
                                    iconClass="fa fa-file-excel"
                                    onClick={handleExport}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <CardContent title={`A/B Testing Results - ${survey.title}`} icon="fa fa-chart-bar">
                    <div className="mb-4">
                        <div className="alert alert-info">
                            <strong>Total Respondents:</strong> {respondentCount || 0}
                        </div>
                        
                        <ul className="nav nav-tabs">
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'results' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('results')}
                                >
                                    Results
                                </button>
                            </li>
                            <li className="nav-item">
                                <button 
                                    className={`nav-link ${activeTab === 'respondents' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('respondents')}
                                >
                                    Respondent Details
                                </button>
                            </li>
                        </ul>
                        
                        <div className="tab-content mt-3">
                            {activeTab === 'results' ? (
                                <ABTestingResults 
                                    abTestResults={abTestResults}
                                    abTestQuestions={abTestQuestions}
                                    demographicRespondents={demographicRespondents}
                                />
                            ) : (
                                <ABTestingRespondents 
                                    abTestSurveyResults={abTestSurveyResults}
                                    abTestQuestions={abTestQuestions}
                                />
                            )}
                        </div>
                    </div>
                </CardContent>
            </LayoutAccount>
        </>
    );
}
