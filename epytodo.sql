CREATE DATABASE IF NOT EXISTS `epytodo`;

USE `epytodo`;

CREATE TABLE IF NOT EXISTS `user` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(128) UNIQUE NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `name` VARCHAR(64) UNIQUE NOT NULL,
    `firstname` VARCHAR(64) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `todo` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(64) NOT NULL,
    `description` VARCHAR(4096) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `due_time` TIMESTAMP NOT NULL,
    `status` ENUM('not_started', 'todo', 'done', 'in_progress') DEFAULT 'not_started',
    `user_id` INT UNSIGNED,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `user`(`id`)
);
