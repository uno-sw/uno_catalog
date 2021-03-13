<?php

namespace Tests\Feature\Link;

use App\Models\Link;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LinkCreateApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void {
        parent::setUp();

        $this->users = User::factory()->count(2)->create();
        $this->user = $this->users[0];
        $this->product = Product::factory()->for($this->user)->create();
    }

    /**
     * @test
     */
    public function should_create_link()
    {
        $data = [
            'title' => 'Test',
            'url' => 'https://example.com',
        ];

        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]), $data);
        $response->assertCreated();
        $this->assertNotNull($response['id']);
        $link = $this->product->links()->find($response['id']);
        $this->assertNotNull($link);
        $this->assertEquals($data['title'], $link->title);
        $this->assertEquals($data['url'], $link->url);
    }

    /**
     * @test
     */
    public function should_not_create_link_when_not_logged_in()
    {
        $linkCount = Link::count();
        $response = $this->postJson(
            route('link.create', ['product' => $this->product]),
            [
                'title' => 'Test',
                'url' => 'https://example.com',
            ]);
        $response->assertUnauthorized();
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_for_product_current_user_does_not_own()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->users[1])
            ->postJson(route('link.create', ['product' => $this->product]), [
                'title' => 'Test',
                'url' => 'https://example.com',
            ]);
        $response->assertForbidden();
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_for_not_found_product()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->users[1])
            ->postJson(route('link.create', ['product' => 5]), [
                'title' => 'Test',
                'url' => 'https://example.com',
            ]);
        $response->assertNotFound();
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_when_no_data_provided()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]));
        $response->assertStatus(422);
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_when_title_not_provided()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]), [
                'url' => 'https://example.com',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_when_url_not_provided()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]), [
                'title' => 'Test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_with_title_of_21_or_more_characters()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]), [
                'title' => 'Lorem ipsum dolor sit',
                'url' => 'https://example.com',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_with_invalid_url()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]), [
                'title' => 'Test',
                'url' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_with_url_of_101_or_more_characters()
    {
        $linkCount = Link::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]), [
                'title' => 'Test',
                'url' => 'https://example.com/lorem/ipsum/dolor/sit/amet/consectetur/' .
                         'adipisicing/elit/sed/do/eiusmod/tempor/incididunt',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($linkCount, Link::count());
    }

    /**
     * @test
     */
    public function should_not_create_link_when_product_already_has_10_links()
    {
        Link::factory()->count(10)->for($this->product)->create();

        $linkCount = Link::count();
        $response = $this->actingAs($this->user)
            ->postJson(route('link.create', ['product' => $this->product]), [
                'title' => 'Test',
                'url' => 'test',
            ]);
        $response->assertStatus(422);
        $this->assertEquals($linkCount, Link::count());
    }
}
