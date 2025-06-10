import React from "react";
import hasAnyPermission from "../Utils/Permissions";
import { Link, usePage } from "@inertiajs/inertia-react";
import "./sidebar.css"; // Import the CSS

export default function Sidebar() {
    const { url } = usePage();

    return (
        <>
            <div
                className="list-group list-group-flush"
                style={{
                    maxHeight: 'calc(100vh - 120px)', // Adjust based on your header height
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    scrollbarWidth: 'thin', // For Firefox
                    scrollbarColor: '#888 #f1f1f1' // For Firefox
                }}
            >
                {hasAnyPermission([
                    "dashboard.index",
                    "dashboard.index.full",
                ]) && (
                    <Link
                        href="/account/dashboard"
                        className={`${
                            url.startsWith("/account/dashboard")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-tachometer-alt me-2"></i> Dashboard
                    </Link>
                )}

                {hasAnyPermission(["sus.index", "sus.index.full"]) && (
                    <Link
                        href="/account/sus"
                        className={`${
                            url.startsWith("/account/sus")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-poll-h me-2"></i> SUS Results
                    </Link>
                )}

                {hasAnyPermission(["tam.index", "tam.index.full"]) && (
                    <Link
                        href="/account/tam"
                        className={`${
                            url.startsWith("/account/tam")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-poll-h me-2"></i> TAM Results
                    </Link>
                )}

                {hasAnyPermission(["ab_test.index", "ab_test.index.full"]) && (
                    <Link
                        href="/account/ab_test"
                        className={`${
                            url.startsWith("/account/ab_test")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-poll-h me-2"></i> A/B Testing Results
                    </Link>
                )}

                {hasAnyPermission(["wcag_test.index", "wcag_test.index.full"]) && (
                    <Link
                        href="/account/wcag_test"
                        className={`${
                            url.startsWith("/account/wcag_test")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-poll-h me-2"></i> WCAG Testing Results
                    </Link>
                )}

                {hasAnyPermission(["surveys.index", "surveys.index.full"]) && (
                    <Link
                        href="/account/surveys"
                        className={`${
                            url.startsWith("/account/surveys")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-scroll me-2"></i> Surveys
                    </Link>
                )}

                {hasAnyPermission(["categories.index"]) && (
                    <Link
                        href="/account/categories"
                        className={`${
                            url.startsWith("/account/categories")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-folder me-2"></i> Categories
                    </Link>
                )}

                {hasAnyPermission(["roles.index"]) && (
                    <Link
                        href="/account/roles"
                        className={`${
                            url.startsWith("/account/roles")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-shield-alt me-2"></i> Roles
                    </Link>
                )}

                {hasAnyPermission(["permissions.index"]) && (
                    <Link
                        href="/account/permissions"
                        className={`${
                            url.startsWith("/account/permissions")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-key me-2"></i> Permissions
                    </Link>
                )}

                {hasAnyPermission([
                    "certificates.index",
                    "certificates.index.full",
                ]) && (
                    <Link
                        href="/account/certificates"
                        className={`${
                            url.startsWith("/account/certificates")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fas fa-certificate me-2"></i> Certificates
                    </Link>
                )}

                {hasAnyPermission(["users.index"]) && (
                    <Link
                        href="/account/users"
                        className={`${
                            url.startsWith("/account/users")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-users me-2"></i> Users
                    </Link>
                )}

                {hasAnyPermission([
                    "articles.index",
                    "articles.index.full",
                ]) && (
                    <Link
                        href="/account/articles"
                        className={`${
                            url.startsWith("/account/articles")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-newspaper me-2"></i> Articles
                    </Link>
                )}

                {hasAnyPermission(["article_reports.index"]) && (
                    <Link
                        href="/account/article-reports"
                        className={`${
                            url.startsWith("/account/article-reports")
                                ? "active list-group-item list-group-item-action list-group-item-light p-3"
                                : "list-group-item list-group-item-action list-group-item-light p-3"
                        }`}
                    >
                        <i className="fa fa-flag me-2"></i> Article Reports
                    </Link>
                )}
            </div>

            {/* Custom CSS for better scrollbar styling */}
            <style jsx>{`
                .list-group-flush::-webkit-scrollbar {
                    width: 8px;
                }

                .list-group-flush::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .list-group-flush::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }

                .list-group-flush::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }

                /* Smooth scrolling */
                .list-group-flush {
                    scroll-behavior: smooth;
                }

                /* Hide scrollbar on mobile devices to save space */
                @media (max-width: 768px) {
                    .list-group-flush::-webkit-scrollbar {
                        width: 4px;
                    }
                }
            `}</style>
        </>
    );
}
