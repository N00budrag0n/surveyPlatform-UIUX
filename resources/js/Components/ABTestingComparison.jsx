import React from "react";
import InputField from "./InputField";
import ButtonCRUD from "./ButtonCRUD";
import ABTestingVariant from "./ABTestingVariant";

export default function ABTestingComparison({
    comparison,
    compIndex,
    groupIndex,
    groupName,
    abTestingData,
    setAbTestingData
}) {
    return (
        <div className="mb-3 border p-3 rounded">
            <h6>Comparison {compIndex + 1}</h6>
            <InputField
                label="Question"
                type="text"
                value={comparison.title}
                onChange={(e) => {
                    const updatedData = [...abTestingData];
                    updatedData[groupIndex].comparisons[compIndex].title = e.target.value;
                    setAbTestingData(updatedData);
                }}
            />

            <div className="row">
                {/* Variant A */}
                <div className="col-md-6">
                    <ABTestingVariant
                        variant={comparison.variant_a}
                        variantType="a"
                        groupIndex={groupIndex}
                        compIndex={compIndex}
                        groupName={groupName}
                        comparisonId={comparison.id}
                        abTestingData={abTestingData}
                        setAbTestingData={setAbTestingData}
                    />
                </div>

                {/* Variant B */}
                <div className="col-md-6">
                    <ABTestingVariant
                        variant={comparison.variant_b}
                        variantType="b"
                        groupIndex={groupIndex}
                        compIndex={compIndex}
                        groupName={groupName}
                        comparisonId={comparison.id}
                        abTestingData={abTestingData}
                        setAbTestingData={setAbTestingData}
                    />
                </div>
            </div>

            <div className="text-end mt-2">
                <ButtonCRUD
                    type="delete"
                    color="btn-outline-danger"
                    iconClass="fas fa-trash"
                    onClick={() => {
                        const updatedData = [...abTestingData];
                        updatedData[groupIndex].comparisons.splice(compIndex, 1);
                        setAbTestingData(updatedData);
                    }}
                />
            </div>
        </div>
    );
}
