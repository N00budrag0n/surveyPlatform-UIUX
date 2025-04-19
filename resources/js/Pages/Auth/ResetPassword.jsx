import React, { useState } from "react";
import Layout from "../../Layouts/Header";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import AuthField from "../../Components/AuthField";
import Swal from "sweetalert2";

export default function ResetPassword({ auth, token, email }) {
    const { errors } = usePage().props;

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const resetPasswordHandler = async (e) => {
        e.preventDefault();

        Inertia.post("/reset-password", {
            token: token,
            email: email,
            password: password,
            password_confirmation: passwordConfirmation,
        }, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Password updated successfully!",
                    icon: "success",
                    showConfirmButton: true,
                })
            },
        });
    };

    return (
        <>
            <Head>
                <title>Reset Password - UIX-Probe</title>
            </Head>
            <Layout footerVisible={false}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 mt-80">
                            <div className="text-center mb-4">
                                <img
                                    src="/assets/images/logo.png"
                                    width={"60"}
                                />
                                <h4>
                                    <strong>Survey</strong>{" "}
                                    <small>Platform</small>
                                </h4>
                            </div>
                            <div className="card border-0 rounded-3 shadow-sm border-top">
                                <div className="card-body">
                                    <div className="text-center">
                                        <h6 className="fw-bold">
                                            Reset Your Password
                                        </h6>
                                        <hr />
                                    </div>
                                    <form onSubmit={resetPasswordHandler}>
                                        <AuthField
                                            icon="fa fa-envelope"
                                            label="Email Address"
                                            type="text"
                                            value={email}
                                            disabled
                                        />
                                        <AuthField
                                            icon="fa fa-lock"
                                            label="New Password"
                                            type="password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="New Password"
                                            error={errors.password}
                                        />
                                        <AuthField
                                            icon="fa fa-lock"
                                            label="Confirm New Password"
                                            type="password"
                                            value={passwordConfirmation}
                                            onChange={(e) =>
                                                setPasswordConfirmation(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Confirm New Password"
                                            error={errors.password_confirmation}
                                        />
                                        {errors.email && (
                                            <div className="alert alert-danger">
                                                {errors.email}
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-style shadow-sm rounded-sm px-4 w-100"
                                            type="submit"
                                        >
                                            Reset Password
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
