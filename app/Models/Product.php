<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'price', 'note', 'image_url'];

    protected $casts = [
        'user_id' => 'integer',
        'price' => 'integer',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user() {
        return $this->belongsTo(User::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function links()
    {
        return $this->hasMany(Link::class);
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function getTagLabelsAttribute()
    {
        return $this->tags->map(fn($tag) => $tag->label)->all();
    }

    public function setTagsAttribute(array $tags): void
    {
        if ($tags) {
            $tagIds = array_map(function ($tag) {
                return $this->user
                    ->tags()
                    ->firstOrCreate(['label' => $tag])
                    ->id;
            }, $tags);
            $this->tags()->sync($tagIds);
        } else {
            $this->tags()->sync([]);
        }
    }
}
