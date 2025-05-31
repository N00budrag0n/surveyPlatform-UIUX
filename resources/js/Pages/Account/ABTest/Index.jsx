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

     // Export modal states
    const [showExportModal, setShowExportModal] = useState(false);
    const [selectedSurveys, setSelectedSurveys] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);

    // Make sure survey exists before accessing its properties
    const surveyTitle = survey ? survey.title : "A/B Testing Results";

    const handleExport = () => {
        setShowExportModal(true);
    };

    const handleSurveySelection = (surveyId) => {
        setSelectedSurveys(prev => {
            if (prev.includes(surveyId)) {
                return prev.filter(id => id !== surveyId);
            } else {
                return [...prev, surveyId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedSurveys.length === surveyTitles.length) {
            setSelectedSurveys([]);
        } else {
            setSelectedSurveys(surveyTitles.map(survey => survey.id));
        }
    };

    const handleConfirmExport = async () => {
        if (selectedSurveys.length === 0) {
            alert('Pilih minimal satu survei untuk diekspor');
            return;
        }

        setExportLoading(true);
        try {
            const surveyIds = selectedSurveys.join(',');
            window.location.href = `/account/responses/ab_test/export?surveys=${surveyIds}`;
            setShowExportModal(false);
            setSelectedSurveys([]);
        } catch (error) {
            alert('Terjadi kesalahan saat mengekspor data');
        } finally {
            setExportLoading(false);
        }
    };

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
                            {survey && hasAnyPermission(["ab_test.export"]) && (
                                <div className="col-md-6 mb-2 text-end">
                                    <button 
                                        onClick={handleExport}
                                        className="btn btn-success"
                                    >
                                        <i className="fas fa-file-excel me-2"></i>
                                        Export to Excel
                                    </button>
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

                {/* Export Modal */}
                {showExportModal && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-download me-2"></i>
                                        Export Data A/B Testing
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setShowExportModal(false);
                                            setSelectedSurveys([]);
                                        }}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <p className="text-muted">
                                            Pilih survei yang ingin diekspor ke Excel:
                                        </p>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="selectAll"
                                                checked={selectedSurveys.length === surveyTitles.length}
                                                onChange={handleSelectAll}
                                            />
                                            <label className="form-check-label fw-bold" htmlFor="selectAll">
                                                Pilih Semua
                                            </label>
                                        </div>
                                        <hr />
                                    </div>

                                    <div className="survey-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {surveyTitles.map((surveyItem) => (
                                            <div key={surveyItem.id} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`survey-${surveyItem.id}`}
                                                    checked={selectedSurveys.includes(surveyItem.id)}
                                                    onChange={() => handleSurveySelection(surveyItem.id)}
                                                />
                                                <label 
                                                    className="form-check-label" 
                                                    htmlFor={`survey-${surveyItem.id}`}
                                                >
                                                    {surveyItem.title}
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedSurveys.length > 0 && (
                                        <div className="mt-3 p-3 bg-light rounded">
                                            <small className="text-muted">
                                                <i className="fas fa-info-circle me-1"></i>
                                                {selectedSurveys.length} survei dipilih untuk diekspor
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowExportModal(false);
                                            setSelectedSurveys([]);
                                        }}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleConfirmExport}
                                        disabled={selectedSurveys.length === 0 || exportLoading}
                                    >
                                        {exportLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Mengekspor...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-download me-2"></i>
                                                Export ({selectedSurveys.length})
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showExportModal && <div className="modal-backdrop fade show"></div>}
            </LayoutAccount>
        </>
    );
}