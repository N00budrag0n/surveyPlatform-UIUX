import React, { useState } from "react";
import LayoutAccount from "../../../../Layouts/Account";
import { Head, Link, usePage, router } from "@inertiajs/inertia-react";

export default function ArticleReportsIndex() {
    const { reports, statusCounts, filters } = usePage().props;
    const [selectedReports, setSelectedReports] = useState([]);
    const [bulkStatus, setBulkStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    console.log(reports);

    const handleBulkUpdate = async () => {
        if (!selectedReports.length || !bulkStatus) return;

        setIsUpdating(true);
        try {
            await axios.post("/account/article-reports/bulk-update", {
                report_ids: selectedReports,
                status: bulkStatus,
            });

            router.reload();
            setSelectedReports([]);
            setBulkStatus("");
        } catch (error) {
            console.error("Bulk update failed:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedReports(reports.data.map((report) => report.id));
        } else {
            setSelectedReports([]);
        }
    };

    const handleSelectReport = (reportId) => {
        setSelectedReports((prev) =>
            prev.includes(reportId)
                ? prev.filter((id) => id !== reportId)
                : [...prev, reportId]
        );
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
                <title>Article Reports - UIX-Probe</title>
            </Head>

            <div className="row align-items-center">
                <div className="col-md-8">
                    <div className="mb-0">
                        <h5 className="card-title">
                            <i className="fa fa-flag me-2"></i>
                            Article Reports
                        </h5>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="d-flex justify-content-end">
                        {selectedReports.length > 0 && (
                            <div className="d-flex align-items-center">
                                <select
                                    className="form-select form-select-sm me-2"
                                    value={bulkStatus}
                                    onChange={(e) =>
                                        setBulkStatus(e.target.value)
                                    }
                                >
                                    <option value="">Select Status</option>
                                    <option value="reviewed">
                                        Mark as Reviewed
                                    </option>
                                    <option value="resolved">
                                        Mark as Resolved
                                    </option>
                                    <option value="dismissed">
                                        Mark as Dismissed
                                    </option>
                                </select>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={handleBulkUpdate}
                                    disabled={isUpdating || !bulkStatus}
                                >
                                    {isUpdating ? "Updating..." : "Update"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <hr />

            {/* Status Summary Cards */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card border-warning">
                        <div className="card-body text-center">
                            <h5 className="text-warning">
                                {statusCounts.pending}
                            </h5>
                            <small>Pending</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-info">
                        <div className="card-body text-center">
                            <h5 className="text-info">
                                {statusCounts.reviewed}
                            </h5>
                            <small>Reviewed</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-success">
                        <div className="card-body text-center">
                            <h5 className="text-success">
                                {statusCounts.resolved}
                            </h5>
                            <small>Resolved</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-secondary">
                        <div className="card-body text-center">
                            <h5 className="text-secondary">
                                {statusCounts.dismissed}
                            </h5>
                            <small>Dismissed</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <form>
                        <div className="row">
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search articles..."
                                    defaultValue={filters.q}
                                    onChange={(e) => {
                                        router.get(
                                            "/account/article-reports",
                                            {
                                                ...filters,
                                                q: e.target.value,
                                            },
                                            { preserveState: true }
                                        );
                                    }}
                                />
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={filters.status || ""}
                                    onChange={(e) => {
                                        router.get(
                                            "/account/article-reports",
                                            {
                                                ...filters,
                                                status: e.target.value,
                                            },
                                            { preserveState: true }
                                        );
                                    }}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="resolved">Resolved</option>
                                    <option value="dismissed">Dismissed</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={filters.reason || ""}
                                    onChange={(e) => {
                                        router.get(
                                            "/account/article-reports",
                                            {
                                                ...filters,
                                                reason: e.target.value,
                                            },
                                            { preserveState: true }
                                        );
                                    }}
                                >
                                    <option value="">All Reasons</option>
                                    <option value="inappropriate_content">
                                        Inappropriate Content
                                    </option>
                                    <option value="spam">Spam</option>
                                    <option value="misinformation">
                                        Misinformation
                                    </option>
                                    <option value="copyright_violation">
                                        Copyright Violation
                                    </option>
                                    <option value="harassment">
                                        Harassment
                                    </option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary w-100"
                                    onClick={() =>
                                        router.get("/account/article-reports")
                                    }
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Reports Table */}
            <div className="card">
                <div className="card-body">
                    {reports.data.length > 0 ? (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th style={{ width: "5%" }}>
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={
                                                        selectedReports.length ===
                                                        reports.data.length
                                                    }
                                                />
                                            </th>
                                            <th style={{ width: "20%" }}>
                                                Article
                                            </th>
                                            <th style={{ width: "15%" }}>
                                                Reason
                                            </th>
                                            <th style={{ width: "15%" }}>
                                                Reporter
                                            </th>
                                            <th style={{ width: "10%" }}>
                                                Status
                                            </th>
                                            <th style={{ width: "15%" }}>
                                                Reported At
                                            </th>
                                            <th style={{ width: "20%" }}>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.data.map((report) => (
                                            <tr key={report.id}>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedReports.includes(
                                                            report.id
                                                        )}
                                                        onChange={() =>
                                                            handleSelectReport(
                                                                report.id
                                                            )
                                                        }
                                                    />
                                                </td>
                                                <td>
                                                    <div>
                                                        <strong>
                                                            {
                                                                report.article
                                                                    .title
                                                            }
                                                        </strong>
                                                        <br />
                                                        <small className="text-muted">
                                                            by{" "}
                                                            {
                                                                report.article.user?.first_name
                                                            }{" "}
                                                            {
                                                                report.article.user?.surname
                                                            }
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-light text-dark">
                                                        {getReasonLabel(
                                                            report.reason
                                                        )}
                                                    </span>
                                                </td>
                                                <td>
                                                    {report.user ? (
                                                        <span>
                                                            {
                                                                report.user
                                                                    .first_name
                                                            }{" "}
                                                            {
                                                                report.user
                                                                    .surname
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted">
                                                            {report.reporter_email ||
                                                                "Anonymous"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span
                                                        className={`badge ${getStatusBadgeClass(
                                                            report.status
                                                        )}`}
                                                    >
                                                        {report.status
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            report.status.slice(
                                                                1
                                                            )}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small>
                                                        {report.created_at}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-1">
                                                        <Link
                                                            href={`/account/article-reports/${report.id}`}
                                                            className="btn btn-sm btn-primary"
                                                        >
                                                            <i className="fa fa-eye"></i>
                                                        </Link>
                                                        <Link
                                                            href={`/articles/${report.article.id}/${report.article.slug}`}
                                                            className="btn btn-sm btn-outline-primary"
                                                            target="_blank"
                                                        >
                                                            <i className="fa fa-external-link-alt"></i>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    <small className="text-muted">
                                        Showing {reports.from} to {reports.to}{" "}
                                        of {reports.total} results
                                    </small>
                                </div>
                                <div>
                                    {reports.links && (
                                        <nav>
                                            <ul className="pagination pagination-sm mb-0">
                                                {reports.links.map(
                                                    (link, index) => (
                                                        <li
                                                            key={index}
                                                            className={`page-item ${
                                                                link.active
                                                                    ? "active"
                                                                    : ""
                                                            } ${
                                                                !link.url
                                                                    ? "disabled"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {link.url ? (
                                                                <Link
                                                                    href={
                                                                        link.url
                                                                    }
                                                                    className="page-link"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <span
                                                                    className="page-link"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: link.label,
                                                                    }}
                                                                />
                                                            )}
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </nav>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fa fa-flag fa-3x text-muted mb-3"></i>
                            <h5 className="text-muted">No Reports Found</h5>
                            <p className="text-muted">
                                {Object.values(filters).some((f) => f)
                                    ? "No reports match your current filters."
                                    : "No article reports have been submitted yet."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </LayoutAccount>
    );
}
