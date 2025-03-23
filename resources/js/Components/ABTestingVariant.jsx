import React from "react";
import InputField from "./InputField";

export default function ABTestingVariant({
    variant,
    variantType,
    groupIndex,
    compIndex,
    groupName,
    comparisonId,
    abTestingData,
    setAbTestingData
}) {
    const variantLabel = variantType === 'a' ? 'A' : 'B';

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const updatedData = [...abTestingData];
            updatedData[groupIndex].comparisons[compIndex][`variant_${variantType}`].image = file;
            setAbTestingData(updatedData);
        }
    };

    return (
        <div className="card">
            <div className="card-header">Variant {variantLabel}</div>
            <div className="card-body">
                <InputField
                    label="Title"
                    type="text"
                    value={variant.title}
                    onChange={(e) => {
                        const updatedData = [...abTestingData];
                        updatedData[groupIndex].comparisons[compIndex][`variant_${variantType}`].title = e.target.value;
                        setAbTestingData(updatedData);
                    }}
                />
                <InputField
                    label="Description"
                    type="text"
                    value={variant.description}
                    onChange={(e) => {
                        const updatedData = [...abTestingData];
                        updatedData[groupIndex].comparisons[compIndex][`variant_${variantType}`].description = e.target.value;
                        setAbTestingData(updatedData);
                    }}
                />
                <InputField
                    label="Image"
                    type="file"
                    name={`ab_image_${groupName}_${comparisonId}_${variantType}`}
                    onChange={handleImageChange}
                />

                {/* Image Preview */}
                {variant.image && (
                    <div className="mt-2">
                        {typeof variant.image === 'string' ? (
                            // Display saved image from server
                            <img
                                src={`/storage/image/ab_testing/${variant.image}`}
                                alt={`Variant ${variantLabel}`}
                                className="img-fluid"
                                style={{ maxHeight: '150px' }}
                                onError={(e) => {
                                    console.log(`Error loading image: ${variant.image}`);
                                    e.target.src = '/assets/images/placeholder-image.jpg';
                                }}
                            />
                        ) : variant.image instanceof File ? (
                            // Display local file preview
                            <img
                                src={URL.createObjectURL(variant.image)}
                                alt={`Variant ${variantLabel} Preview`}
                                className="img-fluid"
                                style={{ maxHeight: '150px' }}
                            />
                        ) : (
                            // Handle other cases
                            <div className="text-muted">No image available</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
