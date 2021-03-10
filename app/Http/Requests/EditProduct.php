<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EditProduct extends FormRequest
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
            'name' => 'required|string|max:100',
            'price' => 'integer|nullable',
            'note' => 'string|nullable',
            'tags' => 'array|nullable|max:10',
            'tags.*' => 'string|max:20',
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
            'price.integer' => '価格は整数で入力してください',
            'tags.max' => '登録できるタグは10個までです',
            'tags.*.max' => 'それぞれのタグは20文字以下で入力してください',
        ];
    }
}
