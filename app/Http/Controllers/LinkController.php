<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateLink;
use App\Models\Link;
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

        if ($product->links()->count() >= 10) {
            abort(409);
        }

        $link = $product->links()->create($request->validated());
        return response()->json(['id' => $link->id], 201);
    }

    public function delete(Link $link)
    {
        $this->authorize('delete', $link);
        $id = $link->id;
        $link->delete();
        return response()->json(['id' => $id]);
    }
}
