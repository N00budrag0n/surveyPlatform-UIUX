import React, { useState, useEffect } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import AuthField from "../../../Components/AuthField";
import CustomDatePicker from "../../../Components/DatePicker";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import SelectCheckbox from "../../../Components/SelectCheckbox";
import hasAnyPermission from "../../../Utils/Permissions";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function UserEdit() {
    const { errors, roles, user, categories, userPrefs } = usePage().props;
    let filteredRoles = roles;

    if (!hasAnyPermission(["users.index.full"])) {
        filteredRoles = filteredRoles.filter(
            (role) => !["super admin"].includes(role.name)
        );
    }

    const [firstName, setFirstName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState(null);
    const [profession, setProfession] = useState("");
    const [educationalBackground, setEducationalBackground] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [rolesData, setRolesData] = useState([]);
    const [userPrefsData, setUserPrefsData] = useState([]);

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFirstName(user.first_name);
        setSurname(user.surname);
        setEmail(user.email);
        setGender(user.gender);
        setBirthDate(user.birth_date);
        setProfession(user.profession);
        setEducationalBackground(user.educational_background);
        setRolesData(user.roles.map((item) => item.name));
        setUserPrefsData(
            userPrefs.map((item) => parseInt(item.category_id, 10))
        );
    }, [user, userPrefs]);

    const handleCheckboxRolesChange = (e) => {
        const roleName = e.target.value;
        if (rolesData.includes(roleName)) {
            setRolesData(rolesData.filter((name) => name !== roleName));
        } else {
            setRolesData([...rolesData, roleName]);
        }
    };

    const handleCheckboxUserPrefsChange = (e) => {
        const categoryId = parseInt(e.target.value, 10);

        if (userPrefsData.includes(categoryId)) {
            setUserPrefsData(userPrefsData.filter((id) => id !== categoryId));
        } else {
            setUserPrefsData([...userPrefsData, categoryId]);
        }
    };

    const updateUser = async (e) => {
        setIsSaving(true);
        e.preventDefault();

        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            return;
        }

        Inertia.put(
            `/account/users/${user.id}`,
            {
                first_name: firstName,
                surname: surname,
                email: email,
                gender: gender,
                birth_date: birthDate,
                profession: profession,
                educational_background: educationalBackground,
                password: password,
                password_confirmation: passwordConfirmation,
                roles: rolesData,
                user_prefs: userPrefsData,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success!",
                        text: "Data updated successfully!",
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
    };

    return (
        <>
            <Head>
                <title>Edit Users - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Edit User" icon="fas fa-user">
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
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <AuthField
                                        icon="fa fa-lock"
                                        label="Password Confirmation"
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) =>
                                            setPasswordConfirmation(
                                                e.target.value
                                            )
                                        }
                                        error={errors.password}
                                        placeholder="Password Confirmation"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <SelectCheckbox
                                id="roles"
                                label="Roles"
                                options={filteredRoles}
                                valueKey="name"
                                labelKey="name"
                                selectedValues={rolesData}
                                error={errors.roles}
                                onChange={handleCheckboxRolesChange}
                            />
                        </div>

                        <div className="mb-3">
                            <SelectCheckbox
                                id="categories"
                                label="Preference Categories"
                                options={categories}
                                valueKey="id"
                                labelKey="name"
                                selectedValues={userPrefsData}
                                error={errors.user_prefs}
                                onChange={handleCheckboxUserPrefsChange}
                            />
                        </div>

                        <div>
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
                        </div>
                    </form>
                </CardContent>
            </LayoutAccount>
        </>
    );
}
