<?php

namespace App\Http\Controllers\Account;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::when(request()->q, function ($roles) {
            $roles = $roles->where('name', 'like', '%' . request()->q . '%');
        })->with('permissions')->orderBy('id')->paginate(5);

        $roles->appends(['q' => request()->q]);

        return inertia('Account/Roles/Roles', [
            'roles' => $roles,
        ]);
    }

    public function create()
    {
        $permissions = Permission::all();

        return inertia('Account/Roles/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'name'          => 'required',
            'permissions'   => 'required',
        ]);

        $role = Role::create(['name' => $request->name]);

        $role->givePermissionTo($request->permissions);

        return redirect()->route('account.roles.index');
    }

    public function edit($id)
    {
        if ($id == 1) {
            abort(403, "The user is not allowed to be edited.");
        }

        $role = Role::with('permissions')->findOrFail($id);

        $permissions = Permission::all();

        return inertia('Account/Roles/Edit', [
            'role'          => $role,
            'permissions'   => $permissions,
        ]);
    }

    public function update(Request $request, Role $role)
    {
        if ($request->name == "super admin") {
            abort(403, "The user is not allowed to be edited.");
        }

        $this->validate($request, [
            'name'          => 'required',
            'permissions'   => 'required',
        ]);

        $role->update(['name' => $request->name]);

        $role->syncPermissions($request->permissions);

        return redirect()->route('account.roles.index');
    }

    public function destroy($id)
    {
        if ($id == 1) {
            abort(403, "The system will not allow you to delete this role. The role cannot be deleted.");
        }

        $role = Role::findOrFail($id);

        $role->delete();

        return redirect()->route('account.roles.index');
    }
}
