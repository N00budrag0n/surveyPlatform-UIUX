import React from "react";

const CardHomepage = ({ icon, title, description }) => {
    return (
        <div className="card h-100 border-0 rounded-4 shadow-sm position-relative card-custom transition-all">
            <div className="position-absolute top-0 start-50 translate-middle icon-container">
                <div className="border border-2 rounded-circle d-flex align-items-center justify-content-center icon-wrapper">
                    <i
                        className={`${icon} fa-2x`}
                        style={{ color: "#ffffff" }}
                    ></i>
                </div>
            </div>
            <div className="card-body pt-5 mt-4 text-center card-body">
                <h5
                    className="card-title fw-bold mb-3"
                    style={{ color: "var(--font-color)" }}
                >
                    {title}
                </h5>
                <p
                    className="card-text"
                    style={{ color: "var(--font-color)", lineHeight: "1.6" }}
                >
                    {description}
                </p>
            </div>
        </div>
    );
};

export default CardHomepage;
