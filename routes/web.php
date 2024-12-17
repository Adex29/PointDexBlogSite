<?php
use App\Models\Post;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AuthenticatedUserController;

Route::get('/', function () {
    return Inertia::render('UserHome', [
        'canRegister' => Route::has('register'),
    ]);
});

// Manage User Dashboard
Route::get('/manageUser', function () {
    return Inertia::render('AdminDashboard', [
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('auth')->name('manageUser');

// Manage Post Dashboard
Route::get('/managePost', function () {
    return Inertia::render('PostDashboard', [
        'userId' => Auth::id(),
    ]);
})->middleware('auth')->name('managePost');

Route::get('/blog/{id}', function ($id) {
    return Inertia::render('BlogPage', [
        'id' => $id,
        'userid' => Auth::id(),
    ]);
});

Route::get('/home', function () {
    return Inertia::render('UserHome');
})->name('user.home');

// User and Post Resource Routes
Route::middleware('auth')->group(function () {
    Route::resource('users', UserController::class);
    Route::post('likes', [LikeController::class, 'store'])->name('likes.store');
    Route::post('comments', [CommentController::class, 'store'])->name('comments.store');
});


Route::get('comments/{comment}', [CommentController::class, 'show'])->name('comments.show');
Route::get('likes', [LikeController::class, 'index'])->name('likes.index');
Route::get('/getAuthenticatedUser', [AuthenticatedUserController::class, 'getAuthenticatedUser']);

Route::resource('posts', PostController::class);
// Route::resource('likes', LikeController::class);
// Route::resource('comments', CommentController::class);

// Dashboard Route
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Profile Routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Authentication Routes
require __DIR__.'/auth.php';

require __DIR__.'/api.php';
