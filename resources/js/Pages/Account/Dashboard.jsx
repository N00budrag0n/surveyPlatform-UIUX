import React, { useEffect } from "react";
import { Head, Inertia, usePage, Link } from "@inertiajs/inertia-react";
import Pagination from "../../Components/Pagination";
import LayoutAccount from "../../Layouts/Account";
import AccordionLayout from "../../Layouts/Accordion";
import hasAnyPermission from "../../Utils/Permissions";
import TableDashboardSurvey from "../../Components/TableDashboardSurvey";

export default function Dashboard() {
    const { auth, app_url, surveys, surveyData } =
        usePage().props;

        useEffect(() => {
        const handleVisibilityChange = () => {
            document.title = document.hidden
                ? "Survey Platform 👋😊"
                : "Survey Platform";
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    return (
        <>
            <Head>
                <title>Dashboard - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="m-3">
                    <div className="row card-body border-0 shadow-sm mb-2">
                        <div className="m-2">
                            Selamat Datang,{" "}
                            <strong>{`${auth.user.first_name} ${auth.user.surname}`}</strong>
                            <br />
                            Untuk membantu Anda dalam menggunakan sistem ini,
                            kami telah menyediakan manual book yang dapat Anda
                            baca dan unduh. Manual book ini mencakup panduan
                            lengkap mulai dari langkah-langkah awal penggunaan
                            hingga fitur-fitur lanjutan yang tersedia di sistem
                            ini. Kami berharap manual book ini dapat memberikan
                            panduan yang jelas dan memudahkan Anda dalam
                            memanfaatkan seluruh layanan yang ditawarkan oleh
                            sistem kami. Silakan klik tombol di bawah ini untuk
                            mengunduh manual book tersebut:
                            <br />
                            <div className="row d-flex">
                                <a
                                    href={`${app_url}/assets/files/SurveyPlatform-UserManualBook(TAM).pdf`}
                                    className="btn btn-style m-2 col-md-3 col-11"
                                    target="_blank"
                                    download
                                >
                                    Unduh Manual Book
                                </a>
                                {hasAnyPermission([
                                    "dashboard.full.manual.book",
                                ]) && (
                                    <a
                                        href={`${app_url}/assets/files/SurveyPlatform-FullManualBook(TAM).pdf`}
                                        className="btn btn-style m-2 col-md-3 col-11"
                                        target="_blank"
                                        download
                                    >
                                        Unduh Manual Book - Admin
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <AccordionLayout
                        title="Jumlah Respons Setiap Survei"
                        defaultOpen={true}
                    >
                        {surveyData.length > 0 ? (
                            <TableDashboardSurvey
                                surveyData={surveyData}
                                surveys={surveys}
                            />
                        ) : (
                            <div className="text-center">Tidak ada data</div>
                        )}

                        <Pagination links={surveys.links} align={"end"} />
                    </AccordionLayout>
                </div>
            </LayoutAccount>
        </>
    );
}
