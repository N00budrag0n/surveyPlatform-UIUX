import React from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import hasAnyPermission from "../../../Utils/Permissions";
import Pagination from "../../../Components/Pagination";
import Search from "../../../Components/Search";
import Delete from "../../../Components/Delete";

export default function PermissionIndex() {
    const { permissions } = usePage().props;

    return (
        <>
            <Head>
                <title>Permissions - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            {hasAnyPermission(["permissions.create"]) && (
                                <div className="col-md-3 col-12 mb-2">
                                    <Link
                                        href="/account/permissions/create"
                                        className="btn btn-md btn-style border-0 shadow w-100"
                                        type="button"
                                    >
                                        <i className="fa fa-plus-circle me-2"></i>
                                        Add
                                    </Link>
                                </div>
                            )}
                            <div className="col-md-9 col-12 mb-2">
                                <Search URL={"/account/permissions/"} />
                            </div>
                        </div>
                    </div>
                </div>
                <CardContent title="Permissions" icon="fas fa-passport">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hovered">
                            <thead className="thead">
                                <tr>
                                    <th scope="col" style={{ width: "5%" }}>
                                        No.
                                    </th>
                                    <th scope="col">Permission Name</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.data.map((permission, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {++index +
                                                (permissions.current_page - 1) *
                                                    permissions.per_page}
                                        </td>
                                        <td>{permission.name}</td>
                                        <td className="text-center">
                                            {hasAnyPermission([
                                                "permissions.edit",
                                            ]) && (
                                                <Link
                                                    href={`/account/permissions/${permission.id}/edit`}
                                                    className="btn btn-primary btn-sm m-2"
                                                >
                                                    <i className="fa fa-pencil-alt"></i>
                                                </Link>
                                            )}
                                            {hasAnyPermission([
                                                "permissions.delete",
                                            ]) && (
                                                <Delete
                                                    URL={"/account/permissions"}
                                                    id={permission.id}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={permissions.links} align={"end"} />
                </CardContent>
            </LayoutAccount>
        </>
    );
}
