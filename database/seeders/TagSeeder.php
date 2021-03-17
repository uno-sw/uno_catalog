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
        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'コミュニケーション',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'パーティ',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => '格闘',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'アクション',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'ロールプレイング',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'シューティング',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'レース',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'トレーニング',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'アドベンチャー',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'ボードゲーム',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'シミュレーション',
        ]);

        DB::table('tags')->insert([
            'user_id' => 1,
            'label' => 'サバイバル',
        ]);
    }
}
