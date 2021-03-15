<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('tags')->insert(['label' => 'コミュニケーション']);
        DB::table('tags')->insert(['label' => 'パーティ']);
        DB::table('tags')->insert(['label' => '格闘']);
        DB::table('tags')->insert(['label' => 'アクション']);
        DB::table('tags')->insert(['label' => 'ロールプレイング']);
        DB::table('tags')->insert(['label' => 'シューティング']);
        DB::table('tags')->insert(['label' => 'レース']);
        DB::table('tags')->insert(['label' => 'トレーニング']);
        DB::table('tags')->insert(['label' => 'アドベンチャー']);
        DB::table('tags')->insert(['label' => 'ボードゲーム']);
        DB::table('tags')->insert(['label' => 'シミュレーション']);
        DB::table('tags')->insert(['label' => 'サバイバル']);
    }
}
