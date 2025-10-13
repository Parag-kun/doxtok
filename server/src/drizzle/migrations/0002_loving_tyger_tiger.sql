CREATE TABLE `Chats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sessionId` text NOT NULL,
	`question` text NOT NULL,
	`answer` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
