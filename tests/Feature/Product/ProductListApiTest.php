<?php

namespace Tests\Feature\Product;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductListApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void {
        parent::setUp();

        $users = \App\Models\User::factory()->count(5)->create();
        $tags = \App\Models\Tag::factory()->count(3)->create();

        foreach ($users as $user) {
            Product::factory()
                ->count(5)
                ->for($user)
                ->hasAttached($tags)
                ->create();
        }

        $this->user = $users[0];
    }

    /**
     * @test
     */
    public function should_response_401_when_not_logged_in()
    {
        $response = $this->getJson(route('product.index'));
        $response->assertUnauthorized()
            ->assertJson(['message' => 'Unauthenticated.']);
    }

    /**
     * @test
     */
    public function should_return_correct_JSON()
    {
        $response = $this->actingAs($this->user)
            ->getJson(route('product.index'));

        $products = $this->user->products()
            ->orderBy('price', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['created_at'])->orderBy('pivot_created_at');
            }])
            ->get();

        $expected_data = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'tags' => $product->tags->map(function ($tag) {
                    return ['label' => $tag->label];
                })->all(),
            ];
        })->all();

        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }
}
