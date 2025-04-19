import React from "react";
import LayoutWeb from "../../../Layouts/Header";
import { Head, usePage, Link } from "@inertiajs/inertia-react";

export default function ArticleShow() {
    const { article } = usePage().props;

    return (
        <LayoutWeb>
            <Head>
                <title>{article.title} - UIX-Probe</title>
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
                                                <button className="btn btn-outline-danger">
                                                    <i className="far fa-bookmark me-1"></i>{" "}
                                                    Save
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
        </LayoutWeb>
    );
}
