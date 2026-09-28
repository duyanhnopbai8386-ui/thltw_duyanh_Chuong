<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_returns_all_products(): void
    {
        DB::table('products')->insert([
            [
                'name' => 'Keyboard',
                'price' => 750000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mouse',
                'price' => 350000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        $response = $this->getJson('/api/products');

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonFragment(['name' => 'Keyboard'])
            ->assertJsonFragment(['name' => 'Mouse']);
    }

    public function test_valid_category_creates_product(): void
    {
        $categoryId = DB::table('categories')->insertGetId([
            'name' => 'Laptop',
            'slug' => 'laptop',
            'status' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->postJson('/api/products', [
            'category_id' => $categoryId,
            'name' => 'MacBook Air',
            'price' => 28990000,
            'description' => 'MacBook dung chip Apple',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.category_id', $categoryId)
            ->assertJsonPath('data.name', 'MacBook Air');

        $this->assertDatabaseHas('products', [
            'category_id' => $categoryId,
            'name' => 'MacBook Air',
        ]);
    }

    public function test_returns_422_when_category_does_not_exist(): void
    {
        $response = $this->postJson('/api/products', [
            'category_id' => 999,
            'name' => 'MacBook Air',
            'price' => 28990000,
        ]);

        $response
            ->assertUnprocessable()
            ->assertJsonPath('errors.category_id.0', 'The selected category id is invalid.');

        $this->assertDatabaseMissing('products', [
            'name' => 'MacBook Air',
        ]);
    }

    public function test_valid_payload_updates_product(): void
    {
        $productId = DB::table('products')->insertGetId([
            'name' => 'MacBook Air',
            'price' => 28990000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->patchJson("/api/products/{$productId}", [
            'name' => 'MacBook Air M4',
            'price' => 30990000,
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.name', 'MacBook Air M4')
            ->assertJsonPath('data.price', '30990000.00');

        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'name' => 'MacBook Air M4',
            'price' => 30990000,
        ]);
    }

    public function test_deletes_product_and_returns_204(): void
    {
        $productId = DB::table('products')->insertGetId([
            'name' => 'MacBook Air',
            'price' => 28990000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->deleteJson("/api/products/{$productId}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }
}
