<?php
/**
 * @var $listOfThemes []
 */
require_once __DIR__ . '/db/list.php';

function getRequest($name, $default = null)
{
    return $_POST[$name] ?? $_GET[$name] ?? $default;
}

$themeFile = __DIR__ . '/db/theme.db';
$action = getRequest('action');
$result = [
    'success' => false,
];

switch ($action) {
    case 'set-theme':
        $theme = getRequest('theme');
        $result['success'] = false !== file_put_contents($themeFile, $theme);
        break;
    case 'get-theme':
        $result['success'] = true;
        $theme = file_get_contents($themeFile);

        if ($theme) {
            $result['theme'] = $listOfThemes[$theme] ?? null;
        } else {
            $result['theme'] = null;
        }

        break;
    case 'get-list':
        $result['success'] = true;
        $result['list'] = $listOfThemes;
        break;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($result);
