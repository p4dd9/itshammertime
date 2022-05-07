import { WithId } from 'mongodb';

export default interface UserTransactionDTO extends WithId<Document> {
	id: string;
	bit_count: number;
	sku: string;
}
