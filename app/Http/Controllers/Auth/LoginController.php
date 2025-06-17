<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function index()
    {
        if (Cookie::has('remember_token')) {
            $user = User::where('remember_token', Cookie::get('remember_token'))->first();
            if ($user) {
                auth()->login($user);
                return redirect()->route('account.dashboard');
            }
        }

        return inertia(
            'Auth/Login',
            [
                'auth' => auth()->user(),
            ]
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'email'     => 'required|email',
            'password'  => 'required',
            'remember'  => 'boolean',
        ]);

        $credentials = $request->only('email', 'password');

        if (auth()->attempt($credentials, $request->remember)) {

            $request->session()->regenerate();

            if ($request->remember) {
                $user = auth()->user();
                $rememberToken = Str::random(60);
                $user->forceFill([
                    'remember_token' => $rememberToken,
                ])->save();

                $minutes = 60 * 24 * 30; // 30 days

                return redirect()->route('account.dashboard')->withCookie('remember_token', $rememberToken, $minutes);
            }

            return redirect()->route('account.dashboard');
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    // Google OAuth methods
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();

            // check if user already exists
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                // user exists, update google id if not set
                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar,
                    ]);
                }

                auth()->login($user);
                return redirect()->route('account.dashboard');
            } else {
                // new user, store google data in session and redirect to complete registration
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
