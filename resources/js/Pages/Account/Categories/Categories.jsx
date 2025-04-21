import React from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import hasAnyPermission from "../../../Utils/Permissions";
import Search from "../../../Components/Search";
import Pagination from "../../../Components/Pagination";
import Delete from "../../../Components/Delete";

export default function CategoryIndex() {
    const { app_url, categories } = usePage().props;

    return (
        <>
            <Head>
                <title>Categories - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            {hasAnyPermission(["categories.create"]) && (
                                <div className="col-md-3 col-12 mb-2">
                                    <Link
                                        href="/account/categories/create"
                                        className="btn btn-md btn-style border-0 shadow w-100"
                                        type="button"
                                    >
                                        <i className="fa fa-plus-circle me-2"></i>
                                        Add
                                    </Link>
                                </div>
                            )}
                            <div className="col-md-9 col-12 mb-2">
                                <Search URL={"/account/categories"} />
                            </div>
                        </div>
                    </div>
                </div>
                <CardContent title="Categories" icon="fa fa-folder">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hovered">
                            <thead className="thead">
                                <tr>
                                    <th scope="col" style={{ width: "5%" }}>
                                        No.
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Category Name
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Status
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Image
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.data.map((category, index) => {
                                    const categoryUrl = `${app_url}/categories/${category.slug}`;

                                    return (
                                        <tr key={index}>
                                            <td className="text-center">
                                                {++index +
                                                    (categories.current_page -
                                                        1) *
                                                        categories.per_page}
                                            </td>
                                            <td>{category.name || "-"}</td>
                                            <td>{category.status || "-"}</td>
                                            <td className="text-center">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        className="rounded-3"
                                                        height={"45"}
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {hasAnyPermission([
                                                    "categories.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/account/categories/${category.id}/edit`}
                                                        className="btn btn-primary btn-sm me-2"
                                                    >
                                                        <i className="fa fa-pencil-alt"></i>
                                                    </Link>
                                                )}
                                                <button
                                                    className="btn btn-primary btn-sm m-2"
                                                    onClick={() =>
                                                        window.open(categoryUrl)
                                                    }
                                                >
                                                    <i className="fa fa-external-link-alt"></i>
                                                </button>
                                                {hasAnyPermission([
                                                    "categories.delete",
                                                ]) && (
                                                    <Delete
                                                        URL={
                                                            "/account/categories"
                                                        }
                                                        id={category.id}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={categories.links} align={"end"} />
                </CardContent>
            </LayoutAccount>
        </>
    );
}
