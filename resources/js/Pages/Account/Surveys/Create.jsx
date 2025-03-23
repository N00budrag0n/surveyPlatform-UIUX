import React, { useState, useEffect } from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage } from "@inertiajs/inertia-react";
import { Inertia } from "@inertiajs/inertia";
import InputField from "../../../Components/InputField";
import Editor from "../../../Components/QuillEditor";
import ButtonCRUD from "../../../Components/ButtonCRUD";
import SelectCheckbox from "../../../Components/SelectCheckbox";
import RadioSelect from "../../../Components/RadioSelect";
import AccordionLayout from "../../../Layouts/Accordion";
import ImageView from "../../../Utils/ImageView";
import Swal from "sweetalert2";

export default function SurveysCreate() {
    const { errors, auth, categories, methods, surveyQuestionsExample } =
        usePage().props;

    const [title, setTitle] = useState("");
    const [image, setImage] = useState(null);
    const [theme, setTheme] = useState("");
    const [description, setDescription] = useState("");
    const [url_website, setUrlWebsite] = useState("");
    const [embed_design, setEmbedDesign] = useState("");
    const [embed_prototype, setEmbedPrototype] = useState("");
    const [surveyCategoriesData, setSurveyCategoriesData] = useState([]);
    const [surveyMethodsData, setSurveyMethodsData] = useState([]);
    const [surveyVisibility, setSurveyVisibility] = useState(null);
    const [susQuestionsData, setSusQuestionsData] = useState([]);
    const [tamQuestionsData, setTamQuestionsData] = useState([]);
    const [abTestingData, setAbTestingData] = useState([]);
    const [user_id] = useState(auth.user.id);

    const [isMethodSusFilled, setIsMethodSusFilled] = useState();
    const [isMethodTamFilled, setIsMethodTamFilled] = useState();
    const [isMethodAbTestFilled, setIsMethodAbTestFilled] = useState();

    const tamJson = [];
    const susJson = {};

    const [isSaving, setIsSaving] = useState(false);
    const [isResetQuestions, setIsResetQuestions] = useState(true);

    useEffect(() => {
        if (surveyMethodsData.includes(1) && surveyMethodsData.includes(2) && surveyMethodsData.includes(3)) {
            setIsMethodSusFilled(true);
            setIsMethodTamFilled(true);
            setIsMethodAbTestFilled(true);
        } else if (surveyMethodsData.includes(1) && surveyMethodsData.includes(2)) {
            setIsMethodSusFilled(true);
            setIsMethodTamFilled(true);
            setIsMethodAbTestFilled(false);
        } else if (surveyMethodsData.includes(1) && surveyMethodsData.includes(3)) {
            setIsMethodSusFilled(true);
            setIsMethodTamFilled(false);
            setIsMethodAbTestFilled(true);
        } else if (surveyMethodsData.includes(2) && surveyMethodsData.includes(3)) {
            setIsMethodSusFilled(false);
            setIsMethodTamFilled(true);
            setIsMethodAbTestFilled(true);
        } else if (surveyMethodsData.includes(1)) {
            setIsMethodSusFilled(true);
            setIsMethodTamFilled(false);
            setIsMethodAbTestFilled(false);
        } else if (surveyMethodsData.includes(2)) {
            setIsMethodSusFilled(false);
            setIsMethodTamFilled(true);
            setIsMethodAbTestFilled(false);
        } else if (surveyMethodsData.includes(3)) {
            setIsMethodSusFilled(false);
            setIsMethodTamFilled(false);
            setIsMethodAbTestFilled(true);
        } else {
            setIsMethodSusFilled(false);
            setIsMethodTamFilled(false);
            setIsMethodAbTestFilled(false);
        }
    }, [surveyMethodsData]);

    const replaceTheme = (text) => {
        return text.replace(/Website Rumah Sakit/g, theme);
    };

    useEffect(() => {
        if (isResetQuestions) {
            let idTamCounter = 0;
            let idSusCounter = 0;

            const data = JSON.parse(surveyQuestionsExample[0].questions_data);
            const parsedSusQuestions = Object.entries(data.sus).map(
                ([key, value]) => ({
                    id: `${idSusCounter++}`,
                    question: replaceTheme(value),
                })
            );
            const parsedTamQuestions = data.tam.flatMap((variable) =>
                variable.indicators.flatMap((indicator) =>
                    indicator.questions.map((question) => ({
                        id: `${idTamCounter++}`,
                        variable: variable.name,
                        indicator: indicator.name,
                        question: replaceTheme(question),
                    }))
                )
            );
            setSusQuestionsData(parsedSusQuestions);
            setTamQuestionsData(parsedTamQuestions);
        }
    }, [surveyQuestionsExample, theme]);

    const handleCheckboxCategoriesChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (surveyCategoriesData.includes(value)) {
            setSurveyCategoriesData((prevData) =>
                prevData.filter((item) => item !== value)
            );
        } else {
            setSurveyCategoriesData((prevData) => [...prevData, value]);
        }
    };

    const handleCheckboxMethodsChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (surveyMethodsData.includes(value)) {
            setSurveyMethodsData((prevData) =>
                prevData.filter((item) => item !== value)
            );
        } else {
            setSurveyMethodsData((prevData) => [...prevData, value]);
        }
    };

    function handleVisibleChange(selectedValue) {
        setSurveyVisibility(selectedValue);
    }

    const handleSusQuestionChange = (questionId, value) => {
        setSusQuestionsData(
            susQuestionsData.map((question) => {
                if (question.id === questionId) {
                    question.question = value;
                }
                return question;
            })
        );
        setIsResetQuestions(false);
    };

    const handleTamVariableChange = (questionId, value) => {
        setTamQuestionsData(
            tamQuestionsData.map((question) => {
                if (question.id === questionId) {
                    question.variable = value;
                }
                return question;
            })
        );
        setIsResetQuestions(false);
    };

    const handleTamIndicatorChange = (questionId, value) => {
        setTamQuestionsData(
            tamQuestionsData.map((question) => {
                if (question.id === questionId) {
                    question.indicator = value;
                }
                return question;
            })
        );
        setIsResetQuestions(false);
    };

    const handleTamQuestionChange = (questionId, value) => {
        setTamQuestionsData(
            tamQuestionsData.map((question) => {
                if (question.id === questionId) {
                    question.question = value;
                }
                return question;
            })
        );
        setIsResetQuestions(false);
    };

    susQuestionsData.forEach((item, index) => {
        susJson[`sus${index + 1}`] = item.question;
    });

    tamQuestionsData.forEach((item) => {
        // Check if the variable already exists in tamJson
        let variableIndex = tamJson.findIndex(
            (element) => element.name === item.variable
        );

        // If the variable doesn't exist, create a new entry
        if (variableIndex === -1) {
            let variable = {
                name: item.variable,
                indicators: [
                    {
                        name: item.indicator,
                        questions: [item.question],
                    },
                ],
            };
            tamJson.push(variable);
        } else {
            // If the variable exists, add the question to its corresponding indicator
            let indicatorIndex = tamJson[variableIndex].indicators.findIndex(
                (element) => element.name === item.indicator
            );

            if (indicatorIndex === -1) {
                tamJson[variableIndex].indicators.push({
                    name: item.indicator,
                    questions: [item.question],
                });
            } else {
                tamJson[variableIndex].indicators[
                    indicatorIndex
                ].questions.push(item.question);
            }
        }
    });

    const combineSurveyData = () => {
        let data = {};

        if (isMethodSusFilled) {
            data.sus = susJson;
        }

        if (isMethodTamFilled) {
            data.tam = tamJson;
        }

        if (isMethodAbTestFilled) {
            data.ab_testing = abTestingData;
        }

        return JSON.stringify(data);
    };

    const storeSurvey = async (e) => {
        setIsSaving(true);
        e.preventDefault();

        if (e.nativeEvent.submitter.getAttribute("type") === "Cancel") {
            handleReset();
            setIsSaving("false");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        if (image) formData.append('image', image);
        formData.append('theme', theme);
        formData.append('description', description);
        formData.append('url_website', url_website);
        formData.append('embed_design', embed_design);
        formData.append('embed_prototype', embed_prototype);
        formData.append('survey_categories', JSON.stringify(surveyCategoriesData));
        formData.append('survey_methods', JSON.stringify(surveyMethodsData));
        formData.append('general_access', surveyVisibility);
        formData.append('user_id', user_id);

        const abTestingDataForJson = JSON.parse(JSON.stringify(abTestingData));

        if (abTestingData.length > 0) {
            abTestingData.forEach((group, groupIndex) => {
                if (group.comparisons) {
                    group.comparisons.forEach((comparison, compIndex) => {
                        // Handle variant A image
                        if (comparison.variant_a.image instanceof File) {
                            const fieldName = `ab_image_${group.name.replace(/\s+/g, '_')}_${comparison.id}_a`;
                            formData.append(fieldName, comparison.variant_a.image);

                            // Set a placeholder in the JSON to indicate there's an image
                            abTestingDataForJson[groupIndex].comparisons[compIndex].variant_a.image =
                                `__FILE_PLACEHOLDER_${fieldName}__`;
                        }

                        // Handle variant B image
                        if (comparison.variant_b.image instanceof File) {
                            const fieldName = `ab_image_${group.name.replace(/\s+/g, '_')}_${comparison.id}_b`;
                            formData.append(fieldName, comparison.variant_b.image);

                            // Set a placeholder in the JSON to indicate there's an image
                            abTestingDataForJson[groupIndex].comparisons[compIndex].variant_b.image =
                                `__FILE_PLACEHOLDER_${fieldName}__`;
                        }
                    });
                }
            });
        }

        // Prepare the survey questions data
        let surveyQuestionsData = {};
        if (isMethodSusFilled) {
            surveyQuestionsData.sus = susJson;
        }
        if (isMethodTamFilled) {
            surveyQuestionsData.tam = tamJson;
        }
        if (isMethodAbTestFilled) {
            surveyQuestionsData.ab_testing = abTestingDataForJson;
        }

        formData.append('survey_questions', JSON.stringify(surveyQuestionsData));

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value instanceof File ? 'File: ' + value.name : value}`);
        }

        // Inertia.post(
        //     "/account/surveys",
        //     {
        //         title: title,
        //         image: image,
        //         theme: theme,
        //         description: description,
        //         url_website: url_website,
        //         embed_design: embed_design,
        //         embed_prototype: embed_prototype,
        //         survey_categories: surveyCategoriesData,
        //         survey_methods: surveyMethodsData,
        //         general_access: surveyVisibility,
        //         survey_questions: combineSurveyData(),
        //         user_id: user_id,
        //     },
        //     {
        //         onSuccess: () => {
        //             Swal.fire({
        //                 title: "Success!",
        //                 text: "Data saved successfully!",
        //                 icon: "success",
        //                 showConfirmButton: false,
        //                 timer: 1500,
        //             });
        //         },
        //         onError: () => {
        //             Swal.fire({
        //                 title: "Error!",
        //                 text: "Data failed to save!",
        //                 icon: "error",
        //                 showConfirmButton: false,
        //                 timer: 1500,
        //             });
        //         },
        //         onFinish: () => {
        //             setIsSaving(false);
        //         },
        //     }
        // );
        Inertia.post(
            "/account/surveys",
            formData,
            {
                forceFormData: true,
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

    const handleReset = () => {
        setImage(null);
        setTitle("");
        setTheme("");
        setDescription("");
        setUrlWebsite("");
        setEmbedDesign("");
        setEmbedPrototype("");
        setSurveyCategoriesData([]);
        setSurveyMethodsData([]);
        setSurveyVisibility(null);
    };

    const resetSusQuestions = () => {
        setSusQuestionsData(
            Object.entries(
                JSON.parse(surveyQuestionsExample[0].questions_data).sus
            ).map(([key, value]) => ({
                id: key,
                question: replaceTheme(value),
            }))
        );
    };

    const resetTamQuestions = () => {
        setTamQuestionsData(
            JSON.parse(surveyQuestionsExample[0].questions_data).tam.flatMap(
                (variable) =>
                    variable.indicators.map((indicator) => ({
                        id: `${variable.indicators.indexOf(indicator)}`,
                        variable: variable.name,
                        indicator: indicator.name,
                        question: replaceTheme(indicator.questions[0]),
                    }))
            )
        );
    };

    const removeTamQuestion = (questionId) => {
        const updatedQuestions = tamQuestionsData.filter(
            (question) => question.id !== questionId
        );

        const reindexedQuestions = updatedQuestions.map((question, index) => ({
            ...question,
            id: `${index + 1}`,
        }));

        setTamQuestionsData(reindexedQuestions);
    };

    const addTamQuestion = () => {
        const newQuestion = {
            id: `${tamQuestionsData.length + 1}`,
            variable: "",
            indicator: "",
            question: "",
        };

        setTamQuestionsData([...tamQuestionsData, newQuestion]);
    };

    const deleteAllTamQuestions = () => {
        setTamQuestionsData([]);
    };

    return (
        <>
            <Head>
                <title>Create Survey - Survey Platform</title>
            </Head>
            <LayoutAccount>
                <CardContent title="Create Survey" icon="fas fa-scroll">
                    <form onSubmit={storeSurvey}>
                        <InputField
                            label="Image Thumbnail (max 2MB)"
                            type="file"
                            value={image}
                            onChange={(e) => [setImage(e.target.files[0])]}
                            error={errors.image}
                        />
                        <InputField
                            label="Title Design"
                            mustFill={true}
                            type="text"
                            value={title}
                            placeholder="Enter title, e.g., E-Learning Platform SmartLearn"
                            onChange={(e) => setTitle(e.target.value)}
                            error={errors.title}
                        />
                        <InputField
                            label="Theme Design"
                            mustFill={true}
                            type="text"
                            value={theme}
                            placeholder="Enter theme, e.g., E-Learning Platform"
                            onChange={(e) => setTheme(e.target.value)}
                            error={errors.theme}
                        />
                        <Editor
                            label="Description"
                            mustFill={true}
                            value={description}
                            onChange={setDescription}
                            error={errors.description}
                        />
                        <InputField
                            label="URL Website"
                            type="text"
                            value={url_website}
                            placeholder="https://example.com (Fill at least one: URL, Embed Design, or Embed Prototype)"
                            onChange={(e) => setUrlWebsite(e.target.value)}
                            error={errors.url_website}
                        />
                        <InputField
                            label="Embed Design (Figma)"
                            type="text"
                            value={embed_design}
                            placeholder="https://figma.com/embed-design (Fill at least one: URL, Embed Design, or Embed Prototype)"
                            onChange={(e) => setEmbedDesign(e.target.value)}
                            error={errors.embed_design}
                        />
                        <InputField
                            label="Embed Prototype (Figma)"
                            type="text"
                            value={embed_prototype}
                            placeholder="https://figma.com/embed-prototype (Fill at least one: URL, Embed Design, or Embed Prototype)"
                            onChange={(e) => setEmbedPrototype(e.target.value)}
                            error={errors.embed_prototype}
                        />
                        <SelectCheckbox
                            id={"categories"}
                            label="Categories Survey"
                            mustFill={true}
                            options={categories}
                            valueKey="id"
                            labelKey="name"
                            onChange={handleCheckboxCategoriesChange}
                            error={errors.survey_categories}
                        />
                        <SelectCheckbox
                            id={"methods"}
                            label="Methods Survey"
                            mustFill={true}
                            options={methods}
                            valueKey="id"
                            labelKey="name"
                            onChange={handleCheckboxMethodsChange}
                            error={errors.survey_methods}
                        />
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
                            selectedValue={surveyVisibility}
                            onChange={handleVisibleChange}
                            error={errors.general_access}
                        />
                        <div>
                            <ButtonCRUD
                                type="submit"
                                label="Save"
                                color="btn-success"
                                iconClass="fa fa-save"
                                disabled={isSaving}
                            />
                            <ButtonCRUD
                                type="reset"
                                label="Reset"
                                color="btn-warning"
                                iconClass="fa fa-redo"
                                onClick={handleReset}
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

                {isMethodSusFilled && (
                    <AccordionLayout
                        title="Preview Question - System Usability Scale"
                        defaultOpen={false}
                    >
                        <div className="card-body">
                            <div className="alert alert-danger">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-exclamation-triangle mb-3"></i>
                                    <h5 className="mb-3 ms-2">
                                        Aturan pertanyaan SUS (System Usability
                                        Scale)
                                    </h5>
                                </div>

                                <p>
                                    1. Pertanyaan SUS (System Usability Scale)
                                    tidak bisa diubah.
                                    <br />
                                    2. Untuk setiap pertanyaan bernomor ganjil,
                                    nilai tertinggi adalah 5 (menyatakan sangat
                                    setuju). Sehingga, isi pertanyaan bersifat
                                    positif untuk pertanyaan ganjil.
                                    <br />
                                    3. Untuk setiap pertanyaan bernomor genap,
                                    nilai terendah adalah 1 (menyatakan sangat
                                    tidak setuju). Sehingga, isi pertanyaan
                                    bersifat negatif untuk pertanyaan genap.
                                </p>
                            </div>
                            <hr />
                            {susQuestionsData.map((question, index) => (
                                <InputField
                                    key={question.id}
                                    label={`Pertanyaan ${index + 1}`}
                                    type="text"
                                    value={question.question}
                                    onChange={(e) =>
                                        handleSusQuestionChange(
                                            question.id,
                                            e.target.value
                                        )
                                    }
                                    error={errors[`question${index + 1}`]}
                                    disabled
                                />
                            ))}
                        </div>

                        <div>
                            <ButtonCRUD
                                type="reset"
                                label="Reset to default"
                                color="btn-warning"
                                iconClass="fa fa-redo"
                                onClick={resetSusQuestions}
                            />
                        </div>
                    </AccordionLayout>
                )}

                {isMethodTamFilled && (
                    <AccordionLayout
                        title="Preview Question - Technology Acceptence Model"
                        defaultOpen={false}
                    >
                        <div className="alert alert-danger">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-exclamation-triangle mb-3"></i>
                                <h5 className="mb-3 ms-2">
                                    Aturan pertanyaan TAM (Technology Acceptence
                                    Model)
                                </h5>
                            </div>
                            <p>
                                1. Pertanyaan yang sudah disimpan tidak bisa
                                diubah.
                                <br />
                                2. Variable, indikator, dan pertanyaan dapat
                                dirubah sesuai kebutuhan.
                                <br />
                                3. Diharapkan menggunakan semua variabel yang
                                tersedia agar analisis regresi dapat memberikan
                                hasil yang optimal.
                            </p>
                            <div className="text-center">
                                <ImageView
                                    src="/assets/images/technologyAcceptanceModel.png"
                                    alt="Technology Acceptance Model"
                                    className="img-fluid rounded shadow-sm"
                                    style={{
                                        maxWidth: "50%",
                                        height: "auto",
                                    }}
                                />
                            </div>
                            <p>
                                <br />
                                4. Saat mengisi indikator, boleh mengisi
                                menggunakan input yang sama.
                                <br />
                                5. Urutan pertanyaan dalam kuesioner akan diatur
                                sesuai dengan urutan variabel TAM. Dimulai dari
                                Pertanyaan <i> Perceived Ease of Use</i>,
                                kemudian <i> Perceived Usefulness</i>,
                                <i> Attitude Toward Using</i>,
                                <i> Behavioral Intention to Use</i>, dan
                                terakhir <i> Actual System Use</i>. Dengan
                                demikian, pengguna akan menjawab pertanyaan
                                sesuai dengan alur yang telah ditetapkan, agar
                                memudahkan pengisian kuesioner.
                            </p>
                        </div>
                        <hr />

                        {tamQuestionsData.map((question, index) => (
                            <div key={index} className="mb-3">
                                <div className="row">
                                    <div className="col-md-3">
                                        <strong>
                                            Variable Pertanyaan {index + 1}
                                        </strong>

                                        <select
                                            className="form-select mt-2"
                                            onChange={(e) => {
                                                handleTamVariableChange(
                                                    question.id,
                                                    e.target.value
                                                );
                                            }}
                                            value={question.variable}
                                        >
                                            <option
                                                value=""
                                                disabled
                                                defaultValue
                                            >
                                                Pilih Variable
                                            </option>
                                            <option value="PEU">
                                                Perceived Ease of Use
                                            </option>
                                            <option value="PU">
                                                Perceived Usefulness
                                            </option>
                                            <option value="ATU">
                                                Attitude Toward Using
                                            </option>
                                            <option value="BI">
                                                Behavioral Intention to Use
                                            </option>
                                            <option value="ASU">
                                                Actual System Use
                                            </option>
                                        </select>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <InputField
                                                    id={`indicator${index + 1}`}
                                                    type="text"
                                                    label={`Indikator Pertanyaan ${
                                                        index + 1
                                                    }`}
                                                    value={question.indicator}
                                                    onChange={(e) =>
                                                        handleTamIndicatorChange(
                                                            question.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    error={
                                                        errors[
                                                            `indicator${
                                                                index + 1
                                                            }`
                                                        ]
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <InputField
                                                    id={`question${index + 1}`}
                                                    type="text"
                                                    label={`Pertanyaan ${
                                                        index + 1
                                                    }`}
                                                    value={question.question}
                                                    onChange={(e) =>
                                                        handleTamQuestionChange(
                                                            question.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    error={
                                                        errors[
                                                            `question${
                                                                index + 1
                                                            }`
                                                        ]
                                                    }
                                                />
                                            </div>
                                            <div className="col-md-1 col-12 text-center mt-md-3">
                                                <ButtonCRUD
                                                    type="delete question"
                                                    color="btn btn-outline-danger"
                                                    iconClass="fas fa-minus"
                                                    onClick={() =>
                                                        removeTamQuestion(
                                                            question.id
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}

                        <div className="mb-3 text-center">
                            <ButtonCRUD
                                type="add question"
                                color="btn btn-outline-success"
                                iconClass="fa fa-plus"
                                onClick={() => addTamQuestion()}
                            />
                        </div>

                        <div>
                            <ButtonCRUD
                                type="reset"
                                label="Reset to default"
                                color="btn-warning"
                                iconClass="fa fa-redo"
                                onClick={resetTamQuestions}
                            />
                            <ButtonCRUD
                                type="delete all questions"
                                label="Delete all questions"
                                color="btn-danger"
                                iconClass="fa fa-trash"
                                onClick={deleteAllTamQuestions}
                            />
                        </div>
                    </AccordionLayout>
                )}
                {isMethodAbTestFilled && (
                    <AccordionLayout
                        title="Preview Question - A/B Testing"
                        defaultOpen={false}
                    >
                        <div className="alert alert-danger">
                            <div className="d-flex align-items-center">
                                <i className="fas fa-exclamation-triangle mb-3"></i>
                                <h5 className="mb-3 ms-2">
                                    A/B Testing Guidelines
                                </h5>
                            </div>
                            <p>
                                1. Create comparison groups to organize related design comparisons.
                                <br />
                                2. Each comparison should have exactly two variants (A and B).
                                <br />
                                3. Upload images for each variant to help respondents visualize the differences.
                                <br />
                                4. Provide clear titles and descriptions for each variant.
                            </p>
                        </div>
                        <hr />

                        {/* A/B Testing Groups */}
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
                                    <div key={compIndex} className="mb-3 border p-3 rounded">
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
                                                <div className="card">
                                                    <div className="card-header">Variant A</div>
                                                    <div className="card-body">
                                                        <InputField
                                                            label="Title"
                                                            type="text"
                                                            value={comparison.variant_a.title}
                                                            onChange={(e) => {
                                                                const updatedData = [...abTestingData];
                                                                updatedData[groupIndex].comparisons[compIndex].variant_a.title = e.target.value;
                                                                setAbTestingData(updatedData);
                                                            }}
                                                        />
                                                        <InputField
                                                            label="Description"
                                                            type="text"
                                                            value={comparison.variant_a.description}
                                                            onChange={(e) => {
                                                                const updatedData = [...abTestingData];
                                                                updatedData[groupIndex].comparisons[compIndex].variant_a.description = e.target.value;
                                                                setAbTestingData(updatedData);
                                                            }}
                                                        />
                                                        <InputField
                                                            label="Image"
                                                            type="file"
                                                            onChange={(e) => {
                                                                const updatedData = [...abTestingData];
                                                                updatedData[groupIndex].comparisons[compIndex].variant_a.image = e.target.files[0];
                                                                setAbTestingData(updatedData);
                                                            }}
                                                        />
                                                        {comparison.variant_a.image && (
                                                            <img
                                                                src={typeof comparison.variant_a.image === 'string'
                                                                    ? `/storage/image/ab_testing/${comparison.variant_a.image}`
                                                                    : URL.createObjectURL(comparison.variant_a.image)
                                                                }
                                                                alt="Variant A"
                                                                className="img-fluid mt-2"
                                                                style={{ maxHeight: '150px' }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Variant B */}
                                            <div className="col-md-6">
                                                <div className="card">
                                                    <div className="card-header">Variant B</div>
                                                    <div className="card-body">
                                                        <InputField
                                                            label="Title"
                                                            type="text"
                                                            value={comparison.variant_b.title}
                                                            onChange={(e) => {
                                                                const updatedData = [...abTestingData];
                                                                updatedData[groupIndex].comparisons[compIndex].variant_b.title = e.target.value;
                                                                setAbTestingData(updatedData);
                                                            }}
                                                        />
                                                        <InputField
                                                            label="Description"
                                                            type="text"
                                                            value={comparison.variant_b.description}
                                                            onChange={(e) => {
                                                                const updatedData = [...abTestingData];
                                                                updatedData[groupIndex].comparisons[compIndex].variant_b.description = e.target.value;
                                                                setAbTestingData(updatedData);
                                                            }}
                                                        />
                                                        <InputField
                                                            label="Image"
                                                            type="file"
                                                            onChange={(e) => {
                                                                const updatedData = [...abTestingData];
                                                                updatedData[groupIndex].comparisons[compIndex].variant_b.image = e.target.files[0];
                                                                setAbTestingData(updatedData);
                                                            }}
                                                        />
                                                        {comparison.variant_b.image && (
                                                            <img
                                                                src={typeof comparison.variant_b.image === 'string'
                                                                    ? `/storage/image/ab_testing/${comparison.variant_b.image}`
                                                                    : URL.createObjectURL(comparison.variant_b.image)
                                                                }
                                                                alt="Variant B"
                                                                className="img-fluid mt-2"
                                                                style={{ maxHeight: '150px' }}
                                                            />
                                                        )}
                                                    </div>
                                                </div>
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
                    </AccordionLayout>
                )}
            </LayoutAccount>
        </>
    );
}
