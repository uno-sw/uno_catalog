<?php

namespace App\Policies;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Log;

class TagPolicy
{
    use HandlesAuthorization;

    public function delete(User $user, Tag $tag)
    {
        return $user->id === $tag->user->id;
    }
}
