import React, { useEffect } from "react";
import Layout from "../../Layouts/Header";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import CardHomepage from "../../Components/CardHomepage";
import CardItem from "../../Components/CardItem";
import CardCategory from "../../Components/CardCategory";

export default function Home() {
    const { surveys, categories, articles, auth } = usePage().props;

    useEffect(() => {
        const handleVisibilityChange = () => {
            document.title = document.hidden ? "UIX-Probe 👋😊" : "UIX-Probe";
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    const handleStartNow = () => {
        if (auth) {
            Inertia.get("/account/dashboard");
        } else {
            Inertia.get("/register");
        }
    };

    return (
        <>
            <Head>
                <title>UI/UX Testing Platform - UIX-Probe</title>
                <meta
                    name="description"
                    content="Platform pengujian UI/UX terbaik untuk meningkatkan pengalaman pengguna aplikasi Anda."
                />
            </Head>
            <Layout>
                {/* Hero Section */}
                <div
                    className="hero-section py-5"
                    style={{ marginTop: "80px" }}
                >
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 pe-lg-5">
                                <div className="hero-content">
                                    <span className="badge bg-primary text-white px-3 py-2 mb-3 animate__animated animate__fadeInUp">
                                        UI/UX Testing Platform
                                    </span>
                                    <h1 className="fw-bold display-4 mb-3 animate__animated animate__fadeInUp">
                                        Solusi pengujian untuk pengalaman
                                        pengguna terbaik
                                    </h1>
                                    <p className="lead mb-4 text-muted animate__animated animate__fadeInUp animate__delay-1s">
                                        UIX-Probe diciptakan untuk membantu
                                        pengembang dalam menemukan pengalaman
                                        UI/UX yang paling cocok dengan kebutuhan
                                        dan keinginan pengguna.
                                    </p>
                                    <button
                                        className="btn btn-primary btn-lg px-4 py-2 rounded-pill shadow-sm animate__animated animate__fadeInUp animate__delay-2s"
                                        onClick={handleStartNow}
                                    >
                                        Mulai Sekarang{" "}
                                        <i className="fas fa-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-6 mt-5 mt-lg-0">
                                <div className="hero-image text-center animate__animated animate__fadeIn animate__delay-1s position-relative">
                                    <div
                                        className="position-absolute"
                                        style={{
                                            width: "300px",
                                            height: "300px",
                                            background: "var(--primary-light)",
                                            borderRadius: "50%",
                                            top: "-50px",
                                            right: "-50px",
                                            zIndex: "-1",
                                        }}
                                    ></div>
                                    <img
                                        src="assets/images/Homepage-Brown.png"
                                        className="img-fluid"
                                        style={{
                                            maxHeight: "400px",
                                            filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
                                        }}
                                        alt="Home Img"
                                    />
                                    <div
                                        className="position-absolute"
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            background: "var(--primary-light)",
                                            borderRadius: "50%",
                                            bottom: "40px",
                                            left: "30px",
                                            zIndex: "-1",
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className="position-absolute"
                        style={{
                            width: "300px",
                            height: "300px",
                            background: "var(--primary-light)",
                            borderRadius: "50%",
                            bottom: "-150px",
                            right: "-100px",
                            zIndex: "0",
                        }}
                    ></div>
                </div>

                {/* Features Section */}
                <div className="features-section py-5 my-5">
                    <div className="container">
                        <div className="row justify-content-center mb-5">
                            <div className="col-lg-7 text-center">
                                <span className="badge bg-light text-primary px-3 py-2 mb-3">
                                    Fitur Unggulan
                                </span>
                                <h2 className="display-5 fw-bold mb-4">
                                    Kenapa Menggunakan UIX-Probe?
                                </h2>
                                <p className="lead text-muted">
                                    Platform kami menyediakan alat lengkap untuk
                                    pengujian UI/UX yang efektif
                                </p>
                            </div>
                        </div>

                        <div className="row g-4 justify-content-center">
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 rounded-4 shadow-sm border-0 text-center card-hover">
                                    <div className="feature-icon mb-4 mx-auto">
                                        <span
                                            className="icon-circle bg-light d-inline-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: "90px",
                                                height: "90px",
                                            }}
                                        >
                                            <i className="fas fa-file-invoice fa-2x text-primary"></i>
                                        </span>
                                    </div>
                                    <h3 className="h4 mb-3">
                                        Template Pertanyaan Siap Pakai
                                    </h3>
                                    <p className="text-muted mb-0">
                                        Tersedia Template Pertanyaan Siap Pakai
                                        untuk mempermudah dalam pengujian UI/UX
                                        yang dapat disesuaikan.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 rounded-4 shadow-sm border-0 text-center card-hover">
                                    <div className="feature-icon mb-4 mx-auto">
                                        <span
                                            className="icon-circle bg-light d-inline-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: "90px",
                                                height: "90px",
                                            }}
                                        >
                                            <i className="fas fa-chart-bar fa-2x text-primary"></i>
                                        </span>
                                    </div>
                                    <h3 className="h4 mb-3">
                                        Dilengkapi Dengan Grafik Dan Metrik
                                    </h3>
                                    <p className="text-muted mb-0">
                                        Menampilkan hasil pengujian dalam bentuk
                                        grafik yang informatif dan mudah
                                        dipahami.
                                    </p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-card h-100 p-4 rounded-4 shadow-sm border-0 text-center card-hover">
                                    <div className="feature-icon mb-4 mx-auto">
                                        <span
                                            className="icon-circle bg-light d-inline-flex align-items-center justify-content-center rounded-circle"
                                            style={{
                                                width: "90px",
                                                height: "90px",
                                            }}
                                        >
                                            <i className="fas fa-calculator fa-2x text-primary"></i>
                                        </span>
                                    </div>
                                    <h3 className="h4 mb-3">
                                        Penghitungan Metrik Usability
                                    </h3>
                                    <p className="text-muted mb-0">
                                        Menggunakan berbagai metrik evaluasi
                                        untuk menyusun dan mengukur hasil dari
                                        pengujian yang dilakukan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-5">
                            <button
                                className="btn btn-primary btn-lg px-5 py-3 shadow-sm rounded-pill"
                                onClick={handleStartNow}
                            >
                                Mulai Sekarang
                            </button>
                            <p className="mt-3 text-muted">
                                Gabung sekarang dan mulai tingkatkan pengalaman
                                pengguna Anda dengan UIX-Probe.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="categories-section py-5 bg-light">
                    <div className="container">
                        <div className="row justify-content-between align-items-center mb-4">
                            <div className="col-md-6">
                                <span className="badge bg-white text-primary px-3 py-2 mb-3">
                                    Kategori
                                </span>
                                <h2 className="fw-bold mb-2">Categories</h2>
                                <p className="text-muted">
                                    Temukan berbagai kategori yang kami sediakan
                                    untuk menemukan kebutuhan Anda.
                                </p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <Link
                                    href="/categories"
                                    className="btn btn-outline-primary rounded-pill"
                                >
                                    See All Categories{" "}
                                    <i className="fa fa-long-arrow-alt-right ms-2"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="row g-4 justify-content-center">
                            {categories.map((category, index) => (
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
                    </div>
                </div>

                {/* Latest Surveys Section */}
                <div className="surveys-section py-5">
                    <div className="container">
                        <div className="row justify-content-between align-items-center mb-4">
                            <div className="col-md-6">
                                <span className="badge bg-light text-primary px-3 py-2 mb-3">
                                    Survei
                                </span>
                                <h2 className="fw-bold mb-2">Latest Surveys</h2>
                                <p className="text-muted">
                                    Temukan survei terbaru untuk berkontribusi
                                    dalam pengembangan UI/UX.
                                </p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <Link
                                    href="/surveys"
                                    className="btn btn-outline-primary rounded-pill"
                                >
                                    See All Surveys{" "}
                                    <i className="fa fa-long-arrow-alt-right ms-2"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="row g-4">
                            {surveys.map((survey, index) => (
                                <div className="col-lg-3 col-md-6" key={index}>
                                    <CardItem
                                        type={"survey"}
                                        data={survey}
                                        link={`/form/${survey.id}/${survey.slug}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Articles Section */}
                <div className="articles-section py-5 bg-light">
                    <div className="container">
                        <div className="row justify-content-between align-items-center mb-4">
                            <div className="col-md-6">
                                <span className="badge bg-white text-primary px-3 py-2 mb-3">
                                    Artikel
                                </span>
                                <h2 className="fw-bold mb-2">Articles</h2>
                                <p className="text-muted">
                                    Temukan artikel terbaru untuk mendapatkan
                                    wawasan mengenai berbagai topik.
                                </p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <Link
                                    href="/articles"
                                    className="btn btn-outline-primary rounded-pill"
                                >
                                    See All Articles{" "}
                                    <i className="fa fa-long-arrow-alt-right ms-2"></i>
                                </Link>
                            </div>
                        </div>

                        <div className="row g-4">
                            {articles.map((article, index) => (
                                <div className="col-md-4" key={index}>
                                    <CardItem
                                        type={"article"}
                                        data={article}
                                        link={`/articles/${article.id}/${article.slug}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="cta-section py-5 my-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-10">
                                <div className="cta-card bg-primary text-white p-5 rounded-4 text-center position-relative overflow-hidden">
                                    <div
                                        className="position-absolute"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            background:
                                                "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "50%",
                                            top: "-100px",
                                            right: "-50px",
                                        }}
                                    ></div>
                                    <div
                                        className="position-absolute"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            background:
                                                "rgba(255, 255, 255, 0.1)",
                                            borderRadius: "50%",
                                            bottom: "-60px",
                                            left: "10%",
                                        }}
                                    ></div>
                                    <div className="position-relative">
                                        <h2 className="display-5 fw-bold mb-4">
                                            Siap Untuk Meningkatkan UI/UX Anda?
                                        </h2>
                                        <p className="lead mb-4">
                                            Bergabunglah dengan ribuan
                                            pengembang yang telah meningkatkan
                                            pengalaman pengguna mereka melalui
                                            platform kami.
                                        </p>
                                        <button
                                            className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-sm"
                                            onClick={handleStartNow}
                                        >
                                            Mulai Sekarang{" "}
                                            <i className="fas fa-arrow-right ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
