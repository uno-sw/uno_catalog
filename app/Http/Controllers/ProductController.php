<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterProduct;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function register(RegisterProduct $request)
    {
        $validated = $request->validated();

        $product = Auth::user()->products()->create($validated);

        if (array_key_exists('tags', $validated)) {
            $product->setTags($validated['tags']);
        }

        if (array_key_exists('links', $validated)) {
            $product->links()->createMany($validated['links']);
        }

        return response()->json(['id' => $product->id], 201);
    }
}
