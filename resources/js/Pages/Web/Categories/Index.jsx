import React from "react";
import Layout from "../../../Layouts/Header";
import { Head, usePage } from "@inertiajs/inertia-react";
import CardCategory from "../../../Components/CardCategory";
import Pagination from "../../../Components/Pagination";

export default function CategoryIndex() {
    const { categories } = usePage().props;

    return (
        <>
            <Head>
                <title>Categories - UIX-Probe</title>
            </Head>
            <Layout>
                <div className="container mt-80 mb-5">
                    <div className="fade-in">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h2 className="fw-bold mb-2">Categories</h2>
                                <p className="text-muted">
                                    Browse all categories to find UI/UX surveys
                                    that match your interests
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card border-0 shadow-sm rounded-4 mb-4">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center">
                                            <i
                                                className="fas fa-th-large me-3 fs-4"
                                                style={{
                                                    color: "var(--nav-color)",
                                                }}
                                            ></i>
                                            <h5 className="fw-bold mb-0">
                                                All Categories
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row g-4">
                            {categories.data.map((category, index) => (
                                <div
                                    className="col-lg-2 col-md-3 col-6"
                                    key={index}
                                >
                                    <CardCategory
                                        category={category}
                                        key={index}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="row mt-5">
                            <div className="col-md-12">
                                <Pagination
                                    links={categories.links}
                                    align={"center"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
