CREATE TABLE `n-mail`.`receive_emails` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender` VARCHAR(255) NOT NULL,
  `receiver` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `is_delete` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '此邮件是否被删除：\n0：未删除\n1：已删除',
  `is_readed` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '此邮件是否被用户读取过\n0：未被读取\n1：已被读取',
  `time` VARCHAR(255) NOT NULL COMMENT '此邮件被接收的时间',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = '所有用户的所接收到的邮件';
