<?php

namespace Tests\Feature\Product;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductDeleteApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->users = User::factory()->count(2)->create();
        $this->user = $this->users[0];
        $this->product = Product::factory()->for($this->user)->create();
        $this->productId = $this->product->id;
    }

    /**
     * @test
     */
    public function should_delete_product()
    {
        $response = $this->actingAs($this->user)
            ->deleteJson(route('product.delete', ['product' => $this->product]));

        $response->assertOk()
            ->assertJson(['id' => $this->productId]);
        $this->assertNull(Product::find($this->productId));
    }

    /**
     * @test
     */
    public function should_not_delete_product_when_not_logged_in()
    {
        $response = $this->deleteJson(
            route('product.delete', ['product' => $this->product]));

        $response->assertUnauthorized();
        $this->assertNotNull(Product::find($this->productId));
    }

    /**
     * @test
     */
    public function should_not_delete_product_current_user_does_not_own()
    {
        $response = $response = $this->actingAs($this->users[1])
            ->deleteJson(route('product.delete', ['product' => $this->product]));

        $response->assertForbidden();
        $this->assertNotNull(Product::find($this->productId));
    }
}
