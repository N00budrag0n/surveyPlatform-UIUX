<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::group(['middleware' => 'cors'], function () {
    Route::get('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'index'])->name('register')->middleware('guest');
    Route::get('/register/preferences', [\App\Http\Controllers\Auth\RegisterController::class, 'index1'])->name('register1')->middleware('guest');
    Route::post('/register/personaldata', [\App\Http\Controllers\Auth\RegisterController::class, 'storePersonalData'])->name('PersonalData.store')->middleware('guest');
    Route::post('/register/preferencedata', [\App\Http\Controllers\Auth\RegisterController::class, 'storePreferenceData'])->name('PreferenceData.store')->middleware('guest');

    Route::get('/login', [\App\Http\Controllers\Auth\LoginController::class, 'index'])->name('login')->middleware('guest');
    Route::post('/login', [\App\Http\Controllers\Auth\LoginController::class, 'store'])->name('login.store')->middleware('guest');

    Route::get('/forgot-password', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'index'])->name('forgotPassword')->middleware('guest');
    Route::post('/forgot-password', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'store'])->name('forgotPassword.store')->middleware('guest');
    Route::get('/reset-password/{token}', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'showResetForm'])->name('password.reset')->middleware('guest');
    Route::post('/reset-password', [\App\Http\Controllers\Auth\ResetPasswordController::class, 'reset'])->name('password.update');

    Route::post('/logout', \App\Http\Controllers\Auth\LogoutController::class)->name('logout')->middleware('auth');

    Route::get('/', \App\Http\Controllers\Web\HomeController::class)->name('web.home.index');

    Route::get('/categories', [\App\Http\Controllers\Web\CategoryController::class, 'index'])->name('web.categories.index');
    Route::get('/categories/{slug}', [\App\Http\Controllers\Web\CategoryController::class, 'show'])->name('web.categories.show');

    Route::get('/surveys', [\App\Http\Controllers\Web\SurveyController::class, 'index'])->name('web.forms.index');

    Route::get('/articles', [\App\Http\Controllers\Web\ArticleController::class, 'index'])->name('web.articles.index');
    Route::get('/articles/{id}/{slug}', [\App\Http\Controllers\Web\ArticleController::class, 'show'])->name('web.articles.show');

    Route::get('/form/{id}/{slug}', [\App\Http\Controllers\Web\FormController::class, 'show'])->name('form.show')->middleware('auth');
    Route::post('/form', [\App\Http\Controllers\Web\FormController::class, 'store'])->middleware('auth');

    Route::get('/about', [\App\Http\Controllers\Web\AboutController::class, 'index'])->name('web.about.index');

    Route::prefix('account')->group(function () {
        Route::group(['middleware' => ['auth']], function () {
            Route::get('/dashboard', [App\Http\Controllers\Account\DashboardController::class, 'index'])->name('account.dashboard');

            Route::resource('profile', \App\Http\Controllers\Account\ProfileController::class, ['as' => 'account'])->only(['index', 'edit', 'update'])
                ->middleware('permission:profile.index|profile.edit');
            Route::get('profile/certificate', [\App\Http\Controllers\Account\ProfileController::class, 'certificate'])
                ->middleware('permission:profile.upload.certificate')->name('account.profile.certificate');
            Route::post('profile/certificate', [\App\Http\Controllers\Account\ProfileController::class, 'uploadCertificate'])
                ->middleware('permission:profile.upload.certificate')->name('account.profile.uploadCertificate');
            Route::get('profile/password', [\App\Http\Controllers\Account\ProfileController::class, 'password'])
                ->middleware('permission:profile.change.password')->name('account.profile.password');
            Route::put('profile/password/update', [\App\Http\Controllers\Account\ProfileController::class, 'updatePassword'])
                ->middleware('permission:profile.change.password')->name('account.profile.updatePassword');

            Route::resource('/surveys', \App\Http\Controllers\Account\SurveyController::class, ['as' => 'account'])
                ->middleware('permission:surveys.index|surveys.index.full|surveys.create|surveys.edit|surveys.delete');

            Route::resource('/categories', \App\Http\Controllers\Account\CategoryController::class, ['as' => 'account'])
                ->middleware('permission:categories.index|categories.create|categories.edit|categories.delete');

            Route::get('/responses/sus/{id}/export', [App\Http\Controllers\Account\SusController::class, 'export'])->name('responses.sus.export');
            Route::get('/responses/tam/{id}/export', [App\Http\Controllers\Account\TamController::class, 'export'])->name('responses.tam.export');
            Route::get('/responses/ab_test/{id}/export', [\App\Http\Controllers\Account\AbTestController::class, 'export'])->name('responses.ab_test.export');

            Route::resource('/roles', \App\Http\Controllers\Account\RoleController::class, ['as' => 'account'])
                ->middleware('permission:roles.index|roles.create|roles.edit|roles.delete');

            Route::resource('/permissions', \App\Http\Controllers\Account\PermissionController::class, ['as' => 'account'])
                ->middleware('permission:permissions.index|permissions.create|permissions.edit|permissions.delete');

            Route::resource('/certificates', \App\Http\Controllers\Account\CertificateController::class, ['as' => 'account'])
                ->middleware('permission:certificates.index|certificates.index.full|certificates.approve|certificates.reject');

            Route::resource('/users', \App\Http\Controllers\Account\UserController::class, ['as' => 'account'])
                ->middleware('permission:users.index|users.create|users.edit|users.delete');

            Route::resource('articles', \App\Http\Controllers\Account\ArticleController::class, ['as' => 'account'])
                ->middleware('permission:articles.index|articles.index.full|articles.create|articles.edit|articles.delete');

            Route::get('/sus', [\App\Http\Controllers\Account\SusController::class, 'index'])
                ->middleware('permission:sus.index|sus.index.full')->name('account.sus');
            Route::get('/sus/{id}', [App\Http\Controllers\Account\SusController::class, 'show'])
                ->middleware('permission:sus.index|sus.index.full|sus.statistics|sus.charts|sus.responses|sus.export')->name('account.sus.id');

            Route::get('/tam', [\App\Http\Controllers\Account\TamController::class, 'index'])
                ->middleware('permission:tam.index|tam.index.full')->name('account.tam');
            Route::get('/tam/{id}', [App\Http\Controllers\Account\TamController::class, 'show'])
                ->middleware('permission:tam.index|tam.index.full|tam.statistics|tam.charts|tam.responses|tam.export')->name('account.tam.id');
            Route::get('/ab_test', [\App\Http\Controllers\Account\AbTestController::class, 'index'])
                ->middleware('permission:ab_test.index|ab_test.index.full')->name('account.ab_test');
            Route::get('/ab_test/{id}', [\App\Http\Controllers\Account\AbTestController::class, 'show'])
                ->middleware('permission:ab_test.index|ab_test.index.full|ab_test.statistics|ab_test.charts|ab_test.responses|ab_test.export')->name('account.ab_test.id');
        });
    });
});

// Add this route for testing
Route::get('/test-ab-image/{filename}', function ($filename) {
    $path = storage_path('app/public/image/ab_testing/' . $filename);
    if (file_exists($path)) {
        return response()->file($path);
    }
    return 'File not found: ' . $path;
})->middleware('auth');

