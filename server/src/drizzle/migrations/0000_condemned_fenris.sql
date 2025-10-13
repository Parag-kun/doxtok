CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionId` text NOT NULL,
	`fileName` text NOT NULL,
	`originalFileName` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_fileName_unique` ON `users` (`fileName`);