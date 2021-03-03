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
            'id' => $this->resource->id,
            'name' => $this->resource->name,
            'price' => $this->resource->price,
            'tags' => TagResource::collection($this->whenLoaded('tags')),
        ];
    }
}
