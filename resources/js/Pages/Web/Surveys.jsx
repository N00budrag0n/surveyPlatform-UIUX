import React from "react";
import Layout from "../../Layouts/Header";
import { Head, usePage } from "@inertiajs/inertia-react";
import CardItem from "../../Components/CardItem";
import Pagination from "../../Components/Pagination";
import Search from "../../Components/Search";

export default function Surveys() {
    const { surveys } = usePage().props;

    return (
        <>
            <Head>
                <title>Surveys - UIX-Probe</title>
            </Head>
            <Layout>
                <div className="container mt-80 mb-5">
                    <div className="fade-in">
                        <div className="row mb-4">
                            <div className="col-12">
                                <h2 className="fw-bold mb-2">Surveys</h2>
                                <p className="text-muted">
                                    Participate in UI/UX surveys and help
                                    improve digital experiences
                                </p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card border-0 shadow-sm rounded-4 mb-4">
                                    <div className="card-body p-4">
                                        <div className="row align-items-center">
                                            <div className="col-md-6 d-flex align-items-center mb-3 mb-md-0">
                                                <i
                                                    className="fas fa-poll me-3 fs-4"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                ></i>
                                                <h5 className="fw-bold mb-0">
                                                    All Surveys
                                                </h5>
                                            </div>
                                            <div className="col-md-6">
                                                <Search URL={"surveys"} />
                                            </div>
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
                                            className="col-lg-3 col-md-4 col-6 mb-4"
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

                                <div className="row mt-4">
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
                                            Try adjusting your search criteria
                                            or check back later.
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
