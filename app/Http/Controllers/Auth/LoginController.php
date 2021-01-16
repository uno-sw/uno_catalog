<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ]);
        $credentials = $request->only(['email', 'password']);

        if (Auth::attempt($credentials, $request->remember)) {
            return Auth::user();
        }

        throw ValidationException::withMessages([
            'email' => ['メールアドレスまたはパスワードが正しくありません。']
        ]);
    }

    public function logout()
    {
        Auth::logout();
        return response()->json(['message' => 'Logged out']);
    }
}
