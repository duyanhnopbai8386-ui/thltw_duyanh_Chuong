<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->get();
        return response()->json([
            'status' => true,
            'data' => $contacts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'title' => 'nullable|string|max:255',
            'content' => 'required|string|min:5',
        ], [
            'name.required' => 'Vui lòng nhập họ và tên của bạn!',
            'email.required' => 'Vui lòng nhập địa chỉ email!',
            'content.required' => 'Vui lòng nhập nội dung liên hệ!',
        ]);

        $contact = Contact::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Cảm ơn bạn đã gửi liên hệ! Chúng tôi sẽ phản hồi sớm nhất.',
            'data' => $contact
        ], 201);
    }

    public function toggleStatus($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->status = !$contact->status;
        $contact->save();

        return response()->json([
            'status' => true,
            'message' => $contact->status ? 'Đã đánh dấu đã xử lý!' : 'Đã chuyển thành chưa xử lý!',
            'data' => $contact
        ]);
    }

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return response()->json([
            'status' => true,
            'message' => 'Đã xóa liên hệ thành công!'
        ]);
    }
}
