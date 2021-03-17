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

        foreach ($users as $user) {
            $products = Product::factory()
                ->count(25)
                ->for($user)
                ->create();
            $products[0]->tags = ['Apple'];
            $products[1]->tags = ['Banana'];
            $products[2]->tags = ['Orange'];
            $products[3]->tags = ['Apple', 'Banana'];
            $products[4]->tags = ['Apple', 'Orange'];
            $products[5]->tags = ['Banana', 'Orange'];
            $products[6]->tags = ['Apple', 'Banana', 'Orange'];
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
                    return [
                        'id' => $tag->id,
                        'label' => $tag->label,
                    ];
                })->all(),
                'image_url' => $product->image_url,
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
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $this->expected_data->take(12)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['page' => 2]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson([
                'data' => $this->expected_data->slice(12, 12)->values()->all(),
            ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['page' => 3]));
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => $this->expected_data->slice(24)->values()->all()
            ]);

        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['page' => 4]));
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
            ->getJson(route('product.index', ['page' => 0]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $this->expected_data->take(12)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['page' => -5]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $this->expected_data->take(12)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['page' => 2.5]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $this->expected_data->take(12)->all()]);

        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['page' => 'test']));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $this->expected_data->take(12)->all()]);
    }

    /**
     * @test
     */
    public function should_return_products_filtered_by_tags()
    {
        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['tag' => [1]]));
        $response->assertOk()->assertJsonCount(4, 'data');

        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['tag' => [1, 2]]));
        $response->assertOk()->assertJsonCount(2, 'data');

        // ignore page param if tag param provided
        $response = $this->actingAs($this->user)
            ->getJson(route('product.index', ['tag' => [2], 'page' => 2]));
        $response->assertOk()->assertJsonCount(4, 'data');
    }
}
