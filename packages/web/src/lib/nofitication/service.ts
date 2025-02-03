export interface NotificationService {
	simple(body: string): void;
	send(title: string, body: string): void;
}

class WebNotificationService implements NotificationService {
	simple(): void {
		throw new Error('Method not implemented.');
	}

	send(): void {
		throw new Error('Method not implemented.');
	}
}

export default WebNotificationService;
