<?php

namespace Tests\Feature\Tag;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class TagDeleteApiTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->users = User::factory()->count(2)->create();
        $this->user = $this->users[0];
        $this->tag = Tag::factory()->for($this->user)->create();
        $this->tagId = $this->tag->id;
    }

    /**
     * @test
     */
    public function should_delete_tag()
    {
        $response = $this->actingAs($this->user)
            ->deleteJson(route('tag.delete', ['tag' => $this->tag]));

        $response->assertOk()
            ->assertJson(['id' => $this->tagId]);
        $this->assertNull(Tag::find($this->tagId));
    }

    /**
     * @test
     */
    public function should_not_delete_tag_when_not_logged_in()
    {
        $response =
            $this->deleteJson(route('tag.delete', ['tag' => $this->tag]));

        $response->assertUnauthorized();
        $this->assertNotNull(Tag::find($this->tagId));
    }

    /**
     * @test
     */
    public function should_not_delete_tag_current_user_does_not_own()
    {
        $response = $this->actingAs($this->users[1])
            ->deleteJson(route('tag.delete', ['tag' => $this->tag]));

        $response->assertForbidden();
        $this->assertNotNull(Tag::find($this->tagId));
    }
}
