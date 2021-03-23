<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'メールアドレスが入力されていません',
            'email.email' => 'メールアドレスが有効な形式ではありません',
            'password.required' => 'パスワードが入力されていません',
            'remember.boolean' => 'rememberが真偽値として有効な値ではありません',
        ];
    }
}
