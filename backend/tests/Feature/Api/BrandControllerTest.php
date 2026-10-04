<?php

namespace Tests\Feature\Api;

use App\Models\Brand;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class BrandControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_returns_all_brands(): void
    {
        Brand::create([
            'name' => 'Apple',
            'slug' => 'apple',
            'status' => true,
        ]);
        Brand::create([
            'name' => 'Samsung',
            'slug' => 'samsung',
            'status' => false,
        ]);

        $response = $this->getJson('/api/brands');

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['slug' => 'apple'])
            ->assertJsonFragment(['slug' => 'samsung']);
    }

    public function test_valid_payload_creates_brand_and_returns_201(): void
    {
        $response = $this->postJson('/api/brands', [
            'name' => 'Apple',
            'slug' => 'apple',
            'status' => true,
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.name', 'Apple')
            ->assertJsonPath('data.slug', 'apple')
            ->assertJsonPath('data.status', true);

        $this->assertDatabaseHas('brands', [
            'name' => 'Apple',
            'slug' => 'apple',
            'status' => true,
        ]);
    }

    public function test_returns_422_when_slug_already_exists(): void
    {
        Brand::create([
            'name' => 'Apple',
            'slug' => 'apple',
            'status' => true,
        ]);

        $response = $this->postJson('/api/brands', [
            'name' => 'Apple Viet Nam',
            'slug' => 'apple',
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonPath('errors.slug.0', 'The slug has already been taken.');

        $this->assertDatabaseMissing('brands', [
            'name' => 'Apple Viet Nam',
        ]);
    }

    public function test_valid_payload_updates_brand(): void
    {
        $brand = Brand::create([
            'name' => 'Apple',
            'slug' => 'apple',
            'status' => true,
        ]);

        $response = $this->patchJson("/api/brands/{$brand->id}", [
            'name' => 'Apple Viet Nam',
            'status' => false,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.name', 'Apple Viet Nam')
            ->assertJsonPath('data.status', false);

        $this->assertDatabaseHas('brands', [
            'id' => $brand->id,
            'name' => 'Apple Viet Nam',
            'status' => false,
        ]);
    }

    public function test_deletes_brand_and_returns_204(): void
    {
        $brand = Brand::create([
            'name' => 'Apple',
            'slug' => 'apple',
            'status' => true,
        ]);

        $response = $this->deleteJson("/api/brands/{$brand->id}");

        $response->assertNoContent();
        $this->assertModelMissing($brand);
    }
}
