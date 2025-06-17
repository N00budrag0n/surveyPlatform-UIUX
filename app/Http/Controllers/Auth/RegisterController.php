<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Models\Certificate;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Models\Category;
use App\Models\UserSelectCategory;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class RegisterController extends Controller
{
    public function index()
    {
        return inertia(
            'Auth/Register',
            [
                'auth' => auth()->user(),
            ]
        );
    }

    public function index1()
    {
        $categories = Category::all();
        return inertia(
            'Auth/SelectCategory',
            [
                'auth' => auth()->user(),
                'categories' => $categories,
            ]
        );
    }

    public function storePersonalData(Request $request)
    {
        $request->validate([
            'first_name'      => 'required',
            'surname'         => 'required',
            'email'     => 'required|email|unique:users',
            'birth_date'     => 'required|date',
            'gender'     => 'required',
            'profession'     => 'required',
            'educational_background'     => 'required',
            'password'  => 'required|confirmed',
        ]);

        $personaldata = [
            'first_name'      => $request->first_name,
            'surname'         => $request->surname,
            'email'     => $request->email,
            'birth_date'     => $request->birth_date,
            'gender'     => $request->gender,
            'profession'     => $request->profession,
            'educational_background'     => $request->educational_background,
            'password'  => bcrypt($request->password)
        ];

        $request->session()->put('personaldata', $personaldata);

        return redirect()->route('register1');
    }

    public function googleCompleteRegistration()
    {
        $googleUser = session('google_user');

        if (!$googleUser) {
            return redirect()->route('login')->with('error', 'Session expired. Please try again.');
        }

        return inertia(
            'Auth/GoogleRegisterComplete',
            [
                'googleUser' => $googleUser,
                'auth' => auth()->user(),
            ]
        );
    }

    public function storeGooglePersonalData(Request $request)
    {
        $googleUser = session('google_user');

        if (!$googleUser) {
            return redirect()->route('login')->with('error', 'Session expired. Please try again.');
        }

        $request->validate([
            'birth_date'     => 'required|date',
            'gender'     => 'required',
            'profession'     => 'required',
            'educational_background'     => 'required',
        ]);

        $personaldata = [
            'google_id'       => $googleUser['google_id'],
            'first_name'      => $googleUser['first_name'],
            'surname'         => $googleUser['surname'],
            'email'           => $googleUser['email'],
            'avatar'          => $googleUser['avatar'],
            'birth_date'      => $request->birth_date,
            'gender'          => $request->gender,
            'profession'      => $request->profession,
            'educational_background' => $request->educational_background,
            'is_google_user'  => true,
        ];

        $request->session()->put('personaldata', $personaldata);
        $request->session()->forget('google_user');

        return redirect()->route('register1');
    }

    public function storePreferenceData(Request $request, UserSelectCategory $userPref, Certificate $certificate)
    {
        $this->validate($request, [
            'userPrefsData' => 'required',
            'files.*' => 'file|mimes:pdf|max:2048',
        ]);

        $personaldata = $request->session()->get('personaldata');

        $userData = [
            'first_name' => $personaldata['first_name'],
            'surname' => $personaldata['surname'],
            'email' => $personaldata['email'],
            'birth_date' => $personaldata['birth_date'],
            'gender' => $personaldata['gender'],
            'profession' => $personaldata['profession'],
            'educational_background' => $personaldata['educational_background'],
        ];

        // handle google user and reguler user
        if (isset($personaldata['google_id']) && $personaldata['is_google_user']) {
            $userData['google_id'] = $personaldata['google_id'];
            $userData['avatar'] = $personaldata['avatar'];
            $userData['email_verified_at'] = $personaldata['email_verified_at'] ?? now();
        } else {
            $userData['password'] = $personaldata['password'];
        }

        $user = User::create($userData);

        $role = Role::findByName('basic user');
        $user->assignRole($role);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $originalName = $file->getClientOriginalName();
                $certificate = $file->hashName();
                $file->storeAs('public/file/certificates', $certificate);
                Certificate::create([
                    'user_id' => $user->id,
                    'original_certificate' => $originalName,
                    'certificate' => $certificate,
                    'status' => 'pending',
                ]);
            }
        }

        $userPrefsData = json_decode($request->userPrefsData);
        $userPref->where('user_id', $user->id)->delete();

        foreach ($userPrefsData as $category_id) {
            $userPref->create(['category_id' => $category_id, 'user_id' => $user->id]);
        }

        $request->session()->forget('personaldata');

        Auth::login($user);

        return redirect()->route('account.dashboard');
    }

}
