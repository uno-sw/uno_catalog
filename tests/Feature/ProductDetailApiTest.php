<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductDetailApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void {
        parent::setUp();

        $this->users = User::factory()->count(2)->create();

        Product::factory()
            ->for($this->users[0])
            ->hasTags(3)
            ->hasLinks(3)
            ->create();

        $this->user = $this->users[0];
        $this->product = $this->user->products()->first();
    }

    /**
     * @test
     */
    public function should_return_product_detail()
    {
        $response = $this->actingAs($this->user)
            ->getJson(route('product.show', ['product' => $this->product]));

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'price' => $this->product->price,
                    'note' => $this->product->note,
                    'tags' => $this->product->tags->map(function ($tag) {
                        return ['label' => $tag->label];
                    })->all(),
                    'links' => $this->product->links->map(function ($link) {
                        return ['title' => $link->title, 'url' => $link->url];
                    })->all(),
                ],
            ]);
    }

    /**
     * @test
     */
    public function should_not_return_product_detail_when_not_logged_in()
    {
        $response = $this->getJson(route('product.show', ['product' => $this->product]));
        $response->assertUnauthorized();
    }

    /**
     * @test
     */
    public function should_not_return_detail_of_product_current_user_does_not_have()
    {
        $response = $this->actingAs($this->users[1])
            ->getJson(route('product.show', ['product' => $this->product]));
        $response->assertForbidden();
    }
}
