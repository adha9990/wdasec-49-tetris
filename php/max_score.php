<?php
    $db = @new mysqli("localhost", "root", "", "guc_2019_client_side");
    $result = $db->query("SELECT * FROM `results` ORDER BY `score`");
    $data = [];
    while($i = $result->fetch_assoc()) $data[] = $i;
    echo $data[0]["score"];