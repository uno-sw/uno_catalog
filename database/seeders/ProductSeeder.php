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
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dwbf4a5aaa/products/D70010000027618/squareHeroBanner/ee827d6ff0ec5159fd3e5298e2a646aa34a8581c8271fe083acc8c1fd0b89c03.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => '大乱闘スマッシュブラザーズ SPECIAL',
            'price' => 7920,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dwbd8bcee3/products/D70010000012085/squareHeroBanner/373eec66a015d0125e44b42f37d0a72071a1f9635f21c960d8272c06e8449db1.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'ポケットモンスター ソード',
            'price' => 6578,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dwa8744f9c/products/D70010000004497/squareHeroBanner/02cd53592b81f646b022900ec7351fc8c803a2a860a15b13a9e53d6927e9c2a2.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'ポケットモンスター シールド',
            'price' => 6578,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dwc3b66980/products/D70010000004493/squareHeroBanner/75958a22ae081feafd40ccf1bb1d3f37a7fd31f8cbde04f3df89046a73780360.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'スプラトゥーン2',
            'price' => 6578,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dw253250af/products/D70010000000309/squareHeroBanner/e212fa0482b0efb47d97c2307f2ad6d7af70a60b0ac51cbd3d329b6a566eb4dd.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'マリオカート８ デラックス',
            'price' => 6578,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dw45f723f5/products/D70010000000186/squareHeroBanner/55e0720b1a064e28b5df173d30b343ecd91287dc86942f833ffbf979a7a66ec9.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'リングフィット アドベンチャー',
            'price' => 8778,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dw41e0ef91/products/D70010000004567/squareHeroBanner/639545a6797c147492117c59af403e712102781599a1561942b9db739dbcf3d9.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'スーパーマリオ オデッセイ',
            'price' => 6578,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dw8b5e76ef/products/D70010000000828/squareHeroBanner/ad4d31f664a1ce704f0219da2805f8459595bc3c01c3f04df2e32ba34a05b8c6.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => '桃太郎電鉄 ～昭和 平成 令和も定番！～',
            'price' => 6930,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dw75fb37e1/products/D70010000018271/squareHeroBanner/985984489a820a98ed89d028d511e537bb823b19f5f8b63b06e1ff36783edc57.jpg?sw=346&strip=false',
        ]);

        DB::table('products')->insert([
            'user_id' => 1,
            'name' => 'Minecraft',
            'price' => 3960,
            'image_url' => 'https://store-jp.nintendo.com/dw/image/v2/BFGJ_PRD/on/demandware.static/-/Sites-all-master-catalog/ja_JP/dwad5ec8d1/products/D70010000000965/squareHeroBanner/2ee0c7de14a92d4d0dca12dafd9937a921a739771c3ecf695164fe86204677da.jpg?sw=346&strip=false',
        ]);
    }
}
