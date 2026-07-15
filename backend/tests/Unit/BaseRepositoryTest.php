<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Repositories\Eloquent\BaseRepository;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BaseRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();
        // Since User is our default model, we can test BaseRepository with it
        $this->repository = new BaseRepository(new User());
    }

    public function test_can_create_and_find_record()
    {
        $userData = [
            'name' => 'Test Detective Lwin',
            'email' => 'detective@ucsm.edu.mm',
            'password' => bcrypt('password123'),
        ];

        $user = $this->repository->create($userData);

        $this->assertDatabaseHas('users', [
            'email' => 'detective@ucsm.edu.mm'
        ]);

        $found = $this->repository->find($user->id);
        $this->assertEquals($user->name, $found->name);
    }
}
