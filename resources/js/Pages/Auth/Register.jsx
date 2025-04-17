import React, { useState } from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import AuthField from "../../Components/AuthField";
import CustomDatePicker from "../../Components/DatePicker";

export default function Register() {
    const { errors } = usePage().props;

    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState(null);
    const [profession, setProfession] = useState("");
    const [educationalBackground, setEducationalBackground] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const registerHandler = async (e) => {
        e.preventDefault();

        Inertia.post("/register/personaldata", {
            first_name: firstName,
            surname: surname,
            email: email,
            birth_date: birthDate,
            gender: gender,
            profession: profession,
            educational_background: educationalBackground,
            password: password,
            password_confirmation: passwordConfirmation,
        });
    };

    return (
        <>
            <Head>
                <title>Register Account - UIX-Probe</title>
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
                                    </strong>{" "}
                                </h4>
                            </div>

                            <div className="card border-0 rounded-4 shadow">
                                <div className="card-body p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <h5 className="fw-bold">
                                            Create Your Account
                                        </h5>
                                        <p className="text-muted small">
                                            Fill in your information to get
                                            started
                                        </p>
                                    </div>

                                    <form onSubmit={registerHandler}>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <AuthField
                                                    icon="fa fa-user"
                                                    label="First Name"
                                                    type="text"
                                                    value={firstName}
                                                    onChange={(e) =>
                                                        setFirstName(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter first name"
                                                    error={errors.firstName}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-6">
                                                <AuthField
                                                    icon="fa fa-user"
                                                    label="Surname"
                                                    type="text"
                                                    value={surname}
                                                    onChange={(e) =>
                                                        setSurname(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter surname"
                                                    error={errors.surname}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <AuthField
                                            icon="fa fa-envelope"
                                            label="Email Address"
                                            type="text"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="Enter email address"
                                            error={errors.email}
                                            required
                                        />

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

                                        <div className="row">
                                            <div className="col-md-6">
                                                <AuthField
                                                    icon="fa fa-lock"
                                                    label="Password"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Create password"
                                                    error={errors.password}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <AuthField
                                                    icon="fa fa-lock"
                                                    label="Confirm Password"
                                                    type="password"
                                                    value={passwordConfirmation}
                                                    onChange={(e) =>
                                                        setPasswordConfirmation(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Confirm password"
                                                    required
                                                />
                                            </div>
                                        </div>

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
                                            Create Account
                                        </button>

                                        <div className="text-center mt-4">
                                            <p className="mb-0 small">
                                                Already have an account?{" "}
                                                <Link
                                                    href="/login"
                                                    className="text-decoration-none fw-semibold"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                >
                                                    Sign In
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
