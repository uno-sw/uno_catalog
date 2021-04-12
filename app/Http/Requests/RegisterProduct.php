<?php

namespace App\Http\Requests;

use App\Rules\ImageUrl;
use Illuminate\Foundation\Http\FormRequest;

class RegisterProduct extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
        ];
    }

    /**
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => '製品名が入力されていません',
            'name.max' => '製品名は100文字以下で入力してください',
        ];
    }
}
