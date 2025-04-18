import React from "react";
import { Link } from "@inertiajs/inertia-react";

export default function CardCategory({ category }) {
    return (
        <>
            <Link
                href={`/categories/${category.slug}`}
                className="text-decoration-none"
                style={{ color: "var(--font-color)" }}
            >
                <div className="card border-0 rounded-3 shadow-sm category transition-all">
                    <div className="card-body text-center">
                        <div
                            style={{
                                width: "100%",
                                height: "135px",
                                overflow: "hidden",
                                borderRadius: "8px",
                            }}
                        >
                            <img
                                src={
                                    category.image
                                        ? category.image
                                        : "/assets/images/image.png"
                                }
                                className="card-img-top"
                                alt={category.name}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease",
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
                        <p
                            className="card-title text-center title-book mt-3 fw-semibold"
                            style={{
                                height: "25px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                color: "var(--font-color)",
                            }}
                        >
                            {category.name}
                        </p>
                    </div>
                </div>
            </Link>
        </>
    );
}
