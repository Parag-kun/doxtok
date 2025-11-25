CREATE TABLE `Chats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionId` text NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionId` text NOT NULL,
	`referenceName` text NOT NULL,
	`originalName` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Documents_referenceName_unique` ON `Documents` (`referenceName`);