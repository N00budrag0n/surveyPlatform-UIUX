import React from "react";
import { Link } from "@inertiajs/inertia-react";

const CardItem = ({
    type,
    data,
    link,
    maxTitleLength,
    surveyFilled = false,
}) => {
    maxTitleLength = maxTitleLength || 80;

    const truncatedTitle =
        data.title.length > maxTitleLength
            ? data.title.substring(0, maxTitleLength) + "..."
            : data.title;

    return (
        <>
            {type === "survey" && (
                <Link
                    href={link}
                    className="text-decoration-none"
                    style={{ color: "var(--font-color)" }}
                >
                    <div className="card border-0 rounded-3 shadow-sm survey transition-all">
                        <div
                            style={{
                                width: "100%",
                                height: "200px",
                                overflow: "hidden",
                                borderRadius: "8px 8px 0 0",
                            }}
                        >
                            <img
                                src={
                                    data.image && data.image.length > 0
                                        ? data.image
                                        : "/assets/images/image.png"
                                }
                                alt={data.title}
                                className="img-fluid"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1.05)")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1)")
                                }
                                loading="lazy"
                            />
                        </div>
                        <div className="card-body h-100">
                            <h6
                                className="card-title text-center fw-semibold"
                                style={{
                                    height: "60px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    color: "var(--font-color)",
                                    lineHeight: "1.5",
                                }}
                            >
                                {truncatedTitle}
                            </h6>
                        </div>
                    </div>
                </Link>
            )}
            {type === "article" && (
                <Link
                    href={link}
                    className="text-decoration-none"
                    style={{ color: "var(--font-color)" }}
                >
                    <div className="card border-0 rounded-3 shadow-sm article transition-all">
                        <div
                            style={{
                                width: "100%",
                                height: "200px",
                                overflow: "hidden",
                                borderRadius: "8px 8px 0 0",
                            }}
                        >
                            <img
                                src={
                                    data.image && data.image.length > 0
                                        ? data.image
                                        : "/assets/images/image.png"
                                }
                                alt={data.title}
                                className="card-img-top"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.5s ease",
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1.05)")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.transform =
                                        "scale(1)")
                                }
                                loading="lazy"
                            />
                        </div>
                        <div className="card-body h-100">
                            <h6
                                className="card-title text-center fw-semibold"
                                style={{
                                    height: "60px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    color: "var(--font-color)",
                                    lineHeight: "1.5",
                                }}
                            >
                                {truncatedTitle}
                            </h6>
                        </div>
                    </div>
                </Link>
            )}
        </>
    );
};

export default CardItem;
