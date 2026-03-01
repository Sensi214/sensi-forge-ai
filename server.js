/**
 * SENSI FORGE MASTER ENGINE v6.0 - FINAL STABLE
 */

// 1. THE HERO REGISTRY (DNA & LIGHTING)
function sensi_get_hero_data( $code ) {
    $map = [
        'LF' => [ 'name' => 'The Loverfighter', 'suit' => 'Red/Gold heart combat suit', 'glow' => 'fire-gold highlights', 'quote' => 'I fight for love.' ],
        'CR' => [ 'name' => 'The Cosmic Rebel', 'suit' => 'Navy/UV stardust suit', 'glow' => 'cosmic neon blues', 'quote' => 'I carve new paths.' ],
        'GG' => [ 'name' => 'The Glam Guardian', 'suit' => 'Maroon/Silver elegance suit', 'glow' => 'glam pink-maroon radiance', 'quote' => 'I stand in grace.' ],
        'JW' => [ 'name' => 'The Joy Warrior', 'suit' => 'Rainbow pride energy suit', 'glow' => 'rainbow pride-spectrum', 'quote' => 'Liberation in motion.' ],
        'TR' => [ 'name' => 'The Transcend', 'suit' => 'White/Gold ascension suit', 'glow' => 'white-gold divine radiance', 'quote' => 'I rise above.' ],
        'PR' => [ 'name' => 'The Protector', 'suit' => 'Steel-Blue/Gold fortified suit', 'glow' => 'steel-blue protective glow', 'quote' => 'I guard the essence.' ],
        'SH' => [ 'name' => 'The Shadow Healer', 'suit' => 'Black/Violet mystery suit', 'glow' => 'violet shadowlight', 'quote' => 'I mend the unseen.' ],
        'VS' => [ 'name' => 'The Visionary', 'suit' => 'Silver/Indigo foresight suit', 'glow' => 'indigo foresight glow', 'quote' => 'I see what others miss.' ],
        'MK' => [ 'name' => 'The Memory Keeper', 'suit' => 'Violet/Gold nostalgic suit', 'glow' => 'golden memory warmth', 'quote' => 'I carry the stories.' ],
        'FB' => [ 'name' => 'The Flamebearer', 'suit' => 'Orange/Gold fiery suit', 'glow' => 'orange-gold ignition', 'quote' => 'I burn through doubt.' ],
        'MR' => [ 'name' => 'The Mirror', 'suit' => 'Silver/Iridescent reflective suit', 'glow' => 'silver-iridescent reflections', 'quote' => 'Truth in clarity.' ],
    ];
    return $map[$code] ?? [ 'name' => 'The Guardian', 'suit' => 'Charcoal/Crimson', 'glow' => 'cinematic studio lighting' ];
}

// 2. THE HANDLER (TALKS TO RENDER INDEX.JS)
function sensi_forge_master_handler( WP_REST_Request $request ) {
    $params = $request->get_json_params();
    $tier = (string)($params['tier'] ?? '1');
    $hero_code = $params['hero'] ?? 'PR';
    $hero = sensi_get_hero_data($hero_code);

    // CAPTURE THE VESSEL
    $img = $params['image_data'] ?? '';
    $decoded = base64_decode( explode( ';base64,', $img )[1] ?? $img );
    $path = wp_upload_dir()['path'] . '/vessel_' . time() . '.png';
    file_put_contents( $path, $decoded );
    $vessel_url = wp_upload_dir()['url'] . '/' . basename($path);

    // DUAL-PROMPT LOGIC
    $prompt_split = "Tier 3 Becoming: 60/40 vertical split. Left: Human in black tshirt. Right: Hero in {$hero['suit']}. Energy seam.";
    $prompt_full  = "Tier 4 Mythic: Full body cinematic masterpiece. {$hero['suit']} with {$hero['glow']}. Vow: {$hero['quote']}.";

    $response = wp_remote_post( 'https://sensi-forge-ai-4.onrender.com/generate', [
        'headers' => [ 'Content-Type' => 'application/json', 'x-sensi-key' => SENSI_FORGE_SHARED_SECRET ],
        'body' => wp_json_encode([
            'faceImage' => $vessel_url,
            'prompt_split' => $prompt_split,
            'prompt_full' => $prompt_full
        ]),
        'timeout' => 120
    ]);

    $res_body = json_decode( wp_remote_retrieve_body( $response ), true );
    $redirects = [ '1'=>'/tier-1-metadata/', '2'=>'/tier-2-the-forge/', '3'=>'/tier-3-becoming/', '4'=>'/master-dossier-reveal/' ];

    return [
        'success' => true,
        'image_url' => $res_body['image_split'] ?? $vessel_url,
        'image_full' => $res_body['image_full'] ?? $vessel_url,
        'redirect' => $redirects[$tier] ?? '/tier-1-metadata/'
    ];
}
