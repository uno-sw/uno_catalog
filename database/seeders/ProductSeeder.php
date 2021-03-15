<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'あつまれ　どうぶつの森',
            'price' => 6578,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => '大乱闘スマッシュブラザーズ SPECIAL',
            'price' => 7920,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'ポケットモンスター ソード',
            'price' => 6578,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'ポケットモンスター シールド',
            'price' => 6578,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'スプラトゥーン2',
            'price' => 6578,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'マリオカート８ デラックス',
            'price' => 6578,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'リングフィット アドベンチャー',
            'price' => 8778,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'スーパーマリオ オデッセイ',
            'price' => 6578,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => '桃太郎電鉄 ～昭和 平成 令和も定番！～',
            'price' => 6930,
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'Minecraft',
            'price' => 3960,
        ]);
    }
}
