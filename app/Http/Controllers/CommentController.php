<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'content' => 'required|string|max:255',
                'post_id' => 'required|exists:posts,id',
                'user_id' => 'required|exists:users,id',
            ], [
                'content.required' => 'Comment content is required.',
                'content.max' => 'Comment content must not exceed 255 characters.',
                'post_id.required' => 'Post ID is required.',
                'post_id.exists' => 'The specified post does not exist.',
                'user_id.required' => 'User ID is required.',
                'user_id.exists' => 'The specified user does not exist.',
            ]);

            DB::beginTransaction();

            $comment = Comment::create([
                'comment' => $request->content,
                'postid' => $request->post_id,
                'userid' => $request->user_id,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Comment created successfully!',
                'comment' => $comment,
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the comment. Please try again later.',
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {

            $comments = DB::table('comments')
                ->join('users', 'comments.userid', '=', 'users.id')
                ->where('comments.postid', $id)
                ->select('comments.*', 'users.name as author')
                ->orderBy('comments.created_at', 'desc')
                ->get();

            if ($comments->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No comments found for the specified post.',
                ], 404);
            } else {
                return response()->json([
                    'status' => 'success',
                    'comments' => $comments,
                ], 200);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred: ' . $e->getMessage()
            ], 500);
        }
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
