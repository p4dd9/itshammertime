import { WithId } from 'mongodb';

export default interface UserDTO extends WithId<Document> {
	id: string;
	bit_count: number;
}
