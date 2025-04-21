import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import SelectCheckbox from "../../../Components/SelectCheckbox";
import hasAnyPermission from "../../../Utils/Permissions";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function RoleCreate() {
    const { errors, permissions } = usePage().props;

    let filteredPermissions = permissions;

    if (!hasAnyPermission(["roles.index.full"])) {
        filteredPermissions = filteredPermissions.filter(
            (permission) =>
                permission.name !== "users.index.full" &&
                permission.name !== "roles.index.full"
        );
    }

    const [name, setName] = useState("");
    const [permissionsData, setPermissionsData] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    const handleCheckboxChange = (e) => {
        let data = permissionsData;
        data.push(e.target.value);

        setPermissionsData(data);
    };

    const storeRole = async (e) => {
        setIsSaving(true);
        e.preventDefault();

        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            setIsSaving(false);
            return;
        }

        Inertia.post(
            "/account/roles",
            {
                name: name,
                permissions: permissionsData,
            },
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Success!",
                        text: "Data saved successfully!",
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
                <title>Create Roles - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Create Roles" icon="fa fa-shield-alt">
                    <form onSubmit={storeRole}>
                        <div className="mb-3">
                            <label className="form-label fw-bold">
                                Role Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter Role Name"
                            />
                        </div>
                        {errors.name && (
                            <div className="alert alert-danger">
                                {errors.name}
                            </div>
                        )}
                        <hr />
                        <div className="mb-3">
                            <SelectCheckbox
                                id={"permissions"}
                                label="Permissions"
                                options={filteredPermissions}
                                valueKey="name"
                                labelKey="name"
                                onChange={handleCheckboxChange}
                                error={errors.permissions}
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
