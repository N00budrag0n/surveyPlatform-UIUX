import React from "react";
import Layout from "../../../Layouts/Header";
import { Head, usePage } from "@inertiajs/inertia-react";
import CardItem from "../../../Components/CardItem";
import Pagination from "../../../Components/Pagination";

export default function Articles() {
    const { articles } = usePage().props;

    return (
        <>
            <Head>
                <title>Articles - UIX-Probe</title>
            </Head>
            <Layout>
                <div className="container mt-80 mb-5">
                    <div className="fade-in">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h2 className="fw-bold mb-2">Articles</h2>
                                <p className="text-muted">
                                    Explore our collection of articles about
                                    UI/UX design and research
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card border-0 shadow-sm rounded-4 mb-4">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <i
                                                className="fas fa-newspaper me-3 fs-4"
                                                style={{
                                                    color: "var(--nav-color)",
                                                }}
                                            ></i>
                                            <h5 className="fw-bold mb-0">
                                                All Articles
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {articles.data.length > 0 ? (
                            <>
                                <div className="row g-4">
                                    {articles.data.map((article, index) => (
                                        <div
                                            className="col-lg-3 col-md-4 col-6"
                                            key={index}
                                        >
                                            <CardItem
                                                type={"article"}
                                                data={article}
                                                link={`/articles/${article.id}/${article.slug}`}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="row mt-5">
                                    <div className="col-md-12">
                                        <Pagination
                                            links={articles.links}
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
                                            className="fas fa-newspaper fa-3x mb-3"
                                            style={{
                                                color: "var(--nav-color)",
                                            }}
                                        ></i>
                                        <h4 className="fw-bold">
                                            No Articles Found
                                        </h4>
                                        <p className="text-muted">
                                            Check back later for new content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </>
    );
}
