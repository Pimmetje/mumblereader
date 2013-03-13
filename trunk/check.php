<?php
echo Ice_stringVersion().'<br /><br />';
if(version_compare(Ice_stringVersion(), '3.4', '>=')) {
    echo '3.4 API';
} else {
    echo 'OLD api';
}