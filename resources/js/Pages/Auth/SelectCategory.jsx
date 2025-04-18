import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import SelectButton from "../../Components/SelectButton";
import PDFDropzone from "../../Components/FileUpload";
import Swal from "sweetalert2";

export default function SelectCategory() {
    const { errors, categories } = usePage().props;

    const [userPrefsData, setUserPrefsData] = useState([]);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const handleCheckboxUserPrefsChange = (value) => {
        setUserPrefsData((prevData) => {
            if (prevData.includes(value)) {
                return prevData.filter((item) => item !== value);
            } else {
                return [...prevData, value];
            }
        });
    };

    const handleFileUpload = (files) => {
        setUploadedFiles(files);
    };

    const storeCategories = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("userPrefsData", JSON.stringify(userPrefsData));
        uploadedFiles.forEach((file) => {
            formData.append("files[]", file);
        });

        Inertia.post("/register/preferencedata", formData, {
            onSuccess: () => {
                Swal.fire({
                    title: "Success!",
                    text: "Registration successful! Welcome to UIX-Probe!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
        });
    };

    // Custom styles to override the default brown colors
    const customStyles = {
        selectedCategory: {
            backgroundColor: "var(--nav-color)",
            color: "#ffffff",
            borderColor: "var(--nav-color)"
        },
        fileUploadContainer: {
            border: "2px dashed var(--nav-color)",
            backgroundColor: "rgba(var(--nav-color-rgb), 0.05)",
            color: "var(--font-color)"
        },
        fileIcon: {
            color: "var(--nav-color)"
        },
        fileListHeader: {
            color: "var(--nav-color)"
        }
    };

    return (
        <>
            <Head>
                <title>Select Preferences - UIX-Probe</title>
            </Head>

            <div className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    padding: "20px"
                }}>
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
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
                                    <strong style={{ color: "var(--nav-color)" }}>UIX</strong>-Probe
                                </h4>
                            </div>

                            <div className="card border-0 rounded-4 shadow">
                                <div className="card-body p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <h5 className="fw-bold">Select Your Preferences</h5>
                                        <p className="text-muted small">Choose categories that interest you to personalize your experience</p>
                                    </div>

                                    <form onSubmit={storeCategories}>
                                        <div className="mb-4">
                                            {/* Apply custom styles to SelectButton component */}
                                            <style jsx>{`
                                                .btn-check:checked + .btn-outline-primary {
                                                    background-color: var(--nav-color) !important;
                                                    color: #ffffff !important;
                                                    border-color: var(--nav-color) !important;
                                                }
                                                .btn-outline-primary {
                                                    color: var(--nav-color) !important;
                                                    border-color: var(--nav-color) !important;
                                                }
                                                .btn-outline-primary:hover {
                                                    background-color: rgba(var(--nav-color-rgb), 0.1) !important;
                                                    color: var(--nav-color) !important;
                                                }
                                            `}</style>

                                            <SelectButton
                                                options={categories}
                                                valueKey="id"
                                                labelKey="name"
                                                selectedValues={userPrefsData}
                                                onChange={handleCheckboxUserPrefsChange}
                                                error={errors.userPrefsData}
                                            />

                                            {errors.userPrefsData && (
                                                <div className="text-danger small mt-2">
                                                    {errors.userPrefsData}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3 bg-light rounded-3 mb-4">
                                            <h6 className="fw-bold mb-2">Optional Certification</h6>
                                            <p className="text-muted small mb-3">
                                                If you have certificates or qualifications related to your selected categories,
                                                you can upload them here to become a "Certified User" on our platform.
                                            </p>

                                            {/* Apply custom styles to PDFDropzone component */}
                                            <style jsx>{`
                                                .container section > div {
                                                    border-color: var(--nav-color) !important;
                                                    background-color: rgba(var(--nav-color-rgb), 0.05) !important;
                                                }
                                                .container section > div p {
                                                    color: var(--font-color) !important;
                                                }
                                                .container section aside p {
                                                    color: var(--font-color) !important;
                                                    font-weight: 600;
                                                }
                                                .container section aside ul {
                                                    color: var(--font-color) !important;
                                                }
                                            `}</style>

                                            <PDFDropzone
                                                onFileUpload={handleFileUpload}
                                            />

                                            {/* Display uploaded files with updated styling */}
                                            {uploadedFiles.length > 0 && (
                                                <div className="mt-3">
                                                    <h6 className="fw-semibold mb-2" style={{ color: "var(--nav-color)" }}>
                                                        <i className="fas fa-check-circle me-2"></i>
                                                        Files Ready for Upload
                                                    </h6>
                                                    <ul className="list-group list-group-flush small">
                                                        {uploadedFiles.map((file, index) => (
                                                            <li key={index} className="list-group-item bg-transparent px-0 py-1 d-flex align-items-center">
                                                                <i className="fas fa-file-pdf me-2" style={{ color: "var(--nav-color)" }}></i>
                                                                <span className="text-truncate" style={{ color: "var(--font-color)" }}>{file.name}</span>
                                                                <span className="ms-auto text-muted">
                                                                    {(file.size / 1024).toFixed(1)} KB
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {errors.files && (
                                                <div className="text-danger small mt-2">
                                                    {errors.files}
                                                </div>
                                            )}
                                        </div>

                                        <div className="d-grid gap-2">
                                            <button
                                                className="btn py-2"
                                                type="submit"
                                                style={{
                                                    background: "var(--nav-color)",
                                                    color: "#ffffff",
                                                    fontWeight: "600",
                                                    borderRadius: "8px"
                                                }}
                                            >
                                                Complete Registration
                                            </button>

                                            <Link
                                                href="/login"
                                                className="btn btn-outline-secondary py-2"
                                                style={{
                                                    borderRadius: "8px",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                Skip for Now
                                            </Link>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div className="text-center mt-4">
                                <p className="mb-0 small text-muted">
                                    Already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="text-decoration-none fw-semibold"
                                        style={{ color: "var(--nav-color)" }}
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
