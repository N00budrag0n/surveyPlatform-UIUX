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

    // add google login handler
    const handleGoogleLogin = () => {
        window.location.href = "/oauth/google";
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

                                        <div className="text-center mb-3">
                                            <span className="text-muted-small">
                                                or
                                            </span>
                                        </div>

                                        {/* Google Login Button */}
                                        <button
                                            onClick={handleGoogleLogin}
                                            className="btn btn-outline-dark w-100 py-2 mb-3 d-flex align-items-center justify-content-center"
                                            style={{ borderRadius: "8px" }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" className="me-2">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                            </svg>
                                            Continue with Google
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
