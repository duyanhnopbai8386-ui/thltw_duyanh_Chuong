<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'link' => $this->link,
            'position' => $this->position,
            'sort_order' => (int) $this->sort_order,
            'parent_id' => $this->parent_id,
            'status' => (bool) $this->status,
            'parent' => $this->whenLoaded('parent', function () {
                return [
                    'id' => $this->parent->id,
                    'name' => $this->parent->name,
                ];
            }),
            'children' => MenuResource::collection($this->whenLoaded('children')),
            'created_at' => $this->created_at?->format('d/m/Y H:i'),
        ];
    }
}
