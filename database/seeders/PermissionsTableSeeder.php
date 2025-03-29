<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //permission dashboard
        Permission::create(['name' => 'dashboard.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'dashboard.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'dashboard.full.manual.book', 'guard_name' => 'web']);

        //permission profile
        Permission::create(['name' => 'profile.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'profile.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'profile.upload.certificate', 'guard_name' => 'web']);
        Permission::create(['name' => 'profile.change.password', 'guard_name' => 'web']);

        //permission sus result
        Permission::create(['name' => 'sus.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'sus.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'sus.statistics', 'guard_name' => 'web']);
        Permission::create(['name' => 'sus.charts', 'guard_name' => 'web']);
        Permission::create(['name' => 'sus.responses', 'guard_name' => 'web']);
        Permission::create(['name' => 'sus.export', 'guard_name' => 'web']);

        //permission tam result
        Permission::create(['name' => 'tam.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'tam.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'tam.statistics', 'guard_name' => 'web']);
        Permission::create(['name' => 'tam.charts', 'guard_name' => 'web']);
        Permission::create(['name' => 'tam.responses', 'guard_name' => 'web']);
        Permission::create(['name' => 'tam.export', 'guard_name' => 'web']);

        // permission ab_test result
        Permission::create(['name' => 'ab_test.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'ab_test.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'ab_test.statistics', 'guard_name' => 'web']);
        Permission::create(['name' => 'ab_test.charts', 'guard_name' => 'web']);
        Permission::create(['name' => 'ab_test.responses', 'guard_name' => 'web']);
        Permission::create(['name' => 'ab_test.export', 'guard_name' => 'web']);

        // permission wcag_test result
        Permission::create(['name' => 'wcag_test.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'wcag_test.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'wcag_test.statistics', 'guard_name' => 'web']);
        Permission::create(['name' => 'wcag_test.charts', 'guard_name' => 'web']);
        Permission::create(['name' => 'wcag_test.responses', 'guard_name' => 'web']);
        Permission::create(['name' => 'wcag_test.export', 'guard_name' => 'web']);

        //permission surveys
        Permission::create(['name' => 'surveys.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'surveys.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'surveys.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'surveys.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'surveys.delete', 'guard_name' => 'web']);

        //permission articles
        Permission::create(['name' => 'articles.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'articles.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'articles.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'articles.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'articles.delete', 'guard_name' => 'web']);

        //permission categories
        Permission::create(['name' => 'categories.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'categories.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'categories.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'categories.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'categories.delete', 'guard_name' => 'web']);

        //permission roles
        Permission::create(['name' => 'roles.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'roles.delete', 'guard_name' => 'web']);

        //permission permissions
        Permission::create(['name' => 'permissions.index', 'guard_name' => 'web']);

        //permission certificates
        Permission::create(['name' => 'certificates.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'certificates.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'certificates.approve', 'guard_name' => 'web']);
        Permission::create(['name' => 'certificates.reject', 'guard_name' => 'web']);

        //permission users
        Permission::create(['name' => 'users.index', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.index.full', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.create', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.edit', 'guard_name' => 'web']);
        Permission::create(['name' => 'users.delete', 'guard_name' => 'web']);
    }
}
