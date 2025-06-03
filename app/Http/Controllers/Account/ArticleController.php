<?php

namespace App\Http\Controllers\Account;

use App\Models\User;
use App\Models\Articles;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ArticleReport;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class ArticleController extends Controller
{
    public function index()
    {
        if (auth()->user()->hasPermissionTo('articles.index.full')) {
            $articles = Articles::when(request()->q, function ($articles) {
                $articles = $articles->where('title', 'like', '%' . request()->q . '%');
            })->orderBy('id')->paginate(8);

            $articles->load('user');
        } else {
            $articles = Articles::when(request()->q, function ($articles) {
                $articles = $articles->where('title', 'like', '%' . request()->q . '%');
            })
                ->where('user_id', auth()->user()->id)
                ->latest()
                ->paginate(10);
        }

        $articles->appends(['q' => request()->q]);

        return inertia('Account/Articles/Articles', [
            'articles' => $articles,
            'app_url' => config('app.url')
        ]);
    }

    public function create()
    {
        $user = auth()->user();
        return inertia('Account/Articles/Create', [
            'user' => $user
        ]);
    }

    public function store(Request $request)
    {
        if ($request->image != null) {
            $this->validate($request, [
                'user_id' => 'required',
                'title' => 'required',
                'content' => 'required',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'status' => 'required'
            ]);

            $image = $request->file('image');
            $image->storeAs('public/image/articles/', $image->hashName());

            Articles::create([
                'user_id' => $request->user_id,
                'title' => $request->title,
                'slug' => Str::slug($request->title, '-'),
                'content' => $request->content,
                'image' => $image->hashName(),
                'status' => $request->status
            ]);
        } else {
            $this->validate($request, [
                'user_id' => 'required',
                'title' => 'required',
                'content' => 'required',
                'status' => 'required'
            ]);
            Articles::create([
                'user_id' => $request->user_id,
                'title' => $request->title,
                'slug' => Str::slug($request->title, '-'),
                'content' => $request->content,
                'image' => 'articleFactory.png',
                'status' => $request->status
            ]);
        }

        return redirect()->route('account.articles.index');
    }

    public function edit($id)
    {
        $user = auth()->user();
        $article = Articles::find($id);
        return inertia('Account/Articles/Edit', [
            'user' => $user,
            'article' => $article
        ]);
    }

    public function update(Request $request, Articles $article)
    {
        if ($request->image == null) {
            $request->validate([
                'title' => 'required',
                'content' => 'required',
                'status' => 'required'
            ]);
        } else {
            $request->validate([
                'title' => 'required',
                'image' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'content' => 'required',
                'status' => 'required'
            ]);
        }

        if ($request->file('image')) {

            if (!Str::contains($article->image, 'articleFactory.png')) {
                Storage::disk('local')->delete('public/image/articles/' . basename($article->image));
            }

            $image = $request->file('image');
            $image->storeAs('public/image/articles/', $image->hashName());

            $article->update([
                'title' => $request->title,
                'slug' => Str::slug($request->title, '-'),
                'content' => $request->content,
                'status' => $request->status,
                'image' => $image->hashName(),
            ]);
        } else {
            $article->update([
                'title' => $request->title,
                'slug' => Str::slug($request->title, '-'),
                'content' => $request->content,
                'status' => $request->status,
                'image' => 'articleFactory.png',
            ]);
        }

        return redirect()->route('account.articles.index');
    }

    public function destroy($id)
    {
        $article = Articles::find($id);

        if (!Str::contains($article->image, 'articleFactory.png')) {
            Storage::disk('local')->delete('public/image/articles/' . basename($article->image));
        }

        $article->delete();
        return redirect()->route('account.articles.index');
    }

    // Article Reports Management Methods
    public function reportsIndex()
    {
        $reports = ArticleReport::with(['article', 'user'])
            ->when(request()->status, function ($query) {
                return $query->where('status', request()->status);
            })
            ->when(request()->reason, function ($query) {
                return $query->where('reason', request()->reason);
            })
            ->when(request()->q, function ($query) {
                return $query->whereHas('article', function ($articleQuery) {
                    $articleQuery->where('title', 'like', '%' . request()->q . '%');
                });
            })
            ->latest()
            ->paginate(15);

        $reports->appends(request()->all());

        $statusCounts = [
            'pending' => ArticleReport::where('status', 'pending')->count(),
            'reviewed' => ArticleReport::where('status', 'reviewed')->count(),
            'resolved' => ArticleReport::where('status', 'resolved')->count(),
            'dismissed' => ArticleReport::where('status', 'dismissed')->count(),
        ];

        return inertia('Account/Articles/Reports/Index', [
            'reports' => $reports,
            'statusCounts' => $statusCounts,
            'filters' => [
                'status' => request()->status,
                'reason' => request()->reason,
                'q' => request()->q
            ]
        ]);
    }

    public function reportShow($id)
    {
        $report = ArticleReport::with(['article.user', 'user'])->findOrFail($id);

        return inertia('Account/Articles/Reports/Show', [
            'report' => $report
        ]);
    }

    public function updateReportStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,reviewed,resolved,dismissed',
            'admin_notes' => 'nullable|string|max:1000'
        ]);

        $report = ArticleReport::findOrFail($id);

        $report->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report status updated successfully.'
        ]);
    }

    public function destroyReport($id)
    {
        $report = ArticleReport::findOrFail($id);
        $report->delete();

        return redirect()->route('account.article-reports.index')
            ->with('success', 'Report deleted successfully.');
    }

    public function bulkUpdateReports(Request $request)
    {
        $request->validate([
            'report_ids' => 'required|array',
            'report_ids.*' => 'exists:article_reports,id',
            'status' => 'required|in:pending,reviewed,resolved,dismissed'
        ]);

        ArticleReport::whereIn('id', $request->report_ids)
            ->update([
                'status' => $request->status,
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Reports updated successfully.'
        ]);
    }
}
