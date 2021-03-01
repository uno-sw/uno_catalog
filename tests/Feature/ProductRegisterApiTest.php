<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductRegisterApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    /**
     * @test
     */
    public function should_not_register_product_when_not_logged_in()
    {
        $productCount = Product::count();
        $response = $this->postJson(route('product.register'), [
            'name' => 'Test',
        ]);
        $response->assertStatus(401);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_register_product()
    {
        $data = [
            'name' => 'Test',
            'price' => 1980,
            'note' => 'Test',
            'tags' => ['Apple', 'Banana', 'Orange'],
            'links' => [
                ['title' => 'Test', 'url' => 'https://example.com'],
                ['title' => 'Google', 'url' => 'https://www.google.co.jp'],
            ],
        ];

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), $data);

        $response->assertStatus(201);
        $this->assertNotNull($response['id']);
        $product = $this->user->products()->find($response['id']);
        $this->assertNotNull($product);
        $this->assertEquals($data['name'], $product->name);
        $this->assertEquals($data['price'], $product->price);
        $this->assertEquals($data['note'], $product->note);
        $this->assertEquals(collect($data['tags']), $product->tagLabels);
        $this->assertEquals(count($data['links']), $product->links()->count());
    }

    /**
     * @test
     */
    public function should_not_register_product_with_empty_data()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'));
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_not_register_product_when_name_not_provided()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'price' => 1980,
                'note' => 'Test',
                'tags' => ['Apple', 'Banana', 'Orange'],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_not_register_product_when_name_is_not_string()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), ['name' => 123]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_not_register_product_with_name_of_101_or_more_characters()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Lorem ipsum dolor sit amet, consectetur ' .
                          'adipisicing elit, sed do eiusmod tempor ' .
                          'incididunt ut labore et',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_not_register_product_when_price_is_not_integer()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'price' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'price' => '3.1492653',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_not_register_product_when_note_is_not_string()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'note' => 123,
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_not_register_product_with_invalid_tags()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'tags' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'tags' => [1, 2, 3],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'tags' => ['test', 'Lorem ipsum dolor sit'],  // 20文字を超えるタグを含んでいる
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_not_register_product_with_invalid_links()
    {
        $productCount = Product::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'links' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'links' => [['url' => 'https://example.com']],  // titleが無い
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'links' => [['title' => 'Test']],  // urlが無い
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'links' => [
                    [
                        'title' => 'Lorem ipsum dolor sit',  // titleが20文字を超えている
                        'url' => 'https://example.com',
                    ],
                ],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), [
                'name' => 'Test',
                'links' => [
                    ['title' => 'Test', 'url' => 'test'],  // URLが有効な形式でない
                ],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($productCount, Product::count());
    }
}
