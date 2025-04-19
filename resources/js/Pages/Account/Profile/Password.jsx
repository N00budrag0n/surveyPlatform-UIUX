import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import AuthField from "../../../Components/AuthField";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function ProfilePassword() {
    const { errors, user } = usePage().props;

    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    const updatePassword = async (e) => {
        e.preventDefault();

        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            setIsSaving(false);
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to edit your password?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, edit it!",
        });

        if (result.isConfirmed) {
            setIsSaving(true);

            Inertia.put(
                `/account/profile/password/update`,
                {
                    email: email,
                    password: password,
                    new_password: newPassword,
                    new_password_confirmation: confirmNewPassword,
                },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Success!",
                            text: "Data update successfully!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    },
                    onError: () => {
                        Swal.fire({
                            title: "Error!",
                            text: "Something went wrong!",
                            icon: "error",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                    },
                    onFinish: () => {
                        setIsSaving(false);
                    },
                }
            );
        }
    };

    return (
        <>
            <Head>
                <title>Create Users - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Profile">
                    <form onSubmit={updatePassword}>
                        <div className="mb-3">
                            <AuthField
                                icon="fa fa-envelope"
                                label="Email Address"
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                error={errors.email}
                                disabled
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <AuthField
                                icon="fa fa-lock"
                                label="Current Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                error={errors.password}
                            />
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <AuthField
                                        icon="fa fa-lock"
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(e.target.value)
                                        }
                                        placeholder="New Password"
                                        error={errors.new_password}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <AuthField
                                        icon="fa fa-lock"
                                        label="Confirm New Password"
                                        type="password"
                                        value={confirmNewPassword}
                                        onChange={(e) =>
                                            setConfirmNewPassword(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Confirm New Password"
                                        error={errors.new_password_confirmation}
                                    />
                                </div>
                            </div>
                        </div>

                        <ButtonCRUD
                            type="submit"
                            label="Save"
                            color="btn-success"
                            iconClass="fa fa-save"
                            disabled={isSaving}
                        />

                        <ButtonCRUD
                            type="Cancel"
                            label="Cancel"
                            color="btn-secondary"
                            iconClass="fas fa-times"
                            onClick={() => window.history.back()}
                        />
                    </form>
                </CardContent>
            </LayoutAccount>
        </>
    );
}
