import React from "react";
import LayoutAccount from "../../../Layouts/Account";
import CardContent from "../../../Layouts/CardContent";
import { Head, usePage, Link } from "@inertiajs/inertia-react";
import hasAnyPermission from "../../../Utils/Permissions";
import Search from "../../../Components/Search";
import Pagination from "../../../Components/Pagination";
import Delete from "../../../Components/Delete";

export default function UserIndex() {
    const { users } = usePage().props;

    return (
        <>
            <Head>
                <title>Users - UIX-Probe</title>
            </Head>
            <LayoutAccount>
                <div className="row mt-5">
                    <div className="col-md-8">
                        <div className="row">
                            {hasAnyPermission(["users.create"]) && (
                                <div className="col-md-3 col-12 mb-2">
                                    <Link
                                        href="/account/users/create"
                                        className="btn btn-md btn-style border-0 shadow w-100"
                                        type="button"
                                    >
                                        <i className="fa fa-plus-circle me-2"></i>
                                        Add
                                    </Link>
                                </div>
                            )}
                            <div className="col-md-9 col-12 mb-2">
                                <Search URL={"/account/users"} />
                            </div>
                        </div>
                    </div>
                </div>
                <CardContent title="Users" icon="fa fa-users">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped table-hovered">
                            <thead className="thead">
                                <tr>
                                    <th scope="col" style={{ width: "5%" }}>
                                        No.
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Name
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Email Address
                                    </th>
                                    <th scope="col" style={{ width: "30%" }}>
                                        Role
                                    </th>
                                    <th scope="col" style={{ width: "15%" }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.map((user, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {++index +
                                                (users.current_page - 1) *
                                                    users.per_page}
                                        </td>
                                        <td>
                                            {user.roles[0].name ===
                                            "verified user" ? (
                                                <>
                                                    <i className="fas fa-user-check" />{" "}
                                                    {user.first_name}{" "}
                                                    {user.surname}
                                                </>
                                            ) : (
                                                <>
                                                    {user.first_name}{" "}
                                                    {user.surname}
                                                </>
                                            )}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            {user.roles.map((role, index) => (
                                                <span
                                                    className="btn btn-style btn-sm shadow-sm border-0 ms-2 mb-2"
                                                    key={index}
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </td>
                                        <td className="text-center">
                                            {hasAnyPermission([
                                                "users.edit",
                                            ]) && (
                                                <Link
                                                    href={`/account/users/${user.id}/edit`}
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    <i className="fa fa-pencil-alt"></i>
                                                </Link>
                                            )}
                                            {hasAnyPermission([
                                                "users.delete",
                                            ]) && (
                                                <Delete
                                                    URL="/account/users"
                                                    id={user.id}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination links={users.links} align={"end"} />
                </CardContent>
            </LayoutAccount>
        </>
    );
}
