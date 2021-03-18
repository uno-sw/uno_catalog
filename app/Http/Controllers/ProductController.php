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

    public function index(Request $request) {
        $perPage = 12;

        $tags = $request->tags;

        if (is_array($tags)) {
            $products = Auth::user()
                ->products()
                ->select('products.*')
                ->join('product_tag', 'product_tag.product_id', '=', 'products.id')
                ->whereIn('product_tag.tag_id', $tags)
                ->groupBy('products.id')
                ->havingRaw('count(DISTINCT product_tag.tag_id) = ' . count($tags))
                ->orderBy('products.price', 'asc')
                ->orderBy('products.id', 'asc')
                ->limit(50)
                ->with(['tags' => function ($query) {
                    $query->withPivot(['id'])->orderBy('pivot_id');
                }])
                ->paginate($perPage);

            return ProductIndexResource::collection($products);
        }

        $products = Auth::user()
            ->products()
            ->orderBy('price', 'asc')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->paginate($perPage);

        return ProductIndexResource::collection($products);
    }

    public function register(RegisterProduct $request)
    {
        $product = new Product();
        $product->name = $request->name;
        $product->price = $request->price;
        $product->note = $request->note;
        $product->image_url = $request->image_url;
        Auth::user()->products()->save($product);

        if ($request->tags) {
            $product->tags = $request->tags;
        }

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
        $product->image_url = $request->image_url;
        $product->save();

        $tags = [];
        if ($request->tags) {
            $tags = $request->tags;
        }
        $product->tags = $tags;

        return response()->json(['id' => $product->id]);
    }

    public function delete(Product $product)
    {
        $this->authorize('delete', $product);
        $product->delete();
        return response()->json(['id' => $product->id]);
    }
}
