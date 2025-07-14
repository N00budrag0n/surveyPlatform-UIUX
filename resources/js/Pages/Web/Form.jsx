import React, { useState, useEffect } from "react";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import Layout from "../../Layouts/Header";
import SurveyDescription from "../../Components/SurveyDescription";
import LikertScale from "../../Components/LikertScale";
import EmbedDesign from "../../Components/EmbedDesign";
import AccordionLayout from "../../Layouts/Accordion";
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
        setAbTestingResponses((prev) => {
            const updated = { ...prev };

            if (!updated[groupName]) {
                updated[groupName] = {
                    name: groupName,
                    responses: [],
                };
            }

            // Find if this comparison already has a response
            const existingResponseIndex = updated[
                groupName
            ].responses.findIndex((r) => r.id === comparisonId);

            if (existingResponseIndex >= 0) {
                updated[groupName].responses[existingResponseIndex].selected =
                    variant;
            } else {
                updated[groupName].responses.push({
                    id: comparisonId,
                    selected: variant,
                    reason: "",
                });
            }

            return updated;
        });
    };

    const handleAbTestingReason = (groupName, comparisonId, reason) => {
        setAbTestingResponses((prev) => {
            const updated = { ...prev };

            if (!updated[groupName]) {
                return prev; // Can't add reason without selecting a variant first
            }

            const existingResponseIndex = updated[
                groupName
            ].responses.findIndex((r) => r.id === comparisonId);

            if (existingResponseIndex >= 0) {
                updated[groupName].responses[existingResponseIndex].reason =
                    reason;
                return updated;
            }

            return prev;
        });
    };

    const getAbTestingSelection = (groupName, comparisonId) => {
        if (!abTestingResponses[groupName]) return null;

        const response = abTestingResponses[groupName].responses.find(
            (r) => r.id === comparisonId
        );
        return response ? response.selected : null;
    };

    const getAbTestingReason = (groupName, comparisonId) => {
        if (!abTestingResponses[groupName]) return "";

        const response = abTestingResponses[groupName].responses.find(
            (r) => r.id === comparisonId
        );
        return response ? response.reason || "" : "";
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
            abTestingResponses,
        };

        // Add user id to survey data in local storage
        localStorage.setItem(
            `surveyData_${surveys.id}_${auth.id}`,
            JSON.stringify(surveyData)
        );

        setTimeout(() => {
            localStorage.removeItem(`surveyData_${surveys.id}_${auth.id}`);
        }, oneWeekInMillis);
    }, [formData, susValues, tamValues, abTestingResponses]);

    const loadSurveyData = () => {
        const storedData = localStorage.getItem(`surveyData_${surveys.id}_${auth.id}`);
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

    // remove local storage data when submitted
    const removeSurveyData = () => {
        localStorage.removeItem(`surveyData_${surveys.id}_${auth.id}`);
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

        Inertia.post("/form", dataSubmit, {
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
            onError: (errors) => {
                Swal.fire({
                    title: "Error!",
                    text: errors || "Data failed to save!",
                    icon: "error",
                    showConfirmButton: false,
                    timer: 1500,
                });
            },
            onFinish: () => {
                setIsSaving(false);
            },
        });
    };

    return (
        <>
            <Head>
                <title>{surveys.title + " - UIX-Probe"}</title>
            </Head>
            <Layout footerVisible={false}>
                <div className="container" style={{ marginTop: "80px" }}>
                    <div className="fade-in">
                        <div className="row justify-content-center">
                            <div className="col-md-10 col-lg-8">
                                <nav aria-label="breadcrumb" className="mb-3">
                                    <ol className="breadcrumb">
                                        <li className="breadcrumb-item">
                                            <Link
                                                href="/surveys"
                                                className="text-decoration-none"
                                                style={{
                                                    color: "var(--nav-color)",
                                                }}
                                            >
                                                Surveys
                                            </Link>
                                        </li>
                                        <li
                                            className="breadcrumb-item active"
                                            aria-current="page"
                                        >
                                            {surveys.title.length > 30
                                                ? surveys.title.substring(
                                                      0,
                                                      30
                                                  ) + "..."
                                                : surveys.title}
                                        </li>
                                    </ol>
                                </nav>

                                <div className="card border-0 rounded-4 shadow-sm mb-4">
                                    <div className="card-body p-4 p-md-5">
                                        <div className="text-center mb-4">
                                            <h2 className="fw-bold mb-3">
                                                {surveys.title}
                                            </h2>
                                            <div className="mx-auto">
                                                <img
                                                    src={surveys.image}
                                                    alt="Survey Image"
                                                    className="img-fluid rounded-4 mb-4"
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "350px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-4 mb-4">
                                            <h5 className="fw-bold mb-3">
                                                <i
                                                    className="fas fa-info-circle me-2"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                ></i>
                                                Survey Description
                                            </h5>
                                            <SurveyDescription
                                                description={
                                                    surveys.description
                                                }
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <h5 className="fw-bold mb-3">
                                                <i
                                                    className="fas fa-laptop-code me-2"
                                                    style={{
                                                        color: "var(--nav-color)",
                                                    }}
                                                ></i>
                                                UI/UX Design Preview
                                            </h5>
                                            <div className="d-flex justify-content-center align-items-center bg-light p-3 rounded-4">
                                                <div
                                                    style={{
                                                        textAlign: "center",
                                                        width: "100%",
                                                    }}
                                                >
                                                    <EmbedDesign
                                                        surveys={surveys}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <form onSubmit={submitForm}>
                                            {/* Keep the existing survey methods code */}
                                            {surveyMethodIds.map(
                                                (methodId, index) => {
                                                    if (methodId == 1) {
                                                        return (
                                                            <AccordionLayout title="System Usability Scale (SUS)">
                                                                <div
                                                                    className="card border-0 rounded-4 shadow-sm mb-4"
                                                                    key={index}
                                                                >
                                                                    <div className="card-body p-4">
                                                                        <div className="mb-3">
                                                                            {parsedSusQuestions.map(
                                                                                (
                                                                                    susQuestion,
                                                                                    index
                                                                                ) => (
                                                                                    <div
                                                                                        className="mb-4 p-3 rounded-3"
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                    >
                                                                                        <h6 className="fw-semibold">
                                                                                            {index +
                                                                                                1}

                                                                                            .{" "}
                                                                                            {
                                                                                                susQuestion.question
                                                                                            }
                                                                                        </h6>
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
                                                                </div>
                                                            </AccordionLayout>
                                                        );
                                                    } else if (methodId == 2) {
                                                        return (
                                                            <AccordionLayout title="Technology Acceptance Model (TAM)">
                                                                <div
                                                                    className="card border-0 rounded-4 shadow-sm mb-4"
                                                                    key={index}
                                                                >
                                                                    <div className="card-body p-4">
                                                                        {parsedTamQuestions.map(
                                                                            (
                                                                                tamQuestion,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    className="mb-4 p-3 rounded-3"
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                >
                                                                                    <h6 className="fw-semibold">
                                                                                        {index +
                                                                                            1}

                                                                                        .{" "}
                                                                                        {
                                                                                            tamQuestion.question
                                                                                        }
                                                                                    </h6>
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
                                                                                            ) ||
                                                                                            ""
                                                                                        }
                                                                                        onValueChange={
                                                                                            handleTAMChange
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </AccordionLayout>
                                                        );
                                                    } else if (methodId == 3) {
                                                        return (
                                                            <AccordionLayout title="AB Testing">
                                                                <div
                                                                    className="card border-0 rounded-4 shadow-sm mb-4"
                                                                    key={index}
                                                                >
                                                                    <div className="card-body p-4">
                                                                        {parsedAbTestingGroups.map(
                                                                            (
                                                                                group,
                                                                                groupIndex
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        groupIndex
                                                                                    }
                                                                                    className="card mb-4 border-0 shadow-sm"
                                                                                >
                                                                                    <div className="card-header py-3">
                                                                                        <h6 className="fw-bold mb-1">
                                                                                            {
                                                                                                group.name
                                                                                            }
                                                                                        </h6>
                                                                                        {group.description && (
                                                                                            <p className="text-muted mb-0 small">
                                                                                                {
                                                                                                    group.description
                                                                                                }
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="card-body">
                                                                                        {group.comparisons.map(
                                                                                            (
                                                                                                comparison,
                                                                                                compIndex
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        comparison.id
                                                                                                    }
                                                                                                    className="mb-4 pb-4 border-bottom"
                                                                                                >
                                                                                                    <h6 className="mb-3 fw-semibold">
                                                                                                        {
                                                                                                            (compIndex+1) + ". " +
                                                                                                            comparison.title
                                                                                                        }
                                                                                                    </h6>

                                                                                                    <div className="row g-4">
                                                                                                        <div className="col-md-6">
                                                                                                            <div
                                                                                                                className={`card h-100 mb-3 ${
                                                                                                                    getAbTestingSelection(
                                                                                                                        group.name,
                                                                                                                        comparison.id
                                                                                                                    ) ===
                                                                                                                    "a"
                                                                                                                        ? "border-primary"
                                                                                                                        : "border"
                                                                                                                }`}
                                                                                                                onClick={() =>
                                                                                                                    handleAbTestingSelection(
                                                                                                                        group.name,
                                                                                                                        comparison.id,
                                                                                                                        "a"
                                                                                                                    )
                                                                                                                }
                                                                                                                style={{
                                                                                                                    cursor: "pointer",
                                                                                                                }}
                                                                                                            >
                                                                                                                <div className="position-relative">
                                                                                                                    <img
                                                                                                                        className="card-img-top"
                                                                                                                        src={`/storage/image/ab_testing/${comparison.variant_a.image}`}
                                                                                                                        alt={
                                                                                                                            comparison
                                                                                                                                .variant_a
                                                                                                                                .title
                                                                                                                        }
                                                                                                                        style={{
                                                                                                                            maxHeight:
                                                                                                                                "200px",
                                                                                                                            objectFit:
                                                                                                                                "contain",
                                                                                                                        }}
                                                                                                                    />
                                                                                                                    {getAbTestingSelection(
                                                                                                                        group.name,
                                                                                                                        comparison.id
                                                                                                                    ) ===
                                                                                                                        "a" && (
                                                                                                                        <div className="position-absolute top-0 end-0 m-2">
                                                                                                                            <span className="badge bg-primary rounded-pill">
                                                                                                                                <i className="fas fa-check"></i>{" "}
                                                                                                                                Selected
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                                <div className="card-body">
                                                                                                                    <h5 className="card-title">
                                                                                                                        {
                                                                                                                            comparison
                                                                                                                                .variant_a
                                                                                                                                .title
                                                                                                                        }
                                                                                                                    </h5>
                                                                                                                    <p className="card-text small">
                                                                                                                        {
                                                                                                                            comparison
                                                                                                                                .variant_a
                                                                                                                                .description
                                                                                                                        }
                                                                                                                    </p>

                                                                                                                    <div className="form-check">
                                                                                                                        <input
                                                                                                                            className="form-check-input"
                                                                                                                            type="radio"
                                                                                                                            name={`ab_testing_${group.name}_${comparison.id}`}
                                                                                                                            id={`ab_testing_${group.name}_${comparison.id}_a`}
                                                                                                                            checked={
                                                                                                                                getAbTestingSelection(
                                                                                                                                    group.name,
                                                                                                                                    comparison.id
                                                                                                                                ) ===
                                                                                                                                "a"
                                                                                                                            }
                                                                                                                            onChange={() =>
                                                                                                                                handleAbTestingSelection(
                                                                                                                                    group.name,
                                                                                                                                    comparison.id,
                                                                                                                                    "a"
                                                                                                                                )
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <label
                                                                                                                            className="form-check-label"
                                                                                                                            htmlFor={`ab_testing_${group.name}_${comparison.id}_a`}
                                                                                                                        >
                                                                                                                            Select
                                                                                                                            Design
                                                                                                                            A
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>

                                                                                                        <div className="col-md-6">
                                                                                                            <div
                                                                                                                className={`card h-100 mb-3 ${
                                                                                                                    getAbTestingSelection(
                                                                                                                        group.name,
                                                                                                                        comparison.id
                                                                                                                    ) ===
                                                                                                                    "b"
                                                                                                                        ? "border-primary"
                                                                                                                        : "border"
                                                                                                                }`}
                                                                                                                onClick={() =>
                                                                                                                    handleAbTestingSelection(
                                                                                                                        group.name,
                                                                                                                        comparison.id,
                                                                                                                        "b"
                                                                                                                    )
                                                                                                                }
                                                                                                                style={{
                                                                                                                    cursor: "pointer",
                                                                                                                }}
                                                                                                            >
                                                                                                                <div className="position-relative">
                                                                                                                    <img
                                                                                                                        className="card-img-top"
                                                                                                                        src={`/storage/image/ab_testing/${comparison.variant_b.image}`}
                                                                                                                        alt={
                                                                                                                            comparison
                                                                                                                                .variant_b
                                                                                                                                .title
                                                                                                                        }
                                                                                                                        style={{
                                                                                                                            maxHeight:
                                                                                                                                "200px",
                                                                                                                            objectFit:
                                                                                                                                "contain",
                                                                                                                        }}
                                                                                                                    />
                                                                                                                    {getAbTestingSelection(
                                                                                                                        group.name,
                                                                                                                        comparison.id
                                                                                                                    ) ===
                                                                                                                        "b" && (
                                                                                                                        <div className="position-absolute top-0 end-0 m-2">
                                                                                                                            <span className="badge bg-primary rounded-pill">
                                                                                                                                <i className="fas fa-check"></i>{" "}
                                                                                                                                Selected
                                                                                                                            </span>
                                                                                                                        </div>
                                                                                                                    )}
                                                                                                                </div>
                                                                                                                <div className="card-body">
                                                                                                                    <h5 className="card-title">
                                                                                                                        {
                                                                                                                            comparison
                                                                                                                                .variant_b
                                                                                                                                .title
                                                                                                                        }
                                                                                                                    </h5>
                                                                                                                    <p className="card-text small">
                                                                                                                        {
                                                                                                                            comparison
                                                                                                                                .variant_b
                                                                                                                                .description
                                                                                                                        }
                                                                                                                    </p>

                                                                                                                    <div className="form-check">
                                                                                                                        <input
                                                                                                                            className="form-check-input"
                                                                                                                            type="radio"
                                                                                                                            name={`ab_testing_${group.name}_${comparison.id}`}
                                                                                                                            id={`ab_testing_${group.name}_${comparison.id}_b`}
                                                                                                                            checked={
                                                                                                                                getAbTestingSelection(
                                                                                                                                    group.name,
                                                                                                                                    comparison.id
                                                                                                                                ) ===
                                                                                                                                "b"
                                                                                                                            }
                                                                                                                            onChange={() =>
                                                                                                                                handleAbTestingSelection(
                                                                                                                                    group.name,
                                                                                                                                    comparison.id,
                                                                                                                                    "b"
                                                                                                                                )
                                                                                                                            }
                                                                                                                        />
                                                                                                                        <label
                                                                                                                            className="form-check-label"
                                                                                                                            htmlFor={`ab_testing_${group.name}_${comparison.id}_b`}
                                                                                                                        >
                                                                                                                            Select
                                                                                                                            Design
                                                                                                                            B
                                                                                                                        </label>
                                                                                                                    </div>
                                                                                                                </div>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>

                                                                                                    {getAbTestingSelection(
                                                                                                        group.name,
                                                                                                        comparison.id
                                                                                                    ) && (
                                                                                                        <div className="form-group mt-3">
                                                                                                            <label
                                                                                                                htmlFor={`ab_testing_reason_${group.name}_${comparison.id}`}
                                                                                                                className="form-label fw-semibold"
                                                                                                            >
                                                                                                                Why
                                                                                                                did
                                                                                                                you
                                                                                                                choose
                                                                                                                this
                                                                                                                design?
                                                                                                                (Optional)
                                                                                                            </label>
                                                                                                            <textarea
                                                                                                                className="form-control"
                                                                                                                id={`ab_testing_reason_${group.name}_${comparison.id}`}
                                                                                                                rows="2"
                                                                                                                value={getAbTestingReason(
                                                                                                                    group.name,
                                                                                                                    comparison.id
                                                                                                                )}
                                                                                                                onChange={(
                                                                                                                    e
                                                                                                                ) =>
                                                                                                                    handleAbTestingReason(
                                                                                                                        group.name,
                                                                                                                        comparison.id,
                                                                                                                        e
                                                                                                                            .target
                                                                                                                            .value
                                                                                                                    )
                                                                                                                }
                                                                                                                placeholder="Please explain your choice..."
                                                                                                            ></textarea>
                                                                                                        </div>
                                                                                                    )}
                                                                                                </div>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </AccordionLayout>
                                                        );
                                                    } else if (methodId == 4) {
                                                        return (
                                                            ""
                                                        );
                                                    } else {
                                                        return (
                                                            <div key={index}>
                                                                Error Method
                                                            </div>
                                                        );
                                                    }
                                                }
                                            )}

                                            <div className="d-grid gap-2 mt-5">
                                                <button
                                                    type="submit"
                                                    className="btn py-3"
                                                    disabled={isSaving}
                                                    style={{
                                                        background:
                                                            "var(--nav-color)",
                                                        color: "#ffffff",
                                                        fontWeight: "600",
                                                        borderRadius: "8px",
                                                    }}
                                                >
                                                    {isSaving ? (
                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                                role="status"
                                                                aria-hidden="true"
                                                            ></span>
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Submit Survey
                                                            Response
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}
export default Form;
