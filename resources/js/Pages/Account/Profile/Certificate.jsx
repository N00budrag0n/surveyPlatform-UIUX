import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import CardContent from "../../../Layouts/CardContent";
import PDFDropzone from "../../../Components/FileUpload";
import TableCertificates from "../../../Components/CertificatesTable";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function ProfileCertificate() {
    const { errors, user, certificates } = usePage().props;

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleFileUpload = (files) => {
        setUploadedFiles(files);
    };

    const storeCertificates = async (e) => {
        e.preventDefault();

        setIsSaving(true);
        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            setIsSaving(false);
            return;
        }

        const formData = new FormData();
        uploadedFiles.forEach((file) => {
            formData.append("files[]", file);
        });
        formData.append("user_id", user.id);

        Inertia.post(
            `/account/profile/certificate`,
            formData,
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success!",
                        text: "Upload successful! We will review your certificates and get back to you as soon as possible.",
                        icon: "success",
                        showConfirmButton: true,
                    });
                    setIsSaving(false);
                },
                onError: () => {
                    Swal.fire({
                        title: "Error!",
                        text: "Data failed to save!",
                        icon: "error",
                        showConfirmButton: true,
                    });
                    setIsSaving(false);
                },
            },
            setIsSaving(false)
        );
    };

    return (
        <>
            <Head>
                <title>Create Users - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Upload Certificate">
                    <form onSubmit={storeCertificates}>
                        <p>
                            Jika Anda memiliki sertifikat atau ijasah Anda dapat
                            mengunggahnya di sini. Dokumen tersebut digunakan
                            untuk mengajukan anda sebagai "Certified User".
                        </p>

                        <PDFDropzone onFileUpload={handleFileUpload} />

                        <>
                            {Object.keys(errors).length > 0 && (
                                <div className="alert alert-danger">
                                    {Object.values(errors).map(
                                        (error, index) => (
                                            <div key={index}>{error}</div>
                                        )
                                    )}
                                </div>
                            )}
                        </>

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

                <CardContent title="Uploaded Certificates">
                    {certificates.data.length > 0 ? (
                        <TableCertificates certificates={certificates} />
                    ) : (
                        <div className="text-center">Tidak ada data</div>
                    )}
                </CardContent>
            </LayoutAccount>
        </>
    );
}
