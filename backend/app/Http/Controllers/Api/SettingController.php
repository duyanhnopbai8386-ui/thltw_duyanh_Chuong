<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index() {
        $settings = Setting::pluck('value', 'key'); // Trả về dạng key-value object
        return response()->json($settings);
    }

    public function update(Request $request) {
        $data = $request->all();
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return response()->json(['message' => 'Cập nhật cấu hình thành công!']);
    }
}