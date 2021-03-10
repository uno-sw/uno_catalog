<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateLink extends FormRequest
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
            'title' => 'required|string|max:20',
            'url' => 'required|url|max:100',
        ];
    }

    /**
     * @return array
     */
    public function messages()
    {
        return [
            'title.max' => 'タイトルは20文字以下で入力してください',
            'url.url' => 'URLが不正な形式です',
            'url.max' => 'URLは100文字以下で入力してください'
        ];
    }
}
