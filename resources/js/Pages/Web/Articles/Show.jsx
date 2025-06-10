import React, { useState } from "react";
import LayoutWeb from "../../../Layouts/Header";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import axios from "axios";

export default function ArticleShow() {
    const { article } = usePage().props;
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportForm, setReportForm] = useState({
        reason: '',
        description: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const handleReportSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await axios.post(`/articles/${article.id}/report`, reportForm);

            if (response.data.success) {
                setSubmitMessage(response.data.message);
                setReportForm({ reason: '', description: '' });
                setTimeout(() => {
                    setShowReportModal(false);
                    setSubmitMessage('');
                }, 2000);
            }
        } catch (error) {
            setSubmitMessage('An error occurred. Please try again.');
            console.error('Report submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReportForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <LayoutWeb>
            <Head>
                <title>UIX-Probe</title>
            </Head>
            <div className="container" style={{ marginTop: "80px" }}>
                <div className="fade-in">
                    <div className="row mb-4">
                        <div className="col-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link
                                            href="/articles"
                                            className="text-decoration-none"
                                            style={{
                                                color: "var(--nav-color)",
                                            }}
                                        >
                                            Articles
                                        </Link>
                                    </li>
                                    <li
                                        className="breadcrumb-item active"
                                        aria-current="page"
                                    >
                                        {article.title.length > 30
                                            ? article.title.substring(0, 30) +
                                              "..."
                                            : article.title}
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    <div className="row justify-content-center">
                        <div className="col-md-10 col-lg-8">
                            <div className="card border-0 rounded-4 shadow-sm mb-4">
                                <div className="card-body p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="img-fluid rounded-4 mb-4"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "400px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>

                                    <h1 className="fw-bold fs-2 mb-3">
                                        {article.title}
                                    </h1>

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                }}
                                            >
                                                <i
                                                    className="fas fa-user"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                ></i>
                                            </div>
                                            <div>
                                                <p className="mb-0 fw-semibold">
                                                    {article.user.first_name +
                                                        " " +
                                                        article.user.surname}
                                                </p>
                                                <p className="text-muted small mb-0">
                                                    Author
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-muted">
                                            <i className="far fa-calendar-alt me-1"></i>{" "}
                                            {article.updated_at}
                                        </div>
                                    </div>

                                    <hr className="my-4" />

                                    <div className="article-content">
                                        <div
                                            className="mt-4"
                                            dangerouslySetInnerHTML={{
                                                __html: article.content,
                                            }}
                                        ></div>
                                    </div>

                                    <div className="mt-5 pt-4 border-top">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Link
                                                href="/articles"
                                                className="btn btn-outline-secondary"
                                            >
                                                <i className="fas fa-arrow-left me-2"></i>{" "}
                                                Back to Articles
                                            </Link>
                                            <div className="d-flex">
                                                <button className="btn btn-outline-primary me-2">
                                                    <i className="fas fa-share-alt me-1"></i>{" "}
                                                    Share
                                                </button>
                                                <button className="btn btn-outline-danger me-2">
                                                    <i className="far fa-bookmark me-1"></i>{" "}
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning"
                                                    onClick={() => setShowReportModal(true)}
                                                >
                                                    <i className="fas fa-flag me-1"></i>{" "}
                                                    Report
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Report Modal */}
            {showReportModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-flag me-2 text-warning"></i>
                                    Report Article
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowReportModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleReportSubmit}>
                                <div className="modal-body">
                                    {submitMessage && (
                                        <div className={`alert ${submitMessage.includes('success') ? 'alert-success' : 'alert-danger'}`}>
                                            {submitMessage}
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label htmlFor="reason" className="form-label">Reason for reporting *</label>
                                        <select
                                            className="form-select"
                                            id="reason"
                                            name="reason"
                                            value={reportForm.reason}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a reason</option>
                                            <option value="inappropriate_content">Inappropriate Content</option>
                                            <option value="spam">Spam</option>
                                            <option value="misinformation">Misinformation</option>
                                            <option value="copyright_violation">Copyright Violation</option>
                                            <option value="harassment">Harassment</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Additional Details</label>
                                        <textarea
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            rows="3"
                                            value={reportForm.description}
                                            onChange={handleInputChange}
                                            placeholder="Please provide additional details about your report..."
                                        ></textarea>
                                    </div>

                                    <div className="alert alert-info">
                                        <i className="fas fa-info-circle me-2"></i>
                                        <small>
                                            All reports are reviewed by our moderation team.
                                            False reports may result in account restrictions.
                                        </small>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowReportModal(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-warning"
                                        disabled={isSubmitting || !reportForm.reason}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-flag me-2"></i>
                                                Submit Report
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </LayoutWeb>
    );
}
