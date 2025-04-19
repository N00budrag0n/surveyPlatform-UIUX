import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import hasAnyPermission from "../../../Utils/Permissions";
import TableDashboardFilledSurvey from "../../../Components/TableDashboardfilledSurvey";
import AccordionLayout from "../../../Layouts/Accordion";
import Pagination from "../../../Components/Pagination";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";

export default function UserCreate() {
    const { user, filledOutSurvey } = usePage().props;
    const logoutHandler = async (e) => {
        e.preventDefault();
        localStorage.clear();

        Inertia.post("/logout");
    };

    return (
        <>
            <Head>
                <title>Create Users - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="row">
                    <div className="col-md-12 col-lg-8">
                        <CardContent title="Profile">
                            <div
                                className="d-flex flex-column"
                                style={{ height: "20rem" }}
                            >
                                <div className="d-flex mb-3">
                                    <div className="col-7 col-lg-3">
                                        <strong>Nama Lengkap</strong>
                                    </div>
                                    <div className="col-7 col-sm-6 col-lg-9">
                                        : {user.first_name} {user.surname}
                                    </div>
                                </div>
                                <div className="d-flex mb-3">
                                    <div className="col-7 col-lg-3">
                                        <strong>Email</strong>
                                    </div>
                                    <div className="col-7 col-sm-6 col-lg-9">
                                        : {user.email}
                                    </div>
                                </div>
                                <div className="d-flex mb-3">
                                    <div className="col-7 col-lg-3">
                                        <strong>Gender</strong>
                                    </div>
                                    <div className="col-7 col-sm-6 col-lg-9">
                                        : {user.gender}
                                    </div>
                                </div>
                                <div className="d-flex mb-3">
                                    <div className="col-7 col-lg-3">
                                        <strong>Tanggal Lahir</strong>
                                    </div>
                                    <div className="col-7 col-sm-6 col-lg-9">
                                        : {user.birth_date}
                                    </div>
                                </div>
                                <div className="d-flex mb-3">
                                    <div className="col-7 col-lg-3">
                                        <strong>Profesi</strong>
                                    </div>
                                    <div className="col-7 col-sm-6 col-lg-9">
                                        : {user.profession}
                                    </div>
                                </div>
                                <div className="d-flex mb-3">
                                    <div className="col-7 col-lg-3">
                                        <strong>
                                            Latar Belakang Pendidikan
                                        </strong>
                                    </div>
                                    <div className="col-7 col-sm-6 col-lg-9">
                                        : {user.educational_background}
                                    </div>
                                </div>
                                <div className="d-flex mb-3">
                                    <div className="col-7 col-lg-3">
                                        <strong>Bergabung sejak</strong>
                                    </div>
                                    <div className="col-md-7 col-sm-6 col-lg-9">
                                        : {user.created_at}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                    <div className="col-md-12 col-lg-4">
                        <CardContent
                            title={"Account Settings"}
                            icon={"fas fa-user-cog"}
                        >
                            <nav
                                className="d-flex flex-column align-items-center p-4"
                                style={{ height: "20rem" }}
                            >
                                <Link
                                    href="/"
                                    className="btn btn-outline-primary btn-block mb-3"
                                    style={{ width: "100%" }}
                                    type="button"
                                >
                                    <div className="row">
                                        <div className="col-5 d-flex justify-content-end align-items-center">
                                            <i class="fas fa-home" />
                                        </div>
                                        <div className="col-7 d-flex justify-content-start align-items-center">
                                            Home
                                        </div>
                                    </div>
                                </Link>
                                {hasAnyPermission(["profile.edit"]) && (
                                    <Link
                                        href={`/account/profile/${user.id}/edit`}
                                        className="btn btn-outline-success btn-block mb-3"
                                        style={{ width: "100%" }}
                                        type="button"
                                    >
                                        <div className="row">
                                            <div className="col-5 d-flex justify-content-end align-items-center">
                                                <i class="fas fa-user-edit" />
                                            </div>
                                            <div className="col-7 d-flex justify-content-start align-items-center">
                                                Edit Profile
                                            </div>
                                        </div>
                                    </Link>
                                )}
                                {hasAnyPermission([
                                    "profile.upload.certificate",
                                ]) && (
                                    <Link
                                        href="/account/profile/certificate"
                                        className="btn btn-outline-secondary btn-block mb-3"
                                        style={{ width: "100%" }}
                                        type="button"
                                    >
                                        <div className="row">
                                            <div className="col-5 d-flex justify-content-end align-items-center">
                                                <i class="fas fa-upload" />
                                            </div>
                                            <div className="col-7 d-flex justify-content-start align-items-center">
                                                Upload Certificates
                                            </div>
                                        </div>
                                    </Link>
                                )}
                                {hasAnyPermission([
                                    "profile.change.password",
                                ]) && (
                                    <Link
                                        href="/account/profile/password"
                                        className="btn btn-outline-warning btn-block mb-3"
                                        style={{ width: "100%" }}
                                        type="button"
                                    >
                                        <div className="row">
                                            <div className="col-5 d-flex justify-content-end align-items-center">
                                                <i class="fas fa-tools" />
                                            </div>
                                            <div className="col-7 d-flex justify-content-start align-items-center">
                                                Change Password{" "}
                                            </div>
                                        </div>
                                    </Link>
                                )}
                                <Link
                                    onClick={logoutHandler}
                                    className="btn btn-outline-danger btn-block mb-3"
                                    style={{ width: "100%" }}
                                    type="button"
                                >
                                    <div className="row">
                                        <div className="col-5 d-flex justify-content-end align-items-center">
                                            <i class="fas fa-sign-out-alt" />
                                        </div>
                                        <div className="col-7 d-flex justify-content-start align-items-center">
                                            Logout
                                        </div>
                                    </div>
                                </Link>
                            </nav>
                        </CardContent>
                    </div>
                </div>
                <div>
                    <AccordionLayout
                        title="Survei Yang Telah Diisi"
                        defaultOpen={false}
                    >
                        {filledOutSurvey.data.length > 0 ? (
                            <>
                                <TableDashboardFilledSurvey
                                    surveyFilled={filledOutSurvey}
                                />

                                <Pagination
                                    links={filledOutSurvey.links}
                                    align={"end"}
                                />
                            </>
                        ) : (
                            <>
                                <div className="text-center">
                                    Tidak ada data
                                </div>
                            </>
                        )}
                    </AccordionLayout>
                </div>
            </LayoutAccount>
        </>
    );
}
