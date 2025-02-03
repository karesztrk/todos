import type { NotificationService } from '@todotrk/web/notification/service';
import {
	isPermissionGranted,
	requestPermission,
	sendNotification
} from '@tauri-apps/plugin-notification';

class TauriNotificationService implements NotificationService {
	permissionGranted = false;

	simple(body: string): void {
		isPermissionGranted()
			.then((granted) => {
				return granted ? 'granted' : requestPermission();
			})
			.then((permission) => {
				this.permissionGranted = permission === 'granted';

				if (this.permissionGranted) {
					sendNotification(body);
				}
			});
	}

	send(title: string, body: string): void {
		isPermissionGranted()
			.then((granted) => {
				return granted ? 'granted' : requestPermission();
			})
			.then((permission) => {
				this.permissionGranted = permission === 'granted';

				if (this.permissionGranted) {
					sendNotification({
						title,
						body,
						largeBody: body,
						actionTypeId: 'todos'
					});
				}
			});
	}
}

export default TauriNotificationService;
