import React, { useState } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import InputField from "../../../Components/InputField";
import RadioSelect from "../../../Components/RadioSelect";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Swal from "sweetalert2";

export default function CategoryEdit() {
    const { errors, category } = usePage().props;

    const [name, setName] = useState(category.name);
    const [categoryVisibility, setCategoryVisibility] = useState(
        category.status
    );
    const [image, setImage] = useState(category.image);

    const [isSaving, setIsSaving] = useState(false);

    function handleVisibleChange(selectedValue) {
        setCategoryVisibility(selectedValue);
    }

    const updateCategory = async (e) => {
        setIsSaving(true);
        e.preventDefault();

        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            setIsSaving(false);
            return;
        }

        Inertia.post(
            `/account/categories/${category.id}`,
            {
                name: name,
                image: image,
                status: categoryVisibility,
                _method: "PUT",
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
                        text: "Data failed to save!",
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
    };

    return (
        <>
            <Head>
                <title>Edit Category - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Edit Category" icon="fa fa-folder">
                    <form onSubmit={updateCategory}>
                        <div className="mb-3">
                            <InputField
                                label="Image (max 2MB)"
                                type="file"
                                value={category.image}
                                onChange={(e) => [setImage(e.target.files[0])]}
                                error={errors.image}
                            />
                        </div>

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
                            <RadioSelect
                                id="survey_visibility"
                                label="General Access Survey"
                                mustFill={true}
                                options={[
                                    {
                                        id: 1,
                                        value: "Public",
                                        label: "Public",
                                    },
                                    {
                                        id: 2,
                                        value: "Private",
                                        label: "Private",
                                    },
                                    {
                                        id: 3,
                                        value: "Restricted",
                                        label: "Only link holders can access",
                                    },
                                ]}
                                valueKey="value"
                                labelKey="label"
                                selectedValue={categoryVisibility}
                                onChange={handleVisibleChange}
                                error={errors.status}
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
