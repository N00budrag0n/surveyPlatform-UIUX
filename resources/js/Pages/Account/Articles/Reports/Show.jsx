import React, { useState } from "react";
import LayoutAccount from "../../../../Layouts/Account";
import { Head, Link, router } from "@inertiajs/inertia-react";
import axios from "axios";

export default function ArticleReportShow({ report }) {
    const [status, setStatus] = useState(report.status);
    const [adminNotes, setAdminNotes] = useState(report.admin_notes || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("");

        try {
            const response = await axios.put(
                `/account/article-reports/${report.id}/status`,
                {
                    status,
                    admin_notes: adminNotes,
                }
            );

            if (response.data.success) {
                setMessage("Report status updated successfully!");
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            setMessage("Error updating report status.");
            console.error("Update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: "bg-warning",
            reviewed: "bg-info",
            resolved: "bg-success",
            dismissed: "bg-secondary",
        };
        return classes[status] || "bg-secondary";
    };

    const getReasonLabel = (reason) => {
        const labels = {
            inappropriate_content: "Inappropriate Content",
            spam: "Spam",
            misinformation: "Misinformation",
            copyright_violation: "Copyright Violation",
            harassment: "Harassment",
            other: "Other",
        };
        return labels[reason] || reason;
    };

    return (
        <LayoutAccount>
            <Head>
                <title>Report Details - UIX-Probe</title>
            </Head>

            <div className="row">
                <div className="col-md-8">
                    <div className="mb-0">
                        <h5 className="card-title">
                            <Link
                                href="/account/article-reports"
                                className="text-decoration-none me-2"
                            >
                                <i className="fa fa-arrow-left"></i>
                            </Link>
                            Report Details
                        </h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="d-flex justify-content-end">
                        <Link
                            href={`/articles/${report.article.id}/${report.article.slug}`}
                            className="btn btn-outline-primary btn-sm"
                            target="_blank"
                        >
                            <i className="fa fa-external-link-alt me-1"></i>
                            View Article
                        </Link>
                    </div>
                </div>
            </div>

            <hr />

            {message && (
                <div
                    className={`alert ${
                        message.includes("success")
                            ? "alert-success"
                            : "alert-danger"
                    }`}
                >
                    {message}
                </div>
            )}

            <div className="row">
                <div className="col-md-8">
                    {/* Report Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="fa fa-info-circle me-2"></i>
                                Report Information
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Reason:
                                        </label>
                                        <div>
                                            <span className="badge bg-light text-dark fs-6">
                                                {getReasonLabel(report.reason)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Status:
                                        </label>
                                        <div>
                                            <span
                                                className={`badge ${getStatusBadgeClass(
                                                    report.status
                                                )} fs-6`}
                                            >
                                                {report.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    report.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Reported At:
                                        </label>
                                        <div>{report.created_at}</div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-bold">
                                            Reporter:
                                        </label>
                                        <div>
                                            {report.user ? (
                                                <span>
                                                    {report.user.first_name}{" "}
                                                    {report.user.surname}
                                                </span>
                                            ) : (
                                                <span className="text-muted">
                                                    {report.reporter_email ||
                                                        "Anonymous"}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {report.description && (
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Additional Details:
                                    </label>
                                    <div className="p-3 bg-light rounded">
                                        {report.description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Article Information */}
                    <div className="card mb-4">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="fa fa-newspaper me-2"></i>
                                Reported Article
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="d-flex align-items-start">
                                <img
                                    src={report.article.image}
                                    alt={report.article.title}
                                    className="me-3 rounded"
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                    }}
                                />
                                <div>
                                    <h6 className="mb-1">
                                        {report.article.title}
                                    </h6>
                                    <p className="text-muted mb-1">
                                        by {report.article.user.first_name}{" "}
                                        {report.article.user.surname}
                                    </p>
                                    <p className="text-muted small mb-0">
                                        Published: {report.article.created_at}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    {/* Update Status Form */}
                    <div className="card">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="fa fa-edit me-2"></i>
                                Update Report
                            </h6>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleStatusUpdate}>
                                <div className="mb-3">
                                    <label
                                        htmlFor="status"
                                        className="form-label"
                                    >
                                        Status:
                                    </label>
                                    <select
                                        id="status"
                                        className="form-select"
                                        value={status}
                                        onChange={(e) =>
                                            setStatus(e.target.value)
                                        }
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="reviewed">
                                            Reviewed
                                        </option>
                                        <option value="resolved">
                                            Resolved
                                        </option>
                                        <option value="dismissed">
                                            Dismissed
                                        </option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label
                                        htmlFor="adminNotes"
                                        className="form-label"
                                    >
                                        Admin Notes:
                                    </label>
                                    <textarea
                                        id="adminNotes"
                                        className="form-control"
                                        rows="4"
                                        value={adminNotes}
                                        onChange={(e) =>
                                            setAdminNotes(e.target.value)
                                        }
                                        placeholder="Add notes about this report..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa fa-save me-2"></i>
                                            Update Report
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card mt-3">
                        <div className="card-header">
                            <h6 className="mb-0">
                                <i className="fa fa-bolt me-2"></i>
                                Quick Actions
                            </h6>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() => {
                                        setStatus("resolved");
                                        setAdminNotes(
                                            "Resolved - No action needed"
                                        );
                                    }}
                                >
                                    <i className="fa fa-check me-1"></i>
                                    Mark as Resolved
                                </button>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => {
                                        setStatus("dismissed");
                                        setAdminNotes(
                                            "Dismissed - Invalid report"
                                        );
                                    }}
                                >
                                    <i className="fa fa-times me-1"></i>
                                    Dismiss Report
                                </button>
                                <Link
                                    href={`/account/articles/${report.article.id}/edit`}
                                    className="btn btn-warning btn-sm"
                                >
                                    <i className="fa fa-edit me-1"></i>
                                    Edit Article
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutAccount>
    );
}
