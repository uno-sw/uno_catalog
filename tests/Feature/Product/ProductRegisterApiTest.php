<?php

namespace Tests\Feature\Product;

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
        $response->assertUnauthorized();
        $this->assertEquals($productCount, Product::count());
    }

    /**
     * @test
     */
    public function should_register_product()
    {
        $name = 'Test';

        $response = $this->actingAs($this->user)
            ->postJson(route('product.register'), ['name' => $name]);

        $response->assertCreated();
        $this->assertNotNull($response['id']);
        $product = $this->user->products()->find($response['id']);
        $this->assertNotNull($product);
        $this->assertEquals($name, $product->name);
    }

    /**
     * @test
     */
    public function should_not_register_product_when_name_not_provided()
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
}
