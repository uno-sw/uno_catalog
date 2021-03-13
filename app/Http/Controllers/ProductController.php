<?php

namespace App\Http\Controllers;

use App\Http\Requests\EditProduct;
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
        $product = new Product();
        $product->name = $request->name;
        $product->price = $request->price;
        $product->note = $request->note;
        Auth::user()->products()->save($product);
        $product->tags = $request->tags;

        return response()->json(['id' => $product->id], 201);
    }

    public function show(Product $product)
    {
        $this->authorize('view', $product);
        return new ProductDetailResource($product);
    }

    public function edit(Product $product, EditProduct $request)
    {
        $this->authorize('edit', $product);

        $product->name = $request->name;
        $product->price = $request->price;
        $product->note = $request->note;
        $product->save();
        $product->tags = $request->tags;

        return response()->json(['id' => $product->id]);
    }

    public function delete(Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();
        return response()->json(['id' => $product->id]);
    }
}
