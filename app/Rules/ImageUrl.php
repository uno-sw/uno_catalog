<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class ImageUrl implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        preg_match(
            '/^(?:[^:\/?#]+:)?(?:\/\/[^\/?#]*)?(?:([^?#]*\/)([^\/?#]*))?(\?[^#]*)?(?:#.*)?$/',
            $value,
            $matches,
        );
        if (count($matches) < 3) {
            return false;
        }
        $file_name = $matches[2];
        preg_match('/^(.+?)(\.[^.]+)?$/', $file_name, $matches);
        if (count($matches) < 3) {
            return false;
        }
        return in_array($matches[2], ['.jpg', '.jpeg', '.png']);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'JPEGまたはPNG形式のファイルを指すURLではありません';
    }
}
