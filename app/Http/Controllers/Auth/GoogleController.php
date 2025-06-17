<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::drive('google')->user();

            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // if exists, auth then redirect to dashboard,
                Auth::login($user);
                return redirect()->intended('/dashboard');
            } else {
                // new usser, create user
                session([
                    'google_user' => [
                        'google_id' => $googleUser->id,
                        'first_name' => $googleUser->user['given_name'] ?? explode(' ', $googleUser->name)[0],
                        'surname' => $googleUser->user['family_name'] ?? (explode(' ', $googleUser->name)[1] ?? ''),
                        'email' => $googleUser->email,
                        'avatar' => $googleUser->avatar,
                    ]
                ]);

                return redirect()->route('register.google.complete');
            }
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Google authentication failed. Please try again.');
        }
    }
}
