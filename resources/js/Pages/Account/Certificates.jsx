import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, usePage } from "@inertiajs/inertia-react";
import Swal from "sweetalert2";
import LayoutAccount from "../../Layouts/Account";
import hasAnyPermission from "../../Utils/Permissions";
import AccordionLayout from "../../Layouts/Accordion";
import CardContent from "../../Layouts/CardContent";
import SelectCheckbox from "../../Components/SelectCheckbox";
import ButtonCRUD from "../../Components/ButtonCRUD";
import TableCertificates from "../../Components/CertificatesTable";
import CertificateCard from "../../Components/CertificateCard";
import Search from "../../Components/Search";

export default function Certificates() {
    const { pendingCertificates, categories, certificateHistory, errors } =
        usePage().props;

    const [selectedCertificateId, setSelectedCertificateId] = useState();
    const [selectedCertificateName, setSelectedCertificateName] = useState("");

    const [certCategoriesData, setCertCategoriesData] = useState([]);
    const [selectedCertificate, setSelectedCertificate] = useState("");

    const [isSaving, setIsSaving] = useState(false);

    const handleCardClick = (id, certificate, fileName) => {
        setSelectedCertificateId(id);
        setSelectedCertificate(certificate);
        setSelectedCertificateName(fileName);
    };

    const handleCheckboxCetfCategory = (e) => {
        const category_id = parseInt(e.target.value, 10);
        if (certCategoriesData.includes(category_id)) {
            setCertCategoriesData(
                certCategoriesData.filter((id) => id !== category_id)
            );
        } else {
            setCertCategoriesData([...certCategoriesData, category_id]);
        }
    };

    const handleReset = () => {
        setCertCategoriesData([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const shouldProceed = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to approve the certificate categories?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, save it!",
        });

        if (shouldProceed.isConfirmed) {
            setIsSaving(true);
            const { value: text, isConfirmed } = await Swal.fire({
                input: "textarea",
                inputLabel: "Message for approve this certificate",
                inputPlaceholder: "Type your message here...",
                inputAttributes: {
                    "aria-label": "Type your message here",
                },
                showCancelButton: true,
            });

            if (isConfirmed) {
                Inertia.post(
                    "/account/certificates",
                    {
                        certificateId: selectedCertificateId,
                        status: "approved",
                        massage: text,
                        certificate_categories: certCategoriesData,
                    },
                    {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Success!",
                                text: "Certificate categories saved successfully!",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            setIsSaving(false);
                            setCertCategoriesData([]);
                            setSelectedCertificate("");
                            setSelectedCertificateId(null);
                            setSelectedCertificateName("");
                        },
                        onError: () => {
                            Swal.fire({
                                title: "Error!",
                                text: "Data failed to save!",
                                icon: "error",
                                showConfirmButton: false,
                                timer: 1500,
                            });
                            setIsSaving(false);
                        },
                    },
                    setIsSaving(false)
                );
            }
            is;
        }
    };

    const handleReject = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to reject this certificate?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, reject it!",
        });

        if (result.isConfirmed) {
            const { value: text } = await Swal.fire({
                input: "textarea",
                inputLabel: "Message for rejecting this certificate",
                inputPlaceholder: "Type your message here...",
                inputAttributes: {
                    "aria-label": "Type your message here",
                },
                showCancelButton: true,
            });

            Inertia.post(
                "/account/certificates",
                {
                    certificateId: selectedCertificateId,
                    status: "rejected",
                    massage: text,
                    selectedCertificate: selectedCertificate,
                },
                {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Success!",
                            text: "Certificate rejected successfully!",
                            icon: "success",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        setCertCategoriesData([]);
                        setSelectedCertificate("");
                        setSelectedCertificateId(null);
                        setSelectedCertificateName("");
                    },
                }
            );
        }
    };

    return (
        <>
            <Head>
                <title>Certificates - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <AccordionLayout
                    title="Pengkategorian Sertifikat"
                    defaultOpen={true}
                >
                    <div className="row">
                        <div className="col-md-8 d-flex align-items-center justify-content-center">
                            {selectedCertificate ? (
                                <iframe
                                    id="pdfViewer"
                                    src={selectedCertificate}
                                    width="100%"
                                    height="600"
                                ></iframe>
                            ) : (
                                <div
                                    className="card-preview text-center bg-black"
                                    style={{ width: "100%", height: "600px" }}
                                >
                                    <div className="card-body mt-4">
                                        <p>
                                            Silakan pilih sertifikat pada
                                            navigasi sertifikat.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="col-md-4 h-100">
                            <AccordionLayout
                                title="Navigasi Sertifikat"
                                defaultOpen={true}
                            >
                                {pendingCertificates.data.length > 0 ? (
                                    <div
                                        style={{
                                            maxHeight: "500px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {pendingCertificates.data.map(
                                            (certificate) => (
                                                <CertificateCard
                                                    key={certificate.id}
                                                    background="#EE7E34"
                                                    certificate={certificate}
                                                    selectedCertificateId={
                                                        selectedCertificateId
                                                    }
                                                    handleCardClick={
                                                        handleCardClick
                                                    }
                                                />
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        Tidak ada data
                                    </div>
                                )}
                            </AccordionLayout>
                        </div>
                    </div>
                    {hasAnyPermission([
                        "certificates.index.full",
                        "certificates.approve",
                        "certificates.reject",
                    ]) && (
                        <AccordionLayout
                            title="Kategori Sertifikat"
                            defaultOpen={true}
                        >
                            <div className="alert alert-info">
                                <strong>Selected Certificate :</strong>{" "}
                                {selectedCertificateName ?? "null"}
                            </div>
                            {Object.keys(errors).length > 0 && (
                                <div className="alert alert-danger">
                                    {Object.values(errors).map(
                                        (error, index) => (
                                            <div key={index}>{error}</div>
                                        )
                                    )}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <SelectCheckbox
                                    id="certCategories"
                                    options={categories}
                                    selectedValues={certCategoriesData}
                                    valueKey="id"
                                    labelKey="name"
                                    onChange={handleCheckboxCetfCategory}
                                />
                                {hasAnyPermission(["certificates.approve"]) && (
                                    <ButtonCRUD
                                        type="submit"
                                        label="Save"
                                        color="btn-success"
                                        iconClass="fas fa-check-circle"
                                        disabled={isSaving}
                                    />
                                )}
                                <ButtonCRUD
                                    type="reset"
                                    label="Reset"
                                    color="btn-warning"
                                    iconClass="fa fa-redo"
                                    onClick={handleReset}
                                />
                                {hasAnyPermission(["certificates.reject"]) && (
                                    <ButtonCRUD
                                        type="Reject"
                                        label="Reject"
                                        color="btn-danger"
                                        iconClass="fas fa-times-circle"
                                        onClick={handleReject}
                                        disabled={isSaving}
                                    />
                                )}
                            </form>
                        </AccordionLayout>
                    )}
                </AccordionLayout>

                <CardContent title="Sertifikat Terdaftar" icon="fa fa-folder">
                    <div className="col-12 alert alert-info">
                        <Search URL={"/account/certificates/"} />
                    </div>
                    {certificateHistory.data.length > 0 ? (
                        <TableCertificates certificates={certificateHistory} />
                    ) : (
                        <div className="text-center">Tidak ada data</div>
                    )}
                </CardContent>
            </LayoutAccount>
        </>
    );
}
