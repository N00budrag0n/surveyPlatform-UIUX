import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Layout from "../../Layouts/Header";
import SurveyDescription from "../../Components/SurveyDescription";
import LikertScale from "../../Components/LikertScale";
import EmbedDesign from "../../Components/EmbedDesign";
import Swal from "sweetalert2";

function Form() {
    const { surveys, auth, surveyMethods, surveyMethodIds, surveyQuestions } =
        usePage().props;

    const initialFormData = {
        user_id: auth.id,
        first_name: auth.first_name,
        surname: auth.surname,
        email: auth.email,
        birth_date: auth.birth_date,
        gender: auth.gender,
        profession: auth.profession,
        educational_background: auth.educational_background,
    };

    const [isSaving, setIsSaving] = useState(false);

    let idTamCounter = 0;
    let idSusCounter = 0;

    const questionData = JSON.parse(surveyQuestions[0].questions_data);

    if (surveys.user_id == auth.id) {
        Swal.fire({
            title: "Warning!",
            text: "You are not allowed to fill out your own survey. Please choose another survey to participate in.",
            icon: "warning",
            showConfirmButton: true,
            confirmButtonText: "Got it!",
        });
    }

    const parsedSusQuestions = questionData.sus
        ? Object.entries(questionData.sus).map(([key, value]) => ({
              id: `${idSusCounter++}`,
              question: value,
          }))
        : [];

    const parsedTamQuestions = questionData.tam
        ? questionData.tam.flatMap((variable) =>
              variable.indicators.flatMap((indicator) =>
                  indicator.questions.map((question) => ({
                      id: `${idTamCounter++}`,
                      variable: variable.name,
                      indicator: indicator.name,
                      question: question,
                  }))
              )
          )
        : [];

    const [formData, setFormData] = useState(initialFormData);
    const [susValues, setSusValues] = useState(
        parsedSusQuestions.length
            ? Object.fromEntries(
                  parsedSusQuestions.map((question, index) => [
                      `sus${index + 1}`,
                      "",
                  ])
              )
            : {}
    );
    const [tamValues, setTamValues] = useState(() => {
        const transformedData = [];

        parsedTamQuestions.forEach((question) => {
            const existingVariable = transformedData.find(
                (variable) => variable.name === question.variable
            );
            if (existingVariable) {
                const existingIndicator = existingVariable.responses.find(
                    (response) => response.name === question.indicator
                );
                if (!existingIndicator) {
                    existingVariable.responses.push({
                        name: question.indicator,
                        value: [],
                    });
                }
            } else {
                transformedData.push({
                    name: question.variable,
                    responses: [
                        {
                            name: question.indicator,
                            value: [],
                        },
                    ],
                });
            }
        });

        return transformedData;
    });

    // AB test
    const [abTestingResponses, setAbTestingResponses] = useState({});
    const parsedAbTestingGroups = questionData.ab_testing || [];

    // AB handler
    const handleAbTestingSelection = (groupName, comparisonId, variant) => {
        setAbTestingResponses(prev => {
            const updated = { ...prev };

            if (!updated[groupName]) {
                updated[groupName] = {
                    name: groupName,
                    responses: []
                };
            }

            // Find if this comparison already has a response
            const existingResponseIndex = updated[groupName].responses.findIndex(
                r => r.id === comparisonId
            );

            if (existingResponseIndex >= 0) {
                updated[groupName].responses[existingResponseIndex].selected = variant;
            } else {
                updated[groupName].responses.push({
                    id: comparisonId,
                    selected: variant,
                    reason: ''
                });
            }

            return updated;
        });
    };

    const handleAbTestingReason = (groupName, comparisonId, reason) => {
        setAbTestingResponses(prev => {
            const updated = { ...prev };

            if (!updated[groupName]) {
                return prev; // Can't add reason without selecting a variant first
            }

            const existingResponseIndex = updated[groupName].responses.findIndex(
                r => r.id === comparisonId
            );

            if (existingResponseIndex >= 0) {
                updated[groupName].responses[existingResponseIndex].reason = reason;
                return updated;
            }

            return prev;
        });
    };

    const getAbTestingSelection = (groupName, comparisonId) => {
        if (!abTestingResponses[groupName]) return null;

        const response = abTestingResponses[groupName].responses.find(r => r.id === comparisonId);
        return response ? response.selected : null;
    };

    const getAbTestingReason = (groupName, comparisonId) => {
        if (!abTestingResponses[groupName]) return '';

        const response = abTestingResponses[groupName].responses.find(r => r.id === comparisonId);
        return response ? response.reason || '' : '';
    };



    useEffect(() => {
        loadSurveyData();
    }, [surveys.id]);

    useEffect(() => {
        const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
        const surveyData = {
            title: surveys.title,
            formData,
            susValues,
            tamValues,
            abTestingResponses
        };

        localStorage.setItem(
            `surveyData_${surveys.id}`,
            JSON.stringify(surveyData)
        );

        setTimeout(() => {
            localStorage.removeItem(`surveyData_${surveys.id}`);
        }, oneWeekInMillis);
    }, [formData, susValues, tamValues, abTestingResponses]);

    const loadSurveyData = () => {
        const storedData = localStorage.getItem(`surveyData_${surveys.id}`);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setFormData(parsedData.formData);
            setSusValues(parsedData.susValues);
            setTamValues(parsedData.tamValues);
            if (parsedData.abTestingResponses) {
                setAbTestingResponses(parsedData.abTestingResponses);
            }
        }
    };

    function handleSUSChange(dataAnswer, selectedValue) {
        setSusValues((prevState) => ({
            ...prevState,
            [dataAnswer]: selectedValue,
        }));
    }

    const tamSelectedValue = (tamQuestion, index) =>
        tamValues
            .find((variable) => variable.name === tamQuestion.variable)
            ?.responses.find(
                (indicator) => indicator.name === tamQuestion.indicator
            )
            ?.value.find((item) => item[0] === `tam${index + 1}`)?.[1];

    const handleTAMChange = (dataAnswer, selectedValue) => {
        setTamValues((prevState) => {
            const newState = [...prevState];
            const parts = dataAnswer.split("-");
            const questionId = parts[0];
            const questionVariable = parts[1];
            const questionIndicator = parts[2].replace(/_/g, " ");

            const variableIndex = newState.findIndex(
                (variable) => variable.name === questionVariable
            );
            if (variableIndex !== -1) {
                const responseIndex = newState[
                    variableIndex
                ].responses.findIndex(
                    (indicator) => indicator.name === questionIndicator
                );
                if (responseIndex !== -1) {
                    const response =
                        newState[variableIndex].responses[responseIndex];
                    const existingQuestionIndex = response.value.findIndex(
                        (item) => item[0] === questionId
                    );
                    if (existingQuestionIndex !== -1) {
                        // Jika pertanyaan sudah ada, perbarui nilainya
                        response.value[existingQuestionIndex][1] =
                            selectedValue;
                        // Urutkan berdasarkan ID TAM terkecil
                        response.value.sort((a, b) => a[0] - b[0]);
                    } else {
                        // Jika pertanyaan belum ada, tambahkan baru
                        response.value.push([questionId, selectedValue]);
                        // Urutkan berdasarkan ID TAM terkecil
                        response.value.sort((a, b) => a[0] - b[0]);
                    }
                } else {
                    // Jika indikator belum ada, tambahkan baru
                    newState[variableIndex].responses.push({
                        name: questionIndicator,
                        value: [[questionId, selectedValue]],
                    });
                }
            }
            return newState;
        });
    };

    const responseData = {};

    if (parsedSusQuestions.length > 0) {
        responseData.sus = susValues;
    }
    if (parsedTamQuestions.length > 0) {
        responseData.tam = tamValues;
    }
    if (parsedAbTestingGroups.length > 0) {
        responseData.ab_testing = Object.values(abTestingResponses);
    }

    const submitForm = (e) => {
        setIsSaving(true);
        e.preventDefault();

        const responseData = {};

        if (surveyMethodIds.includes(1)) {
            responseData.sus = susValues;
        }
        if (surveyMethodIds.includes(2)) {
            responseData.tam = tamValues;
        }
        if (surveyMethodIds.includes(3)) {
            responseData.ab_testing = Object.values(abTestingResponses);
        }

        const dataSubmit = {
            ...formData,
            survey_id: surveys.id,
            response_data: JSON.stringify(responseData),
        };

        Inertia.post(
            "/form",
            dataSubmit,
            {
                onSuccess: () => {
                    Swal.fire({
                        title: "Thank You!",
                        text: "Survey data submitted successfully!",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 3000,
                    }).then(() => {
                        removeSurveyData();
                        Inertia.visit("/");
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
                <title>Form Survey</title>
            </Head>
            <Layout footerVisible={false}>
                <div className="container" style={{ marginTop: "80px" }}>
                    <div className="fade-in">
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <div className="Introduction text-center">
                                    <h3 className="text-2xl font-bold mb-4 mt-4">
                                        Pengenalan dan Konteks <br />"
                                        <strong>{surveys.title}</strong>"
                                    </h3>
                                    <div className="mx-auto">
                                        <img
                                            src={surveys.image}
                                            alt="Gambar Survei"
                                            className="img-fluid rounded mb-4 mx-auto d-block"
                                            style={{
                                                maxWidth: "100%",
                                                maxHeight: "350px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>
                                </div>

                                <SurveyDescription
                                    description={surveys.description}
                                />

                                <hr />

                                <div className="Explore-UI-UX">
                                    <h3 className="text-center text-2xl font-bold mb-4">
                                        Desain UI/UX
                                    </h3>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div
                                            style={{
                                                textAlign: "center",
                                                width: "100%",
                                            }}
                                        >
                                            <EmbedDesign surveys={surveys} />
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={submitForm}>
                                    {surveyMethodIds.map((methodId, index) => {
                                        if (methodId == 1) {
                                            return (
                                                <div
                                                    className="Questionnaire-SUS"
                                                    key={index}
                                                >
                                                    <hr />
                                                    <h3 className="text-center text-2xl font-bold mb-4">
                                                        Questionnaire SUS
                                                    </h3>
                                                    <div className="mb-3">
                                                        {parsedSusQuestions.map(
                                                            (
                                                                susQuestion,
                                                                index
                                                            ) => (
                                                                <div
                                                                    className="mb-3"
                                                                    key={index}
                                                                >
                                                                    <h5>
                                                                        {index +
                                                                            1}
                                                                        .{" "}
                                                                        {
                                                                            susQuestion.question
                                                                        }
                                                                    </h5>
                                                                    <LikertScale
                                                                        name={`sus${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        selectedValue={
                                                                            susValues[
                                                                                `sus${
                                                                                    index +
                                                                                    1
                                                                                }`
                                                                            ]
                                                                        }
                                                                        onValueChange={
                                                                            handleSUSChange
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        } else if (methodId == 2) {
                                            return (
                                                <div
                                                    className="Questionnaire-TAM"
                                                    key={index}
                                                >
                                                    <hr />
                                                    <h3 className="text-center text-2xl font-bold mb-4">
                                                        Questionnaire TAM
                                                    </h3>
                                                    {parsedTamQuestions.map(
                                                        (
                                                            tamQuestion,
                                                            index
                                                        ) => (
                                                            <div
                                                                className="mb-3"
                                                                key={index}
                                                            >
                                                                <h5>
                                                                    {index + 1}.{" "}
                                                                    {
                                                                        tamQuestion.question
                                                                    }
                                                                </h5>
                                                                <LikertScale
                                                                    name={`tam${
                                                                        index +
                                                                        1
                                                                    }-${
                                                                        tamQuestion.variable
                                                                    }-${tamQuestion.indicator.replace(
                                                                        /\s+/g,
                                                                        "_"
                                                                    )}`}
                                                                    selectedValue={
                                                                        tamSelectedValue(
                                                                            tamQuestion,
                                                                            index
                                                                        ) || ""
                                                                    }
                                                                    onValueChange={
                                                                        handleTAMChange
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            );
                                        } else if (methodId == 3) {
                                            return (
                                                <div className="Questionnaire-ABTesting" key={index}>
                                                    <hr />
                                                    <h3 className="text-center text-2xl font-bold mb-4">
                                                        Design Comparison
                                                    </h3>

                                                    {parsedAbTestingGroups.map((group, groupIndex) => (
                                                        <div key={groupIndex} className="card mb-4">
                                                            <div className="card-header">
                                                                <h5>{group.name}</h5>
                                                                {group.description && <p className="text-muted mb-0">{group.description}</p>}
                                                            </div>
                                                            <div className="card-body">
                                                                {group.comparisons.map((comparison, compIndex) => (
                                                                    <div key={comparison.id} className="mb-4">
                                                                        <h6 className="mb-3">{comparison.title}</h6>

                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <div
                                                                                    className={`card mb-3 ${getAbTestingSelection(group.name, comparison.id) === 'a' ? 'border-primary' : ''}`}
                                                                                    onClick={() => handleAbTestingSelection(group.name, comparison.id, 'a')}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                >
                                                                                    <img
                                                                                        className="card-img-top"
                                                                                        src={`/storage/image/ab_testing/${comparison.variant_a.image}`}
                                                                                        alt={comparison.variant_a.title}
                                                                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                                                                    />
                                                                                    <div className="card-body">
                                                                                        <h5 className="card-title">{comparison.variant_a.title}</h5>
                                                                                        <p className="card-text">{comparison.variant_a.description}</p>

                                                                                        <div className="form-check">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="radio"
                                                                                                name={`ab_testing_${group.name}_${comparison.id}`}
                                                                                                id={`ab_testing_${group.name}_${comparison.id}_a`}
                                                                                                checked={getAbTestingSelection(group.name, comparison.id) === 'a'}
                                                                                                onChange={() => handleAbTestingSelection(group.name, comparison.id, 'a')}
                                                                                            />
                                                                                            <label className="form-check-label" htmlFor={`ab_testing_${group.name}_${comparison.id}_a`}>
                                                                                                Select this design
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-md-6">
                                                                                <div
                                                                                    className={`card mb-3 ${getAbTestingSelection(group.name, comparison.id) === 'b' ? 'border-primary' : ''}`}
                                                                                    onClick={() => handleAbTestingSelection(group.name, comparison.id, 'b')}
                                                                                    style={{ cursor: 'pointer' }}
                                                                                >
                                                                                    <img
                                                                                        className="card-img-top"
                                                                                        src={`/storage/image/ab_testing/${comparison.variant_b.image}`}
                                                                                        alt={comparison.variant_b.title}
                                                                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                                                                    />
                                                                                    <div className="card-body">
                                                                                        <h5 className="card-title">{comparison.variant_b.title}</h5>
                                                                                        <p className="card-text">{comparison.variant_b.description}</p>

                                                                                        <div className="form-check">
                                                                                            <input
                                                                                                className="form-check-input"
                                                                                                type="radio"
                                                                                                name={`ab_testing_${group.name}_${comparison.id}`}
                                                                                                id={`ab_testing_${group.name}_${comparison.id}_b`}
                                                                                                checked={getAbTestingSelection(group.name, comparison.id) === 'b'}
                                                                                                onChange={() => handleAbTestingSelection(group.name, comparison.id, 'b')}
                                                                                            />
                                                                                            <label className="form-check-label" htmlFor={`ab_testing_${group.name}_${comparison.id}_b`}>
                                                                                                Select this design
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        {getAbTestingSelection(group.name, comparison.id) && (
                                                                            <div className="form-group mt-3">
                                                                                <label htmlFor={`ab_testing_reason_${group.name}_${comparison.id}`}>
                                                                                    Why did you choose this design? (Optional)
                                                                                </label>
                                                                                <textarea
                                                                                    className="form-control"
                                                                                    id={`ab_testing_reason_${group.name}_${comparison.id}`}
                                                                                    rows="2"
                                                                                    value={getAbTestingReason(group.name, comparison.id)}
                                                                                    onChange={(e) => handleAbTestingReason(group.name, comparison.id, e.target.value)}
                                                                                    placeholder="Please explain your choice..."
                                                                                ></textarea>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={index}>
                                                    Error Method
                                                </div>
                                            );
                                        }
                                    })}

                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg m-4"
                                            disabled={isSaving}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Form;
