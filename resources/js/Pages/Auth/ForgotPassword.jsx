import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import AuthField from "../../Components/AuthField";
import Swal from "sweetalert2";

export default function ForgotPassword() {
    const { errors } = usePage().props;
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetPasswordHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        Inertia.post(
            "/forgot-password",
            {
                email: email,
            },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    Swal.fire({
                        title: "Email Sent!",
                        text: "Check your inbox for password reset instructions",
                        icon: "success",
                        showConfirmButton: true,
                    });
                },
                onError: () => {
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <>
            <Head>
                <title>Reset Password - UIX-Probe</title>
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
                                        UIX
                                    </strong>
                                    -Probe
                                </h4>
                            </div>

                            <div className="card border-0 rounded-4 shadow">
                                <div className="card-body p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <div className="mb-3">
                                            <span className="d-inline-block p-3 bg-light rounded-circle">
                                                <i
                                                    className="fas fa-lock fa-2x"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                ></i>
                                            </span>
                                        </div>
                                        <h5 className="fw-bold">
                                            Forgot Your Password?
                                        </h5>
                                        <p className="text-muted small">
                                            Enter your email address and we'll
                                            send you instructions to reset your
                                            password.
                                        </p>
                                    </div>

                                    <form onSubmit={resetPasswordHandler}>
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

                                        <div className="d-grid gap-2 mt-4">
                                            <button
                                                className="btn py-2"
                                                type="submit"
                                                disabled={isSubmitting}
                                                style={{
                                                    background:
                                                        "var(--nav-color)",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                    borderRadius: "8px",
                                                }}
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm me-2"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                        Sending...
                                                    </>
                                                ) : (
                                                    "Send Reset Link"
                                                )}
                                            </button>

                                            <Link
                                                href="/login"
                                                className="btn btn-outline-secondary py-2"
                                                style={{
                                                    borderRadius: "8px",
                                                    fontWeight: "500",
                                                }}
                                            >
                                                Back to Login
                                            </Link>
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
