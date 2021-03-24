<?php

namespace Tests\Feature\Product;

use App\Models\Product;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Collection;
use Tests\TestCase;

class ProductListApiTest extends TestCase
{
    use RefreshDatabase;

    private function productsToJSON(Collection $products): Collection
    {
        return $products->map(function ($product) {
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
        $users = User::factory()->count(2)->create();
        $user = $users[0];

        $tags = Tag::factory()->count(3)->for($user)->create();

        foreach ($users as $user) {
            Product::factory()
                ->count(25)
                ->for($user)
                ->hasAttached($tags)
                ->create();
        }

        $products = $user->products()
            ->oldest()
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products);

        $response = $this->actingAs($user)
            ->getJson(route('product.index'));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $expected_data->take(12)->all()]);

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['page' => 2]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson([
                'data' => $expected_data->slice(12, 12)->values()->all(),
            ]);

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['page' => 3]));
        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJson([
                'data' => $expected_data->slice(24)->values()->all()
            ]);

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['page' => 4]));
        $response->assertOk()
            ->assertJsonCount(0, 'data')
            ->assertJson(['data' => []]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_oldest_created()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->oldest()
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'created_at', 'order' => 'asc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_latest_created()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->latest()
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'created_at', 'order' => 'desc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_oldest_update()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->oldest('updated_at')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'updated_at', 'order' => 'asc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_latest_updated()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->latest('updated_at')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'updated_at', 'order' => 'desc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_highest_price()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->orderBy('price', 'asc')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'price', 'order' => 'asc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_lowest_price()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->orderBy('price', 'desc')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'price', 'order' => 'desc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_title_asc()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->orderBy('title', 'asc')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'title', 'order' => 'asc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_sorted_by_title_desc()
    {
        $user = User::factory()->hasProducts(5)->create();

        $products = $user->products()
            ->orderBy('title', 'desc')
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->get();
        $expected_data = $this->productsToJSON($products)->all();
        $response = $this->actingAs($user)
            ->getJson(route('product.index',
                ['sort' => 'title', 'order' => 'desc']));
        $response->assertOk()
            ->assertJsonCount(5, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_first_page_when_invalid_page_requested()
    {
        $user = User::factory()
            ->hasProducts(25)
            ->create();

        $products = $user->products()
            ->oldest()
            ->orderBy('id', 'asc')
            ->with(['tags' => function ($query) {
                $query->withPivot(['id'])->orderBy('pivot_id');
            }])
            ->limit(12)
            ->get();
        $expected_data = $this->productsToJSON($products)->all();

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['page' => 0]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $expected_data]);

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['page' => -5]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $expected_data]);

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['page' => 2.5]));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $expected_data]);

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['page' => 'test']));
        $response->assertOk()
            ->assertJsonCount(12, 'data')
            ->assertJson(['data' => $expected_data]);
    }

    /**
     * @test
     */
    public function should_return_products_filtered_by_tags()
    {
        $user = User::factory()->create();
        $products = Product::factory()->count(25)->for($user)->create();
        $products[0]->tags = ['Apple'];
        $products[1]->tags = ['Banana'];
        $products[2]->tags = ['Orange'];
        $products[3]->tags = ['Apple', 'Banana'];
        $products[4]->tags = ['Apple', 'Orange'];
        $products[5]->tags = ['Banana', 'Orange'];
        $products[6]->tags = ['Apple', 'Banana', 'Orange'];

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['tags' => [1]]));
        $response->assertOk()->assertJsonCount(4, 'data');

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['tags' => [1, 2]]));
        $response->assertOk()->assertJsonCount(2, 'data');

        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['tags' => [100]]));
        $response->assertOk()->assertJsonCount(0, 'data');

        // ingore invalid tag param
        $response = $this->actingAs($user)
            ->getJson(route('product.index', ['tags' => 'test']));
        $response->assertOk()->assertJsonCount(12, 'data');
    }
}
