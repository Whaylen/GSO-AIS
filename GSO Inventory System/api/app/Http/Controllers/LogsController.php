<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;

use App\Models\Logs;

use App\Http\Resources\LogsResource;

use App\Traits\LogsTrait;

class LogsController extends Controller
{
    use LogsTrait;

    protected $DS = DIRECTORY_SEPARATOR;

    public function __construct(){
        $this->middleware('role:Admin',
            ['only' => ['getLogs']]);
    }
    
    public function getLogs(Request $request, $year, $month = 0, $day = 0){
        $year = $year == 'null' ? Carbon::now()->format('Y') : $year;
        $hasMonth = ($month && ($month > 0 && $month <= 12));
        $hasDay = ($day && $day > 0);
        $dateStr = $hasMonth ? ($hasDay ? $year."-".$month."-".$day : $year."-".$month."-01") : $year."-07-01";

        $result = [];
        $sql = "";

        $count = 0;
        if($hasDay){
            $page = $request->input('page', 1);
            $limit = $request->input('limit', 100);
            $offset = $limit * ($page - 1);
            $orderBy = $request->input('orderBy', 'time');
            $order = $request->input('order', 'desc');
            $levelFilter = $request->input('levels', null);

            $grph = Logs::whereDate('created_at', $dateStr)
                ->select('level')->selectRaw('count(*) as total')
                ->groupBy('level')->get();
            
            $summary = $this->summarize($grph);

            $logs = Logs::whereDate('created_at', $dateStr)
                ->when(!!$levelFilter, function($query) use ($levelFilter){
                    $query->whereIn('level', $levelFilter);
                })
                ->when($orderBy == 'time', function ($query) use ($order) {
                    $query->orderBy('created_at', $order);
                })
                ->when($orderBy == 'level', function ($query) use ($order) {
                    $query->orderBy('level', $order);
                })
                ->when($orderBy == 'module', function ($query) use ($order) {
                    $query->orderBy('module', $order);
                })
                ->offset($offset)->limit($limit);

            $result = LogsResource::collection($logs->get());
            $count = Logs::whereDate('created_at', $dateStr)
                ->when($levelFilter, function($query) use ($levelFilter){
                    $query->whereIn('level', $levelFilter);
                })
                ->selectRaw('count(*) as count')->first()->count;
            return response([
                'data' => $result,
                'count' => $count,
                'summary' => $summary,
            ]);
        }else{
            $date = Carbon::parse($dateStr);
            $start = ($hasMonth ? $hasDay ? $date->startOfDay() : $date->startOfMonth() : $date->startOfYear())->format('Y-m-d H:i:s');
            $end = ($hasMonth ? $hasDay ? $date->endOfDay() : $date->endOfMonth() : $date->endOfYear())->format('Y-m-d H:i:s');
            $sqlDateStr = "";
            $RawSqls = [];
            if(env('DB_CONNECTION') == 'mysql'){
                $sqlDateStr = $hasMonth ? '%Y-%m-%d' : '%Y-%m';
                $RawSqls = [
                    'select' => "DATE_FORMAT(created_at, '$sqlDateStr') as date",
                    'group' => "DATE_FORMAT(created_at, '$sqlDateStr')"
                ];
            }else if(env('DB_CONNECTION') == 'pgsql'){
                $sqlDateStr = $hasMonth ? 'YYYY-MM-dd' : 'YYYY-MM';
                $RawSqls = [
                    'select' => "TO_CHAR(created_at::timestamp, '$sqlDateStr') as date",
                    'group' => "TO_CHAR(created_at::timestamp, '$sqlDateStr')"
                ];
            }

            $logs = Logs::select('level', \DB::raw($RawSqls['select']), \DB::raw('count(*) as total'))
                ->whereBetween('created_at', [$start, $end])
                ->groupBy('level', \DB::raw($RawSqls['group']))
                ->orderBy('date', 'desc')
                ->get();
            $result = $logs->groupBy('date')->map(function ($item, $key) {
                return $item->groupBy('level')->map(function ($items, $keys){
                    return $items->first()->total;
                });
            });
        }
        

        return response([
            'data' => $result,
        ]);
    }

    public function summarize($grph){
        $summary = [];
        $total = 0;
        
        $levels = collect($this->getLevels())->mapWithKeys(function($item, $key){
            return [$item => $key];
        });
        foreach($levels as $keys => $values){
            $tmp = $grph->filter(function ($value, $key) use ($keys) {
                return $keys == $value['level'];
            });
            if($tmp->first()){
                $summary[] = [
                    'total' => $tmp->first()->total,
                    'prct' => 0
                ];
                $total += $tmp->first()->total;
            }else{
                $summary[] = [
                    'total' => 0,
                    'prct' => 0
                ];
            }
        }
        $summary = collect($summary)->map(function ($item, $key) use ($total) {
            return [
                'total' => $item['total'],
                'prct' => $total > 0 ? (float) number_format((($item['total'] / $total) * 100), 2) : 0,
            ];
        });
        return $summary->prepend([
            'total' => $total,
            'prct' => 100,
        ]);
    }

    public function clearLogFile() {
        $path = storage_path('logs/laravel.log');
        File::delete($path);
        return response([
            "message" => "Log file deleted successfully!"
        ]);
    }

    public function getSystemLog(){
        $path = storage_path('logs/laravel.log');
        if(File::exists($path)) {
            $size = File::size($path);
            if($size > 52428800) { // 50MB
                return response([
                    "size" => $size,
                    "message" => "Log file is too large to preview, please download the file instead!"
                ], 422);
            }
            $content = File::get($path);
            $mime = File::mimeType($path);
            $headers = array('Content-Type' => $mime, 'Content-Length' => $size);
            return response($content)
                ->header('Content-Type', $mime)
                ->header('Content-Length', $size);
        }
        return response("");
    }

    public function downloadLogFile() {
        $path = storage_path('logs/laravel.log');
        if(!File::exists($path)) {
            return response([
                "message" => "Log file not found!"
            ], 422);
        }
        return response()->download($path);
    }
}
 