import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import AuthField from "../../../Components/AuthField";
import CardContent from "../../../Layouts/CardContent";
import CustomDatePicker from "../../../Components/DatePicker";
import SelectCheckbox from "../../../Components/SelectCheckbox";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function ProfileEdit() {
    const { errors, user, userPrefs, categories } = usePage().props;

    const [firstName, setFirstName] = useState(user.first_name);
    const [surname, setSurname] = useState(user.surname);
    const [email, setEmail] = useState(user.email);
    const [gender, setGender] = useState(user.gender);
    const [birthDate, setBirthDate] = useState(user.birth_date);
    const [profession, setProfession] = useState(user.profession);
    const [educationalBackground, setEducationalBackground] = useState(
        user.educational_background
    );
    const [password, setPassword] = useState("");
    const [userPrefsData, setUserPrefsData] = useState(
        userPrefs.map((item) => parseInt(item.category_id, 10))
    );

    const [uploadedFiles, setUploadedFiles] = useState([]);

    const [isSaving, setIsSaving] = useState(false);

    const handleCheckboxUserPrefsChange = (e) => {
        const categoryId = parseInt(e.target.value, 10);
        if (userPrefsData.includes(categoryId)) {
            setUserPrefsData(userPrefsData.filter((id) => id !== categoryId));
        } else {
            setUserPrefsData([...userPrefsData, categoryId]);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();

        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            setIsSaving(false);
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to edit your data?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, edit it!",
        });

        if (result.isConfirmed) {
            setIsSaving(true);
            Inertia.post(
                `/account/profile/${user.id}`,
                {
                    first_name: firstName,
                    surname: surname,
                    email: email,
                    gender: gender,
                    birth_date: birthDate,
                    profession: profession,
                    educational_background: educationalBackground,
                    password: password,
                    userPrefsData: userPrefsData,
                    _method: "PUT",
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
                },
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
                    <form onSubmit={updateUser}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <AuthField
                                        icon="fa fa-user"
                                        label="First Name"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        placeholder="First Name"
                                        error={errors.firstName}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <AuthField
                                        icon="fa fa-user"
                                        label="Surname"
                                        type="text"
                                        value={surname}
                                        onChange={(e) =>
                                            setSurname(e.target.value)
                                        }
                                        placeholder="Surname"
                                        error={errors.surname}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <AuthField
                                        icon="fa fa-envelope"
                                        label="Email Address"
                                        type="text"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Email Address"
                                        error={errors.email}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
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
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
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
                                            "other",
                                        ]}
                                        error={errors.profession}
                                        fieldselect="true"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
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
                                </div>
                            </div>
                        </div>

                        <CustomDatePicker
                            label="Birth Date"
                            icon="fas fa-calendar-alt"
                            selectedDate={birthDate}
                            onChange={(date) => setBirthDate(date)}
                            error={errors.birthDate}
                        />

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <AuthField
                                        icon="fa fa-lock"
                                        label="Password"
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Password"
                                        error={errors.password}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <SelectCheckbox
                                id={"user-prefs"}
                                label="Preference Categories"
                                options={categories}
                                valueKey="id"
                                labelKey="name"
                                selectedValues={userPrefsData}
                                error={errors.userPrefs}
                                onChange={handleCheckboxUserPrefsChange}
                            />
                        </div>

                        <ButtonCRUD
                            type="submit"
                            label="Save"
                            color="btn-success"
                            iconClass="fa fa-save"
                            isSaving={isSaving}
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
