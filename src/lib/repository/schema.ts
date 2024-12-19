import { Account, CoList, CoMap, Profile, co } from 'jazz-tools';

export class MyProfile extends Profile {
	name = co.string;
}

export class Todo extends CoMap {
	text = co.string;
	date = co.optional.Date;
	done = co.boolean;
}

export class ListOfTodos extends CoList.Of(co.ref(Todo)) {}

export class TodoProject extends CoMap {
	title = co.string;
	todos = co.ref(ListOfTodos);
}

export class ListOfProjects extends CoList.Of(co.ref(TodoProject)) {}

export class TodoAccountRoot extends CoMap {
	projects = co.ref(ListOfProjects);
}

export class MyAccount extends Account {
	profile = co.ref(Profile);
	root = co.ref(TodoAccountRoot);
	/** The account migration is run on account creation and on every log-in.
	 *  You can use it to set up the account root and any other initial CoValues you need.
	 */
	migrate(this: MyAccount, creationProps?: { name: string }) {
		super.migrate(creationProps);
		if (!this._refs.root) {
			this.root = TodoAccountRoot.create(
				{
					projects: ListOfProjects.create([], { owner: this })
				},
				{ owner: this }
			);
		}
	}
}
