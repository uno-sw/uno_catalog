<?php

namespace Tests\Feature\Product;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductEditApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->users = User::factory()->count(2)->create();
        $this->user = $this->users[0];

        $this->product = $this->user->products()->create([
            'name' => 'Test',
            'price' => 1980,
            'note' => 'Test',
            'image_url' => 'https://example.com/test/image.png',
        ]);
        $this->product->tags = ['Apple', 'Banana', 'Orange'];
    }

    /**
     * @test
     */
    public function should_not_edit_product_when_not_logged_in()
    {
        $name = $this->product->name;
        $response = $this->putJson(
            route('product.edit', ['product' => $this->product]),
            ['name' => 'Foobar']);
        $response->assertUnauthorized();
        $this->assertEquals($name, Product::first()->name);
    }

    /**
     * @test
     */
    public function should_not_edit_product_current_user_does_not_own()
    {
        $name = $this->product->name;
        $response = $this->actingAs($this->users[1])
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
            ]);
        $response->assertForbidden();
        $this->assertEquals($name, Product::first()->name);
    }

    /**
     * @test
     */
    public function should_not_edit_product_when_not_found()
    {
        $response = $this->actingAs($this->user)
            ->putJson(
                route('product.edit', ['product' => 5]), ['name' => 'Foobar']);
        $response->assertNotFound();
    }

    /**
     * @test
     */
    public function should_edit_product_with_max_parameters()
    {
        $data = [
            'name' => 'Foobar',
            'price' => 7678,
            'note' => 'Foobar',
            'tags' => ['Test'],
            'image_url' => 'https://example.com/test/image.jpg?query#section',
        ];

        $response = $this->actingAs($this->user)
            ->putJson(
                route('product.edit', ['product' => $this->product]), $data);

        $response->assertOk();
        $this->assertNotNull($response['id']);
        $product = $this->user->products()->find($response['id']);
        $this->assertNotNull($product);
        $this->assertEquals($data['name'], $product->name);
        $this->assertEquals($data['price'], $product->price);
        $this->assertEquals($data['note'], $product->note);
        $this->assertEquals($data['image_url'], $product->image_url);
        $this->assertEquals($data['tags'], $product->tagLabels);
    }

    /**
     * @test
     */
    public function should_edit_product_with_min_parameters()
    {
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar'
            ]);

        $response->assertOk();
        $this->assertNotNull($response['id']);
        $product = $this->user->products()->find($response['id']);
        $this->assertNotNull($product);
        $this->assertEquals('Foobar', $product->name);
        $this->assertEquals('', $product->price);
        $this->assertEquals('', $product->note);
        $this->assertEquals('', $product->image_url);
        $this->assertEquals([], $product->tagLabels);
    }

    /**
     * @test
     */
    public function should_edit_product_with_valid_image_url()
    {
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Test',
                'image_url' => 'https://example.com/test/image.jpeg?query#section',
            ]);
        $response->assertOk();

        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Test',
                'image_url' => 'https://example.com/test/image.jpg?query#section',
            ]);
        $response->assertOk();

        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Test',
                'image_url' => 'https://example.com/test/image.png?query#section',
            ]);
        $response->assertOk();
    }

    /**
     * @test
     */
    public function should_not_edit_product_with_empty_data()
    {
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]));
        $response->assertStatus(422);
    }

    /**
     * @test
     */
    public function should_not_edit_product_when_name_not_provided()
    {
        $name = $this->product->name;
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'price' => 7678,
                'note' => 'Foobar',
                'tags' => ['Test'],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($name, Product::first()->name);
    }

    /**
     * @test
     */
    public function should_not_edit_product_when_name_is_not_string()
    {
        $name = $this->product->name;
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 123,
            ]);
        $response->assertStatus(422);
        $this->assertEquals($name, Product::first()->name);
    }

    /**
     * @test
     */
    public function should_not_edit_product_with_name_of_more_than_100_characters()
    {
        $name = $this->product->name;
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Lorem ipsum dolor sit amet, consectetur ' .
                          'adipisicing elit, sed do eiusmod tempor ' .
                          'incididunt ut labore et',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($name, Product::first()->name);
    }

    /**
     * @test
     */
    public function should_not_edit_product_when_price_is_not_integer()
    {
        $price = $this->product->price;
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
                'price' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($price, Product::first()->price);

        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
                'price' => '3.1492653',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($price, Product::first()->price);
    }

    /**
     * @test
     */
    public function should_not_edit_product_when_note_is_not_string()
    {
        $note = $this->product->note;
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
                'note' => 123,
            ]);
        $response->assertStatus(422);
        $this->assertEquals($note, Product::first()->note);
    }

    /**
     * @test
     */
    public function should_not_edit_product_with_invalid_tags()
    {
        $tagLabels = $this->product->tagLabels;
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
                'tags' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($tagLabels, Product::first()->tagLabels);

        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
                'tags' => [1, 2, 3],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($tagLabels, Product::first()->tagLabels);

        // more than 10 tags
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
                'tags' => ['a', 'b', 'c', 'd', 'e',
                           'f', 'g', 'h', 'i', 'j', 'k'],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($tagLabels, Product::first()->tagLabels);

        // contains tag of more than 20 characters
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Foobar',
                'tags' => ['test', 'Lorem ipsum dolor sit'],
            ]);
        $response->assertStatus(422);
        $this->assertEquals($tagLabels, Product::first()->tagLabels);
    }

    /**
     * @test
     */
    public function should_not_edit_product_with_invalid_image_url()
    {
        $image_url = $this->product->image_url;

        // invalid URL
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Test',
                'image_url' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($image_url, Product::first()->image_url);

        // URL not include file name
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Test',
                'image_url' => 'http://example.com',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($image_url, Product::first()->image_url);

        // file extension is neither .jpg, .jpeg nor .png
        $response = $this->actingAs($this->user)
            ->putJson(route('product.edit', ['product' => $this->product]), [
                'name' => 'Test',
                'image_url' => 'http://example.com/example.gif',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($image_url, Product::first()->image_url);
    }
}
