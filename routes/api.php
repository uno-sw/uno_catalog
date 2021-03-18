<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\LinkController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TagController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', fn() => Auth::user())->name('user');

Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

Route::get('/products', [ProductController::class, 'index'])->name('product.index');
Route::post('/products', [ProductController::class, 'register'])->name('product.register');
Route::get('/products/{product}', [ProductController::class, 'show'])->name('product.show');
Route::put('/products/{product}', [ProductController::class, 'edit'])->name('product.edit');
Route::delete('/products/{product}', [ProductController::class, 'delete'])->name('product.delete');

Route::post('/products/{product}/links', [LinkController::class, 'create'])->name('link.create');
Route::delete('/links/{link}', [LinkController::class, 'delete'])->name('link.delete');

Route::get('/tags', [TagController::class, 'index'])->name('tag.index');
Route::delete('/tags/{tag}', [TagController::class, 'delete'])->name('tag.delete');
