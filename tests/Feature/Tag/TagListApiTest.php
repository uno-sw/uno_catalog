<?php

namespace Tests\Feature\Tag;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TagListApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $tags1 = ['Banana', 'Apple', 'Orange'];

        $this->users = User::factory()->count(2)->create();
        $this->user = $this->users[0];

        $products = Product::factory()->count(7)->for($this->users[0])->create();
        $products[0]->tags = [$tags1[0]];
        $products[1]->tags = [$tags1[1]];
        $products[2]->tags = [$tags1[2]];
        $products[3]->tags = [$tags1[0], $tags1[1]];
        $products[4]->tags = [$tags1[0], $tags1[2]];
        $products[5]->tags = [$tags1[1], $tags1[2]];
        $products[6]->tags = [$tags1[0], $tags1[1], $tags1[2]];

        $this->expected_data = $this->user
            ->tags()
            ->orderBy('label', 'asc')
            ->get()
            ->map(function ($tag) {
                return [
                    'id' => $tag->id,
                    'label' => $tag->label,
                    'product_count' => $tag->products()->count(),
                ];
            })
            ->all();
    }

    /**
     * @test
     */
    public function should_respond_with_unauthorized_when_not_logged_in()
    {
        $response = $this->getJson(route('tag.index'));

        $response->assertUnauthorized()
            ->assertJsonMissing(['data' => $this->expected_data]);
    }

    /**
     * @test
     */
    public function should_return_correct_JSON()
    {
        $response = $this->actingAs($this->user)->getJson(route('tag.index'));

        $response->assertOk()
            ->assertJson(['data' => $this->expected_data]);
    }
}
