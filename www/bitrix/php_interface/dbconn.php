<?
define("SHORT_INSTALL", true);
define("SHORT_INSTALL_CHECK", true);

define("MYSQL_TABLE_TYPE", "INNODB");
define("BX_UTF", true);

define("DBPersistent", false);
$DBType = "mysql";
$DBHost = "127.0.0.1:31007";
$DBName = "sitemanager";
$DBLogin = "root";
$DBPassword = "";
$DBDebug = false;
$DBDebugToFile = false;

define("BX_FILE_PERMISSIONS", 0664);
define("BX_DIR_PERMISSIONS", 0775);
@umask(~BX_DIR_PERMISSIONS);

define("BX_USE_MYSQLI", true);
define("DELAY_DB_CONNECT", true);
define("CACHED_menu", 3600);
define("CACHED_b_file", 3600);
define("CACHED_b_file_bucket_size", 10);
define("CACHED_b_lang", 3600);
define("CACHED_b_option", 3600);
define("CACHED_b_lang_domain", 3600);
define("CACHED_b_site_template", 3600);
define("CACHED_b_event", 3600);
define("CACHED_b_agent", 3660);

?>