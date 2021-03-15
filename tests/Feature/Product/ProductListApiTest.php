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

        $users = \App\Models\User::factory()->count(2)->create();
        $tags = \App\Models\Tag::factory()->count(3)->create();

        foreach ($users as $user) {
            Product::factory()
                ->count(20)
                ->for($user)
                ->hasAttached($tags)
                ->create();
        }

        $this->user = $users[0];

        $products = $this->user->products()
            ->orderBy('price', 'asc')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();

        $this->expected_data = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'tags' => $product->tags->map(function ($tag) {
                    return ['label' => $tag->label];
                })->all(),
            ];
        });
    }

    /**
     * @test
     */
    public function should_respond_with_401_when_not_logged_in()
    {
        $response = $this->getJson(route('product.index'));
        $response->assertUnauthorized()
            ->assertJson(['message' => 'Unauthenticated.']);
    }

    /**
     * @test
     */
    public function should_return_correct_JSON_with_pagination()
    {
        $response = $this->actingAs($this->user)
            ->getJson(route('product.index'));
        $response->assertOk()
            ->assertJsonCount(9, 'data')
            ->assertJson(['data' => $this->expected_data->take(9)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/products/?page=2');
        $response->assertOk()
            ->assertJsonCount(9, 'data')
            ->assertJson([
                'data' => $this->expected_data->slice(9, 9)->values()->all(),
            ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/products/?page=3');
        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJson([
                'data' => $this->expected_data->slice(18)->values()->all()
            ]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/products/?page=4');
        $response->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJson(['data' => []]);
    }

    /**
     * @test
     */
    public function should_return_first_page_when_invalid_page_requested()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/api/products/?page=0');
        $response->assertOk()
            ->assertJsonCount(9, 'data')
            ->assertJson(['data' => $this->expected_data->take(9)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/products/?page=-5');
        $response->assertOk()
            ->assertJsonCount(9, 'data')
            ->assertJson(['data' => $this->expected_data->take(9)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/products/?page=2.5');
        $response->assertOk()
            ->assertJsonCount(9, 'data')
            ->assertJson(['data' => $this->expected_data->take(9)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson('/api/products/?page=test');
        $response->assertOk()
            ->assertJsonCount(9, 'data')
            ->assertJson(['data' => $this->expected_data->take(9)->all()]);

    }
}
