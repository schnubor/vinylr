# Vinylr

Vinylr is your personal vinyl collection tool. Storing and sharing your collection has never been easier! In addition Vinylr tells you more about your listening behaviour over time on the basis of meta data retreived from your collection. Find out more about your personal development and market trends. All your vinyls. Anywhere. Anytime.

## Shipping:

1. check FB IDs in facebook.js
2. check DB name in cb_connect.php
3. if importing fails change line 6 of importvinyl.php to ```$vinyl = json_decode(stripslashes($_POST['vinyldata']));```