<?php

namespace Tests\Feature;

use App\Models\Link;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProuductLinkDeleteApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->users = User::factory()->count(2)->create();
        $this->user = $this->users[0];
        $this->product = Product::factory()->for($this->user)->create();
        $this->link = Link::factory()->for($this->product)->create();
        $this->linkId = $this->link->id;
    }

    /**
     * @test
     */
    public function should_delete_link()
    {
        $response = $this->actingAs($this->user)
            ->deleteJson(route('link.delete', ['link' => $this->link]));

        $response->assertOk()->assertJson(['id' => $this->linkId]);
        $this->assertNull(Link::find($this->linkId));
    }

    /**
     * @test
     */
    public function should_not_delete_link_when_not_logged_in()
    {
        $response = $this->deleteJson(route('link.delete', ['link' => $this->link]));

        $response->assertUnauthorized();
        $this->assertNotNull(Link::find($this->linkId));
    }

    /**
     * @test
     */
    public function should_not_delete_link_current_user_does_not_own()
    {
        $response = $this->actingAs($this->users[1])
            ->deleteJson(route('link.delete', ['link' => $this->link]));

        $response->assertForbidden();
        $this->assertNotNull(Link::find($this->linkId));
    }
}
