<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagIndexResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TagController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index()
    {
        $tags = Auth::user()
            ->tags()
            ->orderBy('label', 'asc')
            ->get();

        return TagIndexResource::collection($tags);
    }
}
