import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";

export default function Layout({ children }) {
    const { auth, flash } = usePage().props;
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        Inertia.post("/logout");
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            {/* Navbar with improved text readability */}
            <nav
                className={`navbar navbar-expand-lg fixed-top ${
                    isScrolled ? "shadow-sm" : ""
                }`}
                style={{
                    background: isScrolled
                        ? "var(--nav-color)"
                        : "var(--nav-color)",
                    backdropFilter: isScrolled ? "blur(10px)" : "none",
                    transition: "all 0.3s ease",
                }}
            >
                <div className="container">
                    <Link
                        className="navbar-brand d-flex align-items-center"
                        href="/"
                    >
                        <img
                            src="/assets/images/logo.png"
                            alt="UIX-Probe Logo"
                            height="40"
                            className="me-2"
                        />
                        <span className="fw-bold fs-4 text-white">
                            UIX-Probe
                        </span>
                    </Link>

                    <button
                        className="navbar-toggler border-0"
                        type="button"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className={`collapse navbar-collapse ${
                            isMobileMenuOpen ? "show" : ""
                        }`}
                    >
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item mx-1">
                                <Link
                                    className="nav-link px-3 py-2 rounded-pill"
                                    href="/"
                                    style={{
                                        transition: "all 0.3s ease",
                                        fontWeight: "600",
                                        color: "rgba(255, 255, 255, 0.9)",
                                        letterSpacing: "0.2px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                            "transparent";
                                        e.currentTarget.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item mx-1">
                                <Link
                                    className="nav-link px-3 py-2 rounded-pill"
                                    href="/surveys"
                                    style={{
                                        transition: "all 0.3s ease",
                                        fontWeight: "600",
                                        color: "rgba(255, 255, 255, 0.9)",
                                        letterSpacing: "0.2px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                            "transparent";
                                        e.currentTarget.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    Surveys
                                </Link>
                            </li>
                            <li className="nav-item mx-1">
                                <Link
                                    className="nav-link px-3 py-2 rounded-pill"
                                    href="/articles"
                                    style={{
                                        transition: "all 0.3s ease",
                                        fontWeight: "600",
                                        color: "rgba(255, 255, 255, 0.9)",
                                        letterSpacing: "0.2px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                            "transparent";
                                        e.currentTarget.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    Articles
                                </Link>
                            </li>
                            <li className="nav-item mx-1">
                                <Link
                                    className="nav-link px-3 py-2 rounded-pill"
                                    href="/categories"
                                    style={{
                                        transition: "all 0.3s ease",
                                        fontWeight: "600",
                                        color: "rgba(255, 255, 255, 0.9)",
                                        letterSpacing: "0.2px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                            "transparent";
                                        e.currentTarget.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    Categories
                                </Link>
                            </li>
                            <li className="nav-item mx-1">
                                <Link
                                    className="nav-link px-3 py-2 rounded-pill"
                                    href="/about"
                                    style={{
                                        transition: "all 0.3s ease",
                                        fontWeight: "600",
                                        color: "rgba(255, 255, 255, 0.9)",
                                        letterSpacing: "0.2px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background =
                                            "rgba(255, 255, 255, 0.15)";
                                        e.currentTarget.style.color = "#ffffff";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background =
                                            "transparent";
                                        e.currentTarget.style.color =
                                            "rgba(255, 255, 255, 0.9)";
                                    }}
                                >
                                    About
                                </Link>
                            </li>

                            {auth ? (
                                <>
                                    <li className="nav-item dropdown ms-2">
                                        <a
                                            className="nav-link dropdown-toggle d-flex align-items-center"
                                            href="#"
                                            id="navbarDropdown"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            style={{
                                                color: "rgba(255, 255, 255, 0.9)",
                                                fontWeight: "600",
                                            }}
                                        >
                                            <div
                                                className="rounded-circle overflow-hidden me-2 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "38px",
                                                    height: "38px",
                                                    background:
                                                        "rgba(255, 255, 255, 0.2)",
                                                    border: "2px solid rgba(255, 255, 255, 0.5)",
                                                }}
                                            >
                                                {auth.avatar ? (
                                                    <img
                                                        src={auth.avatar}
                                                        className="img-fluid"
                                                        alt={auth.name}
                                                    />
                                                ) : (
                                                    <span
                                                        style={{
                                                            color: "#ffffff",
                                                            fontWeight: "bold",
                                                            fontSize: "16px",
                                                        }}
                                                    >
                                                        {auth.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="d-none d-md-inline">
                                                {auth.name}
                                            </span>
                                        </a>
                                        <ul
                                            className="dropdown-menu dropdown-menu-end border-0 shadow-sm rounded-3 py-2"
                                            style={{
                                                minWidth: "220px",
                                                marginTop: "10px",
                                            }}
                                        >
                                            <li>
                                                <Link
                                                    className="dropdown-item py-2 px-3"
                                                    href="/account/dashboard"
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "#1E293B",
                                                    }}
                                                >
                                                    <i className="fas fa-tachometer-alt me-2 text-primary"></i>
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="dropdown-item py-2 px-3"
                                                    href="/account/profile"
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "#1E293B",
                                                    }}
                                                >
                                                    <i className="fas fa-user me-2 text-primary"></i>
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <hr className="dropdown-divider" />
                                            </li>
                                            <li>
                                                <a
                                                    className="dropdown-item py-2 px-3"
                                                    href="#"
                                                    onClick={handleLogout}
                                                    style={{
                                                        fontWeight: "500",
                                                        color: "#DC2626",
                                                    }}
                                                >
                                                    <i className="fas fa-sign-out-alt me-2"></i>
                                                    Logout
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item ms-2">
                                        <Link
                                            className="nav-link btn px-4 py-2 rounded-pill"
                                            href="/login"
                                            style={{
                                                border: "2px solid rgba(255, 255, 255, 0.8)",
                                                color: "#ffffff",
                                                fontWeight: "600",
                                                transition: "all 0.3s ease",
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background =
                                                    "rgba(255, 255, 255, 0.15)";
                                                e.currentTarget.style.borderColor =
                                                    "#ffffff";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background =
                                                    "transparent";
                                                e.currentTarget.style.borderColor =
                                                    "rgba(255, 255, 255, 0.8)";
                                            }}
                                        >
                                            Login
                                        </Link>
                                    </li>
                                    <li className="nav-item ms-2">
                                        <Link
                                            className="btn btn px-4 py-2 rounded-pill"
                                            href="/register"
                                            style={{
                                                background: "#ffffff",
                                                color: "#23445C",
                                                fontWeight: "600",
                                                transition: "all 0.3s ease",
                                                boxShadow:
                                                    "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                textDecoration: "none"
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background =
                                                    "rgba(255, 255, 255, 0.9)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 4px 12px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background =
                                                    "#ffffff";
                                                e.currentTarget.style.boxShadow =
                                                    "0 4px 6px rgba(0, 0, 0, 0.1)";
                                            }}
                                        >
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow-1">{children}</main>

            {/* Footer */}
            <footer className="footer py-5">
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4 mb-4 mb-lg-0">
                            <div className="d-flex align-items-center mb-3">
                                <img
                                    src="/assets/images/logo.png"
                                    alt="UIX-Probe Logo"
                                    height="40"
                                    className="me-2"
                                />
                                <span className="fw-bold fs-4 text-white">
                                    UIX-Probe
                                </span>
                            </div>
                            <p className="text-light mb-4">
                                Platform pengujian UI/UX terbaik untuk
                                meningkatkan pengalaman pengguna aplikasi Anda.
                            </p>
                            <div className="d-flex gap-3">
                                <a
                                    href="#"
                                    className="text-light fs-5 transition-all"
                                >
                                    <i className="fab fa-facebook-square"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-light fs-5 transition-all"
                                >
                                    <i className="fab fa-twitter-square"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-light fs-5 transition-all"
                                >
                                    <i className="fab fa-instagram"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-light fs-5 transition-all"
                                >
                                    <i className="fab fa-linkedin"></i>
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-2 col-md-4 col-6">
                            <h5 className="fw-bold mb-4 text-white">
                                Quick Links
                            </h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <Link
                                        href="/"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link
                                        href="/surveys"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Surveys
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link
                                        href="/articles"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Articles
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link
                                        href="/categories"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Categories
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link
                                        href="/about"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        About Us
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="col-lg-2 col-md-4 col-6">
                            <h5 className="fw-bold mb-4 text-white">
                                Resources
                            </h5>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <a
                                        href="#"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Documentation
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a
                                        href="#"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Help Center
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a
                                        href="#"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Privacy Policy
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a
                                        href="#"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        Terms of Service
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a
                                        href="#"
                                        className="text-light text-decoration-none hover-text-white transition-all"
                                    >
                                        FAQ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-lg-4 col-md-4">
                            <h5 className="fw-bold mb-4 text-white">
                                Subscribe to Our Newsletter
                            </h5>
                            <p className="text-light mb-3">
                                Get the latest updates and news about UI/UX
                                testing.
                            </p>
                            <div className="input-group mb-3">
                                <input
                                    type="email"
                                    className="form-control border-0 py-2 bg-light text-dark"
                                    placeholder="Your email address"
                                    aria-label="Your email address"
                                    style={{ borderRadius: "8px 0 0 8px" }}
                                />
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    style={{
                                        borderRadius: "0 8px 8px 0",
                                    }}
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <hr className="my-4 bg-secondary" />

                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="mb-0 text-light">
                                &copy; {new Date().getFullYear()} UIX-Probe. All
                                rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end mt-3 mt-md-0">
                            <div className="d-flex justify-content-center justify-content-md-end gap-3">
                                <a
                                    href="#"
                                    className="text-light text-decoration-none small hover-text-white transition-all"
                                >
                                    Privacy Policy
                                </a>
                                <span className="text-secondary">|</span>
                                <a
                                    href="#"
                                    className="text-light text-decoration-none small hover-text-white transition-all"
                                >
                                    Terms of Service
                                </a>
                                <span className="text-secondary">|</span>
                                <a
                                    href="#"
                                    className="text-light text-decoration-none small hover-text-white transition-all"
                                >
                                    Cookies
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Toast Notifications */}
            {flash && flash.message && (
                <div
                    className="position-fixed bottom-0 end-0 p-3"
                    style={{ zIndex: 1050 }}
                >
                    <div
                        className={`toast show ${
                            flash.type === "success"
                                ? "bg-success"
                                : flash.type === "error"
                                ? "bg-danger"
                                : "bg-primary"
                        }`}
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                        style={{
                            color: "white",
                            borderRadius: "10px",
                            boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div className="d-flex">
                            <div className="toast-body d-flex align-items-center">
                                <i
                                    className={`fas ${
                                        flash.type === "success"
                                            ? "fa-check-circle"
                                            : flash.type === "error"
                                            ? "fa-exclamation-circle"
                                            : "fa-info-circle"
                                    } me-2`}
                                ></i>
                                {flash.message}
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white me-2 m-auto"
                                data-bs-dismiss="toast"
                                aria-label="Close"
                            ></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
