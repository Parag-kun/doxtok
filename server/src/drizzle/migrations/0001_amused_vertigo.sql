ALTER TABLE `users` RENAME TO `Documents`;--> statement-breakpoint
ALTER TABLE `Documents` RENAME COLUMN "fileName" TO "referenceName";--> statement-breakpoint
ALTER TABLE `Documents` RENAME COLUMN "originalFileName" TO "originalName";--> statement-breakpoint
DROP INDEX `users_fileName_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `Documents_referenceName_unique` ON `Documents` (`referenceName`);