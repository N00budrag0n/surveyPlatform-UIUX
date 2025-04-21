import React from "react";
import LayoutAccount from "../../../Layouts/Account";
import hasAnyPermission from "../../../Utils/Permissions";
import Search from "../../../Components/Search";
import Delete from "../../../Components/Delete";
import Pagination from "../../../Components/Pagination";
import CardContent from "../../../Layouts/CardContent";
import Swal from "sweetalert2";
import { Head, usePage, Link } from "@inertiajs/inertia-react";

export default function articleIndex() {
    const { app_url, articles } = usePage().props;
    return (
        <>
            <Head>
                <title>Articles - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            {hasAnyPermission(["articles.create"]) && (
                                <div className="col-md-3 col-12 mb-2">
                                    <Link
                                        href="/account/articles/create"
                                        className="btn btn-md btn-style border-0 shadow w-100"
                                        type="button"
                                    >
                                        <i className="fa fa-plus-circle me-2"></i>
                                        Add
                                    </Link>
                                </div>
                            )}
                            <div className="col-md-9 col-12 mb-2">
                                <Search URL={"/account/articles/"} />
                            </div>
                        </div>
                    </div>
                </div>
                <CardContent title="Articles Directory" icon="fa fa-newspaper">
                    {articles.data.length > 0 ? (
                        <>
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-hovered">
                                    <thead className="thead">
                                        <tr>
                                            <th
                                                scope="col"
                                                style={{ width: "2%" }}
                                            >
                                                No.
                                            </th>
                                            <th
                                                scope="col"
                                                style={{ width: "10%" }}
                                            >
                                                Article Title
                                            </th>
                                            {hasAnyPermission([
                                                "articles.index.full",
                                            ]) && (
                                                <th
                                                    scope="col"
                                                    style={{ width: "10%" }}
                                                >
                                                    Creator Name
                                                </th>
                                            )}
                                            <th
                                                scope="col"
                                                style={{ width: "12%" }}
                                            >
                                                Updated At
                                            </th>
                                            <th
                                                scope="col"
                                                style={{ width: "10%" }}
                                            >
                                                Image
                                            </th>
                                            <th
                                                scope="col"
                                                style={{ width: "15%" }}
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articles.data.map((article, index) => {
                                            const articleUrl = `${app_url}/articles/${article.id}/${article.slug}`;
                                            return (
                                                <tr key={index}>
                                                    <td className="text-center">
                                                        {++index +
                                                            (articles.current_page -
                                                                1) *
                                                                articles.per_page}
                                                    </td>
                                                    <td>
                                                        {article.title || "-"}
                                                    </td>
                                                    {hasAnyPermission([
                                                        "articles.index.full",
                                                    ]) && (
                                                        <td>
                                                            {article.user
                                                                ? `${article.user.first_name} ${article.user.surname}`
                                                                : "-"}
                                                        </td>
                                                    )}
                                                    <td>
                                                        {article.updated_at ||
                                                            "-"}
                                                    </td>
                                                    <td className="text-center">
                                                        {article.image ? (
                                                            <img
                                                                src={
                                                                    article.image
                                                                }
                                                                className="rounded-3"
                                                                width={"100"}
                                                            />
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>

                                                    <td className="text-center">
                                                        {hasAnyPermission([
                                                            "articles.edit",
                                                        ]) && (
                                                            <Link
                                                                href={`/account/articles/${article.id}/edit`}
                                                                className="btn btn-primary btn-sm m-2"
                                                            >
                                                                <i className="fa fa-pencil-alt"></i>
                                                            </Link>
                                                        )}

                                                        {hasAnyPermission([
                                                            "articles.delete",
                                                        ]) && (
                                                            <Delete
                                                                URL={
                                                                    "/account/articles"
                                                                }
                                                                id={article.id}
                                                            />
                                                        )}

                                                        <button
                                                            className="btn btn-success btn-sm m-2"
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    title: "Bagikan article",
                                                                    html: `<p>Salin URL di bawah :</p><input id="urlInput" type="text" value="${articleUrl}" readOnly>`,
                                                                    showCancelButton: true,
                                                                    showConfirmButton: false,
                                                                });
                                                            }}
                                                        >
                                                            <i className="fas fa-share-alt"></i>{" "}
                                                        </button>
                                                        <button
                                                            className="btn btn-primary btn-sm m-2"
                                                            onClick={() =>
                                                                window.open(
                                                                    articleUrl
                                                                )
                                                            }
                                                        >
                                                            <i className="fa fa-external-link-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={articles.links} align={"end"} />
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="text-center">Tidak ada data</div>
                        </div>
                    )}
                </CardContent>
            </LayoutAccount>
        </>
    );
}
