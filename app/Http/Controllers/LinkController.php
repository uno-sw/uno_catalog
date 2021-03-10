<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateLink;
use App\Models\Product;
use Illuminate\Http\Request;

class LinkController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function create(Product $product, CreateLink $request)
    {
        $this->authorize('createLink', $product);
        $link = $product->links()->create($request->validated());
        return response()->json(['id' => $link->id], 201);
    }
}
