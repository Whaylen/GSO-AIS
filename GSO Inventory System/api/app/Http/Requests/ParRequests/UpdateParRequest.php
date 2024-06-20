<?php

namespace App\Http\Requests\ParRequests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateParRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // return auth()->user()->hasAnyPermission('par_create') || auth()->user()->isSuperAdmin();
        return false
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'scanned_documents' => 'nullable',
            'date_received' => 'required|date',
            'article' => 'required',
            'brand_model' => 'nullable',
            'particulars' => 'required',
            'responsibility_center' => 'required',
            'account_code' => 'required',
            'date_acquired' => 'required|date',
            'unit_value' => 'required|numeric',
            'quantity' => 'required|numeric',
            'total_value' => 'required|numeric',
            'unit_of_measure' => 'required',
            'custodians' => 'nullable|array',
        ];
    }
}
