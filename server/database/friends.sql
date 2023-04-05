CREATE TABLE `n-mail`.`friends` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(255) NOT NULL COMMENT '该朋友的所属用户',
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(255) NULL,
  `home_address` VARCHAR(255) NULL,
  `birthday` VARCHAR(255) NULL,
  `qq` VARCHAR(255) NULL,
  `company` VARCHAR(255) NULL,
  `apartment` VARCHAR(255) NULL,
  `work` VARCHAR(255) NULL,
  `comment` TEXT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
COMMENT = '所有用户的通讯录';
