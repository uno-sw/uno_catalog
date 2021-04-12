<?php

namespace App\Http\Resources;

use App\Http\Resources\TagResource;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'image_url' => $this->image_url,
            'links' => LinkResource::collection($this->whenLoaded('links')),
            'note' => $this->note,
        ];
    }
}
