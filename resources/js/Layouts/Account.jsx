import React, { useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Sidebar from "../Layouts/Sidebar";
import ThemeMode from "../Components/ThemeMode";

export default function LayoutAccount({ children }) {
    const { auth } = usePage().props;
    const [sidebarToggle, setSidebarToggle] = useState(false);

    const sidebarToggleHandler = (e) => {
        e.preventDefault();

        if (!sidebarToggle) {
            document.body.classList.add("sb-sidenav-toggled");

            setSidebarToggle(true);
        } else {
            document.body.classList.remove("sb-sidenav-toggled");

            setSidebarToggle(false);
        }
    };

    const profileHandler = async (e) => {
        Inertia.get("/account/profile");
    };

    const logoutHandler = async (e) => {
        e.preventDefault();
        localStorage.clear();

        Inertia.post("/logout");
    };

    return (
        <>
            <div className="d-flex sb-sidenav-toggled" id="wrapper">
                <div className="bg-sidebar" id="sidebar-wrapper">
                    <div className="sidebar-heading text-center">
                        <Link href="/" className="btn text-white">
                            <img
                                src="/assets/images/logo.png"
                                width={"50"}
                                alt="Logo"
                            />
                            <strong>UIX-Probe</strong>
                        </Link>
                    </div>
                    <Sidebar />
                </div>
                <div id="page-content-wrapper" style={{ width: "100%" }}>
                    <nav className="navbar navbar-wrapper navbar-expand-lg navbar-light fixed-top">
                        <div className="container-fluid">
                            <div className="toggled-sidebar">
                                <button
                                    className="btn btn-sidebar me-3"
                                    onClick={sidebarToggleHandler}
                                >
                                    <i className="fa fa-list-ul"></i>
                                </button>
                            </div>
                            <div className="navbar-header d-flex align-items-center">
                                <ul className="navbar-nav d-flex flex-row align-items-center">
                                    <li className="nav-item">
                                        <Link
                                            href="/"
                                            className="btn text-white"
                                        >
                                            Home
                                        </Link>
                                    </li>
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
                                                alt={auth.first_name}
                                            />
                                        ) : (
                                            <span
                                                style={{
                                                    color: "#ffffff",
                                                    fontWeight: "bold",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                {auth.user.first_name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                    <NavDropdown
                                        title={
                                            <>
                                                {auth.user.roles.some(
                                                    (role) =>
                                                        role.name ==
                                                        "verified user"
                                                ) && (
                                                    <i className="fas fa-user-check me-2" />
                                                )}
                                                {`${auth.user.first_name} ${auth.user.surname}`}
                                            </>
                                        }
                                        id="basic-nav-dropdown"
                                    >
                                        <NavDropdown.Item
                                            onClick={profileHandler}
                                        >
                                            <i className="fa fa-user me-2"></i>
                                            Profile
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            onClick={logoutHandler}
                                        >
                                            <i className="fa fa-sign-out-alt me-2"></i>
                                            Logout
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    {/* <ThemeMode /> */}
                                </ul>
                            </div>
                        </div>
                    </nav>
                    <div
                        className="container-fluid"
                        style={{ marginTop: "80px" }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
