<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('links')->insert([
            'product_id' => 1,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000027618.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 2,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000012085.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 3,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000004497.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 4,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000004493.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 5,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000000309.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 6,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000000186.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 7,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/D70010000004567.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 8,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000000828.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 9,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000018271.html',
        ]);

        DB::table('links')->insert([
            'product_id' => 10,
            'title' => 'My Nintendo Store',
            'url' => 'https://store-jp.nintendo.com/list/software/70010000000965.html',
        ]);
    }
}
