<?php

namespace App\Http\Requests;

use App\Rules\ImageUrl;
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
            'name' => ['required', 'string', 'max:100'],
            'price' => ['integer', 'nullable'],
            'note' => ['string', 'nullable'],
            'tags' => ['array', 'nullable', 'max:10'],
            'tags.*' => ['string', 'max:20'],
            'image_url' => ['url', 'nullable', 'max:512', new ImageUrl],
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
            'image_url.url' => '画像URLが無効なURL形式です',
            'image_url.max' => '画像URLは512文字以下で入力してください',
        ];
    }
}
