import React from "react";
import LayoutWeb from "../../../Layouts/Header";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import CardItem from "../../../Components/CardItem";
import Pagination from "../../../Components/Pagination";

export default function CategoryShow() {
    const { category, surveys, auth } = usePage().props;

    return (
        <>
            <Head>
                <title>{`${category.name} - UIX-Probe`}</title>
            </Head>
            <LayoutWeb>
                <div className="container" style={{ marginTop: "80px" }}>
                    <div className="fade-in">
                        <div className="row mb-4">
                            <div className="col-12">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link
                                                href="/categories"
                                                className="text-decoration-none"
                                                style={{
                                                    color: "var(--nav-color)",
                                                }}
                                            >
                                                Categories
                                            </Link>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            {category.name}
                                        </li>
                                    </ol>
                                </nav>
                                <h2 className="fw-bold mb-2">
                                    {category.name}
                                </h2>
                                <p className="text-muted">
                                    Browse all surveys in this category
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card border-0 shadow-sm rounded-4 mb-4">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <i
                                                className="fas fa-folder-open me-3 fs-4"
                                                style={{
                                                    color: "var(--nav-color)",
                                                }}
                                            ></i>
                                            <h5 className="fw-bold mb-0">
                                                Surveys in{" "}
                                                <span
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                >
                                                    {category.name}
                                                </span>
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {surveys.data.length > 0 ? (
                            <>
                                <div className="row g-4">
                                    {surveys.data.map((survey, index) => (
                                        <div
                                            className="col-lg-3 col-md-4 col-6"
                                            key={index}
                                        >
                                            <CardItem
                                                type={"survey"}
                                                data={survey}
                                                link={`/form/${survey.id}/${survey.slug}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="row mt-5">
                                    <div className="col-md-12">
                                        <Pagination
                                            links={surveys.links}
                                            align={"center"}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <div className="py-5">
                                        <i
                                            className="fas fa-search fa-3x mb-3"
                                            style={{
                                                color: "var(--nav-color)",
                                            }}
                                        ></i>
                                        <h4 className="fw-bold">
                                            No Surveys Found
                                        </h4>
                                        <p className="text-muted">
                                            There are no surveys available in
                                            this category yet.
                                        </p>
                                        <Link
                                            href="/surveys"
                                            className="btn btn-outline-primary mt-3"
                                        >
                                            Browse All Surveys
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </LayoutWeb>
        </>
    );
}
