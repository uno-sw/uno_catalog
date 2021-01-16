<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class LoginApiTest extends TestCase
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
    public function should_authenticate_and_return_user()
    {
        $response = $this->json('POST', route('login'), [
            'email' => $this->user->email,
            'password' => 'password',
            'remember' => false,
        ]);

        $response
            ->assertStatus(200)
            ->assertJson(['name' => $this->user->name]);

        $this->assertAuthenticatedAs($this->user);
    }
}
