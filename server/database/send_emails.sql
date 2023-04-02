CREATE TABLE `n-mail`.`send_emails` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender` VARCHAR(255) NOT NULL,
  `receiver` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `is_delete` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '0 表示未删除\n1 表示已删除',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = '用户发送的所有邮件';