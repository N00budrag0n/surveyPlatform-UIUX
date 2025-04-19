import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import InputField from "../../../Components/InputField";
import RadioSelect from "../../../Components/RadioSelect";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function CategoryCreate() {
    const { permissions, errors } = usePage().props;

    const [name, setName] = useState(permissions.name);
    const [guardName, setGuardName] = useState(permissions.guard_name);

    const [isSaving, setIsSaving] = useState(false);

    const storeCategory = async (e) => {
        setIsSaving(true);
        e.preventDefault();

        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            setIsSaving(false);
            return;
        }

        Inertia.post(
            `/account/permissions/${permissions.id}`,
            {
                name: name,
                guard_name: guardName,
                _method: "PUT",
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
                        text: "Data failed to save!",
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
                <title>Create Permissions - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Create Permissions" icon="fas fa-passport">
                    <form onSubmit={storeCategory}>
                        <div className="mb-3">
                            <InputField
                                label="Permission Name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={errors.name}
                            />
                        </div>

                        <div className="mb-3">
                            <InputField
                                label="Guard Name"
                                name="guard_name"
                                value={guardName}
                                onChange={(e) => setGuardName(e.target.value)}
                                error={errors.guard_name}
                                placeholder={"web"}
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
