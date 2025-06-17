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

    // add google register handler
    const handleGoogleRegister = () => {
        window.location.href = "/oauth/google";
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

                                    {/* Google Register Button */}
                                    <button
                                        onClick={handleGoogleRegister}
                                        className="btn btn-outline-dark w-100 py-2 mb-3 d-flex align-items-center justify-content-center"
                                        style={{ borderRadius: "8px" }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" className="me-2">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                        </svg>
                                        Continue with Google
                                    </button>

                                    <div className="text-center mb-3">
                                        <span className="text-muted small">or</span>
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
