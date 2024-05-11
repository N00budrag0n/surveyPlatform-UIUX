<?php

namespace App\Http\Controllers\Account;

use App\Models\Survey;
use App\Models\Method;
use App\Models\Category;
use App\Models\SurveyHasCategories;
use App\Models\SurveyHasMethods;
use App\Models\SurveyQuestions;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SurveyController extends Controller
{
    public function index()
    {
        if (auth()->user()->hasPermissionTo('surveys.index.full')) {
            $surveys = Survey::when(request()->q, function ($surveys) {
                $surveys = $surveys->where('title', 'like', '%' . request()->q . '%');
            })->orderBy('id')->paginate(10);

            $surveys->load('user');
        } else {
            $surveys = Survey::when(request()->q, function ($surveys) {
                $surveys = $surveys->where('title', 'like', '%' . request()->q . '%');
            })
                ->where('user_id', auth()->user()->id)
                ->latest()
                ->paginate(10);
        }

        $surveys->appends(['q' => request()->q]);

        return inertia('Account/Surveys/Survey', [
            'surveys' => $surveys,
            'app_url' => config('app.url')
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        $methods = Method::all();
        $surveyQuestionsExample = SurveyQuestions::where('survey_id', 1)->get();

        return inertia('Account/Surveys/Create', [
            'categories' => $categories,
            'methods' => $methods,
            'surveyQuestionsExample' => $surveyQuestionsExample
        ]);
    }

    public function store(Request $request, SurveyHasCategories $surveyHasCategories, SurveyHasMethods $surveyHasMethods)
    {
        if ($request->image != null) {
            $this->validate($request, [
                'user_id'        => 'required',
                'title'          => 'required',
                'image'         => 'image|mimes:jpeg,jpg,png,svg|max:2048',
                'theme'          => 'required',
                'description'    => 'required',
                'survey_categories' => 'required',
                'survey_methods' => 'required',
                'general_access' => 'required',
                'survey_questions' => 'required',
                'url_website'    => 'required_without_all:embed_design,embed_prototype',
                'embed_design'   => 'required_without_all:url_website,embed_prototype',
                'embed_prototype'   => 'required_without_all:url_website,embed_design',
            ], [
                'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
            ]);
        } else {
            $this->validate($request, [
                'user_id'        => 'required',
                'title'          => 'required',
                'theme'          => 'required',
                'description'    => 'required',
                'survey_categories' => 'required',
                'survey_methods' => 'required',
                'general_access' => 'required',
                'survey_questions' => 'required',
                'url_website'    => 'required_without_all:embed_design,embed_prototype',
                'embed_design'   => 'required_without_all:url_website,embed_prototype',
                'embed_prototype'   => 'required_without_all:url_website,embed_design',
            ], [
                'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
            ]);
        }


        if ($request->file('image')) {
            $image = $request->file('image');
            $image->storeAs('public/image/surveys/', $image->hashName());

            $survey = Survey::create([
                'user_id'        => $request->user_id,
                'title'          => $request->title,
                'slug'          => Str::slug($request->title, '-'),
                'image'         => $image->hashName(),
                'theme'          => $request->theme,
                'description'    => $request->description,
                'url_website'    => $request->url_website,
                'embed_design'   => $request->embed_design,
                'embed_prototype'   => $request->embed_prototype,
                'status' => $request->general_access,
            ]);
        } else {
            $image = "surveyFactory.jpg";

            $survey = Survey::create([
                'user_id'        => $request->user_id,
                'title'          => $request->title,
                'slug'          => Str::slug($request->title, '-'),
                'image'         => $image,
                'theme'          => $request->theme,
                'description'    => $request->description,
                'url_website'    => $request->url_website,
                'embed_design'   => $request->embed_design,
                'embed_prototype'   => $request->embed_prototype,
                'status' => $request->general_access,
            ]);
        }

        SurveyQuestions::create([
            'survey_id' => $survey->id,
            'questions_data' => $request->survey_questions
        ]);

        if ($request->has('survey_categories')) {
            $surveyCategoriesData = $request->survey_categories;

            $surveyHasCategories->where('survey_id', $survey->id)->delete();

            foreach ($surveyCategoriesData as $category_id) {
                $surveyHasCategories->create(['category_id' => $category_id, 'survey_id' => $survey->id]);
            }
        }

        if ($request->has('survey_methods')) {
            $surveyMethodsData = $request->survey_methods;

            $surveyHasMethods->where('survey_id', $survey->id)->delete();

            foreach ($surveyMethodsData as $method_id) {
                $surveyHasMethods->create(['method_id' => $method_id, 'survey_id' => $survey->id]);
            }
        }

        return redirect()->route('account.surveys.index');
    }


    public function edit(Survey $survey)
    {
        $categories = Category::all();
        $methods = Method::all();
        $surveyCategories = SurveyHasCategories::where('survey_id', $survey->id)->get();
        $surveyMethods = SurveyHasMethods::where('survey_id', $survey->id)->get();
        $surveyQuestions = SurveyQuestions::where('survey_id', $survey->id)->get();

        return inertia('Account/Surveys/Edit', [
            'survey' => $survey,
            'categories' => $categories,
            'methods' => $methods,
            'surveyCategories' => $surveyCategories,
            'surveyMethods' => $surveyMethods,
            'surveyQuestions' => $surveyQuestions,
        ]);
    }

    public function update(Request $request, Survey $survey, SurveyHasCategories $surveyHasCategories, SurveyHasMethods $surveyHasMethods, SurveyQuestions $surveyQuestion)
    {
        if ($survey->id == 1 && $survey->user_id !== auth()->user()->id) {
            return abort(403, 'You do not have permission to update this survey.');
        }

        if ($request->file('image')) {
            $this->validate($request, [
                'user_id'        => 'required',
                'title'          => 'required',
                'image'         => 'image|mimes:jpeg,jpg,png,svg|max:2048',
                'theme'          => 'required',
                'description'    => 'required',
                'survey_questions' => 'required',
                'survey_visible' => 'required',
                'url_website'    => 'required_without_all:embed_design,embed_prototype',
                'embed_design'   => 'required_without_all:url_website,embed_prototype',
                'embed_prototype'   => 'required_without_all:url_website,embed_design',
            ], [
                'image.max' => 'The image may not be greater than 2 MB.',
                'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
            ]);
        } else {
            $this->validate(
                $request,
                [
                    'user_id'        => 'required',
                    'title'          => 'required',
                    'theme'          => 'required',
                    'description'    => 'required',
                    'survey_questions' => 'required',
                    'survey_visible' => 'required',
                    'url_website'    => 'required_without_all:embed_design,embed_prototype',
                    'embed_design'   => 'required_without_all:url_website,embed_prototype',
                    'embed_prototype'   => 'required_without_all:url_website,embed_design',
                ],
                [
                    'url_website.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                    'embed_design.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                    'embed_prototype.required_without_all' => 'At least one of URL Website, Embed Design, or Embed Prototype is required.',
                ]
            );
        }

        if ($request->file('image')) {
            Storage::disk('local')->delete('public/image/surveys/' . basename($survey->image));

            $image = $request->file('image');
            $image->storeAs('public/image/surveys/', $image->hashName());

            $survey->update([
                'image' => $image->hashName(),
                'name' => $request->name,
                'slug' => Str::slug($request->name, '-')
            ]);
        }

        $survey->update([
            'title'          => $request->title,
            'theme'          => $request->theme,
            'description'    => $request->description,
            'url_website'    => $request->url_website,
            'embed_design'   => $request->embed_design,
            'embed_prototype' => $request->embed_prototype,
            'slug'          => Str::slug($request->title, '-'),
            'status' => $request->survey_visible
        ]);

        if ($request->has('survey_categories')) {
            $surveyCategoriesData = $request->survey_categories;
            $surveyHasCategories->where('survey_id', $survey->id)->delete();

            foreach ($surveyCategoriesData as $category_id) {
                $surveyHasCategories->create(['category_id' => $category_id, 'survey_id' => $survey->id]);
            }
        }

        if ($request->has('survey_methods')) {
            $surveyMethodsData = $request->survey_methods;
            $surveyHasMethods->where('survey_id', $survey->id)->delete();

            foreach ($surveyMethodsData as $method_id) {
                $surveyHasMethods->create(['method_id' => $method_id, 'survey_id' => $survey->id]);
            }
        }

        if ($request->has('survey_questions')) {
            $surveyQuestion->where('survey_id', $survey->id)->delete();
            $surveyQuestionsData = $request->survey_questions;
            $surveyQuestion->create([
                'survey_id' => $survey->id,
                'questions_data' => $request->survey_questions
            ]);
        }

        return redirect()->route('account.surveys.index');
    }


    public function destroy($id)
    {
        $Survey = Survey::findOrFail($id);

        if ($Survey->id == 1 && $Survey->user_id !== auth()->user()->id) {
            return abort(403, 'You do not have permission to delete this survey.');
        }

        if ($Survey->image != 'surveyFactory.png') {
            Storage::disk('local')->delete('public/image/surveys/' . basename($Survey->image));
        }

        Cache::forget('responses-tam-' . $id); 
        Cache::forget('responses-sus-' . $id);

        $Survey->delete();

        return redirect()->route('account.surveys.index');
    }
}
