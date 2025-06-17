import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import AuthField from "../../Components/AuthField";
import CustomDatePicker from "../../Components/DatePicker";

export default function GoogleRegisterComplete() {
    const { errors, googleUser } = usePage().props;

    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState(null);
    const [profession, setProfession] = useState("");
    const [educationalBackground, setEducationalBackground] = useState("");

    const registerHandler = async (e) => {
        e.preventDefault();

        Inertia.post("/register/google/complete", {
            birth_date: birthDate,
            gender: gender,
            profession: profession,
            educational_background: educationalBackground,
        });
    };

    return (
        <>
            <Head>
                <title>Complete Registration - UIX-Probe</title>
            </Head>

            <div
                className="min-vh-100 d-flex align-items-center justify-content-center"
                style={{
                    background:
                        "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                    padding: "20px",
                }}
            >
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-7">
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
                                    </strong>
                                </h4>
                            </div>

                            <div className="card border-0 rounded-4 shadow">
                                <div className="card-body p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <div className="mb-3">
                                            <img
                                                src={googleUser.avatar}
                                                alt="Profile"
                                                className="rounded-circle"
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                }}
                                            />
                                        </div>
                                        <h5 className="fw-bold">
                                            Complete Your Registration
                                        </h5>
                                        <p className="text-muted small">
                                            Welcome {googleUser.first_name}!
                                            Please provide additional
                                            information to complete your account
                                            setup.
                                        </p>
                                    </div>

                                    <form onSubmit={registerHandler}>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    First Name
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fa fa-user text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            googleUser.first_name
                                                        }
                                                        disabled
                                                        style={{
                                                            backgroundColor:
                                                                "#f8f9fa",
                                                        }}
                                                    />
                                                </div>
                                                <small className="text-muted">
                                                    From Google account
                                                </small>
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label small fw-semibold">
                                                    Surname
                                                </label>
                                                <div className="input-group">
                                                    <span className="input-group-text bg-light">
                                                        <i className="fa fa-user text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={
                                                            googleUser.surname
                                                        }
                                                        disabled
                                                        style={{
                                                            backgroundColor:
                                                                "#f8f9fa",
                                                        }}
                                                    />
                                                </div>
                                                <small className="text-muted">
                                                    From Google account
                                                </small>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label small fw-semibold">
                                                Email Address
                                            </label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light">
                                                    <i className="fa fa-envelope text-muted"></i>
                                                </span>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    value={googleUser.email}
                                                    disabled
                                                    style={{
                                                        backgroundColor:
                                                            "#f8f9fa",
                                                    }}
                                                />
                                            </div>
                                            <small className="text-muted">
                                                From Google account
                                            </small>
                                        </div>

                                        <AuthField
                                            icon="fas fa-venus-mars"
                                            label="Gender"
                                            value={gender}
                                            onChange={(e) =>
                                                setGender(e.target.value)
                                            }
                                            options={["Male", "Female"]}
                                            error={errors.gender}
                                            fieldselect="true"
                                            required
                                        />

                                        <AuthField
                                            icon="fas fa-user-tie"
                                            label="Profession"
                                            value={profession}
                                            onChange={(e) =>
                                                setProfession(e.target.value)
                                            }
                                            options={[
                                                "Government Employee",
                                                "Armed Forces",
                                                "Police",
                                                "Entrepreneur",
                                                "Private Workers",
                                                "Freelancer",
                                                "Homemaker",
                                                "Professor",
                                                "Student",
                                                "Other",
                                            ]}
                                            error={errors.profession}
                                            fieldselect="true"
                                            required
                                        />

                                        <AuthField
                                            icon="fas fa-user-graduate"
                                            label="Educational Background"
                                            value={educationalBackground}
                                            onChange={(e) =>
                                                setEducationalBackground(
                                                    e.target.value
                                                )
                                            }
                                            options={[
                                                "Elementary School",
                                                "Junior High School",
                                                "High School",
                                                "Associate's Degree",
                                                "Bachelor's Degree",
                                                "Master's Degree",
                                                "Doctorate Degree",
                                            ]}
                                            error={errors.educationalBackground}
                                            fieldselect="true"
                                            required
                                        />

                                        <CustomDatePicker
                                            label="Birth Date"
                                            icon="fas fa-calendar-alt"
                                            selectedDate={birthDate}
                                            onChange={(date) =>
                                                setBirthDate(date)
                                            }
                                            error={errors.birthDate}
                                            required
                                        />

                                        <button
                                            className="btn w-100 py-2 mt-3"
                                            type="submit"
                                            style={{
                                                background: "var(--nav-color)",
                                                color: "#ffffff",
                                                fontWeight: "600",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            Continue Registration
                                        </button>
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
