import React from "react";
import InputField from "./InputField";
import ButtonCRUD from "./ButtonCRUD";
import ABTestingComparison from "./ABTestingComparison";

export default function ABTestingGroups({ abTestingData, setAbTestingData }) {
    return (
        <>
            {abTestingData.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-4">
                    <div className="row">
                        <div className="col-md-12">
                            <InputField
                                label={`Group ${groupIndex + 1} Name`}
                                type="text"
                                value={group.name}
                                onChange={(e) => {
                                    const updatedData = [...abTestingData];
                                    updatedData[groupIndex].name = e.target.value;
                                    setAbTestingData(updatedData);
                                }}
                            />
                            <InputField
                                label="Group Description"
                                type="text"
                                value={group.description}
                                onChange={(e) => {
                                    const updatedData = [...abTestingData];
                                    updatedData[groupIndex].description = e.target.value;
                                    setAbTestingData(updatedData);
                                }}
                            />
                        </div>
                    </div>

                    {/* Comparisons within this group */}
                    {group.comparisons.map((comparison, compIndex) => (
                        <ABTestingComparison
                            key={compIndex}
                            comparison={comparison}
                            compIndex={compIndex}
                            groupIndex={groupIndex}
                            groupName={group.name}
                            abTestingData={abTestingData}
                            setAbTestingData={setAbTestingData}
                        />
                    ))}

                    <div className="mb-3">
                        <ButtonCRUD
                            type="button"
                            label="Add Comparison"
                            color="btn-outline-primary"
                            iconClass="fa fa-plus"
                            onClick={() => {
                                const updatedData = [...abTestingData];
                                updatedData[groupIndex].comparisons.push({
                                    id: `comp_${Date.now()}`,
                                    title: "Which design do you prefer?",
                                    variant_a: {
                                        title: "Design A",
                                        image: null,
                                        description: ""
                                    },
                                    variant_b: {
                                        title: "Design B",
                                        image: null,
                                        description: ""
                                    }
                                });
                                setAbTestingData(updatedData);
                            }}
                        />
                    </div>

                    <div className="text-end">
                        <ButtonCRUD
                            type="delete"
                            color="btn-outline-danger"
                            iconClass="fas fa-trash"
                            onClick={() => {
                                const updatedData = [...abTestingData];
                                updatedData.splice(groupIndex, 1);
                                setAbTestingData(updatedData);
                            }}
                        />
                    </div>
                    <hr />
                </div>
            ))}

            <div className="mb-3">
                <ButtonCRUD
                    type="button"
                    label="Add Comparison Group"
                    color="btn-primary"
                    iconClass="fa fa-plus"
                    onClick={() => {
                        setAbTestingData([...abTestingData, {
                            name: `Group ${abTestingData.length + 1}`,
                            description: "",
                            comparisons: [{
                                id: `comp_${Date.now()}`,
                                title: "Which design do you prefer?",
                                variant_a: {
                                    title: "Design A",
                                    image: null,
                                    description: ""
                                },
                                variant_b: {
                                    title: "Design B",
                                    image: null,
                                    description: ""
                                }
                            }]
                        }]);
                    }}
                />
            </div>
        </>
    );
}
