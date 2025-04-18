import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import AuthField from "../../Components/AuthField";

export default function Login() {
    const { errors } = usePage().props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const loginHandler = async (e) => {
        e.preventDefault();

        Inertia.post("/login", {
            email: email,
            password: password,
            remember: rememberMe,
        });
    };

    return (
        <>
            <Head>
                <title>Login Account - UIX-Probe</title>
            </Head>

            <div
                className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background:
                        "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    padding: "20px",
                }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-5 col-lg-4">
                            <div className="text-center mb-4">
                                <Link href="/">
                                    <img
                                        src="/assets/images/logo.png"
                                        width="70"
                                        alt="Logo"
                                        className="mb-2"
                                    />
                                </Link>
                                <h4 className="mb-0">
                                    <strong
                                        style={{ color: "var(--nav-color)" }}
                                    >
                                        UIX-Probe
                                    </strong>{" "}
                                </h4>
                            </div>

                            <div className="card border-0 rounded-4 shadow">
                                <div className="card-body p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <h5 className="fw-bold">
                                            Welcome Back
                                        </h5>
                                        <p className="text-muted small">
                                            Sign in to your account to continue
                                        </p>
                                    </div>

                                    <form onSubmit={loginHandler}>
                                        <AuthField
                                            icon="fa fa-envelope"
                                            label="Email Address"
                                            type="text"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Enter your email"
                                            error={errors.email}
                                        />

                                        <AuthField
                                            icon="fa fa-lock"
                                            label="Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Enter your password"
                                            error={errors.password}
                                        />

                                        <div className="row mb-4">
                                            <div className="col-6 d-flex align-items-center">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="rememberMe"
                                                        checked={rememberMe}
                                                        onChange={(e) =>
                                                            setRememberMe(
                                                                e.target.checked
                                                            )
                                                        }
                                                    />
                                                    <label
                                                        className="form-check-label ms-2 small"
                                                        htmlFor="rememberMe"
                                                    >
                                                        Remember Me
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-6 d-flex justify-content-end align-items-center">
                                                <Link
                                                    href="/forgot-password"
                                                    className="small text-decoration-none"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                >
                                                    Forgot Password?
                                                </Link>
                                            </div>
                                        </div>

                                        <button
                                            className="btn w-100 py-2 mb-3"
                                            type="submit"
                                            style={{
                                                background: "var(--nav-color)",
                                                color: "#ffffff",
                                                fontWeight: "600",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            Sign In
                                        </button>

                                        <div className="text-center mt-4">
                                            <p className="mb-0 small">
                                                Don't have an account?{" "}
                                                <Link
                                                    href="/register"
                                                    className="text-decoration-none fw-semibold"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                >
                                                    Sign Up
                                                </Link>
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <Link
                                    href="/"
                                    className="text-decoration-none small"
                                    style={{ color: "var(--nav-color)" }}
                                >
                                    <i className="fas fa-arrow-left me-1"></i>{" "}
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
