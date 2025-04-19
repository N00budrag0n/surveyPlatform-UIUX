import React from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import hasAnyPermission from "../../../Utils/Permissions";
import Pagination from "../../../Components/Pagination";
import Delete from "../../../Components/Delete";

export default function RoleIndex() {
    const { roles } = usePage().props;
    return (
        <>
            <Head>
                <title>Roles - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            {hasAnyPermission(["roles.create"]) && (
                                <div className="col-md-3 col-12 mb-2">
                                    <Link
                                        href="/account/roles/create"
                                        className="btn btn-md btn-style border-0 shadow w-100"
                                        type="button"
                                    >
                                        <i className="fa fa-plus-circle me-2"></i>
                                        Add
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <CardContent title="Roles" icon="fa fa-shield-alt">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hovered">
                            <thead className="thead">
                                <tr>
                                    <th scope="col" style={{ width: "5%" }}>
                                        No.
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Role Name
                                    </th>
                                    <th scope="col" style={{ width: "50%" }}>
                                        Permissions
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles.data.map((role, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {++index +
                                                (roles.current_page - 1) *
                                                    roles.per_page}
                                        </td>
                                        <td>{role.name || "-"}</td>
                                        <td>
                                            {role.permissions &&
                                            role.permissions.length > 0
                                                ? role.permissions.map(
                                                      (permission, index) => (
                                                          <span
                                                              className="btn btn-style btn-sm shadow-sm border-0 ms-2 mb-2"
                                                              key={index}
                                                          >
                                                              {permission.name}
                                                          </span>
                                                      )
                                                  )
                                                : "-"}
                                        </td>
                                        <td className="text-center">
                                            {hasAnyPermission([
                                                "roles.edit",
                                            ]) && (
                                                <Link
                                                    href={`/account/roles/${role.id}/edit`}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    <i className="fa fa-pencil-alt"></i>
                                                </Link>
                                            )}
                                            {hasAnyPermission([
                                                "roles.delete",
                                            ]) && (
                                                <Delete
                                                    URL={"/account/roles"}
                                                    id={role.id}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination links={roles.links} align={"end"} />
                </CardContent>
            </LayoutAccount>
        </>
    );
}
