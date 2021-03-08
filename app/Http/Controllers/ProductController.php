<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterProduct;
use App\Http\Resources\ProductDetailResource;
use App\Http\Resources\ProductIndexResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index() {
        $products = Auth::user()
            ->products()
            ->orderBy('price', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['created_at'])->orderBy('pivot_created_at');
            }])
            ->paginate();

        return ProductIndexResource::collection($products);
    }

    public function register(RegisterProduct $request)
    {
        $validated = $request->validated();

        $product = Auth::user()->products()->create($validated);

        if (array_key_exists('tags', $validated)) {
            $product->tags = $validated['tags'];
        }

        if (array_key_exists('links', $validated)) {
            $product->links()->createMany($validated['links']);
        }

        return response()->json(['id' => $product->id], 201);
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);
        return new ProductDetailResource($product);
    }
}
