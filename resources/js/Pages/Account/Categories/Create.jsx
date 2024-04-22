import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import InputField from "../../../Components/InputField";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function CategoryCreate() {
    const { errors } = usePage().props;

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

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
            "/account/categories",
            {
                name: name,
                image: image,
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
                    setIsSaving(false);
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
    };

    return (
        <>
            <Head>
                <title>Create Category - Survey Platform</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Create Category" icon="fas fa-folder-plus">
                    <form onSubmit={storeCategory}>
                        <div className="mb-3">
                            <InputField
                                label="Category Name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={errors.name}
                            />
                        </div>
                        <div className="mb-3">
                            <InputField
                                label="Image (max 2 MB)"
                                type="file"
                                value={image}
                                onChange={(e) => [setImage(e.target.files[0])]}
                                error={errors.image}
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
